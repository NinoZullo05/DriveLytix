import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Characteristic, Device } from "react-native-ble-plx";
import { ConnectionState } from "../../domain/enums/ConnectionState";
import { IOBDAdapter, OBDDevice } from "../../domain/interfaces/IOBDAdapter";

const SERVICE_UUIDS = ["FFF0", "18F0", "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2"]; // Common OBD Service UUIDs
const NOTIFY_UUIDS = ["FFF1", "2AF1", "BEF8D6C9-9C21-4C9E-B632-BD58C1009F9F"];
const WRITE_UUIDS = ["FFF2", "2AF0", "BEF8D6C9-9C21-4C9E-B632-BD58C1009F9F"];

export class BLEService implements IOBDAdapter {
  private manager: BleManager;
  private device: Device | null = null;
  private writeCharacteristic: Characteristic | null = null;
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private stateListeners: ((state: ConnectionState) => void)[] = [];

  // Buffer to hold incoming chunks of data
  private dataBuffer: string = "";
  private onDataCallback: ((data: string) => void) | null = null;

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
  }

  setOnDataReceived(callback: (data: string) => void) {
    this.onDataCallback = callback;
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true; // iOS permissions handled by Info.plist
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
      // Scan for 5 seconds
      const subscription = this.manager.startDeviceScan(
        null,
        null,
        (error, device) => {
          if (error) {
            if (error.errorCode === 601) {
              // LocationServicesDisabled
              console.error(
                "Location services are disabled. Please enable GPS.",
              );
            } else {
              console.error("Scan error:", error);
            }
            this.setState(ConnectionState.ERROR);
            // subscription.remove(); // Not needed as stopDeviceScan cleans up, but good practice if available
            this.manager.stopDeviceScan();
            resolve([]);
            return;
          }

          // Filter for devices that look like OBD adapters
          if (
            device &&
            device.name &&
            (device.name.includes("OBD") ||
              device.name.includes("Vlink") ||
              device.name.includes("ELM"))
          ) {
            if (!devices.has(device.id)) {
              devices.set(device.id, {
                id: device.id,
                name: device.name,
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
        this.setState(ConnectionState.DISCONNECTED);
        resolve(Array.from(devices.values()));
      }, 5000);
    });
  }

  async connect(deviceId: string): Promise<void> {
    this.setState(ConnectionState.CONNECTING);
    try {
      this.device = await this.manager.connectToDevice(deviceId);
      await this.device.discoverAllServicesAndCharacteristics();

      // Find Write and Notify characteristics
      // In a real robust app, we'd iterate services. For now, we try to find known characteristics.
      // This part often requires specific knowledge of the dongle or iterating content.
      // Simplifying for this architecture step:

      this.setState(ConnectionState.CONNECTED);

      // Fake implementation of characteristic finding for now to allow compiling
      // In reality, we need to iterate device.services()
    } catch (error) {
      console.error("Connection failed", error);
      this.setState(ConnectionState.ERROR);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.device) {
      await this.device.cancelConnection();
      this.device = null;
    }
    this.setState(ConnectionState.DISCONNECTED);
  }

  async sendCommand(command: string): Promise<string> {
    if (
      !this.device ||
      (this.connectionState !== ConnectionState.CONNECTED &&
        this.connectionState !== ConnectionState.READY &&
        this.connectionState !== ConnectionState.STREAMING)
    ) {
      throw new Error("Device not connected");
    }
    // Write logic
    // const base64 = btoa(command + '\r');
    // await this.writeCharacteristic.writeWithResponse(base64);

    // For now, return mock response or implement real write later
    return "OK";
  }
}
