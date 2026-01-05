
// src/domain/entities/Sensor.ts

export type SensorCategory = 'engine' | 'fluids' | 'electrical' | 'misc';

export interface Sensor {
  id: string;
  name: string;
  pid: string;
  unit: string;
  category: SensorCategory;
  icon: string;
  color: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
  currentValue: number;
  history: { value: number; timestamp: number }[];
}

export interface SensorDataPoint {
  value: number;
  timestamp: number;
}
