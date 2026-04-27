import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function QuietHoursScreen({ navigation }: any) {
  const [enabled, setEnabled] = useState(false);
  const [startHour, setStartHour] = useState(21);
  const [endHour, setEndHour] = useState(7);
  const [weekendsOff, setWeekendsOff] = useState(false);
  const [alertOnViolation, setAlertOnViolation] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem('@gameguardian_quiet_hours');
      if (data) {
        const parsed = JSON.parse(data);
        setEnabled(parsed.enabled);
        setStartHour(parsed.startHour);
        setEndHour(parsed.endHour);
        setWeekendsOff(parsed.weekendsOff);
        setAlertOnViolation(parsed.alertOnViolation);
      }
    } catch {}
  };

  const saveSettings = async (settings: any) => {
    try {
      await AsyncStorage.setItem('@gameguardian_quiet_hours', JSON.stringify(settings));
    } catch {}
  };

  const updateSetting = (key: string, value: any) => {
    const newSettings = {
      enabled, startHour, endHour, weekendsOff, alertOnViolation,
      [key]: value,
    };
    switch (key) {
      case 'enabled': setEnabled(value); break;
      case 'startHour': setStartHour(value); break;
      case 'endHour': setEndHour(value); break;
      case 'weekendsOff': setWeekendsOff(value); break;
      case 'alertOnViolation': setAlertOnViolation(value); break;
    }
    saveSettings(newSettings);
  };

  const formatHour = (h: number) => {
    if (h === 0) return '12:00 AM';
    if (h === 12) return '12:00 PM';
    if (h < 12) return `${h}:00 AM`;
    return `${h - 12}:00 PM`;
  };

  const getQuietDuration = () => {
    let duration = endHour - startHour;
    if (duration <= 0) duration += 24;
    return duration;
  };

  const isCurrentlyQuiet = () => {
    const now = new Date().getHours();
    if (startHour < endHour) {
      return now >= startHour && now < endHour;
    }
    return now >= startHour || now < endHour;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiet Hours</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Enable Toggle */}
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleContent}>
              <Text style={styles.toggleTitle}>Enable Quiet Hours</Text>
              <Text style={styles.toggleDesc}>Alert when gaming occurs during quiet hours</Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={(val) => updateSetting('enabled', val)}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={enabled ? '#3B82F6' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Status Banner */}
        {enabled && (
          <View style={[styles.statusBanner, isCurrentlyQuiet() ? styles.statusActive : styles.statusInactive]}>
            <Text style={styles.statusIcon}>{isCurrentlyQuiet() ? '🌙' : '☀️'}</Text>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>
                {isCurrentlyQuiet() ? 'Quiet Hours Active' : 'Quiet Hours Inactive'}
              </Text>
              <Text style={styles.statusDesc}>
                {isCurrentlyQuiet()
                  ? 'Gaming activity will trigger alerts right now'
                  : `Quiet hours start at ${formatHour(startHour)}`}
              </Text>
            </View>
          </View>
        )}

        {/* Schedule */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Schedule</Text>
          <Text style={styles.cardDesc}>
            Quiet hours last {getQuietDuration()} hours ({formatHour(startHour)} to {formatHour(endHour)})
          </Text>

          <Text style={styles.timeLabel}>Start Time (No gaming after)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
            <View style={styles.timeRow}>
              {[19, 20, 21, 22, 23].map(h => (
                <TouchableOpacity
                  key={h}
                  style={[styles.timeButton, startHour === h && styles.timeButtonActive]}
                  onPress={() => updateSetting('startHour', h)}>
                  <Text style={[styles.timeText, startHour === h && styles.timeTextActive]}>
                    {formatHour(h)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.timeLabel}>End Time (Gaming allowed after)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
            <View style={styles.timeRow}>
              {[5, 6, 7, 8, 9, 10].map(h => (
                <TouchableOpacity
                  key={h}
                  style={[styles.timeButton, endHour === h && styles.timeButtonActive]}
                  onPress={() => updateSetting('endHour', h)}>
                  <Text style={[styles.timeText, endHour === h && styles.timeTextActive]}>
                    {formatHour(h)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Visual Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Timeline</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineBar}>
              {HOURS.map(h => {
                let isQuiet = false;
                if (startHour < endHour) {
                  isQuiet = h >= startHour && h < endHour;
                } else {
                  isQuiet = h >= startHour || h < endHour;
                }
                return (
                  <View
                    key={h}
                    style={[
                      styles.timelineSegment,
                      { backgroundColor: isQuiet && enabled ? '#4F46E5' : '#E5E7EB' },
                    ]}
                  />
                );
              })}
            </View>
            <View style={styles.timelineLabels}>
              <Text style={styles.timelineLabel}>12AM</Text>
              <Text style={styles.timelineLabel}>6AM</Text>
              <Text style={styles.timelineLabel}>12PM</Text>
              <Text style={styles.timelineLabel}>6PM</Text>
              <Text style={styles.timelineLabel}>12AM</Text>
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4F46E5' }]} />
              <Text style={styles.legendText}>Quiet (alerts on)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#E5E7EB' }]} />
              <Text style={styles.legendText}>Normal (gaming ok)</Text>
            </View>
          </View>
        </View>

        {/* Options */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Options</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleContent}>
              <Text style={styles.optionTitle}>Relax on Weekends</Text>
              <Text style={styles.toggleDesc}>Disable quiet hours on Saturday and Sunday</Text>
            </View>
            <Switch
              value={weekendsOff}
              onValueChange={(val) => updateSetting('weekendsOff', val)}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={weekendsOff ? '#3B82F6' : '#F3F4F6'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleContent}>
              <Text style={styles.optionTitle}>High Priority Alerts</Text>
              <Text style={styles.toggleDesc}>Send high severity alert on quiet hour violations</Text>
            </View>
            <Switch
              value={alertOnViolation}
              onValueChange={(val) => updateSetting('alertOnViolation', val)}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={alertOnViolation ? '#3B82F6' : '#F3F4F6'}
            />
          </View>
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
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  toggleContent: { flex: 1 },
  toggleTitle: { fontSize: 16, fontWeight: '500', color: '#1F2937', marginBottom: 4 },
  toggleDesc: { fontSize: 14, color: '#6B7280' },
  optionTitle: { fontSize: 15, fontWeight: '500', color: '#1F2937', marginBottom: 4 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  statusBanner: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 15,
    padding: 16, marginBottom: 15,
  },
  statusActive: { backgroundColor: '#EDE9FE', borderWidth: 1, borderColor: '#C4B5FD' },
  statusInactive: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  statusIcon: { fontSize: 28, marginRight: 12 },
  statusContent: { flex: 1 },
  statusTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  statusDesc: { fontSize: 14, color: '#6B7280' },
  timeLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8, marginTop: 12 },
  timeScroll: { marginBottom: 8 },
  timeRow: { flexDirection: 'row', gap: 8 },
  timeButton: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB',
  },
  timeButtonActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  timeText: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  timeTextActive: { color: '#FFFFFF' },
  timeline: { marginTop: 8 },
  timelineBar: { flexDirection: 'row', height: 20, borderRadius: 10, overflow: 'hidden' },
  timelineSegment: { flex: 1 },
  timelineLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  timelineLabel: { fontSize: 10, color: '#9CA3AF' },
  legendRow: { flexDirection: 'row', gap: 20, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 12, color: '#6B7280' },
});