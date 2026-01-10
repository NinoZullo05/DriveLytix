export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  SCANNING = 'SCANNING',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED', // Physical connection established
  INITIALIZING = 'INITIALIZING', // ELM327 protocol setup
  READY = 'READY', // Ready for commands
  STREAMING = 'STREAMING', // Active PID polling
  ERROR = 'ERROR',
  RECONNECTING = 'RECONNECTING',
}
