import React, { useState, useEffect, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import AuthService from './src/services/AuthService';
import StorageService from './src/services/StorageService';
import ApiService from './src/services/ApiService';
import { ThemeProvider } from './src/context/ThemeContext';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SplashScreen from './src/screens/SplashScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import AlertDetailScreen from './src/screens/AlertDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddChildScreen from './src/screens/AddChildScreen';
import ScreenTimeLimitsScreen from './src/screens/ScreenTimeLimitsScreen';
import GameBlocklistScreen from './src/screens/GameBlocklistScreen';
import QuietHoursScreen from './src/screens/QuietHoursScreen';
import AnalyticsDashboardScreen from './src/screens/AnalyticsDashboardScreen';
import GroupDetailScreen from './src/screens/GroupDetailScreen';
import ChildSetupScreen from './src/screens/ChildSetupScreen';
import ChildrenScreen from './src/screens/ChildrenScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export const AuthContext = createContext<{ logout: () => void }>({ logout: () => {} });

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="Alerts" component={AlertsScreen} />
      <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
      <Stack.Screen name="Profile" component={SettingsScreen} />
      <Stack.Screen name="AddChild" component={AddChildScreen} />
      <Stack.Screen name="Children" component={ChildrenScreen} />
      <Stack.Screen name="ScreenTimeLimits" component={ScreenTimeLimitsScreen} />
      <Stack.Screen name="GameBlocklist" component={GameBlocklistScreen} />
      <Stack.Screen name="QuietHours" component={QuietHoursScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsDashboardScreen} />
    </Stack.Navigator>
  );
}

function ActivityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ActivityHome" component={ActivityScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />
      <Stack.Screen name="ScreenTimeLimits" component={ScreenTimeLimitsScreen} />
      <Stack.Screen name="GameBlocklist" component={GameBlocklistScreen} />
      <Stack.Screen name="QuietHours" component={QuietHoursScreen} />
      <Stack.Screen name="AddChild" component={AddChildScreen} />
      <Stack.Screen name="Children" component={ChildrenScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="ActivityTab"
        component={ActivityStack}
        options={{
          tabBarLabel: 'Activity',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 24 }}>⚙️</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [appState, setAppState] = useState<'loading' | 'onboarding' | 'login' | 'setup' | 'app'>('loading');

  const checkState = async () => {
    const onboarded = await StorageService.hasCompletedOnboarding();
    if (!onboarded) {
      setAppState('onboarding');
      return;
    }
    const authenticated = await AuthService.isAuthenticated();
    if (!authenticated) {
      setAppState('login');
      return;
    }
    const hasChild = await StorageService.hasChildProfile();
    if (!hasChild) {
      setAppState('setup');
      return;
    }
    setAppState('app');
  };

  useEffect(() => {
    checkState();
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    ApiService.clearCache();
    setAppState('login');
  };

  const handleOnboardingComplete = () => {
    setAppState('login');
  };

  const handleLogin = async () => {
    const hasChild = await StorageService.hasChildProfile();
    if (!hasChild) {
      setAppState('setup');
    } else {
      setAppState('app');
    }
  };

  const handleSetupComplete = () => {
    setAppState('app');
  };

  if (appState === 'loading') return null;

  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ logout: handleLogout }}>
        <NavigationContainer key={appState}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>

            {appState === 'onboarding' && (
              <Stack.Screen name="Onboarding">
                {(props) => (
                  <OnboardingScreen
                    {...props}
                    navigation={{
                      ...props.navigation,
                      replace: () => handleOnboardingComplete(),
                    }}
                  />
                )}
              </Stack.Screen>
            )}

            {appState === 'login' && (
              <>
                <Stack.Screen name="Login">
                  {(props) => <LoginScreen {...props} onLoginSuccess={handleLogin} />}
                </Stack.Screen>
                <Stack.Screen name="Signup">
                  {(props) => <SignupScreen {...props} onSignupSuccess={handleLogin} />}
                </Stack.Screen>
              </>
            )}

            {appState === 'setup' && (
              <Stack.Screen name="ChildSetup">
                {() => <ChildSetupScreen onSetupComplete={handleSetupComplete} />}
              </Stack.Screen>
            )}

            {appState === 'app' && (
              <>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen
                  name="MainApp"
                  component={MainTabs}
                  options={{ gestureEnabled: false }}
                />
              </>
            )}

          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}