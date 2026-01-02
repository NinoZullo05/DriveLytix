
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
    private lastConnectedDeviceIdKey = 'LAST_CONNECTED_DEVICE_ID';

    constructor() {
        this.manager = new BleManager();
    }

    async initialize() {
        // Any init logic
         const state = await this.manager.state();
         console.log("Bluetooth State:", state);
         if (state === 'PoweredOff') {
            // Optional: Prompt user to turn on BT
         }
    }

    async requestPermissions(): Promise<boolean> {
        if (Platform.OS === 'android') {
            // Android 12+ (API 31+)
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
                // Android < 12
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
        return true; // iOS handles automatically via Info.plist usage descriptions
    }

    startScan(callback: (devices: BluetoothDevice[]) => void, errorCallback?: (error: BleError) => void) {
        if (this.isScanning) return;
        
        this.isScanning = true;
        let foundDevices: Map<string, BluetoothDevice> = new Map();

        // Add mock devices for testing
        const mockDevices: BluetoothDevice[] = [
            { id: 'MOCK-OBDII-001', name: 'OBDII-ELM327-VLink', rssi: -45, status: 'new' },
            { id: 'MOCK-DASH-042', name: 'DriveLytix Adapter Pro', rssi: -32, status: 'new' },
            { id: 'MOCK-VEEPEAK-99', name: 'Veepeak OBDCheck', rssi: -58, status: 'new' },
            { id: 'MOCK-UNKNOWN-XX', name: 'Unknown Device', rssi: -82, status: 'new' },
        ];

        // Immediately show mock devices
        mockDevices.forEach(d => foundDevices.set(d.id, d));
        callback(Array.from(foundDevices.values()));

        this.manager.startDeviceScan(null, { allowDuplicates: true }, (error, device) => {
            if (error) {
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
    }

    stopScan() {
        this.manager.stopDeviceScan();
        this.isScanning = false;
    }

    async connectToDevice(deviceId: string): Promise<boolean> {
        this.stopScan(); // Stop scanning before connecting
        
        try {
            console.log(`Connecting to ${deviceId}...`);
            const device = await this.manager.connectToDevice(deviceId, { autoConnect: false });
            console.log(`Connected to ${device.name}, discovering services...`);
            
            await device.discoverAllServicesAndCharacteristics();
            
            // Save as last connected
            await AsyncStorage.setItem(this.lastConnectedDeviceIdKey, deviceId);
            
            return true;
        } catch (error) {
            console.error("Connection Error:", error);
            return false;
        }
    }
    
    async checkAutoConnect(): Promise<string | null> {
         const lastId = await AsyncStorage.getItem(this.lastConnectedDeviceIdKey);
         return lastId;
    }

    async disconnect(deviceId: string) {
        try {
            await this.manager.cancelDeviceConnection(deviceId);
        } catch (error) {
             console.error("Disconnect error", error);
        }
    }
    
    // Helper to see if a device is connected
    async isDeviceConnected(deviceId: string): Promise<boolean> {
        return this.manager.isDeviceConnected(deviceId);
    }
}

export const bluetoothService = new BluetoothService();
