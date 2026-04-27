import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'high-contrast';

interface ThemeColors {
  background: string;
  surface: string;
  surfaceBorder: string;
  primary: string;
  primaryLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  headerBg: string;
  headerText: string;
  headerSubtext: string;
  cardBg: string;
  cardBorder: string;
  tabBarBg: string;
  tabBarBorder: string;
  inputBg: string;
  inputBorder: string;
}

const LIGHT: ThemeColors = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceBorder: '#E5E7EB',
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  headerBg: '#4F46E5',
  headerText: '#FFFFFF',
  headerSubtext: '#C7D2FE',
  cardBg: '#FFFFFF',
  cardBorder: '#E5E7EB',
  tabBarBg: '#FFFFFF',
  tabBarBorder: '#E5E7EB',
  inputBg: '#F9FAFB',
  inputBorder: '#E5E7EB',
};

const DARK: ThemeColors = {
  background: '#111827',
  surface: '#1F2937',
  surfaceBorder: '#374151',
  primary: '#6366F1',
  primaryLight: '#1E1B4B',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  headerBg: '#1E1B4B',
  headerText: '#FFFFFF',
  headerSubtext: '#A5B4FC',
  cardBg: '#1F2937',
  cardBorder: '#374151',
  tabBarBg: '#1F2937',
  tabBarBorder: '#374151',
  inputBg: '#374151',
  inputBorder: '#4B5563',
};

const HIGH_CONTRAST: ThemeColors = {
  background: '#000000',
  surface: '#1A1A1A',
  surfaceBorder: '#FFFFFF',
  primary: '#FFFF00',
  primaryLight: '#333300',
  text: '#FFFFFF',
  textSecondary: '#FFFFFF',
  textMuted: '#CCCCCC',
  headerBg: '#000000',
  headerText: '#FFFF00',
  headerSubtext: '#FFFFFF',
  cardBg: '#1A1A1A',
  cardBorder: '#FFFFFF',
  tabBarBg: '#000000',
  tabBarBorder: '#FFFFFF',
  inputBg: '#1A1A1A',
  inputBorder: '#FFFFFF',
};

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  colors: LIGHT,
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem('@gameguardian_theme');
      if (saved) setModeState(saved as ThemeMode);
    } catch {}
  };

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await AsyncStorage.setItem('@gameguardian_theme', newMode);
  };

  const colors = mode === 'dark' ? DARK : mode === 'high-contrast' ? HIGH_CONTRAST : LIGHT;

  return (
    <ThemeContext.Provider value={{ mode, colors, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;