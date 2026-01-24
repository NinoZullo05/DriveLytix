// src/core/services/BluetoothService.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ConnectionState } from "../../domain/enums/ConnectionState";
import { IOBDAdapter, OBDDevice } from "../../domain/interfaces/IOBDAdapter";
import { BLEService } from "../../infrastructure/obd/BLEService";
import { MockBLEService } from "../../infrastructure/obd/MockBLEService";

class BluetoothService {
  private realAdapter: BLEService;
  private mockAdapter: MockBLEService;
  private simulationMode = false;
  private lastConnectedDeviceIdKey = "LAST_CONNECTED_DEVICE_ID";
  private listeners: ((isConnected: boolean) => void)[] = [];

  constructor() {
    this.realAdapter = new BLEService();
    this.mockAdapter = new MockBLEService();

    // Listen to state changes from both and notify our listeners
    this.realAdapter.onStateChange(this.handleStateChange.bind(this));
    this.mockAdapter.onStateChange(this.handleStateChange.bind(this));
  }

  private handleStateChange(state: ConnectionState) {
    const isConnected =
      state === ConnectionState.CONNECTED ||
      state === ConnectionState.STREAMING;
    this.notifyListeners(isConnected);
  }

  setSimulationMode(enabled: boolean) {
    if (this.simulationMode !== enabled) {
      this.simulationMode = enabled;
      console.log(
        `[BluetoothService] Switched to ${enabled ? "Simulation" : "Real"} mode`,
      );
      // If we were connected, we should probably disconnect
      this.getAdapter().disconnect().catch(console.error);
      this.notifyListeners(false);
    }
  }

  getSimulationMode() {
    return this.simulationMode;
  }

  getAdapter(): IOBDAdapter {
    return this.simulationMode ? this.mockAdapter : this.realAdapter;
  }

  subscribeToConnectionStatus(callback: (isConnected: boolean) => void) {
    this.listeners.push(callback);
    const state = this.getAdapter().getState();
    callback(
      state === ConnectionState.CONNECTED ||
        state === ConnectionState.STREAMING,
    );
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(isConnected: boolean) {
    this.listeners.forEach((callback) => callback(isConnected));
  }

  async initialize() {
    // Any specific startup logic
  }

  async requestPermissions(): Promise<boolean> {
    return this.realAdapter.requestPermissions();
  }

  async startScan(callback: (devices: OBDDevice[]) => void) {
    const devices = await this.getAdapter().scanDevices();
    callback(devices);
  }

  async connectToDevice(deviceId: string): Promise<boolean> {
    try {
      await this.getAdapter().connect(deviceId);
      await AsyncStorage.setItem(this.lastConnectedDeviceIdKey, deviceId);
      return true;
    } catch (error) {
      console.error("Connection Error:", error);
      return false;
    }
  }

  async checkAutoConnect(): Promise<string | null> {
    return AsyncStorage.getItem(this.lastConnectedDeviceIdKey);
  }

  async disconnect() {
    await this.getAdapter().disconnect();
  }

  async isDeviceConnected(): Promise<boolean> {
    const state = this.getAdapter().getState();
    return (
      state === ConnectionState.CONNECTED || state === ConnectionState.STREAMING
    );
  }
}

export const bluetoothService = new BluetoothService();
