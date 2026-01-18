import { ConnectionState } from "../../domain/enums/ConnectionState";
import { IOBDAdapter, OBDDevice } from "../../domain/interfaces/IOBDAdapter";

export class MockBLEService implements IOBDAdapter {
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private stateListeners: ((state: ConnectionState) => void)[] = [];

  private setState(state: ConnectionState) {
    this.connectionState = state;
    this.stateListeners.forEach((l) => l(state));
  }

  getState(): ConnectionState {
    return this.connectionState;
  }

  onStateChange(callback: (state: ConnectionState) => void): void {
    this.stateListeners.push(callback);
    callback(this.connectionState);
  }

  async scanDevices(): Promise<OBDDevice[]> {
    this.setState(ConnectionState.SCANNING);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const mockDevices: OBDDevice[] = [
      {
        id: "SIM-OBD-01",
        name: "DriveLytix Simulator",
        address: "00:11:22:33:44:55",
        protocol: "BLE",
        rssi: -45,
      },
      {
        id: "SIM-VLINK-02",
        name: "V-Link Pro (Simulated)",
        address: "AA:BB:CC:DD:EE:FF",
        protocol: "BLE",
        rssi: -30,
      },
    ];
    this.setState(ConnectionState.DISCONNECTED);
    return mockDevices;
  }

  async connect(deviceId: string): Promise<void> {
    this.setState(ConnectionState.CONNECTING);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.setState(ConnectionState.CONNECTED);
    console.log(`[MockBLEService] Connected to ${deviceId}`);
  }

  async disconnect(): Promise<void> {
    this.setState(ConnectionState.DISCONNECTED);
  }

  async sendCommand(command: string): Promise<string> {
    // Basic ELM327 mock responses
    await new Promise((resolve) => setTimeout(resolve, 50)); // Simulating latency

    const cmd = command.toUpperCase().trim();

    if (cmd === "ATZ") return "ELM327 v2.1";
    if (cmd.startsWith("AT")) return "OK";

    // Mock PID Responses (Simplified ELM327 format: 41 PID VALUE)
    if (cmd === "010C") {
      // RPM
      // Random RPM between 800 and 3000
      const rpm = Math.floor(Math.random() * 2200) + 800;
      const hex = (rpm * 4).toString(16).padStart(4, "0").toUpperCase();
      return `41 0C ${hex.substring(0, 2)} ${hex.substring(2, 4)}`;
    }
    if (cmd === "010D") {
      // Speed
      const speed = Math.floor(Math.random() * 120);
      return `41 0D ${speed.toString(16).padStart(2, "0").toUpperCase()}`;
    }
    if (cmd === "0105") {
      // Coolant
      const temp = Math.floor(Math.random() * 20) + 80; // 80-100 C
      return `41 05 ${(temp + 40).toString(16).padStart(2, "0").toUpperCase()}`;
    }
    if (cmd === "0104") {
      // Engine Load
      const load = Math.floor(Math.random() * 100);
      return `41 04 ${(load * 2.55).toString(16).substring(0, 2).toUpperCase()}`;
    }
    if (cmd === "0110") {
      // MAF
      const maf = Math.floor(Math.random() * 10000);
      const hex = maf.toString(16).padStart(4, "0").toUpperCase();
      return `41 10 ${hex.substring(0, 2)} ${hex.substring(2, 4)}`;
    }
    if (cmd === "0142") {
      // Control Module Voltage
      const voltage = Math.floor(Math.random() * 2000) + 12000; // 12-14V
      const hex = voltage.toString(16).padStart(4, "0").toUpperCase();
      return `41 42 ${hex.substring(0, 2)} ${hex.substring(2, 4)}`;
    }

    return "NO DATA";
  }
}
