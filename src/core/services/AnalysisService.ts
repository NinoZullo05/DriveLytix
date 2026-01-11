import { useTelemetryStore } from '../store/TelemetryStore';

export interface Anomaly {
  id: string;
  type: 'warning' | 'critical';
  message: string;
  timestamp: number;
  sensorId: string;
  value: number;
}

export class AnalysisService {
  private anomalies: Anomaly[] = [];
  private listeners: Set<(anomalies: Anomaly[]) => void> = new Set();

  constructor() {
    // Subscribe to store updates
    useTelemetryStore.subscribe((state) => {
        this.analyze(state.latestValues);
    });
  }

  private analyze(values: Record<string, number>) {
    let newAnomalyDetected = false;
    
    // Check Coolant (0105)
    if (values['0105'] !== undefined) {
         if (values['0105'] > 110) {
              this.addAnomaly({
               id: Date.now().toString(),
               type: 'critical',
               message: 'Engine Overheating Detected',
               timestamp: Date.now(),
               sensorId: '0105',
               value: values['0105']
           });
           newAnomalyDetected = true;
         }
    }

    // Check Load (0104)
    if (values['0104'] !== undefined) {
          if (values['0104'] > 95) {
               // High load check
          }
    }

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
