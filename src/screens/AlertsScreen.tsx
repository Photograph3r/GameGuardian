// ALERTS SCREEN
// Shows all safety alerts in a list
// Uses API service layer + persists read state

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
import { LoadingState, ErrorState, EmptyState } from '../components/SharedStates';
import { Alert } from '../types';

export default function AlertsScreen({ navigation }: any) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // ===== DATA FETCHING =====
  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);
      const data = await ApiService.getAlerts();

      // Merge persisted read state from AsyncStorage
      const readIds = await StorageService.getReadAlertIds();
      const alertsWithState = data.map(a => ({
        ...a,
        isRead: a.isRead || readIds.includes(a.id),
      }));

      setAlerts(alertsWithState);
    } catch (err: any) {
      setError(err.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAlerts();
  }, [fetchAlerts]);

  // ===== MARK ALERT AS READ =====
  // Persists to AsyncStorage so it survives app restart
  const handleAlertPress = async (alert: Alert) => {
    if (!alert.isRead) {
      await StorageService.markAlertRead(alert.id);
      await ApiService.markAlertRead(alert.id);
      setAlerts(prev =>
        prev.map(a => (a.id === alert.id ? { ...a, isRead: true } : a)),
      );
    }
    navigation.navigate('AlertDetail', { alert });
  };

  // ===== HELPER FUNCTIONS =====

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' };
      case 'medium':
        return { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' };
      case 'low':
        return { bg: '#FEF3C7', text: '#854D0E', border: '#FDE047' };
      default:
        return { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'late-night-gaming': return '⏰';
      case 'rapid-friends': return '👥';
      case 'risky-group': return '🛡️';
      case 'out-of-age-gaming': return '⚠️';
      default: return '⚠️';
    }
  };

  // ===== RENDER STATES =====
  if (loading) return <LoadingState message="Loading alerts..." />;
  if (error) return <ErrorState message={error} onRetry={fetchAlerts} />;

  const unreadCount = alerts.filter(a => !a.isRead).length;

  if (alerts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Alerts</Text>
          <View style={{ width: 40 }} />
        </View>
        <EmptyState
          icon="🎉"
          title="All Clear!"
          message="No safety alerts at this time"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alerts</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount} New</Text>
          </View>
        )}
        {unreadCount === 0 && <View style={{ width: 40 }} />}
      </View>

      {/* ===== ALERTS LIST ===== */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {alerts.map(alert => {
          const colors = getSeverityColor(alert.severity);
          const icon = getAlertIcon(alert.type);

          return (
            <TouchableOpacity
              key={alert.id}
              style={[
                styles.alertCard,
                !alert.isRead && styles.alertCardUnread,
              ]}
              onPress={() => handleAlertPress(alert)}>
              <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
                <Text style={styles.alertIcon}>{icon}</Text>
              </View>

              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  {!alert.isRead && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.alertMessage} numberOfLines={2}>
                  {alert.message}
                </Text>
                <View style={styles.alertFooter}>
                  <View style={[styles.severityBadge, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.severityText, { color: colors.text }]}>
                      {alert.severity.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.timestamp}>
                    {formatTimestamp(alert.timestamp)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  backText: { fontSize: 32, color: '#374151' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '600', color: '#1F2937' },
  badge: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#991B1B', fontSize: 12, fontWeight: '600' },
  content: { flex: 1, padding: 20 },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  alertCardUnread: { borderColor: '#93C5FD', borderWidth: 2, shadowColor: '#3B82F6', shadowOpacity: 0.15 },
  iconContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  alertIcon: { fontSize: 24 },
  alertContent: { flex: 1 },
  alertHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  alertTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1F2937' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginLeft: 8 },
  alertMessage: { fontSize: 14, color: '#6B7280', marginBottom: 10, lineHeight: 20 },
  alertFooter: { flexDirection: 'row', alignItems: 'center' },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginRight: 8 },
  severityText: { fontSize: 10, fontWeight: '600' },
  timestamp: { fontSize: 12, color: '#9CA3AF' },
});