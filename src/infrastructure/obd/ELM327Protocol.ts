export const ELM327_INIT_COMMANDS = [
  'ATZ',      // Reset
  'ATE0',     // Echo Off
  'ATL0',     // Linefeeds Off
  'ATS0',     // Spaces Off (makes parsing easier)
  'ATH0',     // Headers Off
  'ATSP0',    // Set Protocol Auto
];

export class ELM327Protocol {
  // Helper to determining if a message is a full response
  static isCompleteResponse(buffer: string): boolean {
    return buffer.includes('>'); // ELM327 prompt character
  }

  // Helper to clean response
  static cleanResponse(data: string): string {
    return data.replace(/>/g, '').trim();
  }
}
