import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert as RNAlert,
} from 'react-native';
import ApiService from '../services/ApiService';
import StorageService, { UserSettings } from '../services/StorageService';
import { LoadingState, ErrorState } from '../components/SharedStates';
import { Child } from '../types';
import { AuthContext } from '../../App';

export default function SettingsScreen({ navigation }: any) {
  const { logout } = useContext(AuthContext);
  const [child, setChild] = useState<Child | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    activityTracking: true,
    patternDetection: true,
    pushNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [children, savedSettings, syncTime] = await Promise.all([
        ApiService.getChildren(),
        StorageService.getSettings(),
        StorageService.getLastSyncTime(),
      ]);
      setChild(children[0] || null);
      setSettings(savedSettings);
      setLastSync(syncTime);
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleSetting = async (key: keyof UserSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await StorageService.saveSettings(updated);
  };

  const handleLogout = () => {
    RNAlert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  if (loading) return <LoadingState message="Loading settings..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  if (!child) return <ErrorState message="No child profile found" />;

  const syncDisplay = lastSync
    ? `Last synced: ${new Date(lastSync).toLocaleTimeString()}`
    : 'Last synced: Never';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: '#8B5CF6' }]}>
          <Text style={styles.avatarText}>{child.name.charAt(0)}</Text>
        </View>
        <Text style={styles.headerName}>{child.name}</Text>
        <Text style={styles.headerSubtitle}>Child Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text style={styles.infoIconText}>👤</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{child.age} years old</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text style={styles.infoIconText}>🌍</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Timezone</Text>
                <Text style={styles.infoValue}>{child.timezone}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text style={styles.infoIconText}>🔗</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Roblox Username</Text>
                <Text style={styles.infoValue}>@{child.robloxUsername}</Text>
              </View>
              <View style={styles.linkedBadge}>
                <Text style={styles.linkedText}>Linked</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monitoring Settings</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Activity Tracking</Text>
                <Text style={styles.settingDescription}>Games, friends, and groups</Text>
              </View>
              <Switch
                value={settings.activityTracking}
                onValueChange={() => toggleSetting('activityTracking')}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={settings.activityTracking ? '#3B82F6' : '#F3F4F6'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Pattern Detection</Text>
                <Text style={styles.settingDescription}>Late night gaming, risky groups</Text>
              </View>
              <Switch
                value={settings.patternDetection}
                onValueChange={() => toggleSetting('patternDetection')}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={settings.patternDetection ? '#3B82F6' : '#F3F4F6'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>High priority alerts only</Text>
              </View>
              <Switch
                value={settings.pushNotifications}
                onValueChange={() => toggleSetting('pushNotifications')}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={settings.pushNotifications ? '#3B82F6' : '#F3F4F6'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parental Controls</Text>

          <View style={styles.settingCard}>
            <TouchableOpacity style={styles.controlRow}>
              <View style={styles.controlIcon}>
                <Text style={styles.controlIconText}>🕐</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Screen Time Limits</Text>
                <Text style={styles.settingDescription}>Set daily play limits</Text>
              </View>
              <Text style={styles.comingSoon}>Coming Soon</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.controlRow}>
              <View style={styles.controlIcon}>
                <Text style={styles.controlIconText}>🚫</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Game Blocklist</Text>
                <Text style={styles.settingDescription}>Block specific games</Text>
              </View>
              <Text style={styles.comingSoon}>Coming Soon</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.controlRow}>
              <View style={styles.controlIcon}>
                <Text style={styles.controlIconText}>🔔</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Quiet Hours</Text>
                <Text style={styles.settingDescription}>No gaming during set hours</Text>
              </View>
              <Text style={styles.comingSoon}>Coming Soon</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>Privacy & Safety</Text>
          <Text style={styles.privacyText}>
            Game Guardian monitors public activity like games played, friends
            added, and group memberships. We do NOT monitor in-game chat or
            private messages. All data is stored securely and only accessible by
            you.
          </Text>
        </View>

        <Text style={styles.syncText}>{syncDisplay}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#4F46E5', paddingTop: 50, paddingBottom: 30, alignItems: 'center' },
  avatar: {
    width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8,
  },
  avatarText: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold' },
  headerName: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#C7D2FE' },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
  editButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  editButtonText: { color: '#3B82F6', fontSize: 14, fontWeight: '500' },
  infoCard: {
    backgroundColor: '#FFFFFF', borderRadius: 15, overflow: 'hidden',
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  infoIcon: {
    width: 40, height: 40, borderRadius: 8, backgroundColor: '#DBEAFE',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  infoIconText: { fontSize: 20 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  infoValue: { fontSize: 16, fontWeight: '500', color: '#1F2937' },
  linkedBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  linkedText: { color: '#065F46', fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginHorizontal: 15 },
  settingCard: {
    backgroundColor: '#FFFFFF', borderRadius: 15, overflow: 'hidden',
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '500', color: '#1F2937', marginBottom: 4 },
  settingDescription: { fontSize: 14, color: '#6B7280' },
  controlRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  controlIcon: {
    width: 40, height: 40, borderRadius: 8, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  controlIconText: { fontSize: 20 },
  comingSoon: {
    fontSize: 11, fontWeight: '600', color: '#9CA3AF',
    backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  privacyCard: {
    backgroundColor: '#EFF6FF', borderRadius: 15, padding: 15,
    borderWidth: 1, borderColor: '#BFDBFE', marginBottom: 15,
  },
  privacyTitle: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  privacyText: { fontSize: 12, color: '#4B5563', lineHeight: 18 },
  syncText: { textAlign: 'center', fontSize: 14, color: '#6B7280' },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  logoutText: {
    color: '#991B1B',
    fontSize: 16,
    fontWeight: '600',
  },
});