import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import ApiService from '../services/ApiService';
import StorageService, { UserSettings } from '../services/StorageService';
import { LoadingState, ErrorState } from '../components/SharedStates';
import { Child } from '../types';
import { AuthContext } from '../../App';
import { useTheme } from '../context/ThemeContext';
import CustomAlert from '../components/CustomAlert';

export default function SettingsScreen({ navigation }: any) {
  const { logout } = useContext(AuthContext);
  const { mode, setMode, colors } = useTheme();
  const [child, setChild] = useState<Child | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    activityTracking: true,
    patternDetection: true,
    pushNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);

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

  if (loading) return <LoadingState message="Loading settings..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  if (!child) return <ErrorState message="No child profile found" />;

  const syncDisplay = lastSync
    ? `Last synced: ${new Date(lastSync).toLocaleTimeString()}`
    : 'Last synced: Never';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Logout Alert */}
      <CustomAlert
        visible={alertVisible}
        title="Log Out"
        message="Are you sure you want to log out of Game Guardian?"
        icon="🚪"
        buttons={[
          { text: 'Cancel', style: 'cancel', onPress: () => setAlertVisible(false) },
          {
            text: 'Log Out',
            style: 'destructive',
            onPress: () => {
              setAlertVisible(false);
              logout();
            },
          },
        ]}
        onDismiss={() => setAlertVisible(false)}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <View style={[styles.avatar, { backgroundColor: '#8B5CF6' }]}>
          <Text style={styles.avatarText}>{child.name.charAt(0)}</Text>
        </View>
        <Text style={[styles.headerName, { color: colors.headerText }]}>{child.name}</Text>
        <Text style={[styles.headerSubtitle, { color: colors.headerSubtext }]}>Child Profile</Text>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: colors.background }]}>

        {/* Profile Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Information</Text>
            <TouchableOpacity>
              <Text style={[styles.editButton, { color: colors.primary }]}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: colors.primaryLight }]}>
                <Text style={styles.infoIconText}>👤</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Age</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{child.age} years old</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: colors.primaryLight }]}>
                <Text style={styles.infoIconText}>🌍</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Timezone</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{child.timezone}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: colors.primaryLight }]}>
                <Text style={styles.infoIconText}>🔗</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Roblox Username</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>@{child.robloxUsername}</Text>
              </View>
              <View style={styles.linkedBadge}>
                <Text style={styles.linkedText}>Linked</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Monitoring Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Monitoring Settings</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Activity Tracking</Text>
                <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Games, friends, and groups</Text>
              </View>
              <Switch
                value={settings.activityTracking}
                onValueChange={() => toggleSetting('activityTracking')}
                trackColor={{ false: colors.surfaceBorder, true: '#93C5FD' }}
                thumbColor={settings.activityTracking ? colors.primary : colors.surface}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Pattern Detection</Text>
                <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Late night gaming, risky groups</Text>
              </View>
              <Switch
                value={settings.patternDetection}
                onValueChange={() => toggleSetting('patternDetection')}
                trackColor={{ false: colors.surfaceBorder, true: '#93C5FD' }}
                thumbColor={settings.patternDetection ? colors.primary : colors.surface}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Push Notifications</Text>
                <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>High priority alerts only</Text>
              </View>
              <Switch
                value={settings.pushNotifications}
                onValueChange={() => toggleSetting('pushNotifications')}
                trackColor={{ false: colors.surfaceBorder, true: '#93C5FD' }}
                thumbColor={settings.pushNotifications ? colors.primary : colors.surface}
              />
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            {[
              { key: 'light', label: 'Light Mode', icon: '☀️' },
              { key: 'dark', label: 'Dark Mode', icon: '🌙' },
              { key: 'high-contrast', label: 'High Contrast', icon: '🔲' },
            ].map((item, index, arr) => (
              <View key={item.key}>
                <TouchableOpacity
                  style={styles.controlRow}
                  onPress={() => setMode(item.key as any)}>
                  <View style={[styles.controlIcon, { backgroundColor: colors.primaryLight }]}>
                    <Text style={styles.controlIconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>{item.label}</Text>
                  </View>
                  {mode === item.key && (
                    <Text style={[styles.checkMark, { color: colors.primary }]}>✓</Text>
                  )}
                </TouchableOpacity>
                {index < arr.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Parental Controls */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Parental Controls</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            {[
              { icon: '🕐', label: 'Screen Time Limits', desc: 'Set daily play limits', route: 'ScreenTimeLimits' },
              { icon: '🚫', label: 'Game Blocklist', desc: 'Block specific games', route: 'GameBlocklist' },
              { icon: '🔔', label: 'Quiet Hours', desc: 'No gaming during set hours', route: 'QuietHours' },
            ].map((item, index, arr) => (
              <View key={item.route}>
                <TouchableOpacity
                  style={styles.controlRow}
                  onPress={() => navigation.navigate(item.route)}>
                  <View style={[styles.controlIcon, { backgroundColor: colors.primaryLight }]}>
                    <Text style={styles.controlIconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>{item.label}</Text>
                    <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
                  </View>
                  <Text style={[styles.controlArrow, { color: colors.textMuted }]}>›</Text>
                </TouchableOpacity>
                {index < arr.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={[styles.privacyCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
          <Text style={[styles.privacyTitle, { color: colors.text }]}>Privacy & Safety</Text>
          <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
            Game Guardian monitors public activity like games played, friends added, and group
            memberships. We do NOT monitor in-game chat or private messages. All data is stored
            securely and only accessible by you.
          </Text>
        </View>

        <Text style={[styles.syncText, { color: colors.textMuted }]}>{syncDisplay}</Text>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => setAlertVisible(true)}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 30, alignItems: 'center' },
  avatar: {
    width: 80, height: 80, borderRadius: 40, justifyContent: 'center',
    alignItems: 'center', marginBottom: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8,
  },
  avatarText: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold' },
  headerName: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  headerSubtitle: { fontSize: 14 },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  editButton: { fontSize: 14, fontWeight: '500' },
  card: {
    borderRadius: 15, overflow: 'hidden', borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  infoIcon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  infoIconText: { fontSize: 20 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, marginBottom: 2 },
  infoValue: { fontSize: 16, fontWeight: '500' },
  linkedBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  linkedText: { color: '#065F46', fontSize: 12, fontWeight: '600' },
  divider: { height: 1, marginHorizontal: 15 },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '500', marginBottom: 2 },
  settingDesc: { fontSize: 14 },
  controlRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  controlIcon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  controlIconText: { fontSize: 20 },
  controlArrow: { fontSize: 24 },
  checkMark: { fontSize: 20, fontWeight: 'bold' },
  privacyCard: { borderRadius: 15, padding: 15, marginBottom: 15, borderWidth: 1 },
  privacyTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  privacyText: { fontSize: 12, lineHeight: 18 },
  syncText: { textAlign: 'center', fontSize: 14, marginBottom: 15 },
  logoutButton: {
    backgroundColor: '#FEE2E2', borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 5,
  },
  logoutText: { color: '#991B1B', fontSize: 16, fontWeight: '600' },
});
