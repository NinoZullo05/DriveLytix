# DriveLytix 🚗📊

**DriveLytix** is a premium OBD-II diagnostic and real-time vehicle analytics application built with **React Native** and **Expo**. It empowers drivers to unlock hidden data from their vehicles, providing professional-grade telemetry, error code diagnostics, and a customizable interactive dashboard.

---

## 🌟 Key Features

### 🔌 Intelligent Connectivity

- **Hybrid Support**: Seamlessly connect to ELM327 adapters via **Bluetooth Low Energy (BLE)** or **Wi-Fi**.
- **Auto-Reconnect**: Intelligent background management to stay connected to your vehicle.
- **Simulation Mode**: Test and explore all features even without an adapter plugged in.

### 📊 Real-Time Telemetry

- **Dynamic Dashboard**: Interactive gauges for RPM, Speed, Engine Load, and more.
- **Customizable Widgets**: Enable, disable, and reorder dashboard components to suit your driving style.
- **High-Performance UI**: Smooth 60fps animations for real-time sensor updates.

### 🛠 Powerful Diagnostics

- **DTC Scanner**: Retrieve, interpret, and clear Diagnostic Trouble Codes (DTC).
- **Human-Readable Errors**: Understand what's happening under the hood with detailed code descriptions.

### 🌍 Universal Design

- **Multi-language (i18n)**: Native support for English, Italian, French, German, Spanish, and Portuguese.
- **Dynamic Theming**: Premium Dark and Light modes out of the box.
- **Clean Architecture**: Built on a solid foundation for maximum reliability and scalability.

---

## 🛠 Tech Stack

- **Core**: [React Native](https://reactnative.dev/) (0.81.5) & [Expo](https://expo.dev/) (SDK 54)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Communication**: `react-native-ble-plx` for industrial-strength BLE connectivity.
- **Storage**: AsyncStorage for local configurations and trip histories.
- **Localization**: [i18next](https://www.i18next.com/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (LTS)
- **Expo Go** app (Android/iOS) or a suitable Emulator.

### Installation

1. Clone the repository: `git clone https://github.com/NinoZullo05/DriveLytix.git`
2. Install dependencies: `npm install`
3. Start the engine: `npx expo start`

---

## 📂 Project Governance (Clean Architecture)

```text
src/
├── core/           # Universal utilities, theme, and i18n
├── data/           # Repositories and local/remote data handling
├── domain/         # Entities and business logic
└── presentation/   # UI layer: Screens, Components, and Hooks
```

---

## 🌍 Localization

Adding a language is simple:

1. Create a JSON file in `src/core/locales/`.
2. Register it in `src/core/i18n.ts`.

---

Built with precision by the **DriveLytix Team**.
