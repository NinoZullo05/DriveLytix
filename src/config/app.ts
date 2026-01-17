import Constants from 'expo-constants';

export const AppConfig = {
  NAME: 'DriveLytix',
  VERSION: Constants.expoConfig?.version || '1.0.0',
  BUNDLE_ID: Constants.expoConfig?.ios?.bundleIdentifier || Constants.expoConfig?.android?.package || 'com.drivelytix.app',
  SUPPORT_EMAIL: 'support@drivelytix.com',
  WEBSITE: 'https://drivelytix.com',
  COPYRIGHT: `© ${new Date().getFullYear()} DriveLytix`,
};
