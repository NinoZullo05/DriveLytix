import { DTC, DTCSeverity, DTCStatus } from '../../domain/entities/DTC';
import { ConnectionState } from '../../domain/enums/ConnectionState';
import { IOBDAdapter } from '../../domain/interfaces/IOBDAdapter';

export class DiagnosticService {
  private adapter: IOBDAdapter; // In a real app, this should be a shared instance or singleton
  // For now, assume we can get the active adapter from TelemetryService or use a singleton pattern for the functionality
  // To avoid circular dependency or multiple adapter instances, we'll assume a Singleton access pattern for the adapter/transport layer later.
  // For this architecture step, I will inject it or accept it in methods. 
  
  // To keep it simple: generic execute method
  
  constructor(adapter: IOBDAdapter) {
      this.adapter = adapter;
  }

  async readDTCs(): Promise<DTC[]> {
      if (this.adapter.getState() !== ConnectionState.CONNECTED && this.adapter.getState() !== ConnectionState.STREAMING) {
          throw new Error("Not connected");
      }

      // Mode 03: Request Trouble Codes
      const response = await this.adapter.sendCommand("03");
      return this.parseDTCResponse(response);
  }

  async clearDTCs(): Promise<void> {
       if (this.adapter.getState() !== ConnectionState.CONNECTED) {
          throw new Error("Not connected");
      }
      // Mode 04: Clear Trouble Codes
      await this.adapter.sendCommand("04");
  }

  private parseDTCResponse(rawHex: string): DTC[] {
      // Hex: 43 01 33 00 00 00 ...
      // 43 is Success for Mode 03
      // Pairs of bytes represent DTCs.
      // e.g. 0133 -> P0133
      
      const dtcs: DTC[] = [];
      const clean = rawHex.replace(/\s+/g, '').replace(/>/g, '');
      
      if (!clean.startsWith('43')) return [];

      const codesHex = clean.substring(2);
      for (let i = 0; i < codesHex.length; i += 4) {
          const codeHex = codesHex.substr(i, 4);
          if (codeHex === '0000') continue; // Padding
          
          const dtc = this.decodeDTCCode(codeHex);
          dtcs.push(dtc);
      }
      return dtcs;
  }

  private decodeDTCCode(hex: string): DTC {
      // First nibble logic for P/C/B/U codes
      // 0-3 = P (Powertrain), 4-7 = C (Chassis), 8-B = B (Body), C-F = U (Network)
      // This is a simplified decoder
      
      const a = parseInt(hex.substr(0, 1), 16);
      const b = parseInt(hex.substr(1, 1), 16);
      const c = parseInt(hex.substr(2, 1), 16);
      const d = parseInt(hex.substr(3, 1), 16);
      
      let prefix = 'P';
      let firstDigit = 0;
      
      if (a >= 0 && a <= 3) { prefix = 'P'; firstDigit = a; }
      else if (a >= 4 && a <= 7) { prefix = 'C'; firstDigit = a - 4; }
      else if (a >= 8 && a <= 11) { prefix = 'B'; firstDigit = a - 8; }
      else { prefix = 'U'; firstDigit = a - 12; }
      
      const code = `${prefix}${firstDigit}${b.toString(16)}${c.toString(16)}${d.toString(16)}`.toUpperCase();

      return {
          code,
          description: this.lookupDescription(code),
          system: this.lookupSystem(prefix),
          severity: DTCSeverity.Warning, // Default logic
          status: DTCStatus.Active,
          timestamp: Date.now()
      };
  }

  private lookupDescription(code: string): string {
      // Placeholder table
      const map: Record<string, string> = {
          'P0133': 'O2 Sensor Circuit Slow Response (Bank 1 Sensor 1)',
          'P0300': 'Random/Multiple Cylinder Misfire Detected',
      };
      return map[code] || 'Unknown Diagnostic Trouble Code';
  }

  private lookupSystem(prefix: string): string {
      switch (prefix) {
          case 'P': return 'Powertrain';
          case 'B': return 'Body';
          case 'C': return 'Chassis';
          case 'U': return 'Network';
          default: return 'Unknown';
      }
  }
}

import { telemetryService } from './TelemetryService';
export const diagnosticService = new DiagnosticService(telemetryService.getAdapter());
