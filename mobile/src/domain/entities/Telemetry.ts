export interface TelemetryPoint {
  timestamp: number;
  pid: string;
  value: number;
  raw?: string;
  unit: string;
}

export interface TelemetryBatch {
  timestamp: number;
  points: TelemetryPoint[];
}
