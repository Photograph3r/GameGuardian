import { Child, Game, Alert, ActivitySummary, Friend, Group } from '../types';
import {
  mockChildren, mockGames, mockAlerts,
  mockActivitySummary, mockFriends, mockGroups,
} from '../data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const simulateNetworkDelay = (ms: number = 800): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

async function apiRequest<T>(fetcher: () => T, delayMs: number = 800): Promise<T> {
  await simulateNetworkDelay(delayMs);
  if (Math.random() < 0.01) {
    throw new Error('Network request failed. Please try again.');
  }
  return fetcher();
}

async function robloxRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const tokenData = await AsyncStorage.getItem('@gameguardian_roblox_token');
  if (!tokenData) throw new Error('No Roblox access token found. Please log in.');
  const { accessToken } = JSON.parse(tokenData);
  const response = await fetch(`https://apis.roblox.com${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
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

// ===== RANDOMIZATION HELPERS =====

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomizedGames(): Game[] {
  const shuffled = shuffleArray(mockGames);
  const count = randomInt(5, mockGames.length);
  return shuffled.slice(0, count).map(game => ({
    ...game,
    playtime: randomInt(10, 120),
    lastPlayed: randomFrom([
      'Just now', '1 hour ago', '2 hours ago', '3 hours ago',
      '5 hours ago', 'Yesterday', '2 days ago', '3 days ago',
    ]),
  }));
}

function getRandomizedFriends(): Friend[] {
  const shuffled = shuffleArray(mockFriends);
  const count = randomInt(3, mockFriends.length);
  return shuffled.slice(0, count);
}

function getRandomizedGroups(): Group[] {
  return shuffleArray(mockGroups);
}

function getRandomizedAlerts(): Alert[] {
  const shuffled = shuffleArray(mockAlerts);
  const count = randomInt(4, mockAlerts.length);
  return shuffled.slice(0, count).map(alert => ({
    ...alert,
    isRead: Math.random() < 0.4,
    timestamp: new Date(
      Date.now() - randomInt(1, 7) * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));
}

function getRandomizedSummary(): ActivitySummary {
  const totalPlaytime = randomInt(120, 480);
  const newFriends = randomInt(0, 5);
  const newGroups = randomInt(0, 3);
  const gamesPlayed = randomInt(3, 10);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = days.map(day => ({
    day,
    minutes: Math.random() < 0.15 ? 0 : randomInt(15, 95),
  }));
  return { totalPlaytime, gamesPlayed, newFriends, newGroups, chartData };
}

// Cache randomized data per session so it doesn't change on every refresh
let sessionCache: {
  games?: Game[];
  friends?: Friend[];
  groups?: Group[];
  alerts?: Alert[];
  summary?: ActivitySummary;
} = {};

const ApiService = {
  getChildren: async (): Promise<Child[]> => {
    return apiRequest(() => mockChildren);
  },

  getChild: async (childId: string): Promise<Child | undefined> => {
    return apiRequest(() => mockChildren.find(c => c.id === childId));
  },

  getGames: async (_childId?: string): Promise<Game[]> => {
    if (!sessionCache.games) {
      sessionCache.games = getRandomizedGames();
    }
    return apiRequest(() => sessionCache.games!);
  },

  getFriends: async (_childId?: string): Promise<Friend[]> => {
    if (!sessionCache.friends) {
      sessionCache.friends = getRandomizedFriends();
    }
    return apiRequest(() => sessionCache.friends!);
  },

  getGroups: async (_childId?: string): Promise<Group[]> => {
    if (!sessionCache.groups) {
      sessionCache.groups = getRandomizedGroups();
    }
    return apiRequest(() => sessionCache.groups!);
  },

  getAlerts: async (): Promise<Alert[]> => {
    if (!sessionCache.alerts) {
      sessionCache.alerts = getRandomizedAlerts();
    }
    return apiRequest(() => sessionCache.alerts!);
  },

  getActivitySummary: async (_childId?: string): Promise<ActivitySummary> => {
    if (!sessionCache.summary) {
      sessionCache.summary = getRandomizedSummary();
    }
    return apiRequest(() => sessionCache.summary!);
  },

  markAlertRead: async (alertId: string): Promise<void> => {
    await simulateNetworkDelay(300);
    if (sessionCache.alerts) {
      const alert = sessionCache.alerts.find(a => a.id === alertId);
      if (alert) alert.isRead = true;
    }
  },

  resolveAlert: async (alertId: string): Promise<void> => {
    await simulateNetworkDelay(300);
    if (sessionCache.alerts) {
      sessionCache.alerts = sessionCache.alerts.filter(a => a.id !== alertId);
    }
  },

  // Clear cache to force new randomization (call on logout or refresh)
  clearCache: () => {
    sessionCache = {};
  },

  // ===== ROBLOX LIVE METHODS =====
  getRobloxUser: async (): Promise<any> => {
    return robloxRequest('/oauth/v1/userinfo');
  },

  getRobloxPlayerGames: async (userId: string): Promise<any> => {
    return robloxRequest(`/cloud/v2/users/${userId}/games`);
  },
};

export default ApiService;