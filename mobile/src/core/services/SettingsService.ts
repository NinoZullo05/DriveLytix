import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppTheme = 'light' | 'dark' | 'system';
export type AppLanguage = 'en' | 'it' | 'fr' | 'de' | 'es' | 'pt';
export type MeasurementUnit = 'metric' | 'imperial';

export interface UserPreferences {
  theme: AppTheme;
  language: AppLanguage;
  units: MeasurementUnit;
  analyticsEnabled: boolean;
  biometricsEnabled: boolean;
}

export interface UserSettings {
  // Account specific
  authToken?: string | null;
  userId?: string | null;
  
  // Preferences
  preferences: UserPreferences;
  
  // Custom
  customSettings?: Record<string, any>;
}

const STORAGE_KEY = '@drivelytix_settings';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'en',
  units: 'metric',
  analyticsEnabled: false,
  biometricsEnabled: false,
};

const DEFAULT_SETTINGS: UserSettings = {
  authToken: null,
  userId: null,
  preferences: DEFAULT_PREFERENCES,
  customSettings: {},
};

class SettingsService {
  private _settings: UserSettings = DEFAULT_SETTINGS;
  private _initialized: boolean = false;

  /**
   * Initialize settings by loading from storage.
   * Call this on app startup.
   */
  async init(): Promise<void> {
    if (this._initialized) return;
    try {
      await this.loadSettings();
      this._initialized = true;
    } catch (error) {
      console.error('Failed to initialize settings:', error);
      // Fallback to defaults is handled by instance initialization
    }
  }

  /**
   * Load settings from AsyncStorage.
   */
  async loadSettings(): Promise<UserSettings> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const parsed = JSON.parse(jsonValue);
        // Merge with defaults to ensure all keys exist (schema migration support)
        this._settings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          preferences: {
            ...DEFAULT_PREFERENCES,
            ...(parsed.preferences || {}),
          },
        };
      } else {
        this._settings = DEFAULT_SETTINGS;
      }
      return this._settings;
    } catch (e) {
      console.error('Failed to load settings:', e);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Get current settings synchronously.
   * Ensure init() or loadSettings() is called first.
   */
  getSettings(): UserSettings {
    return this._settings;
  }

  /**
   * Update settings partially and persist.
   * @param changes Partial settings to update
   */
  async updateSettings(changes: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const newSettings = {
        ...this._settings,
        ...changes,
        // Deep merge preferences if provided
        preferences: changes.preferences 
          ? { ...this._settings.preferences, ...changes.preferences }
          : this._settings.preferences,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      this._settings = newSettings;
      return newSettings;
    } catch (e) {
      console.error('Failed to save settings:', e);
      throw e;
    }
  }
  
  /**
   * Update specifically user preferences.
   * @param changes Partial preferences
   */
  async updatePreferences(changes: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const newPreferences = {
         ...this._settings.preferences,
         ...changes
      };
      
      await this.updateSettings({ preferences: newPreferences });
      return newPreferences;
    } catch (e) {
        console.error('Failed to update preferences:', e);
        throw e;
    }
  }

  /**
   * Clear all settings (e.g. on logout or reset)
   */
  async clearSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      this._settings = DEFAULT_SETTINGS;
    } catch (e) {
      console.error('Failed to clear settings:', e);
    }
  }
}

export const settingsService = new SettingsService();
