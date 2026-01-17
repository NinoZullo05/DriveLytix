export const LogConfig = {
  ENABLE_LOGS: __DEV__,
  LOG_LEVEL: __DEV__ ? 'debug' : 'error', // debug, info, warn, error
  MAX_LOGS: 1000,
};

export const FeatureFlags = {
  USE_MOCK_DATA: __DEV__,
  ENABLE_ANALYTICS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_NEW_DASHBOARD: true,
  ENABLE_BACKGROUND_SCAN: false, // Experimental
};
