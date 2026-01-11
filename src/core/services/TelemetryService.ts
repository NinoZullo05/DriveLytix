import { ConnectionState } from '../../domain/enums/ConnectionState';
import { IOBDAdapter, OBDDevice } from '../../domain/interfaces/IOBDAdapter';
import { BLEService } from '../../infrastructure/obd/BLEService';
import { ELM327_INIT_COMMANDS } from '../../infrastructure/obd/ELM327Protocol';
import { decodePID, PID_MAP } from '../../infrastructure/obd/PIDDecoders';
import { useTelemetryStore } from '../store/TelemetryStore';

export class TelemetryService {
  private adapter: IOBDAdapter;
  private pollingInterval: ReturnType<typeof setInterval> | null = null;
  // private listeners: Set<(data: Sensor[]) => void> = new Set(); // Removed: Using Zustand
  
  // Desired PIDs to poll
  private activePIDs: string[] = ['010C', '010D', '0105', '0104', '010F', '0110', '0142'];

  constructor() {
    this.adapter = new BLEService();
    this.adapter.onStateChange(this.handleStateChange.bind(this));
  }

  private handleStateChange(state: ConnectionState) {
    console.log(`Connection State Changed: ${state}`);
    // Update Global Store
    useTelemetryStore.getState().setConnectionState(state);

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
          useTelemetryStore.getState().setConnectionState(ConnectionState.INITIALIZING);
          // Run initialization sequence
          for (const cmd of ELM327_INIT_COMMANDS) {
              await this.adapter.sendCommand(cmd);
          }
          // If successful, start polling
          useTelemetryStore.getState().setConnectionState(ConnectionState.STREAMING); // Ready to stream
          this.startPolling();
      } catch (error) {
          console.error("Initialization failed", error);
          await this.disconnect();
      }
  }

  private startPolling() {
      if (this.pollingInterval) return;
      
      this.pollingInterval = setInterval(async () => {
          if (this.adapter.getState() !== ConnectionState.CONNECTED && this.adapter.getState() !== ConnectionState.STREAMING) { 
              // simplified check
          }

          const updates: any[] = [];

          for (const pid of this.activePIDs) {
             try {
                 const rawResponse = await this.adapter.sendCommand(pid);
                 const value = decodePID(pid, rawResponse);
                 
                 if (value !== null) {
                     // Get unit from map
                     const unit = PID_MAP[pid]?.unit || '';
                     updates.push({
                         timestamp: Date.now(),
                         pid: pid,
                         value: value,
                         unit: unit
                     });
                 }
             } catch (e) {
                 // console.warn(`Failed to read PID ${pid}`, e);
             }
          }
          
          if (updates.length > 0) {
              useTelemetryStore.getState().updateTelemetry(updates);
          }
      }, 250); // Increased to 4Hz for stability initially, aim for 10Hz later
  }

  private stopPolling() {
      if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
      }
  }

  getConnectionState(): ConnectionState {
      return this.adapter.getState();
  }

  getAdapter(): IOBDAdapter {
      return this.adapter;
  }
}

export const telemetryService = new TelemetryService();
