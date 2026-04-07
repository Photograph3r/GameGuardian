// ============================================
// STORAGE SERVICE
// Handles persistent data using AsyncStorage
// Keeps app state between sessions so the app
// doesn't reset every time it's reopened
// ============================================

import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys used for storage - centralized to avoid typos
const STORAGE_KEYS = {
  READ_ALERTS: '@gameguardian_read_alerts',
  SETTINGS: '@gameguardian_settings',
  SELECTED_CHILD: '@gameguardian_selected_child',
  ONBOARDING_COMPLETE: '@gameguardian_onboarding',
  LAST_SYNC: '@gameguardian_last_sync',
} as const;

// User settings shape
export interface UserSettings {
  activityTracking: boolean;
  patternDetection: boolean;
  pushNotifications: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  activityTracking: true,
  patternDetection: true,
  pushNotifications: true,
};

const StorageService = {
  // ===== READ ALERTS =====
  getReadAlertIds: async (): Promise<string[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.READ_ALERTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading read alerts:', error);
      return [];
    }
  },

  markAlertRead: async (alertId: string): Promise<void> => {
    try {
      const readIds = await StorageService.getReadAlertIds();
      if (!readIds.includes(alertId)) {
        readIds.push(alertId);
        await AsyncStorage.setItem(
          STORAGE_KEYS.READ_ALERTS,
          JSON.stringify(readIds),
        );
      }
    } catch (error) {
      console.error('Error saving read alert:', error);
    }
  },

  // ===== USER SETTINGS =====
  getSettings: async (): Promise<UserSettings> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: async (settings: UserSettings): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings),
      );
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // ===== SELECTED CHILD =====
  getSelectedChildId: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_CHILD);
    } catch (error) {
      console.error('Error loading selected child:', error);
      return null;
    }
  },

  setSelectedChildId: async (childId: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_CHILD, childId);
    } catch (error) {
      console.error('Error saving selected child:', error);
    }
  },

  // ===== ONBOARDING =====
  hasCompletedOnboarding: async (): Promise<boolean> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
      return data === 'true';
    } catch (error) {
      return false;
    }
  },

  setOnboardingComplete: async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    } catch (error) {
      console.error('Error saving onboarding state:', error);
    }
  },

  // ===== LAST SYNC =====
  getLastSyncTime: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch (error) {
      return null;
    }
  },

  updateLastSync: async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString(),
      );
    } catch (error) {
      console.error('Error saving sync time:', error);
    }
  },

  // ===== UTILITY =====
  clearAll: async (): Promise<void> => {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export default StorageService;