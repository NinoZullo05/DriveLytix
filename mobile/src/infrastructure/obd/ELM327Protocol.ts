export const ELM327_INIT_COMMANDS = [
  "ATZ", // Reset
  "ATE0", // Echo Off
  "ATL0", // Linefeeds Off
  "ATS0", // Spaces Off (makes parsing easier)
  "ATH0", // Headers Off
  "ATSP0", // Set Protocol Auto
];

export class ELM327Protocol {
  /**
   * Helper to determining if a message is a full response.
   * ELM327 signals completion by sending a '>' prompt.
   */
  static isCompleteResponse(buffer: string): boolean {
    // Trim the buffer to check if it ends with '>'
    const trimmed = buffer.trim();
    return trimmed.endsWith(">");
  }

  /**
   * Helper to clean response.
   * Removes prompts, echo, and weird characters.
   */
  static cleanResponse(data: string): string {
    return data
      .replace(/>/g, "") // Remove all prompt characters
      .replace(/\r/g, "\n") // Normalize line endings
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join(" ")
      .trim();
  }
}
