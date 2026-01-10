export enum DTCSeverity {
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical',
}

export enum DTCStatus {
  Active = 'active',
  Pending = 'pending',
  Stored = 'stored',
  Permanent = 'permanent',
}

export interface DTC {
  code: string; // e.g., P0300
  description: string;
  system: string; // e.g., Powertrain
  severity: DTCSeverity;
  status: DTCStatus;
  timestamp: number;
  freezeFrame?: Record<string, number>; // Snapshot of data when error occurred
}
