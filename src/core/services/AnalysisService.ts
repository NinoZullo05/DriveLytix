import { Sensor } from '../../domain/entities/Sensor';
import { telemetryService, TelemetryService } from './TelemetryService';

export interface Anomaly {
  id: string;
  type: 'warning' | 'critical';
  message: string;
  timestamp: number;
  sensorId: string;
  value: number;
}

export class AnalysisService {
  private telemetry: TelemetryService;
  private anomalies: Anomaly[] = [];
  private listeners: Set<(anomalies: Anomaly[]) => void> = new Set();

  constructor() {
    this.telemetry = telemetryService;
    this.telemetry.subscribe(this.analyze.bind(this));
  }

  private analyze(sensors: Sensor[]) {
    let newAnomalyDetected = false;

    sensors.forEach(sensor => {
      // Example Logic: Overheating
      if (sensor.id === '0105' || sensor.id === 'coolant') {
        if (sensor.currentValue > 110) {
           this.addAnomaly({
               id: Date.now().toString(),
               type: 'critical',
               message: 'Engine Overheating Detected',
               timestamp: Date.now(),
               sensorId: sensor.id,
               value: sensor.currentValue
           });
           newAnomalyDetected = true;
        }
      }

      // Example Logic: High Load
      if (sensor.id === '0104' || sensor.id === 'load') {
          if (sensor.currentValue > 90) {
              // Debounce or check duration usually
          }
      }
    });

    if (newAnomalyDetected) {
        this.notifyListeners();
    }
  }

  private addAnomaly(anomaly: Anomaly) {
      // Avoid duplicate spam
      const last = this.anomalies[this.anomalies.length - 1];
      if (last && last.message === anomaly.message && (anomaly.timestamp - last.timestamp < 5000)) {
          return;
      }
      this.anomalies.push(anomaly);
      console.warn(`[Analysis] ${anomaly.type.toUpperCase()}: ${anomaly.message}`);
  }

  getAnomalies(): Anomaly[] {
      return this.anomalies;
  }

  subscribe(callback: (anomalies: Anomaly[]) => void) {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
      const list = [...this.anomalies];
      this.listeners.forEach(l => l(list));
  }
}

export const analysisService = new AnalysisService();
