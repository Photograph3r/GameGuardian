
// DASHBOARD SCREEN
// The main home screen showing activity overview
// This is what parents see first when they open the app

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
// Import our mock data
import {mockChildren, mockActivitySummary, mockAlerts} from '../data/mockData';

// Get screen width for responsive design
const {width} = Dimensions.get('window');

// Main component - receives navigation prop from React Navigation
export default function DashboardScreen({navigation}: any) {
  // Get data - in real app, this would come from API
  const child = mockChildren[0];  // First child being monitored
  const summary = mockActivitySummary;  // Weekly stats
  const unreadAlerts = mockAlerts.filter(a => !a.isRead);  // Alerts not seen yet
  const highSeverityAlerts = unreadAlerts.filter(a => a.severity === 'high');  // Urgent alerts

  return (
    <ScrollView style={styles.container}>
      {/* ===== HEADER SECTION ===== */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>🛡️ Game Guardian</Text>
        </View>

        {/* Child Information Card */}
        <View style={styles.childCard}>
          <Text style={styles.childLabel}>Monitoring</Text>
          <View style={styles.childInfo}>
            {/* Avatar circle with first letter of name */}
            <View style={[styles.avatar, {backgroundColor: '#8B5CF6'}]}>
              <Text style={styles.avatarText}>{child.name.charAt(0)}</Text>
            </View>
            
            {/* Child's name and username */}
            <View style={styles.childDetails}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childUsername}>@{child.robloxUsername}</Text>
            </View>
            
            {/* Button to view full profile */}
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.profileButtonText}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ===== ALERT BANNER (only shows if there are high priority alerts) ===== */}
      {highSeverityAlerts.length > 0 && (
        <TouchableOpacity
          style={styles.alertBanner}
          onPress={() => navigation.navigate('Alerts')}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>
              {highSeverityAlerts.length} High Priority Alert
              {highSeverityAlerts.length > 1 ? 's' : ''}
            </Text>
            <Text style={styles.alertSubtitle}>{highSeverityAlerts[0].title}</Text>
          </View>
          <Text style={styles.alertArrow}>›</Text>
        </TouchableOpacity>
      )}

      {/* ===== STATS CARDS ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.statsRow}>
          {/* Playtime Card */}
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statLabel}>Playtime</Text>
            <Text style={styles.statValue}>
              {Math.floor(summary.totalPlaytime / 60)}h {summary.totalPlaytime % 60}m
            </Text>
          </View>
          
          {/* New Friends Card */}
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statLabel}>New Friends</Text>
            <Text style={styles.statValue}>{summary.newFriends}</Text>
          </View>
        </View>
      </View>

      {/* ===== ACTIVITY CHART ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Activity</Text>
        <View style={styles.chartCard}>
          {/* Simple bar chart showing minutes per day */}
          <View style={styles.chartBars}>
            {summary.chartData.map((day, index) => {
              // Calculate bar height based on max value
              const maxMinutes = Math.max(...summary.chartData.map(d => d.minutes));
              const height = (day.minutes / maxMinutes) * 100 || 5;  // Min 5px height
              
              return (
                <View key={index} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: height,
                        backgroundColor: day.minutes > 0 ? '#3B82F6' : '#E5E7EB',
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{day.day}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.chartSubtext}>Minutes played per day</Text>
        </View>
      </View>

      {/* ===== QUICK ACTION BUTTONS ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        
        {/* View Games Button */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Activity')}>
          <Text style={styles.actionIcon}>🎮</Text>
          <Text style={styles.actionText}>View Recent Games</Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        {/* View Alerts Button */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Alerts')}>
          <Text style={styles.actionIcon}>⚠️</Text>
          <Text style={styles.actionText}>All Alerts</Text>
          {/* Badge showing unread alert count */}
          {unreadAlerts.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadAlerts.length}</Text>
            </View>
          )}
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom spacing */}
      <View style={{height: 30}} />
    </ScrollView>
  );
}

// ============================================
// STYLES
// All visual styling for this screen
// React Native uses JavaScript objects for styles
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  childCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 15,
  },
  childLabel: {
    color: '#C7D2FE',
    fontSize: 12,
    marginBottom: 8,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  childDetails: {
    flex: 1,
  },
  childName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  childUsername: {
    color: '#C7D2FE',
    fontSize: 14,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  alertBanner: {
    backgroundColor: '#EF4444',
    marginHorizontal: 20,
    marginTop: -15,
    marginBottom: 15,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  alertSubtitle: {
    color: '#FEE2E2',
    fontSize: 14,
  },
  alertArrow: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 10,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  barLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  chartSubtext: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6B7280',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionArrow: {
    color: '#9CA3AF',
    fontSize: 24,
  },
});