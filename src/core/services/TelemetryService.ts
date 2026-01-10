import { Sensor } from '../../domain/entities/Sensor'; // Keeping legacy entity for compatibility for now
import { ConnectionState } from '../../domain/enums/ConnectionState';
import { IOBDAdapter, OBDDevice } from '../../domain/interfaces/IOBDAdapter';
import { BLEService } from '../../infrastructure/obd/BLEService';
import { ELM327_INIT_COMMANDS } from '../../infrastructure/obd/ELM327Protocol';
import { decodePID, PID_MAP } from '../../infrastructure/obd/PIDDecoders';

export class TelemetryService {
  private adapter: IOBDAdapter;
  private pollingInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<(data: Sensor[]) => void> = new Set();
  
  // Cache current values
  private currentData: Map<string, Sensor> = new Map();

  // Desired PIDs to poll
  private activePIDs: string[] = ['010C', '010D', '0105', '0104', '010F', '0110', '0142'];

  constructor() {
    this.adapter = new BLEService();
    this.adapter.onStateChange(this.handleStateChange.bind(this));
    this.initializeSensors();
  }

  // Initialize sensors with default values (matching old SensorService)
  private initializeSensors() {
     this.activePIDs.forEach(pid => {
         const def = PID_MAP[pid];
         if (def) {
             const sensor: Sensor = {
                 id: pid,
                 name: def.name,
                 pid: pid,
                 unit: def.unit,
                 category: 'engine', // Simplified category mapping
                 icon: 'engine', // Placeholder
                 color: '#FFFFFF',
                 minValue: def.min,
                 maxValue: def.max,
                 defaultValue: 0,
                 currentValue: 0,
                 history: []
             };
             this.currentData.set(pid, sensor);
         }
     });
  }

  private handleStateChange(state: ConnectionState) {
    console.log(`Connection State Changed: ${state}`);
    if (state === ConnectionState.CONNECTED) {
        this.initializeAdapter();
    } else if (state === ConnectionState.DISCONNECTED || state === ConnectionState.ERROR) {
        this.stopPolling();
    }
  }

  async scanForDevices(): Promise<OBDDevice[]> {
      return this.adapter.scanDevices();
  }

  async connect(deviceId: string) {
      await this.adapter.connect(deviceId);
  }

  async disconnect() {
      await this.adapter.disconnect();
  }

  private async initializeAdapter() {
      try {
          // Run initialization sequence
          for (const cmd of ELM327_INIT_COMMANDS) {
              await this.adapter.sendCommand(cmd);
          }
          // If successful, start polling
          this.startPolling();
      } catch (error) {
          console.error("Initialization failed", error);
          await this.disconnect();
      }
  }

  private startPolling() {
      if (this.pollingInterval) return;
      
      this.pollingInterval = setInterval(async () => {
          if (this.adapter.getState() !== ConnectionState.CONNECTED) { // Should be STREAMING or READY ideally
              // simplified check
          }

          for (const pid of this.activePIDs) {
             try {
                 const rawResponse = await this.adapter.sendCommand(pid);
                 const value = decodePID(pid, rawResponse);
                 
                 if (value !== null) {
                     this.updateSensor(pid, value);
                 }
             } catch (e) {
                 console.warn(`Failed to read PID ${pid}`, e);
             }
          }
          this.notifyListeners();
      }, 500); // 2Hz for now
  }

  private stopPolling() {
      if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
      }
  }

  private updateSensor(pid: string, value: number) {
      const sensor = this.currentData.get(pid);
      if (sensor) {
          sensor.currentValue = value;
          sensor.history.push({ value, timestamp: Date.now() });
          if (sensor.history.length > 50) sensor.history.shift();
          this.currentData.set(pid, sensor);
      }
  }

  // Public API for UI
  subscribe(callback: (data: Sensor[]) => void): () => void {
      this.listeners.add(callback);
      callback(Array.from(this.currentData.values())); // Initial emit
      return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
      const data = Array.from(this.currentData.values());
      this.listeners.forEach(l => l(data));
  }
  
  getConnectionState(): ConnectionState {
      return this.adapter.getState();
  }

  getAdapter(): IOBDAdapter {
      return this.adapter;
  }
}

export const telemetryService = new TelemetryService();
