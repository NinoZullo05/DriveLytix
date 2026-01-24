import { Buffer } from "buffer";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Characteristic, Device } from "react-native-ble-plx";
import { ConnectionState } from "../../domain/enums/ConnectionState";
import { IOBDAdapter, OBDDevice } from "../../domain/interfaces/IOBDAdapter";
import { ELM327Protocol } from "./ELM327Protocol";

const SERVICE_UUIDS = ["FFF0", "18F0", "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2"]; // Common OBD Service UUIDs

export class BLEService implements IOBDAdapter {
  private manager: BleManager;
  private device: Device | null = null;
  private writeCharacteristic: Characteristic | null = null;
  private notifyCharacteristic: Characteristic | null = null;
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private stateListeners: ((state: ConnectionState) => void)[] = [];

  // Command Queue
  private queue: {
    command: string;
    resolve: (val: string) => void;
    reject: (err: any) => void;
    timeout: number;
    timestamp: number;
  }[] = [];
  private isProcessing: boolean = false;
  private currentCommand: string | null = null;

  // Buffer to hold incoming chunks of data
  private dataBuffer: string = "";
  private commandPromise: {
    resolve: (val: string) => void;
    reject: (err: any) => void;
    timer: ReturnType<typeof setTimeout>;
  } | null = null;

  constructor() {
    this.manager = new BleManager();
  }

  private setState(state: ConnectionState) {
    this.connectionState = state;
    this.stateListeners.forEach((l) => l(state));
  }

  getState(): ConnectionState {
    return this.connectionState;
  }

