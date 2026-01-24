export type AppEnvironment = "development" | "staging" | "production";

const isDev = __DEV__;

export const ENV_CONFIG = {
  current: (isDev ? "development" : "production") as AppEnvironment,

  development: {
    API_URL: "https://dev-api.drivelytix.com",
    ENV_NAME: "Development",
  },
  staging: {
    API_URL: "https://staging-api.drivelytix.com",
    ENV_NAME: "Staging",
  },
  production: {
    API_URL: "https://api.drivelytix.com",
    ENV_NAME: "Production",
  },
};

export const Config = {
  ...ENV_CONFIG[ENV_CONFIG.current],
  IS_DEV: ENV_CONFIG.current === "development",
};
