import { ConnectionState } from "../../domain/enums/ConnectionState";
import { IOBDAdapter, OBDDevice } from "../../domain/interfaces/IOBDAdapter";
import { ELM327_INIT_COMMANDS } from "../../infrastructure/obd/ELM327Protocol";
import { decodePID, PID_MAP } from "../../infrastructure/obd/PIDDecoders";
import { useTelemetryStore } from "../store/TelemetryStore";
import { bluetoothService } from "./BluetoothService";

export class TelemetryService {
  private pollingInterval: ReturnType<typeof setInterval> | null = null;

  // Desired PIDs to poll
  private activePIDs: string[] = [
    "010C",
    "010D",
    "0105",
    "0104",
    "010F",
    "0110",
    "0142",
  ];

  constructor() {
    // Initial adapter setup is managed by BluetoothService
    this.getAdapter().onStateChange(this.handleStateChange.bind(this));
  }

  private handleStateChange(state: ConnectionState) {
    console.log(`[TelemetryService] State: ${state}`);
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

      // Run initialization sequence
      for (const cmd of ELM327_INIT_COMMANDS) {
        await adapter.sendCommand(cmd);
      }

      // If successful, start polling
      useTelemetryStore
        .getState()
        .setConnectionState(ConnectionState.STREAMING);
      this.startPolling();
    } catch (error) {
      console.error("Initialization failed", error);
      await this.disconnect();
    }
  }

  private startPolling() {
    if (this.pollingInterval) return;

    this.pollingInterval = setInterval(async () => {
      const adapter = this.getAdapter();
      const state = adapter.getState();

      if (
        state !== ConnectionState.CONNECTED &&
        state !== ConnectionState.STREAMING
      ) {
        this.stopPolling();
        return;
      }

      const updates: any[] = [];

      for (const pid of this.activePIDs) {
        try {
          const rawResponse = await adapter.sendCommand(pid);
          const value = decodePID(pid, rawResponse);

          if (value !== null) {
            const unit = PID_MAP[pid]?.unit || "";
            updates.push({
              timestamp: Date.now(),
              pid: pid,
              value: value,
              unit: unit,
            });
          }
        } catch (e) {
          // PID read failed, skip quietly or log
        }
      }

      if (updates.length > 0) {
        useTelemetryStore.getState().updateTelemetry(updates);
      }
    }, 250); // 4Hz
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
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
