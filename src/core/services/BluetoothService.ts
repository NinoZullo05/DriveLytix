
// src/core/services/BluetoothService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleError, BleManager, Device } from 'react-native-ble-plx';

export interface BluetoothDevice {
    id: string;
    name: string;
    rssi: number;
    status: 'new' | 'known' | 'connected';
    rawDevice?: Device; // Keep reference to raw device for connection
}

class BluetoothService {
    private manager: BleManager;
    private isScanning = false;
    private simulationMode = false;
    private lastConnectedDeviceIdKey = 'LAST_CONNECTED_DEVICE_ID';
    private connectedDeviceId: string | null = null;
    private listeners: ((status: boolean) => void)[] = [];

    constructor() {
        this.manager = new BleManager();
    }

    setSimulationMode(enabled: boolean) {
        this.simulationMode = enabled;
        console.log(`[BluetoothService] Simulation mode: ${enabled}`);
    }

    getSimulationMode() {
        return this.simulationMode;
    }

    // New: Subscribe to connection changes
    subscribeToConnectionStatus(callback: (isConnected: boolean) => void) {
        this.listeners.push(callback);
        // Immediate call with current state
        callback(this.connectedDeviceId !== null);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    private notifyListeners() {
        const status = this.connectedDeviceId !== null;
        this.listeners.forEach(callback => callback(status));
    }

    getConnectedDeviceId() {
        return this.connectedDeviceId;
    }

    async initialize() {
        try {
            const state = await this.manager.state();
            console.log("Bluetooth State:", state);
        } catch (e) {
            console.error("Failed to check Bluetooth state", e);
        }
    }

    async requestPermissions(): Promise<boolean> {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 31) {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ]);

                return (
                    granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                );
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'DriveLytix needs location access to scan for Bluetooth devices.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
        }
        return true;
    }

    startScan(callback: (devices: BluetoothDevice[]) => void, errorCallback?: (error: BleError) => void) {
        if (this.isScanning) return;
        
        this.isScanning = true;
        let foundDevices: Map<string, BluetoothDevice> = new Map();

        // Conditional mock devices
        if (this.simulationMode) {
            const mockDevices: BluetoothDevice[] = [
                { id: 'SIM-OBDII-001', name: 'SIMULATED-ELM327', rssi: -45, status: 'new' },
                { id: 'SIM-PRO-002', name: 'DriveLytix Pro Adapter (Sim)', rssi: -32, status: 'new' },
            ];
            mockDevices.forEach(d => foundDevices.set(d.id, d));
            callback(Array.from(foundDevices.values()));
        }

        // Start real scan
        this.manager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
            if (error) {
                if (this.simulationMode) {
                    console.log("Real scan failed, but continuing in simulation mode.");
                    return;
                }
                console.error("Scan Error:", error);
                this.isScanning = false;
                if (errorCallback) errorCallback(error);
                return;
            }

            if (device) {
                 const name = device.name || device.localName || 'Unknown Device';
                 foundDevices.set(device.id, {
                     id: device.id,
                     name: name,
                     rssi: device.rssi || -100,
                     status: 'new',
                     rawDevice: device
                 });

                 callback(Array.from(foundDevices.values()));
            }
        });

        setTimeout(() => {
            if (this.isScanning) {
                this.stopScan();
            }
        }, 10000);
    }

    stopScan() {
        this.manager.stopDeviceScan();
        this.isScanning = false;
    }

    async connectToDevice(deviceId: string): Promise<boolean> {
        this.stopScan();
        
        if (deviceId.startsWith('SIM-')) {
            console.log(`[Simulation] Connecting to mock device ${deviceId}...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.connectedDeviceId = deviceId;
            this.notifyListeners();
            return true;
        }

        try {
            const device = await this.manager.connectToDevice(deviceId, { autoConnect: false });
            await device.discoverAllServicesAndCharacteristics();
            await AsyncStorage.setItem(this.lastConnectedDeviceIdKey, deviceId);
            
            this.connectedDeviceId = deviceId;
            this.notifyListeners();
            
            // Listen for disconnection
            device.onDisconnected((error, disconnectedDevice) => {
                console.log(`Device ${disconnectedDevice.id} disconnected`);
                this.connectedDeviceId = null;
                this.notifyListeners();
            });

            return true;
        } catch (error) {
            console.error("Connection Error:", error);
            this.connectedDeviceId = null;
            this.notifyListeners();
            return false;
        }
    }
    
    async checkAutoConnect(): Promise<string | null> {
         const lastId = await AsyncStorage.getItem(this.lastConnectedDeviceIdKey);
         // If we auto-connect, we'd ideally set connectedDeviceId here, 
         // but that usually happens inside a connection attempt.
         return lastId;
    }

    async disconnect(deviceId: string) {
        if (deviceId.startsWith('SIM-')) {
            this.connectedDeviceId = null;
            this.notifyListeners();
            return;
        }

        try {
            await this.manager.cancelDeviceConnection(deviceId);
            this.connectedDeviceId = null;
            this.notifyListeners();
        } catch (error) {
             console.error("Disconnect error", error);
        }
    }
    
    async isDeviceConnected(deviceId: string): Promise<boolean> {
        if (deviceId.startsWith('SIM-')) return this.connectedDeviceId === deviceId;
        return this.manager.isDeviceConnected(deviceId);
    }
}

export const bluetoothService = new BluetoothService();
