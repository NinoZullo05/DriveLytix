
// src/core/services/SensorService.ts

import { Sensor } from '../../domain/entities/Sensor';

class SensorService {
  private sensors: Map<string, Sensor> = new Map();
  private listeners: Set<(sensors: Sensor[]) => void> = new Set();
  private simulationInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.initializeSensors();
  }

  private initializeSensors() {
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
      {
        id: 'load',
        name: 'Calculated Load',
        pid: '0104',
        unit: '%',
        category: 'engine',
        icon: 'engine-outline',
        color: '#A855F7',
        minValue: 0,
        maxValue: 100,
        defaultValue: 15,
        currentValue: 15,
        history: [],
      },
      {
        id: 'coolant',
        name: 'Coolant Temp',
        pid: '0105',
        unit: '°C',
        category: 'fluids',
        icon: 'thermometer',
        color: '#FB923C',
        minValue: -40,
        maxValue: 215,
        defaultValue: 90,
        currentValue: 90,
        history: [],
      },
      {
        id: 'oil_temp',
        name: 'Oil Temp',
        pid: '015C',
        unit: '°C',
        category: 'fluids',
        icon: 'oil',
        color: '#F87171',
        minValue: -40,
        maxValue: 215,
        defaultValue: 95,
        currentValue: 95,
        history: [],
      },
      {
        id: 'intake_temp',
        name: 'Intake Temp',
        pid: '010F',
        unit: '°C',
        category: 'fluids',
        icon: 'weather-windy',
        color: '#38BDF8',
        minValue: -40,
        maxValue: 215,
        defaultValue: 35,
        currentValue: 35,
        history: [],
      },
      {
        id: 'fuel_pressure',
        name: 'Fuel Pressure',
        pid: '010A',
        unit: 'kPa',
        category: 'fluids',
        icon: 'arrow-collapse-vertical',
        color: '#FACC15',
        minValue: 0,
        maxValue: 765,
        defaultValue: 380,
        currentValue: 380,
        history: [],
      },
      {
        id: 'voltage',
        name: 'Module Voltage',
        pid: '0142',
        unit: 'V',
        category: 'electrical',
        icon: 'flash',
        color: '#4ADE80',
        minValue: 0,
        maxValue: 18,
        defaultValue: 13.8,
        currentValue: 13.8,
        history: [],
      },
      {
        id: 'maf',
        name: 'Mass Air Flow',
        pid: '0110',
        unit: 'g/s',
        category: 'engine',
        icon: 'windsock',
        color: '#22D3EE',
        minValue: 0,
        maxValue: 655,
        defaultValue: 12.5,
        currentValue: 12.5,
        history: [],
      },
    ];

    initialSensors.forEach((s) => this.sensors.set(s.id, s));
  }

  private refreshRate = 1000;

  setRefreshRate(ms: number) {
    this.refreshRate = ms;
    if (this.simulationInterval) {
      this.stopSimulation();
      this.startSimulation();
    }
  }

  getRefreshRate(): number {
    return this.refreshRate;
  }

  startSimulation() {
    if (this.simulationInterval) return;

    this.simulationInterval = setInterval(() => {
      this.sensors.forEach((sensor) => {
        let newValue = sensor.currentValue;
        
        // Simple random walk for simulation
        const delta = (Math.random() - 0.5) * (sensor.maxValue - sensor.minValue) * 0.05;
        newValue += delta;
        
        // Clamp values
        newValue = Math.max(sensor.minValue, Math.min(sensor.maxValue, newValue));
        
        sensor.currentValue = newValue;
        sensor.history.push({ value: newValue, timestamp: Date.now() });
        
        // Keep last 50 points
        if (sensor.history.length > 50) {
          sensor.history.shift();
        }
      });

      this.notifyListeners();
    }, this.refreshRate);
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
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
