import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RobloxUser } from '../services/RobloxAuthService';

// --- Roblox Auth Context ---
interface RobloxAuthState {
  isAuthenticated: boolean;
  robloxUser: RobloxUser | null;
  accessToken: string | null;
  login: (user: RobloxUser, token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const RobloxAuthContext = createContext<RobloxAuthState>({
  isAuthenticated: false,
  robloxUser: null,
  accessToken: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

export function RobloxAuthProvider({ children }: { children: React.ReactNode }) {
  const [robloxUser, setRobloxUser] = useState<RobloxUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const token = await AsyncStorage.getItem('@gameguardian_roblox_token');
        const userJson = await AsyncStorage.getItem('@gameguardian_roblox_user');
        if (token && userJson) {
          setAccessToken(token);
          setRobloxUser(JSON.parse(userJson));
        }
      } catch (e) {
        console.error('Failed to restore Roblox session', e);
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (user: RobloxUser, token: string, refreshToken: string) => {
    await AsyncStorage.setItem('@gameguardian_roblox_token', token);
    await AsyncStorage.setItem('@gameguardian_roblox_refresh', refreshToken);
    await AsyncStorage.setItem('@gameguardian_roblox_user', JSON.stringify(user));
    setAccessToken(token);
    setRobloxUser(user);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([
      '@gameguardian_roblox_token',
      '@gameguardian_roblox_refresh',
      '@gameguardian_roblox_user',
    ]);
    setAccessToken(null);
    setRobloxUser(null);
  };

  return (
    <RobloxAuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        robloxUser,
        accessToken,
        login,
        logout,
        isLoading,
      }}>
      {children}
    </RobloxAuthContext.Provider>
  );
}

export function useRobloxAuth() {
  return useContext(RobloxAuthContext);
}

// --- Existing UI Components (unchanged) ---
interface LoadingProps {
  message?: string;
}
export function LoadingState({ message = 'Loading...' }: LoadingProps) {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}
export function ErrorState({
  message = 'Something went wrong',
  onRetry,
}: ErrorProps) {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Oops!</Text>
      <Text style={styles.errorMessage}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface EmptyProps {
  icon?: string;
  title?: string;
  message?: string;
}
export function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  message = 'Check back later for updates',
}: EmptyProps) {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
  },
  loadingText: { marginTop: 15, fontSize: 16, color: '#6B7280' },
  errorIcon: { fontSize: 48, marginBottom: 15 },
  errorTitle: { fontSize: 20, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  errorMessage: {
    fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 20, lineHeight: 22,
  },
  retryButton: { backgroundColor: '#4F46E5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  retryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  emptyIcon: { fontSize: 48, marginBottom: 15 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  emptyMessage: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
});