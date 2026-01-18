// src/core/services/SensorService.ts

import { Sensor } from "../../domain/entities/Sensor";
import { useTelemetryStore } from "../store/TelemetryStore";
import { bluetoothService } from "./BluetoothService";
import { telemetryService, TelemetryService } from "./TelemetryService";

class SensorService {
  private sensors: Map<string, Sensor> = new Map();
  private listeners: Set<(sensors: Sensor[]) => void> = new Set();
  private telemetryService: TelemetryService;

  constructor() {
    this.telemetryService = telemetryService;
    this.initializeSensors();

    // Subscribe to real telemetry updates via Zustand
    useTelemetryStore.subscribe((state) => {
      const latest = state.latestValues;
      let changed = false;

      Object.entries(latest).forEach(([pid, value]) => {
        const friendlyId = this.pidToIdMap[pid] || pid;
        const existing = this.sensors.get(friendlyId);

        if (existing && existing.currentValue !== value) {
          existing.currentValue = value;
          existing.history.push({ value, timestamp: Date.now() });
          if (existing.history.length > 50) {
            existing.history.shift();
          }
          this.sensors.set(friendlyId, existing);
          changed = true;
        }
      });

      if (changed) {
        this.notifyListeners();
      }
    });
  }

  private initializeSensors() {
    const initialSensors: Sensor[] = [
      {
        id: "rpm",
        name: "Engine RPM",
        pid: "010C",
        unit: "RPM",
        category: "engine",
        icon: "speedometer",
        color: "#00C2FF",
        minValue: 0,
        maxValue: 8000,
        defaultValue: 800,
        currentValue: 800,
        history: [],
      },
      {
        id: "speed",
        name: "Vehicle Speed",
        pid: "010D",
        unit: "km/h",
        category: "engine",
        icon: "speedometer-slow",
        color: "#38BDF8",
        minValue: 0,
        maxValue: 260,
        defaultValue: 0,
        currentValue: 0,
        history: [],
      },
    ];
    initialSensors.forEach((s) => this.sensors.set(s.id, s));
  }

  private pidToIdMap: Record<string, string> = {
    "010C": "rpm",
    "010D": "speed",
    "0104": "load",
    "0105": "coolant",
    "015C": "oil_temp",
    "010F": "intake_temp",
    "010A": "fuel_pressure",
    "0142": "voltage",
    "0110": "maf",
  };

  private refreshRate = 1000;

  setRefreshRate(ms: number) {
    this.refreshRate = ms;
  }

  getRefreshRate(): number {
    return this.refreshRate;
  }

  startDataCollection() {
    console.log("[SensorService] Starting Data Collection");
    if (!bluetoothService.getSimulationMode()) {
      bluetoothService.startScan((devices) => {
        console.log("Found devices during auto-start:", devices);
        if (devices.length > 0) {
          bluetoothService.connectToDevice(devices[0].id);
        }
      });
    } else {
      bluetoothService.connectToDevice("SIM-OBD-01");
    }
  }

  stopDataCollection() {
    bluetoothService.disconnect();
  }

  getSensors(): Sensor[] {
    return Array.from(this.sensors.values());
  }

  getSensor(id: string): Sensor | undefined {
    return this.sensors.get(id);
  }

  subscribe(callback: (sensors: Sensor[]) => void) {
    this.listeners.add(callback);
    callback(this.getSensors());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    const sensors = this.getSensors();
    this.listeners.forEach((callback) => callback(sensors));
  }
}

export const sensorService = new SensorService();
