import { ConnectionState } from '../enums/ConnectionState';

export interface IOBDAdapter {
  connect(deviceId: string): Promise<void>;
  disconnect(): Promise<void>;
  sendCommand(command: string): Promise<string>;
  onStateChange(callback: (state: ConnectionState) => void): void;
  getState(): ConnectionState;
  scanDevices(): Promise<OBDDevice[]>;
}

export interface OBDDevice {
  id: string;
  name: string;
  address: string;
  protocol: 'BLE' | 'WIFI';
  rssi?: number;
}
