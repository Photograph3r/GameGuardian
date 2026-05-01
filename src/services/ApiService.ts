import {
  Child,
  Game,
  Alert,
  ActivitySummary,
  Friend,
  Group,
} from '../types';
import {
  mockChildren,
  mockGames,
  mockAlerts,
  mockActivitySummary,
  mockFriends,
  mockGroups,
} from '../data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const simulateNetworkDelay = (ms: number = 800): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

async function apiRequest<T>(
  fetcher: () => T,
  delayMs: number = 800,
): Promise<T> {
  await simulateNetworkDelay(delayMs);
  if (Math.random() < 0.01) {
    throw new Error('Network request failed. Please try again.');
  }
  return fetcher();
}

// Roblox authenticated request helper
async function robloxRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await AsyncStorage.getItem('@gameguardian_roblox_token');
  if (!token) throw new Error('No Roblox access token found. Please log in.');

  const response = await fetch(`https://apis.roblox.com${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Roblox API error: ${err}`);
  }

  return response.json();
}

const ApiService = {
  // --- Mock Methods (existing) ---
  getChildren: async (): Promise<Child[]> => {
    return apiRequest(() => mockChildren);
  },

  getChild: async (childId: string): Promise<Child | undefined> => {
    return apiRequest(() => mockChildren.find(c => c.id === childId));
  },

  getGames: async (_childId?: string): Promise<Game[]> => {
    return apiRequest(() => mockGames);
  },

  getFriends: async (_childId?: string): Promise<Friend[]> => {
    return apiRequest(() => mockFriends);
  },

  getGroups: async (_childId?: string): Promise<Group[]> => {
    return apiRequest(() => mockGroups);
  },

  getAlerts: async (): Promise<Alert[]> => {
    return apiRequest(() => mockAlerts);
  },

  markAlertRead: async (alertId: string): Promise<void> => {
    await simulateNetworkDelay(300);
    const alert = mockAlerts.find(a => a.id === alertId);
    if (alert) alert.isRead = true;
  },

  resolveAlert: async (alertId: string): Promise<void> => {
    await simulateNetworkDelay(300);
    console.log(`Alert ${alertId} resolved`);
  },

  getActivitySummary: async (_childId?: string): Promise<ActivitySummary> => {
    return apiRequest(() => mockActivitySummary);
  },

  // --- Roblox Live Methods ---
  getRobloxUser: async (): Promise<any> => {
    return robloxRequest('/oauth/v1/userinfo');
  },

  getRobloxPlayerGames: async (userId: string): Promise<any> => {
    return robloxRequest(`/cloud/v2/users/${userId}/games`);
  },
};

export default ApiService;