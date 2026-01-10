export const PID_MAP: Record<string, {
  name: string;
  unit: string;
  min: number;
  max: number;
  decoder: (bytes: number[]) => number;
}> = {
  '010C': { // RPM
    name: 'Engine RPM',
    unit: 'RPM',
    min: 0,
    max: 10000,
    decoder: (bytes) => ((bytes[0] * 256) + bytes[1]) / 4,
  },
  '010D': { // Speed
    name: 'Vehicle Speed',
    unit: 'km/h',
    min: 0,
    max: 255,
    decoder: (bytes) => bytes[0],
  },
  '0105': { // Coolant Temp
    name: 'Coolant Temperature',
    unit: '°C',
    min: -40,
    max: 215,
    decoder: (bytes) => bytes[0] - 40,
  },
  '0104': { // Load
    name: 'Calculated Engine Load',
    unit: '%',
    min: 0,
    max: 100,
    decoder: (bytes) => (bytes[0] / 255) * 100,
  },
  '010F': { // Intake Temp
    name: 'Intake Air Temperature',
    unit: '°C',
    min: -40,
    max: 215,
    decoder: (bytes) => bytes[0] - 40,
  },
  '0110': { // MAF
    name: 'Mass Air Flow',
    unit: 'g/s',
    min: 0,
    max: 655,
    decoder: (bytes) => ((bytes[0] * 256) + bytes[1]) / 100,
  },
  '0111': { // Throttle Position
    name: 'Throttle Position',
    unit: '%',
    min: 0,
    max: 100,
    decoder: (bytes) => (bytes[0] / 255) * 100,
  },
  '0142': { // Control Module Voltage
    name: 'Control Module Voltage',
    unit: 'V',
    min: 0,
    max: 20,
    decoder: (bytes) => ((bytes[0] * 256) + bytes[1]) / 1000,
  },
};

export const decodePID = (pid: string, data: string): number | null => {
  // Data is expected to be hex string without spaces, e.g. "410C0FA0"
  // Remove spaces and headers if present (simplified logic)
  const cleanData = data.replace(/\s+/g, '').replace(/>/g, '');
  
  // Check for success response "41" + PID suffix
  const mode = pid.substring(0, 2); // "01"
  const code = pid.substring(2, 4); // "0C"
  const expectedPrefix = (parseInt(mode, 16) + 0x40).toString(16).toUpperCase() + code;
  
  if (!cleanData.includes(expectedPrefix)) {
    return null;
  }

  const def = PID_MAP[pid];
  if (!def) return null;

  // Extract data bytes after prefix
  const payloadIndex = cleanData.indexOf(expectedPrefix) + expectedPrefix.length;
  const payloadHex = cleanData.substring(payloadIndex);
  
  // Convert hex to byte array
  const bytes = [];
  for (let i = 0; i < payloadHex.length; i += 2) {
    bytes.push(parseInt(payloadHex.substr(i, 2), 16));
  }

  return def.decoder(bytes);
};
