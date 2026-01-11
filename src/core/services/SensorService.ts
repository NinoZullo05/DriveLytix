// src/core/services/SensorService.ts

import { Sensor } from '../../domain/entities/Sensor';
import { useTelemetryStore } from '../store/TelemetryStore';
import { telemetryService, TelemetryService } from './TelemetryService';

class SensorService {
  private sensors: Map<string, Sensor> = new Map();
  private listeners: Set<(sensors: Sensor[]) => void> = new Set();
  private telemetryService: TelemetryService;

  constructor() {
    this.telemetryService = telemetryService;
    this.initializeSensors();
    
    // Subscribe to real telemetry updates via Zustand
    // We subscribe to 'latestValues'
    useTelemetryStore.subscribe((state) => {
        const latest = state.latestValues;
        let changed = false;
        
        Object.entries(latest).forEach(([pid, value]) => {
             // Map PID to friendly ID if needed, or use PID
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
    // Initial population can come from TelemetryService or defaults
    const initialSensors: Sensor[] = [
      {
        id: 'rpm',
        name: 'Engine RPM',
        pid: '010C',
        unit: 'RPM',
        category: 'engine',
        icon: 'speedometer',
        color: '#00C2FF',
        minValue: 0,
        maxValue: 8000,
        defaultValue: 800,
        currentValue: 800,
        history: [],
      },
      {
        id: 'speed',
        name: 'Vehicle Speed',
        pid: '010D',
        unit: 'km/h',
        category: 'engine',
        icon: 'speedometer-slow',
        color: '#38BDF8',
        minValue: 0,
        maxValue: 260,
        defaultValue: 0,
        currentValue: 0,
        history: [],
      },
      // ... Add other default sensors if needed or rely on TelemetryService to populate them
    ];
    // For now we keep the manually defined list to ensure UI has something before connection
    // But we map them to the same IDs as TelemetryService uses (PIDs preferably, or mapped IDs)
    // Note: TelemetryService uses PIDs as IDs (e.g. '010C'). SensorService used 'rpm'.
    // We need a mapping or unification.
    // TelemetryService currently uses PIDs as IDs.
    // I will unify this by ensuring TelemetryService uses friendly IDs (via PID_MAP names) or just accept PIDs in UI.
    // Actually, let's keep the existing ID mechanism in SensorService for specific UI widgets, but update them from TelemetryService.
    
    // Mapping PID to SensorService ID
    // 010C -> rpm
    // 010D -> speed
    
    initialSensors.forEach((s) => this.sensors.set(s.id, s));
  }

  // Map PIDs to internal IDs
  private pidToIdMap: Record<string, string> = {
      '010C': 'rpm',
      '010D': 'speed',
      '0104': 'load',
      '0105': 'coolant',
      '015C': 'oil_temp',
      '010F': 'intake_temp',
      '010A': 'fuel_pressure',
      '0142': 'voltage',
      '0110': 'maf',
  };

  private refreshRate = 1000;

  setRefreshRate(ms: number) {
    this.refreshRate = ms;
    // Pass to telemetry service if supported
  }

  getRefreshRate(): number {
    return this.refreshRate;
  }

  startSimulation() {
    // Determine if we should scan for real device or just start logic
    // For this transition, we might trigger a scan
    console.log("Starting Sensor Service (Real Mode)");
    // Auto-scan or Auto-connect could go here
    this.telemetryService.scanForDevices().then(devices => {
        console.log("Found devices:", devices);
        if (devices.length > 0) {
            this.telemetryService.connect(devices[0].id);
        }
    });
  }

  stopSimulation() {
     this.telemetryService.disconnect();
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
