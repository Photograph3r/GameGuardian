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
import { AuthContext } from '../../App';
import { useTheme } from '../context/ThemeContext';
import CustomAlert from '../components/CustomAlert';
import { auth } from '../services/FirebaseService';
import { deleteUser } from 'firebase/auth';

export default function SettingsScreen({ navigation }: any) {
  const { logout } = useContext(AuthContext);
  const { mode, setMode, colors } = useTheme();
  const [child, setChild] = useState<any | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    activityTracking: true,
    patternDetection: true,
    pushNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', icon: '🛡️', buttons: [] as any[] });

  const showAlert = (title: string, message: string, icon: string, buttons: any[]) => {
    setAlertConfig({ title, message, icon, buttons });
    setAlertVisible(true);
  };

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [savedProfiles, savedSettings, syncTime] = await Promise.all([
        StorageService.getChildProfiles(),
        StorageService.getSettings(),
        StorageService.getLastSyncTime(),
      ]);

      if (savedProfiles.length > 0) {
        const activeId = await StorageService.getSelectedChildId();
        const activeChild = savedProfiles.find((p: any) => p.id === activeId) || savedProfiles[0];
        setChild(activeChild);
      } else {
        const mockChildren = await ApiService.getChildren();
        setChild(mockChildren[0] || null);
      }

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
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [fetchData, navigation]);

  const toggleSetting = async (key: keyof UserSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await StorageService.saveSettings(updated);
  };

  const handleLogout = () => {
    showAlert(
      'Log Out',
      'Are you sure you want to log out of Game Guardian?',
      '🚪',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => { setAlertVisible(false); logout(); } },
      ]
    );
  };

  const handleDeleteAccount = () => {
    showAlert(
      'Delete Account',
      'This will permanently delete your account and all data. This cannot be undone.',
      '⚠️',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearAll();
              const user = auth.currentUser;
              if (user) await deleteUser(user);
              logout();
            } catch {
              showAlert('Error', 'Could not delete account. Please log in again and try.', '⚠️', [{ text: 'OK', style: 'default' }]);
            }
          },
        },
      ]
    );
  };

  if (loading) return <LoadingState message="Loading settings..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        buttons={alertConfig.buttons}
        onDismiss={() => setAlertVisible(false)}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        {child && (
          <View style={[styles.avatar, { backgroundColor: child.avatarColor || '#8B5CF6' }]}>
            <Text style={styles.avatarText}>{child.name.charAt(0)}</Text>
          </View>
        )}
        <Text style={[styles.headerName, { color: colors.headerText }]}>
          {child?.name || 'My Account'}
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.headerSubtext }]}>
          {child ? `@${child.robloxUsername} · Age ${child.age}` : 'Game Guardian'}
        </Text>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: colors.background }]}>

        {/* Children */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Children</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <TouchableOpacity style={styles.controlRow} onPress={() => navigation.navigate('Children')}>
              <View style={[styles.controlIcon, { backgroundColor: colors.primaryLight }]}>
                <Text style={styles.controlIconText}>👶</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Manage Children</Text>
                <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Add, remove, or switch profiles</Text>
              </View>
              <Text style={[styles.controlArrow, { color: colors.textMuted }]}>›</Text>
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />
            <TouchableOpacity style={styles.controlRow} onPress={() => navigation.navigate('AddChild')}>
              <View style={[styles.controlIcon, { backgroundColor: colors.primaryLight }]}>
                <Text style={styles.controlIconText}>➕</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Add Child</Text>
                <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Monitor another child's account</Text>
              </View>
              <Text style={[styles.controlArrow, { color: colors.textMuted }]}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Monitoring */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Monitoring</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            {[
              { key: 'activityTracking' as keyof UserSettings, label: 'Activity Tracking', desc: 'Games, friends, and groups' },
              { key: 'patternDetection' as keyof UserSettings, label: 'Pattern Detection', desc: 'Late night gaming, risky groups' },
              { key: 'pushNotifications' as keyof UserSettings, label: 'Push Notifications', desc: 'High priority alerts only' },
            ].map((item, index, arr) => (
              <View key={item.key}>
                <View style={styles.settingRow}>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>{item.label}</Text>
                    <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
                  </View>
                  <Switch
                    value={settings[item.key] as boolean}
                    onValueChange={() => toggleSetting(item.key)}
                    trackColor={{ false: colors.surfaceBorder, true: '#93C5FD' }}
                    thumbColor={settings[item.key] ? colors.primary : colors.surface}
                  />
                </View>
                {index < arr.length - 1 && <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />}
              </View>
            ))}
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
                <TouchableOpacity style={styles.controlRow} onPress={() => setMode(item.key as any)}>
                  <View style={[styles.controlIcon, { backgroundColor: colors.primaryLight }]}>
                    <Text style={styles.controlIconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>{item.label}</Text>
                  </View>
                  {mode === item.key && <Text style={[styles.checkMark, { color: colors.primary }]}>✓</Text>}
                </TouchableOpacity>
                {index < arr.length - 1 && <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />}
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
                <TouchableOpacity style={styles.controlRow} onPress={() => navigation.navigate(item.route)}>
                  <View style={[styles.controlIcon, { backgroundColor: colors.primaryLight }]}>
                    <Text style={styles.controlIconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>{item.label}</Text>
                    <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
                  </View>
                  <Text style={[styles.controlArrow, { color: colors.textMuted }]}>›</Text>
                </TouchableOpacity>
                {index < arr.length - 1 && <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />}
              </View>
            ))}
          </View>
        </View>

        {/* Privacy */}
        <View style={[styles.privacyCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
          <Text style={[styles.privacyTitle, { color: colors.text }]}>🛡️ Privacy & Safety</Text>
          <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
            Game Guardian monitors public activity only — games played, friends added, and group memberships.
            We never monitor private messages. All data is stored securely and only accessible by you.
          </Text>
        </View>

        {lastSync && (
          <Text style={[styles.syncText, { color: colors.textMuted }]}>
            Last synced: {new Date(lastSync).toLocaleTimeString()}
          </Text>
        )}

        {/* Account Actions */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>🗑️ Delete Account</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 30, alignItems: 'center' },
  avatar: {
    width: 80, height: 80, borderRadius: 40, justifyContent: 'center',
    alignItems: 'center', marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8,
  },
  avatarText: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold' },
  headerName: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  headerSubtitle: { fontSize: 14 },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  card: {
    borderRadius: 15, overflow: 'hidden', borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  controlRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  controlIcon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  controlIconText: { fontSize: 20 },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '500', marginBottom: 2 },
  settingDesc: { fontSize: 14 },
  controlArrow: { fontSize: 24 },
  checkMark: { fontSize: 20, fontWeight: 'bold' },
  divider: { height: 1, marginHorizontal: 15 },
  privacyCard: { borderRadius: 15, padding: 16, marginBottom: 15, borderWidth: 1 },
  privacyTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  privacyText: { fontSize: 12, lineHeight: 18 },
  syncText: { textAlign: 'center', fontSize: 14, marginBottom: 15 },
  logoutButton: {
    backgroundColor: '#FEE2E2', borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginBottom: 10,
  },
  logoutText: { color: '#991B1B', fontSize: 16, fontWeight: '600' },
  deleteButton: {
    backgroundColor: '#1F2937', borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginBottom: 10,
  },
  deleteText: { color: '#F87171', fontSize: 16, fontWeight: '600' },
});