import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  READ_ALERTS: '@gameguardian_read_alerts',
  SETTINGS: '@gameguardian_settings',
  SELECTED_CHILD: '@gameguardian_selected_child',
  ONBOARDING_COMPLETE: '@gameguardian_onboarding',
  LAST_SYNC: '@gameguardian_last_sync',
  CHILD_PROFILE: '@gameguardian_child_profile',
} as const;

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
  getReadAlertIds: async (): Promise<string[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.READ_ALERTS);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  markAlertRead: async (alertId: string): Promise<void> => {
    try {
      const readIds = await StorageService.getReadAlertIds();
      if (!readIds.includes(alertId)) {
        readIds.push(alertId);
        await AsyncStorage.setItem(STORAGE_KEYS.READ_ALERTS, JSON.stringify(readIds));
      }
    } catch {}
  },

  getSettings: async (): Promise<UserSettings> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  },

  saveSettings: async (settings: UserSettings): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
  },

  getSelectedChildId: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_CHILD);
    } catch { return null; }
  },

  setSelectedChildId: async (childId: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_CHILD, childId);
    } catch {}
  },

  hasCompletedOnboarding: async (): Promise<boolean> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
      return data === 'true';
    } catch { return false; }
  },

  setOnboardingComplete: async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    } catch {}
  },

  getLastSyncTime: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch { return null; }
  },

  updateLastSync: async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch {}
  },

  getChildProfiles: async (): Promise<any[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHILD_PROFILE);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch { return []; }
  },

  getChildProfile: async (): Promise<any | null> => {
    try {
      const profiles = await StorageService.getChildProfiles();
      return profiles.length > 0 ? profiles[0] : null;
    } catch { return null; }
  },

  saveChildProfile: async (profile: any): Promise<void> => {
    try {
      const existing = await StorageService.getChildProfiles();
      const updated = [...existing, profile];
      await AsyncStorage.setItem(STORAGE_KEYS.CHILD_PROFILE, JSON.stringify(updated));
    } catch {}
  },

  hasChildProfile: async (): Promise<boolean> => {
    try {
      const profiles = await StorageService.getChildProfiles();
      return profiles.length > 0;
    } catch { return false; }
  },

  removeChildProfile: async (childId: string): Promise<void> => {
    try {
      const profiles = await StorageService.getChildProfiles();
      const updated = profiles.filter((p: any) => p.id !== childId);
      await AsyncStorage.setItem(STORAGE_KEYS.CHILD_PROFILE, JSON.stringify(updated));
    } catch {}
  },

  clearAll: async (): Promise<void> => {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch {}
  },
};

export default StorageService;