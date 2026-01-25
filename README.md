# 🚗 DriveLytix

**DriveLytix** is a comprehensive automotive diagnostics and telemetry system designed to provide real-time vehicle monitoring, OBD-II data collection, and advanced analytics. The project consists of a mobile app for on-the-go diagnostics, a web dashboard for detailed analysis, and a backend API for data synchronization and cloud features.

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Applications](#running-the-applications)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Mobile App (iOS & Android)

- **Real-time Vehicle Telemetry**: Monitor RPM, speed, fuel consumption, temperature, and more
- **Bluetooth Low Energy (BLE)**: Connect to OBD-II adapters via Bluetooth
- **Diagnostic Trouble Codes (DTC)**: Read and clear error codes
- **Session Tracking**: Record and analyze driving sessions
- **Multi-language Support**: English, Italian, French, German, Spanish, Portuguese
- **Dark/Light Theme**: Adaptive UI theming
- **Offline Storage**: SQLite database for local data persistence
- **Interactive Charts**: Beautiful data visualization with gifted-charts

### Web Dashboard

- **Live Demo**: Interactive telemetry simulation
- **Responsive Design**: Mobile-first, fully responsive UI
- **Internationalization**: Multi-language support with i18next
- **Modern UI**: Built with React 19, Framer Motion, and Tailwind CSS
- **Data Visualization**: Advanced charts with Recharts
- **Architecture Overview**: Technical documentation and system design

### Backend API

- **RESTful API**: Express.js server for data synchronization
- **CORS Support**: Cross-origin resource sharing enabled
- **TypeScript**: Type-safe backend development
- **Scalable**: Designed for cloud deployment

---

## 🏗️ Architecture

DriveLytix follows a **Clean Architecture** approach with clear separation of concerns:

```
mobile/src/
├── core/              # Core utilities, types, constants
├── domain/            # Business logic & entities
├── data/              # Data sources & repositories
├── infrastructure/    # BLE, SQLite, external services
├── presentation/      # UI components, screens, navigation
└── config/            # App configuration
```

**Key Architectural Principles:**

- **Domain-Driven Design (DDD)**: Business logic isolated from infrastructure
- **Dependency Injection**: Loose coupling between layers
- **Repository Pattern**: Abstracted data access
- **State Management**: Zustand for reactive state, SQLite for persistence
- **Service Layer**: BLE, Telemetry, and Configuration services

---

## 🛠️ Tech Stack

### Mobile (React Native + Expo)

- **Framework**: React Native 0.81.5, Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Database**: SQLite (expo-sqlite) + Drizzle ORM
- **Bluetooth**: react-native-ble-plx
- **Charts**: react-native-gifted-charts
- **i18n**: i18next + react-i18next
- **UI**: Expo Linear Gradient, Expo Blur, React Native Reanimated

### Web Dashboard (React + Vite)

- **Framework**: React 19
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion 11
- **Icons**: Lucide React
- **Charts**: Recharts 2
- **i18n**: i18next + react-i18next

### Backend (Node.js + Express)

- **Runtime**: Node.js
- **Framework**: Express 4
- **Language**: TypeScript
- **Middleware**: CORS, dotenv
- **Development**: ts-node-dev (hot reload)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (for mobile development)
- **Android Studio** (for Android development) or **Xcode** (for iOS development)
- **Git**

### Installation

Clone the repository:

```bash
git clone https://github.com/NinoZullo05/DriveLytix.git
cd DriveLytix
```

Install dependencies for each project:

```bash
# Mobile App
cd mobile
npm install

# Web Dashboard
cd ../web
npm install

# Backend API
cd ../backend
npm install
```

### Running the Applications

#### 🎯 Mobile App

```bash
cd mobile

# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on Web (experimental)
npm run web
```

**Note**: For physical devices, ensure Bluetooth permissions are granted. For OBD-II testing, use a compatible ELM327 Bluetooth adapter.

#### 🌐 Web Dashboard

```bash
cd web

# Start development server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

#### ⚙️ Backend API

```bash
cd backend

# Start development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start
```

**Environment Variables**: Create a `.env` file in the `backend/` directory:

```env
PORT=3000
NODE_ENV=development
```

---

## 📁 Project Structure

```
DriveLytix/
├── mobile/                 # React Native mobile app (iOS & Android)
│   ├── app/               # Expo Router screens
│   ├── src/
│   │   ├── core/          # Utilities, constants, types
│   │   ├── domain/        # Business logic & entities
│   │   ├── data/          # Repositories & data sources
│   │   ├── infrastructure/# BLE, SQLite, services
│   │   ├── presentation/  # UI components & screens
│   │   └── config/        # App configuration
│   └── assets/            # Images, fonts, icons
│
├── web/                   # React web dashboard
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── locales/       # i18n translation files
│   │   ├── App.tsx        # Main app component
│   │   └── i18n.ts        # i18n configuration
│   └── public/            # Static assets
│
├── backend/               # Node.js Express API
│   ├── src/
│   │   └── index.ts       # API entry point
│   └── dist/              # Compiled JavaScript (generated)
│
└── README.md              # This file
```

---

## 💻 Development

### Mobile App Development

**Key Commands:**

```bash
npm start          # Start Expo dev server
npm run android    # Build and run on Android
npm run ios        # Build and run on iOS
npm run lint       # Run ESLint
```

**Debugging:**

- Use **Expo DevTools** for debugging
- React Native Debugger for advanced debugging
- Android Studio Logcat / Xcode Console for native logs

### Web Dashboard Development

**Key Commands:**

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

**Hot Reload**: Vite provides instant HMR (Hot Module Replacement)

### Backend Development

**Key Commands:**

```bash
npm run dev        # Start with hot reload
npm run build      # Compile TypeScript
npm start          # Run compiled code
```

---

## 🧪 Testing

### Mobile

```bash
cd mobile
npm run lint       # ESLint checks
```

### Web

```bash
cd web
npm run lint       # ESLint + TypeScript checks
npm run build      # Type check during build
```

### Backend

```bash
cd backend
npm run build      # TypeScript compilation check
```

---

## 🌍 Internationalization

Both mobile and web apps support multiple languages:

- 🇬🇧 English (default)
- 🇮🇹 Italian
- 🇫🇷 French
- 🇩🇪 German
- 🇪🇸 Spanish
- 🇵🇹 Portuguese

Language files are located in:

- **Mobile**: `mobile/src/config/i18n/locales/`
- **Web**: `web/src/locales/`

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a new branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m 'Add some feature'`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

### Code Style

- Use **TypeScript** for type safety
- Follow **ESLint** rules
- Write **clean, readable code**
- Add **comments** for complex logic

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

**Developer**: Nino Zullo  
**GitHub**: [@NinoZullo05](https://github.com/NinoZullo05)

---

## 🙏 Acknowledgments

- **Expo** - For the amazing React Native framework
- **React Community** - For excellent libraries and support
- **OBD-II Community** - For documentation and standards

---

**Made with ❤️ for automotive enthusiasts**
