📌 PROJECT PROMPT — DRIVELYTIX MOBILE APP

Project Name: DriveLytix

🎯 Overview

DriveLytix is a high-performance mobile application built with React Native and Expo, designed to connect with OBD-II ELM327 adapters (Bluetooth BLE / Wi-Fi). It retrieves real-time vehicle telemetry, diagnostic trouble codes (DTC), and comprehensive sensor data, providing a premium, automotive-inspired experience for both enthusiasts and professionals.

🎯 Primary Goals

1.  **Seamless Connectivity**: Establish robust and auto-reconnecting communication with OBD-II dongles via Bluetooth Low Energy (BLE) and Wi-Fi.
2.  **Real-Time Visualization**: Display live PIDs (RPM, Speed, Temperature, etc.) through highly responsive and animated gauges/charts.
3.  **Advanced Diagnostics**: Retrieve, interpret, and clear Diagnostic Trouble Codes (DTC) with human-readable descriptions.
4.  **Data Analytics**: Log driving sessions and export performance data for further analysis.
5.  **Premium UI/UX**: Deliver a state-of-the-art interface that is both aesthetic and functional, optimized for the automotive environment.

📱 Technical Stack & Architecture

- **Framework**: React Native (0.81.5) with Expo (SDK 54).
- **Language**: TypeScript for type-safe development.
- **Architecture**: **Clean Architecture** (Core, Data, Domain, Presentation) for maximum modularity and testability.
- **Navigation**: Expo Router (v6) with a customized, interactive tab bar.
- **Theming**: Dynamic Theme System supporting seamless Light and Dark modes (Dark mode as default).
- **Localization**: Multi-language support (i18n) including English, Italian, French, German, Spanish, and Portuguese.
- **Responsiveness**: Fully responsive design system adapted for various screen sizes and orientations.

🔌 Connectivity & Communication

- **Supported Protocols**: Bluetooth (BLE) and Wi-Fi.
- **Core Library**: `react-native-ble-plx` for Bluetooth management.
- **Methodology**:
  - Standard OBD-II PID polling.
  - AT commands for adapter configuration and optimization.
  - Event-driven update loop for high-frequency live data.

🧠 Core Functionalities

1.  **Device Management**

    - Discovery and pairing of BLE/Wi-Fi adapters.
    - Visual connection status indicators and automatic reconnection logic.
    - History of recently connected devices.

2.  **Dynamic Dashboard**

    - Customizable real-time tiles and gauges.
    - Key metrics: Engine RPM, Speed, Coolant Temp, Voltage, Fuel Level, etc.
    - High-performance animations for smooth data visualization.

3.  **Diagnostics (DTC)**

    - Full scan of stored, pending, and permanent trouble codes.
    - Searchable database of code definitions.
    - Secure clearance of MIL (Check Engine Light).

4.  **Sensor Explorer**

    - Full list of available OBD-II sensors with search/filter capabilities.
    - Detailed view for each sensor with time-series historical graphs.
    - Ability to "pin" specific sensors to the main dashboard.

5.  **Driving Logs & History**

    - Automated trip logging.
    - Interactive map view for GPS-integrated data.
    - Export logs in CSV/JSON formats.

6.  **Global Settings**
    - Switchable units (Metric/Imperial).
    - Language selection.
    - Connection preference management (BLE vs Wi-Fi).

🎨 UI/UX Requirements & Design System

- **Aesthetics**: Minimalist, modern, and high-contrast (Automotive-inspired).
- **Layout**: Grid-based responsive layout that adjusts based on device DPI.
- **Animations**: Micro-interactions for button presses and smooth transitions between screens.
- **Feedback**: Haptic feedback Integration for critical actions.

🧪 Testing & Quality Assurance

- **Dongle Compatibility**: Verified with various ELM327 clones and professional adapters (Vgate, OBDLink, etc.).
- **Performance**: Optimized for low latency and high refresh rates on both Android and iOS.
- **Reliability**: Error handling for data timeouts and unexpected adapter disconnects.

---

_This document serves as the master specification for DriveLytix, ensuring consistency across development, design, and localization efforts._
