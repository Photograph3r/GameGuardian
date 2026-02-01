// MAIN APP FILE - WITH SPLASH SCREEN

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Text} from 'react-native';

// ===== IMPORT ALL SCREENS =====
import SplashScreen from './src/screens/SplashScreen';  // NEW!
import DashboardScreen from './src/screens/DashboardScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import AlertDetailScreen from './src/screens/AlertDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard Stack (unchanged)
function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="Activity" component={ActivityScreen} />
      <Stack.Screen name="Alerts" component={AlertsScreen} />
      <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
      <Stack.Screen name="Profile" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

// Main Tabs (unchanged)
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
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 24}}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ActivityTab"
        component={ActivityScreen}
        options={{
          tabBarLabel: 'Activity',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 24}}>📊</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 24}}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ============================================
// ROOT NAVIGATOR - WITH SPLASH SCREEN
// Splash shows first, then navigates to main app
// ============================================
function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* Splash screen shows first */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      
      {/* Main app with tabs */}
      <Stack.Screen name="MainApp" component={MainTabs} />
    </Stack.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}