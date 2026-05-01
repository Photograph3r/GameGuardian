import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import ApiService from '../services/ApiService';
import StorageService from '../services/StorageService';
import { LoadingState, ErrorState } from '../components/SharedStates';
import { ActivitySummary, Alert } from '../types';
import { useTheme } from '../context/ThemeContext';

export default function DashboardScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [child, setChild] = useState<any | null>(null);
  const [childProfiles, setChildProfiles] = useState<any[]>([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [summary, setSummary] = useState<ActivitySummary | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [activitySummary, alertsData, savedProfiles] = await Promise.all([
        ApiService.getActivitySummary(),
        ApiService.getAlerts(),
        StorageService.getChildProfiles(),
      ]);

      const readIds = await StorageService.getReadAlertIds();
      const alertsWithReadState = alertsData.map(a => ({
        ...a,
        isRead: a.isRead || readIds.includes(a.id),
      }));

      if (savedProfiles.length > 0) {
        setChildProfiles(savedProfiles);
        const activeId = await StorageService.getSelectedChildId();
        const activeChild = savedProfiles.find((p: any) => p.id === activeId) || savedProfiles[0];
        const activeIndex = savedProfiles.indexOf(activeChild);
        setSelectedChildIndex(activeIndex >= 0 ? activeIndex : 0);
        setChild(activeChild);
      } else {
        const mockChildren = await ApiService.getChildren();
        setChildProfiles(mockChildren);
        setChild(mockChildren[0] || null);
      }

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
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [fetchData, navigation]);

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

  const switchChild = async (index: number) => {
    setSelectedChildIndex(index);
    setChild(childProfiles[index]);
    await StorageService.setSelectedChildId(childProfiles[index].id);
  };

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const unreadAlerts = alerts.filter(a => !a.isRead);
  const highSeverityAlerts = unreadAlerts.filter(a => a.severity === 'high');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
      }>

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: colors.headerText }]}>🛡️ {getGreeting()}</Text>
          <Text style={[styles.headerGreeting, { color: colors.headerSubtext }]}>Game Guardian</Text>
        </View>

        {child && (
          <View style={styles.childCard}>
            <View style={styles.childCardTop}>
              <Text style={[styles.childLabel, { color: colors.headerSubtext }]}>
                Monitoring {childProfiles.length > 1 ? `· ${childProfiles.length} profiles` : ''}
              </Text>
              {childProfiles.length > 1 && (
                <View style={styles.childSwitcher}>
                  {childProfiles.map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.childSwitcherDot,
                        { backgroundColor: i === selectedChildIndex ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }
                      ]}
                      onPress={() => switchChild(i)}
                    />
                  ))}
                </View>
              )}
            </View>
            <View style={styles.childInfo}>
              <View style={[styles.avatar, { backgroundColor: child.avatarColor || '#8B5CF6' }]}>
                <Text style={styles.avatarText}>{child.name.charAt(0)}</Text>
              </View>
              <View style={styles.childDetails}>
                <Text style={[styles.childName, { color: colors.headerText }]}>{child.name}</Text>
                <Text style={[styles.childUsername, { color: colors.headerSubtext }]}>
                  @{child.robloxUsername} · Age {child.age}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Children')}>
                <Text style={[styles.profileButtonText, { color: colors.headerText }]}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* ALERT BANNER */}
      {highSeverityAlerts.length > 0 && (
        <TouchableOpacity style={styles.alertBanner} onPress={() => navigation.navigate('Alerts')}>
          <Text style={styles.alertBannerIcon}>⚠️</Text>
          <View style={styles.alertBannerContent}>
            <Text style={styles.alertBannerTitle}>
              {highSeverityAlerts.length} High Priority Alert{highSeverityAlerts.length > 1 ? 's' : ''}
            </Text>
            <Text style={styles.alertBannerSubtitle}>{highSeverityAlerts[0].title}</Text>
          </View>
          <Text style={styles.alertBannerArrow}>›</Text>
        </TouchableOpacity>
      )}

      {/* STATS */}
      {summary && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>This Week</Text>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Playtime</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {Math.floor(summary.totalPlaytime / 60)}h {summary.totalPlaytime % 60}m
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={styles.statIcon}>👥</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>New Friends</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{summary.newFriends}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={styles.statIcon}>⚠️</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Alerts</Text>
              <Text style={[styles.statValue, { color: unreadAlerts.length > 0 ? '#EF4444' : colors.text }]}>
                {unreadAlerts.length}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* CHART */}
      {summary && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Activity</Text>
          <View style={[styles.chartCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={styles.chartBars}>
              {summary.chartData.map((day, index) => {
                const maxMinutes = Math.max(...summary.chartData.map(d => d.minutes));
                const height = (day.minutes / maxMinutes) * 100 || 5;
                return (
                  <View key={index} style={styles.barContainer}>
                    <Text style={[styles.barValue, { color: colors.primary }]}>
                      {day.minutes > 0 ? `${day.minutes}` : ''}
                    </Text>
                    <View style={[styles.bar, { height, backgroundColor: day.minutes > 0 ? colors.primary : colors.surfaceBorder }]} />
                    <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{day.day}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={[styles.chartSubtext, { color: colors.textMuted }]}>Minutes played per day</Text>
          </View>
        </View>
      )}

      {/* QUICK ACCESS */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Access</Text>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
          onPress={() => navigation.navigate('Alerts')}>
          <Text style={styles.actionIcon}>⚠️</Text>
          <Text style={[styles.actionText, { color: colors.text }]}>All Alerts</Text>
          {unreadAlerts.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadAlerts.length}</Text>
            </View>
          )}
          <Text style={[styles.actionArrow, { color: colors.textMuted }]}>›</Text>
        </TouchableOpacity>

        {[
          { icon: '🎮', label: 'Recent Games', route: 'ActivityTab' },
          { icon: '📊', label: 'Analytics & Patterns', route: 'Analytics' },
          { icon: '👶', label: 'Manage Children', route: 'Children' },
          { icon: '➕', label: 'Add Child', route: 'AddChild' },
          { icon: '👤', label: 'Parental Controls', route: 'Profile' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.actionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
            onPress={() => navigation.navigate(item.route)}>
            <Text style={styles.actionIcon}>{item.icon}</Text>
            <Text style={[styles.actionText, { color: colors.text }]}>{item.label}</Text>
            <Text style={[styles.actionArrow, { color: colors.textMuted }]}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {lastSync && (
        <Text style={[styles.syncText, { color: colors.textMuted }]}>
          Last synced: {new Date(lastSync).toLocaleTimeString()}
        </Text>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTop: { marginBottom: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerGreeting: { fontSize: 14 },
  childCard: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 15, padding: 15 },
  childCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  childLabel: { fontSize: 12 },
  childSwitcher: { flexDirection: 'row', gap: 6 },
  childSwitcherDot: { width: 8, height: 8, borderRadius: 4 },
  childInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  childDetails: { flex: 1 },
  childName: { fontSize: 18, fontWeight: '600' },
  childUsername: { fontSize: 13 },
  profileButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  profileButtonText: { fontSize: 28 },
  alertBanner: {
    backgroundColor: '#EF4444', marginHorizontal: 20, marginTop: -15, marginBottom: 15,
    borderRadius: 15, padding: 15, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8,
  },
  alertBannerIcon: { fontSize: 24, marginRight: 12 },
  alertBannerContent: { flex: 1 },
  alertBannerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  alertBannerSubtitle: { color: '#FEE2E2', fontSize: 14 },
  alertBannerArrow: { color: '#FFFFFF', fontSize: 24 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, borderRadius: 15, padding: 12, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  statIcon: { fontSize: 20, marginBottom: 6 },
  statLabel: { fontSize: 11, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  chartCard: {
    borderRadius: 15, padding: 15, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  chartBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, marginBottom: 10 },
  barContainer: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barValue: { fontSize: 9, fontWeight: '600', marginBottom: 3 },
  bar: { width: 18, borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  barLabel: { fontSize: 9, marginTop: 4 },
  chartSubtext: { textAlign: 'center', fontSize: 12 },
  actionCard: {
    borderRadius: 12, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  actionIcon: { fontSize: 28, marginRight: 12 },
  actionText: { flex: 1, fontSize: 16, fontWeight: '500' },
  badge: { backgroundColor: '#EF4444', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  actionArrow: { fontSize: 24 },
  syncText: { textAlign: 'center', fontSize: 12, marginBottom: 10 },
});