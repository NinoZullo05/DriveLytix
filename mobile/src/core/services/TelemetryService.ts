import { ConnectionState } from "../../domain/enums/ConnectionState";
import { IOBDAdapter, OBDDevice } from "../../domain/interfaces/IOBDAdapter";
import { ELM327_INIT_COMMANDS } from "../../infrastructure/obd/ELM327Protocol";
import { decodePID, PID_MAP } from "../../infrastructure/obd/PIDDecoders";
import { useTelemetryStore } from "../store/TelemetryStore";
import { bluetoothService } from "./BluetoothService";

export class TelemetryService {
  private pollTimer: ReturnType<typeof setTimeout> | null = null;
  private isPollingActive: boolean = false;

  // Desired PIDs to poll
  private activePIDs: string[] = [
    "010C", // RPM
    "010D", // Speed
    "0105", // Engine Coolant Temp
    "0104", // Calculated Engine Load
    "010F", // Intake Air Temp
    "0110", // MAF Air Flow Rate
    "0142", // Control Module Voltage
  ];

  constructor() {
    this.getAdapter().onStateChange(this.handleStateChange.bind(this));
  }

  private handleStateChange(state: ConnectionState) {
    console.log(`[TelemetryService] State Changed: ${state}`);
    useTelemetryStore.getState().setConnectionState(state);

    if (state === ConnectionState.CONNECTED) {
      this.initializeAdapter();
    } else if (
      state === ConnectionState.DISCONNECTED ||
      state === ConnectionState.ERROR
    ) {
      this.stopPolling();
    }
  }

  async scanForDevices(): Promise<OBDDevice[]> {
    return new Promise((resolve) => {
      bluetoothService.startScan(resolve);
    });
  }

  async connect(deviceId: string) {
    await bluetoothService.connectToDevice(deviceId);
  }

  async disconnect() {
    await bluetoothService.disconnect();
  }

  private async initializeAdapter() {
    try {
      useTelemetryStore
        .getState()
        .setConnectionState(ConnectionState.INITIALIZING);
      const adapter = this.getAdapter();

      console.log("[TelemetryService] Initializing OBD Adapter...");
      for (const cmd of ELM327_INIT_COMMANDS) {
        console.log(`[TelemetryService] Sending init command: ${cmd}`);
        await adapter.sendCommand(cmd);
      }

      useTelemetryStore
        .getState()
        .setConnectionState(ConnectionState.STREAMING);

      console.log("[TelemetryService] Adapter Ready. Starting Polling...");
      this.startPolling();
    } catch (error) {
      console.error("[TelemetryService] Initialization failed:", error);
      await this.disconnect();
    }
  }

  private startPolling() {
    if (this.isPollingActive) return;
    this.isPollingActive = true;
    this.poll();
  }

  private async poll() {
    if (!this.isPollingActive) return;

    const adapter = this.getAdapter();
    const state = adapter.getState();

    if (
      state !== ConnectionState.CONNECTED &&
      state !== ConnectionState.STREAMING
    ) {
      console.log(`[TelemetryService] Polling stopped due to state: ${state}`);
      this.stopPolling();
      return;
    }

    const updates: any[] = [];
    const timestamp = Date.now();

    for (const pid of this.activePIDs) {
      if (!this.isPollingActive) break;

      try {
        const rawResponse = await adapter.sendCommand(pid);
        const value = decodePID(pid, rawResponse);

        if (value !== null) {
          const unit = PID_MAP[pid]?.unit || "";
          updates.push({
            timestamp: timestamp,
            pid: pid,
            value: value,
            unit: unit,
          });
        }
      } catch (e) {
        console.warn(`[TelemetryService] Failed to poll PID ${pid}:`, e);
        // If we get consecutive failures, we might want to check connection
      }
    }

    if (updates.length > 0) {
      useTelemetryStore.getState().updateTelemetry(updates);
    }

    // Schedule next poll only after this one is complete
    if (this.isPollingActive) {
      this.pollTimer = setTimeout(() => this.poll(), 100); // Poll at ~10Hz if possible, or as fast as hardware allows
    }
  }

  private stopPolling() {
    console.log("[TelemetryService] Stopping Polling...");
    this.isPollingActive = false;
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private getAdapter(): IOBDAdapter {
    return bluetoothService.getAdapter();
  }

  getConnectionState(): ConnectionState {
    return this.getAdapter().getState();
  }
}

export const telemetryService = new TelemetryService();
