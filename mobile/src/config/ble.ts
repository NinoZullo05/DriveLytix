export const BleConfig = {
  // Parsing
  SCAN_DURATION: 10000, // 10 seconds
  CONNECT_TIMEOUT: 5000, // 5 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second

  // UUIDs to filter (optional)
  SERVICE_UUIDS: [] as string[],

  // OBDII specifics
  OBD_SERVICE_UUID: "000018f0-0000-1000-8000-00805f9b34fb", // Standard OBDII

  // Buffer settings
  MTU: 23, // Default MTU
};
