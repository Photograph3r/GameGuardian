import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import ApiService from '../services/ApiService';
import StorageService from '../services/StorageService';
import { LoadingState, ErrorState } from '../components/SharedStates';
import { Child, ActivitySummary, Alert } from '../types';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
  const [child, setChild] = useState<Child | null>(null);
  const [summary, setSummary] = useState<ActivitySummary | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [children, activitySummary, alertsData] = await Promise.all([
        ApiService.getChildren(),
        ApiService.getActivitySummary(),
        ApiService.getAlerts(),
      ]);
      const readIds = await StorageService.getReadAlertIds();
      const alertsWithReadState = alertsData.map(a => ({
        ...a,
        isRead: a.isRead || readIds.includes(a.id),
      }));
      setChild(children[0] || null);
      setSummary(activitySummary);
      setAlerts(alertsWithReadState);
      await StorageService.updateLastSync();
      const syncTime = await StorageService.getLastSyncTime();
      setLastSync(syncTime);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  const unreadAlerts = alerts.filter(a => !a.isRead);
  const highSeverityAlerts = unreadAlerts.filter(a => a.severity === 'high');

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#FFFFFF"
          colors={['#4F46E5']}
        />
      }>
      {/* ===== HEADER SECTION ===== */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>🛡️ {getGreeting()}</Text>
          <Text style={styles.headerGreeting}>Game Guardian</Text>
        </View>

        {child && (
          <View style={styles.childCard}>
            <Text style={styles.childLabel}>Monitoring</Text>
            <View style={styles.childInfo}>
              <View style={[styles.avatar, { backgroundColor: '#8B5CF6' }]}>
                <Text style={styles.avatarText}>{child.name.charAt(0)}</Text>
              </View>
              <View style={styles.childDetails}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childUsername}>
                  @{child.robloxUsername}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.profileButtonText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* ===== ALERT BANNER ===== */}
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
            <Text style={styles.alertSubtitle}>
              {highSeverityAlerts[0].title}
            </Text>
          </View>
          <Text style={styles.alertArrow}>›</Text>
        </TouchableOpacity>
      )}

      {/* ===== STATS CARDS ===== */}
      {summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statLabel}>Playtime</Text>
              <Text style={styles.statValue}>
                {Math.floor(summary.totalPlaytime / 60)}h{' '}
                {summary.totalPlaytime % 60}m
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>👥</Text>
              <Text style={styles.statLabel}>New Friends</Text>
              <Text style={styles.statValue}>{summary.newFriends}</Text>
            </View>
          </View>
        </View>
      )}

      {/* ===== ACTIVITY CHART ===== */}
      {summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Activity</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartBars}>
              {summary.chartData.map((day, index) => {
                const maxMinutes = Math.max(
                  ...summary.chartData.map(d => d.minutes),
                );
                const height = (day.minutes / maxMinutes) * 100 || 5;
                return (
                  <View key={index} style={styles.barContainer}>
                    <Text style={styles.barValue}>
                      {day.minutes > 0 ? `${day.minutes}` : ''}
                    </Text>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: height,
                          backgroundColor:
                            day.minutes > 0 ? '#3B82F6' : '#E5E7EB',
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
      )}

      {/* ===== QUICK ACCESS ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Activity')}>
          <Text style={styles.actionIcon}>🎮</Text>
          <Text style={styles.actionText}>View Recent Games</Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Alerts')}>
          <Text style={styles.actionIcon}>⚠️</Text>
          <Text style={styles.actionText}>All Alerts</Text>
          {unreadAlerts.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadAlerts.length}</Text>
            </View>
          )}
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.actionIcon}>👤</Text>
          <Text style={styles.actionText}>Parental Controls</Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('AddChild')}>
          <Text style={styles.actionIcon}>➕</Text>
          <Text style={styles.actionText}>Add Child</Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* ===== SYNC INDICATOR ===== */}
      {lastSync && (
        <Text style={styles.syncText}>
          Last synced: {new Date(lastSync).toLocaleTimeString()}
        </Text>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#4F46E5', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTop: { marginBottom: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  headerGreeting: { fontSize: 14, color: '#C7D2FE' },
  childCard: { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 15, padding: 15 },
  childLabel: { color: '#C7D2FE', fontSize: 12, marginBottom: 8 },
  childInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  childDetails: { flex: 1 },
  childName: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  childUsername: { color: '#C7D2FE', fontSize: 14 },
  profileButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  profileButtonText: { color: '#FFFFFF', fontSize: 24 },
  alertBanner: {
    backgroundColor: '#EF4444', marginHorizontal: 20, marginTop: -15, marginBottom: 15,
    borderRadius: 15, padding: 15, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8,
  },
  alertIcon: { fontSize: 24, marginRight: 12 },
  alertContent: { flex: 1 },
  alertTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  alertSubtitle: { color: '#FEE2E2', fontSize: 14 },
  alertArrow: { color: '#FFFFFF', fontSize: 24 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 15, padding: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statLabel: { color: '#6B7280', fontSize: 14, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  chartCard: {
    backgroundColor: '#FFFFFF', borderRadius: 15, padding: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  chartBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140, marginBottom: 10 },
  barContainer: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barValue: { fontSize: 10, color: '#3B82F6', fontWeight: '600', marginBottom: 4 },
  bar: { width: 20, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  barLabel: { fontSize: 10, color: '#6B7280', marginTop: 4 },
  chartSubtext: { textAlign: 'center', fontSize: 12, color: '#6B7280' },
  actionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  actionIcon: { fontSize: 32, marginRight: 12 },
  actionText: { flex: 1, fontSize: 16, fontWeight: '500', color: '#1F2937' },
  badge: { backgroundColor: '#EF4444', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  actionArrow: { color: '#9CA3AF', fontSize: 24 },
  syncText: { textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginBottom: 10 },
});