import { DTC } from '../entities/DTC';

export interface IDTCRepository {
  save(dtc: DTC): Promise<void>;
  getAll(): Promise<DTC[]>;
  clear(): Promise<void>;
}
