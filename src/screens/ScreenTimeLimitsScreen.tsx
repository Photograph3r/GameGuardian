import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TIME_OPTIONS = [30, 60, 90, 120, 180, 240];

export default function ScreenTimeLimitsScreen({ navigation }: any) {
  const [enabled, setEnabled] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(120);
  const [weekendLimit, setWeekendLimit] = useState(180);
  const [usedToday, setUsedToday] = useState(85);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem('@gameguardian_screen_time');
      if (data) {
        const parsed = JSON.parse(data);
        setEnabled(parsed.enabled);
        setDailyLimit(parsed.dailyLimit);
        setWeekendLimit(parsed.weekendLimit);
      }
    } catch {}
  };

  const saveSettings = async (newEnabled: boolean, newDaily: number, newWeekend: number) => {
    try {
      await AsyncStorage.setItem('@gameguardian_screen_time', JSON.stringify({
        enabled: newEnabled,
        dailyLimit: newDaily,
        weekendLimit: newWeekend,
      }));
    } catch {}
  };

  const toggleEnabled = () => {
    const newVal = !enabled;
    setEnabled(newVal);
    saveSettings(newVal, dailyLimit, weekendLimit);
  };

  const setDaily = (mins: number) => {
    setDailyLimit(mins);
    saveSettings(enabled, mins, weekendLimit);
  };

  const setWeekend = (mins: number) => {
    setWeekendLimit(mins);
    saveSettings(enabled, dailyLimit, mins);
  };

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h} hr`;
    return `${h} hr ${m} min`;
  };

  const usagePercent = Math.min((usedToday / dailyLimit) * 100, 100);
  const usageColor = usagePercent > 80 ? '#EF4444' : usagePercent > 50 ? '#F59E0B' : '#10B981';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Screen Time Limits</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Enable Toggle */}
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleContent}>
              <Text style={styles.toggleTitle}>Enable Screen Time Limits</Text>
              <Text style={styles.toggleDesc}>Receive alerts when limits are exceeded</Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={toggleEnabled}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={enabled ? '#3B82F6' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Today's Usage */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Usage</Text>
          <View style={styles.usageRow}>
            <Text style={styles.usageTime}>{formatTime(usedToday)}</Text>
            <Text style={styles.usageLimit}>/ {formatTime(dailyLimit)}</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${usagePercent}%`, backgroundColor: usageColor }]} />
          </View>
          <Text style={[styles.usageStatus, { color: usageColor }]}>
            {usagePercent >= 100 ? 'Limit exceeded!' : usagePercent > 80 ? 'Approaching limit' : 'Within limit'}
          </Text>
        </View>

        {/* Weekday Limit */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekday Limit (Mon-Fri)</Text>
          <Text style={styles.cardDesc}>Maximum daily playtime on school days</Text>
          <View style={styles.optionsGrid}>
            {TIME_OPTIONS.map(mins => (
              <TouchableOpacity
                key={mins}
                style={[styles.optionButton, dailyLimit === mins && styles.optionActive]}
                onPress={() => setDaily(mins)}>
                <Text style={[styles.optionText, dailyLimit === mins && styles.optionTextActive]}>
                  {formatTime(mins)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weekend Limit */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekend Limit (Sat-Sun)</Text>
          <Text style={styles.cardDesc}>Maximum daily playtime on weekends</Text>
          <View style={styles.optionsGrid}>
            {TIME_OPTIONS.map(mins => (
              <TouchableOpacity
                key={mins}
                style={[styles.optionButton, weekendLimit === mins && styles.optionActive]}
                onPress={() => setWeekend(mins)}>
                <Text style={[styles.optionText, weekendLimit === mins && styles.optionTextActive]}>
                  {formatTime(mins)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            When the daily limit is reached, you'll receive an alert. The child can continue playing but the alert will be logged for your review.
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#FFFFFF', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 3,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 32, color: '#374151' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '600', color: '#1F2937', textAlign: 'center' },
  content: { flex: 1, padding: 20 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 15, padding: 20, marginBottom: 15,
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  toggleRow: { flexDirection: 'row', alignItems: 'center' },
  toggleContent: { flex: 1 },
  toggleTitle: { fontSize: 16, fontWeight: '500', color: '#1F2937', marginBottom: 4 },
  toggleDesc: { fontSize: 14, color: '#6B7280' },
  usageRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 10, marginTop: 8 },
  usageTime: { fontSize: 32, fontWeight: 'bold', color: '#1F2937' },
  usageLimit: { fontSize: 16, color: '#9CA3AF', marginLeft: 4 },
  progressBg: { height: 12, backgroundColor: '#E5E7EB', borderRadius: 6, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 6 },
  usageStatus: { fontSize: 14, fontWeight: '500' },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionButton: {
    paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12,
    backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB',
  },
  optionActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  optionText: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  optionTextActive: { color: '#FFFFFF' },
  infoBox: {
    flexDirection: 'row', backgroundColor: '#EFF6FF', borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: '#BFDBFE',
  },
  infoIcon: { fontSize: 16, marginRight: 8, marginTop: 2 },
  infoText: { fontSize: 13, color: '#1E40AF', lineHeight: 18, flex: 1 },
});