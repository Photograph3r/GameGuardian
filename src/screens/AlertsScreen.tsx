import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import ApiService from '../services/ApiService';
import StorageService from '../services/StorageService';
import { LoadingState, ErrorState, EmptyState } from '../components/SharedStates';
import { Alert } from '../types';
import { useTheme } from '../context/ThemeContext';
import CustomAlert from '../components/CustomAlert';

type FilterType = 'all' | 'high' | 'medium' | 'low';
type SortType = 'newest' | 'oldest';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

// Swipeable alert card component
function SwipeableAlertCard({ alert, onPress, onResolve, colors }: any) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [swiped, setSwiped] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 10 && Math.abs(gesture.dy) < 20,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < 0) {
          translateX.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            setSwiped(true);
            onResolve(alert.id);
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (swiped) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return { bg: '#FEE2E2', text: '#991B1B' };
      case 'medium': return { bg: '#FED7AA', text: '#9A3412' };
      case 'low': return { bg: '#FEF3C7', text: '#854D0E' };
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'late-night-gaming': return '⏰';
      case 'rapid-friends': return '👥';
      case 'risky-group': return '🛡️';
      case 'out-of-age-gaming': return '⚠️';
      case 'excessive-playtime': return '⏳';
      case 'inappropriate-chat': return '💬';
      case 'purchase-attempt': return '💳';
      case 'new-game-flagged': return '🎮';
      default: return '⚠️';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const sColors = getSeverityColor(alert.severity);

  return (
    <View style={styles.swipeContainer}>
      {/* Resolve background revealed on swipe */}
      <View style={styles.resolveBackground}>
        <Text style={styles.resolveBackgroundIcon}>✓</Text>
        <Text style={styles.resolveBackgroundText}>Resolve</Text>
      </View>

      <Animated.View
        style={[styles.animatedCard, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}>
        <TouchableOpacity
          style={[
            styles.alertCard,
            { backgroundColor: colors.cardBg, borderColor: alert.isRead ? colors.cardBorder : '#93C5FD' },
            !alert.isRead && styles.alertCardUnread,
          ]}
          onPress={() => onPress(alert)}
          activeOpacity={0.9}>
          <View style={[styles.iconContainer, { backgroundColor: sColors.bg }]}>
            <Text style={styles.alertIcon}>{getAlertIcon(alert.type)}</Text>
          </View>

          <View style={styles.alertContent}>
            <View style={styles.alertHeader}>
              <Text style={[styles.alertTitle, { color: colors.text }]} numberOfLines={1}>
                {alert.title}
              </Text>
              {!alert.isRead && <View style={styles.unreadDot} />}
            </View>
            <Text style={[styles.alertMessage, { color: colors.textSecondary }]} numberOfLines={2}>
              {alert.message}
            </Text>
            <View style={styles.alertFooter}>
              <View style={[styles.severityBadge, { backgroundColor: sColors.bg }]}>
                <Text style={[styles.severityText, { color: sColors.text }]}>
                  {alert.severity.toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                {formatTimestamp(alert.timestamp)}
              </Text>
            </View>
          </View>

          {/* Swipe hint */}
          <Text style={[styles.swipeHint, { color: colors.textMuted }]}>←</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function AlertsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [alertVisible, setAlertVisible] = useState(false);
  const [pendingResolveId, setPendingResolveId] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);
      const data = await ApiService.getAlerts();
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

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAlerts();
  }, [fetchAlerts]);

  const handleAlertPress = async (alert: Alert) => {
    if (!alert.isRead) {
      await StorageService.markAlertRead(alert.id);
      await ApiService.markAlertRead(alert.id);
      setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, isRead: true } : a));
    }
    navigation.navigate('AlertDetail', { alert });
  };

  const handleSwipeResolve = (alertId: string) => {
    setPendingResolveId(alertId);
    setAlertVisible(true);
  };

  const confirmResolve = async () => {
    if (pendingResolveId) {
      await ApiService.resolveAlert(pendingResolveId);
      await StorageService.markAlertRead(pendingResolveId);
      setAlerts(prev => prev.filter(a => a.id !== pendingResolveId));
    }
    setPendingResolveId(null);
    setAlertVisible(false);
  };

  const cancelResolve = () => {
    setPendingResolveId(null);
    setAlertVisible(false);
    fetchAlerts();
  };

  if (loading) return <LoadingState message="Loading alerts..." />;
  if (error) return <ErrorState message={error} onRetry={fetchAlerts} />;

  let filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);
  filteredAlerts = [...filteredAlerts].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sort === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomAlert
        visible={alertVisible}
        title="Resolve Alert"
        message="Mark this alert as resolved?"
        icon="✅"
        buttons={[
          { text: 'Cancel', style: 'cancel', onPress: cancelResolve },
          { text: 'Resolve', style: 'default', onPress: confirmResolve },
        ]}
        onDismiss={cancelResolve}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.surfaceBorder }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.text }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Alerts</Text>
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount} New</Text>
          </View>
        ) : <View style={{ width: 60 }} />}
      </View>

      {/* Swipe hint banner */}
      <View style={[styles.swipeHintBanner, { backgroundColor: colors.primaryLight }]}>
        <Text style={[styles.swipeHintBannerText, { color: colors.primary }]}>
          ← Swipe left on an alert to resolve it quickly
        </Text>
      </View>

      {/* Filters */}
      <View style={[styles.filterRow, { backgroundColor: colors.surface, borderBottomColor: colors.surfaceBorder }]}>
        {(['all', 'high', 'medium', 'low'] as FilterType[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, { backgroundColor: filter === f ? colors.primary : colors.background }]}
            onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, { color: filter === f ? '#FFFFFF' : colors.textSecondary }]}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.sortButton, { backgroundColor: colors.background, borderColor: colors.surfaceBorder }]}
          onPress={() => setSort(sort === 'newest' ? 'oldest' : 'newest')}>
          <Text style={[styles.sortText, { color: colors.textSecondary }]}>
            {sort === 'newest' ? '↓ New' : '↑ Old'}
          </Text>
        </TouchableOpacity>
      </View>

      {filteredAlerts.length === 0 ? (
        <EmptyState icon="🔍" title="No Alerts Found" message={`No ${filter} severity alerts`} />
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {filteredAlerts.map(alert => (
            <SwipeableAlertCard
              key={alert.id}
              alert={alert}
              onPress={handleAlertPress}
              onResolve={handleSwipeResolve}
              colors={colors}
            />
          ))}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 3,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  backText: { fontSize: 32 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '600' },
  badge: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#991B1B', fontSize: 12, fontWeight: '600' },
  swipeHintBanner: {
    paddingHorizontal: 20, paddingVertical: 8,
  },
  swipeHintBannerText: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
  filterRow: {
    flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12,
    gap: 8, alignItems: 'center', borderBottomWidth: 1,
  },
  filterButton: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  filterText: { fontSize: 13, fontWeight: '500' },
  sortButton: { marginLeft: 'auto', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  sortText: { fontSize: 13, fontWeight: '500' },
  content: { flex: 1, padding: 20 },
  swipeContainer: { marginBottom: 12, borderRadius: 15, overflow: 'hidden' },
  resolveBackground: {
    position: 'absolute', right: 0, top: 0, bottom: 0,
    width: '40%', backgroundColor: '#10B981',
    justifyContent: 'center', alignItems: 'center', borderRadius: 15,
    flexDirection: 'row', gap: 8,
  },
  resolveBackgroundIcon: { fontSize: 24, color: '#FFFFFF' },
  resolveBackgroundText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  animatedCard: { width: '100%' },
  alertCard: {
    borderRadius: 15, padding: 15, flexDirection: 'row', borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  alertCardUnread: { borderWidth: 2, shadowColor: '#3B82F6', shadowOpacity: 0.15 },
  iconContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  alertIcon: { fontSize: 24 },
  alertContent: { flex: 1 },
  alertHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  alertTitle: { flex: 1, fontSize: 16, fontWeight: '600' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginLeft: 8 },
  alertMessage: { fontSize: 14, marginBottom: 10, lineHeight: 20 },
  alertFooter: { flexDirection: 'row', alignItems: 'center' },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginRight: 8 },
  severityText: { fontSize: 10, fontWeight: '600' },
  timestamp: { fontSize: 12 },
  swipeHint: { fontSize: 18, marginLeft: 8, alignSelf: 'center' },
});