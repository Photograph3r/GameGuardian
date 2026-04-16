import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEYS = {
  USER: '@gameguardian_user',
  TOKEN: '@gameguardian_token',
} as const;

export interface User {
  id: string;
  name: string;
  email: string;
}

const MOCK_USERS = [
  { id: 'user-001', name: 'Sarah Johnson', email: 'sarah@example.com', password: 'password123' },
  { id: 'user-002', name: 'Demo Parent', email: 'demo@gameguardian.com', password: 'demo1234' },
];

const AuthService = {
  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const userData: User = { id: user.id, name: user.name, email: user.email };
    await AsyncStorage.setItem(AUTH_KEYS.USER, JSON.stringify(userData));
    await AsyncStorage.setItem(AUTH_KEYS.TOKEN, 'mock-jwt-token-' + user.id);
    return userData;
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const exists = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (exists) {
      throw new Error('An account with this email already exists');
    }
    const newUser: User = { id: 'user-' + Date.now(), name, email };
    await AsyncStorage.setItem(AUTH_KEYS.USER, JSON.stringify(newUser));
    await AsyncStorage.setItem(AUTH_KEYS.TOKEN, 'mock-jwt-token-' + newUser.id);
    return newUser;
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const data = await AsyncStorage.getItem(AUTH_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.multiRemove([AUTH_KEYS.USER, AUTH_KEYS.TOKEN]);
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem(AUTH_KEYS.TOKEN);
      return token !== null;
    } catch {
      return false;
    }
  },
};

export default AuthService;