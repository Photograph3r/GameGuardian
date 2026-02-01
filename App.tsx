
// MAIN APP FILE
// This is the entry point of the application
// Sets up navigation between all screens

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

// ===== IMPORT ALL SCREENS =====
import DashboardScreen from './src/screens/DashboardScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import AlertDetailScreen from './src/screens/AlertDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Create navigators
// Tab = Bottom tabs you see at the bottom of the screen
// Stack = Screens that stack on top of each other (with back button)
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ============================================
// DASHBOARD STACK
// This allows Dashboard to navigate to other screens
// while keeping the tab bar visible
// ============================================
function DashboardStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false  // Hide the default header bar
            }}>
            {/* Main dashboard screen */}
            <Stack.Screen
                name="DashboardHome"
                component={DashboardScreen}
            />

            {/* Activity screen (accessed from dashboard) */}
            <Stack.Screen
                name="Activity"
                component={ActivityScreen}
            />

            {/* Alerts list screen */}
            <Stack.Screen
                name="Alerts"
                component={AlertsScreen}
            />

            {/* Single alert detail screen */}
            <Stack.Screen
                name="AlertDetail"
                component={AlertDetailScreen}
            />

            {/* Profile/Settings screen */}
            <Stack.Screen
                name="Profile"
                component={SettingsScreen}
            />
        </Stack.Navigator>
    );
}

// ============================================
// MAIN TAB NAVIGATOR
// The 3 tabs at the bottom of the screen
// ============================================
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,  // Hide header
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',  // White background
                    borderTopColor: '#E5E7EB',   // Light gray border
                    borderTopWidth: 1,
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarActiveTintColor: '#4F46E5',    // Purple when selected
                tabBarInactiveTintColor: '#9CA3AF',  // Gray when not selected
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}>

            {/* ===== TAB 1: DASHBOARD ===== */}
            <Tab.Screen
                name="Dashboard"
                component={DashboardStack}  // Uses the stack we created above
                options={{
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 24 }}>🏠</Text>
                    ),
                }}
            />

            {/* ===== TAB 2: ACTIVITY ===== */}
            <Tab.Screen
                name="ActivityTab"
                component={ActivityScreen}
                options={{
                    tabBarLabel: 'Activity',  // Display name
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 24 }}>📊</Text>
                    ),
                }}
            />

            {/* ===== TAB 3: SETTINGS ===== */}
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 24 }}>⚙️</Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

// ============================================
// MAIN APP COMPONENT
// This is what gets rendered when the app starts
// NavigationContainer wraps everything to enable navigation
// ============================================
export default function App() {
    return (
        <NavigationContainer>
            <MainTabs />
        </NavigationContainer>
    );
}