  onStateChange(callback: (state: ConnectionState) => void): void {
    this.stateListeners.push(callback);
    callback(this.connectionState);
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "android") {
      if (Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return (
          granted["android.permission.BLUETOOTH_SCAN"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted["android.permission.BLUETOOTH_CONNECT"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted["android.permission.ACCESS_FINE_LOCATION"] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  }

  async scanDevices(): Promise<OBDDevice[]> {
    const hasPerms = await this.requestPermissions();
    if (!hasPerms) {
      console.warn("BLE Permissions not granted");
      return [];
    }

    this.setState(ConnectionState.SCANNING);
    const devices = new Map<string, OBDDevice>();

    return new Promise((resolve) => {
      this.manager.startDeviceScan(
        null,
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error("Scan error:", error);
            this.setState(ConnectionState.ERROR);
            this.manager.stopDeviceScan();
            resolve(Array.from(devices.values()));
            return;
          }

          if (device) {
            const name = device.name || device.localName || "Unknown Device";
            if (
              name.toUpperCase().includes("OBD") ||
              name.toUpperCase().includes("V-LINK") ||
              name.toUpperCase().includes("ELM") ||
              name.toUpperCase().includes("IOS-VLINK")
            ) {
              devices.set(device.id, {
                id: device.id,
                name: name,
                address: device.id,
                protocol: "BLE",
                rssi: device.rssi ?? -100,
              });
            }
          }
        },
      );

      setTimeout(() => {
        this.manager.stopDeviceScan();
        if (this.connectionState === ConnectionState.SCANNING) {
          this.setState(ConnectionState.DISCONNECTED);
        }
        resolve(Array.from(devices.values()));
      }, 8000);
    });
  }

  async connect(deviceId: string): Promise<void> {
    this.setState(ConnectionState.CONNECTING);
    try {
      this.device = await this.manager.connectToDevice(deviceId, {
        autoConnect: false,
      });
      await this.device.discoverAllServicesAndCharacteristics();

      const services = await this.device.services();
      let foundNotify = false;
      let foundWrite = false;

      for (const service of services) {
        const characteristics = await service.characteristics();
        for (const char of characteristics) {
          if (char.isWritableWithResponse || char.isWritableWithoutResponse) {
            this.writeCharacteristic = char;
            foundWrite = true;
          }
          if (char.isNotifiable || char.isIndicatable) {
            this.notifyCharacteristic = char;
            foundNotify = true;

            char.monitor((error, c) => {
              if (error) {
                console.error("Monitor error:", error);
                // Handle disconnection if error is severe
                return;
              }
              if (c?.value) {
                const decoded = Buffer.from(c.value, "base64").toString(
                  "ascii",
                );
                this.handleDataReceived(decoded);
              }
            });
          }
        }
        if (foundNotify && foundWrite) break;
      }

      if (!foundNotify || !foundWrite) {
        throw new Error("Could not find OBD communication characteristics.");
      }

      this.setState(ConnectionState.CONNECTED);

      this.device.onDisconnected((error, d) => {
        console.log("Device disconnected", d.id);
        this.handleCleanup();
        this.setState(ConnectionState.DISCONNECTED);
      });
    } catch (error) {
      console.error("Connection failed", error);
      this.setState(ConnectionState.ERROR);
      throw error;
    }
  }

  private handleCleanup() {
    this.device = null;
    this.writeCharacteristic = null;
    this.notifyCharacteristic = null;
    this.dataBuffer = "";
    this.isProcessing = false;
    this.currentCommand = null;

    // Reject all pending commands
    if (this.commandPromise) {
      clearTimeout(this.commandPromise.timer);
      this.commandPromise.reject(new Error("Device disconnected"));
      this.commandPromise = null;
    }

    this.queue.forEach((item) => item.reject(new Error("Device disconnected")));
    this.queue = [];
  }

  private handleDataReceived(data: string) {
    this.dataBuffer += data;
    console.log(
      `[BLE] Received chunk: ${JSON.stringify(data)}, Buffer: ${JSON.stringify(this.dataBuffer)}`,
    );

    if (ELM327Protocol.isCompleteResponse(this.dataBuffer)) {
      const response = ELM327Protocol.cleanResponse(this.dataBuffer);
      this.dataBuffer = "";

      if (this.commandPromise) {
        console.log(`[BLE] Resolving ${this.currentCommand} with: ${response}`);
        const { resolve, timer } = this.commandPromise;
        clearTimeout(timer);
        this.commandPromise = null;
        resolve(response);
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.device) {
      try {
        await this.device.cancelConnection();
      } catch (e) {
        console.error("Disconnect error:", e);
      }
    }
    this.handleCleanup();
    this.setState(ConnectionState.DISCONNECTED);
  }

  async sendCommand(
    command: string,
    timeoutMs: number = 5000,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        command,
        resolve,
        reject,
        timeout: timeoutMs,
        timestamp: Date.now(),
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    if (!this.writeCharacteristic) {
      const item = this.queue.shift();
      item?.reject(new Error("Device not connected"));
      return;
    }

    this.isProcessing = true;
    const { command, resolve, reject, timeout } = this.queue.shift()!;
    this.currentCommand = command;

    try {
      await new Promise<string>((res, rej) => {
        const timer = setTimeout(() => {
          if (this.commandPromise) {
            console.warn(
              `[BLE] Command ${command} timed out after ${timeout}ms`,
            );
            this.commandPromise = null;
            this.dataBuffer = ""; // Clear buffer on timeout
            rej(new Error(`Command ${command} timed out`));
          }
        }, timeout);

        this.commandPromise = { resolve: res, reject: rej, timer };

        const base64 = Buffer.from(command + "\r").toString("base64");
        this.writeCharacteristic!.writeWithResponse(base64).catch((err) => {
          clearTimeout(timer);
          this.commandPromise = null;
          rej(err);
        });
      })
        .then(resolve)
        .catch(reject);
    } catch (error) {
      console.error(`[BLE] Error processing command ${command}:`, error);
    } finally {
      this.isProcessing = false;
      this.currentCommand = null;
      // Process next item in queue
      setTimeout(() => this.processQueue(), 10);
    }
  }
}
