# DriveLytix 🚗📊

**DriveLytix** is a modern React Native application built with **Expo**, designed to provide distinctive driving analytics and data visualization. The application leverages a robust **Clean Architecture** to ensure detailed scalability, maintainability, and testability.

## 🌟 Key Features

- **Clean Architecture**: Structured separation of concerns using Domain, Data, Presentation, and Core layers.
- **Internationalization (i18n)**: Full multi-language support including English, Italian, French, German, Spanish, and Portuguese.
- **Dynamic Theming**: Seamless Light and Dark mode support with a custom design system.
- **Advanced Navigation**: Custom tab bar with specialized interactions (e.g., Power button) and safe area handling.
- **Rich UI/UX**:
  - Interactive **Dashboard** for real-time overview.
  - **Data** & **DataStorage** screens for analytics.
  - **Map** integration for spatial data.
  - **Settings** for deep application configuration.
  - **Get Started** & **Loading** experiences for smooth onboarding.

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (0.81.5) with [Expo](https://expo.dev/) (SDK 54)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [React Navigation 7](https://reactnavigation.org/) & [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: StyleSheet with a centralized Theme System (Palette, Typography)
- **Localization**: [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/)
- **Icons**: @expo/vector-icons

## 📂 Project Structure

The project follows a strict **Clean Architecture** pattern located in the `src` directory:

```text
src/
├── core/           # Core utilities, theme configuration, and constants
├── data/           # Data layer (API repositories, DTOs, local storage)
├── domain/         # Business logic (Entities, Use Cases, Repository interfaces)
└── presentation/   # UI layer (Screens, Components, Hooks)
    ├── components/ # Reusable UI components
    └── screens/    # Application screens (Dashboard, Map, Settings, etc.)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **npm** or **yarn**
- **Expo Go** app on your mobile device (iOS/Android) OR an emulator.

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/drivelytix.git
    cd drivelytix
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the App

Start the development server:

```bash
npx expo start
```

- Press **`a`** to open in Android Emulator / device.
- Press **`i`** to open in iOS Simulator / device.
- Press **`w`** to open in Web browser.
- Scan the QR code with **Expo Go** to run on a physical device.

## 📝 Scripts

- `npm start`: Start the Expo development server.
- `npm run android`: Run on Android (requires Android Studio/SDK).
- `npm run ios`: Run on iOS (requires Xcode/macOS).
- `npm run lint`: Run ESLint analysis.
- `npm run reset-project`: Reset the project state (custom script).

## 🌍 Localization

Translations are managed via `i18next`. To add a new language:

1.  Create a new JSON translation file in `src/core/i18n/locales/`.
2.  Register the new locale in the i18n configuration.

---

Built with ❤️ by the DriveLytix Team.
