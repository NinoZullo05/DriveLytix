import { create } from 'zustand';
import { TelemetryPoint } from '../../domain/entities/Telemetry';
import { ConnectionState } from '../../domain/enums/ConnectionState';

interface TelemetryState {
  // Connection
  connectionState: ConnectionState;
  connectedDeviceName: string | null;
  
  // Data
  // We use a Map-like object for O(1) access by PID
  latestValues: Record<string, number>;
  
  // Buffer for history (used for sparking/graphs)
  // PID -> Array of points
  history: Record<string, TelemetryPoint[]>;

  // Actions
  setConnectionState: (state: ConnectionState, deviceName?: string) => void;
  updateTelemetry: (points: TelemetryPoint[]) => void;
  clearHistory: () => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  connectionState: ConnectionState.DISCONNECTED,
  connectedDeviceName: null,
  latestValues: {},
  history: {},

  setConnectionState: (state, deviceName) => set((prev) => ({
    connectionState: state,
    connectedDeviceName: deviceName ?? prev.connectedDeviceName
  })),

  updateTelemetry: (points) => set((state) => {
    const newValues = { ...state.latestValues };
    const newHistory = { ...state.history };

    points.forEach(p => {
      newValues[p.pid] = p.value;
      
      if (!newHistory[p.pid]) {
        newHistory[p.pid] = [];
      }
      // Add new point
      newHistory[p.pid].push(p);
      
      // Keep last 100 points per PID for performance
      if (newHistory[p.pid].length > 100) {
        newHistory[p.pid].shift();
      }
    });

    return {
      latestValues: newValues,
      history: newHistory
    };
  }),

  clearHistory: () => set({ history: {} })
}));
