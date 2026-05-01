import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import StorageService from '../services/StorageService';
import { useTheme } from '../context/ThemeContext';
import CustomAlert from '../components/CustomAlert';

export default function AddChildScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [robloxUsername, setRobloxUsername] = useState('');
  const [linking, setLinking] = useState(false);
  const [linked, setLinked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', icon: '🛡️', buttons: [] as any[] });

  const showAlert = (title: string, message: string, icon: string, buttons: any[]) => {
    setAlertConfig({ title, message, icon, buttons });
    setAlertVisible(true);
  };

  const handleLinkRoblox = async () => {
    if (!robloxUsername.trim()) {
      showAlert('Missing Info', 'Please enter a Roblox username.', '⚠️', [{ text: 'OK', style: 'default' }]);
      return;
    }
    setLinking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLinking(false);
    setLinked(true);
  };

  const handleSaveChild = async () => {
    if (!childName.trim()) {
      showAlert('Missing Info', 'Please enter your child\'s name.', '⚠️', [{ text: 'OK', style: 'default' }]);
      return;
    }
    if (!childAge.trim() || isNaN(Number(childAge))) {
      showAlert('Missing Info', 'Please enter a valid age.', '⚠️', [{ text: 'OK', style: 'default' }]);
      return;
    }
    if (!linked) {
      showAlert('Link Required', 'Please link a Roblox account first.', '🔗', [{ text: 'OK', style: 'default' }]);
      return;
    }

    setSaving(true);
    const avatarColors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    const newChild = {
      id: 'child-' + Date.now(),
      name: childName.trim(),
      age: Number(childAge),
      robloxUsername: robloxUsername.trim(),
      timezone: 'EST',
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      createdAt: new Date().toISOString(),
    };

    await StorageService.saveChildProfile(newChild);
    setSaving(false);

    showAlert(
      'Child Added!',
      `${childName} (@${robloxUsername}) has been added to your account.`,
      '✅',
      [{ text: 'OK', style: 'default', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        buttons={alertConfig.buttons}
        onDismiss={() => setAlertVisible(false)}
      />

      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.surfaceBorder }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.text }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Child</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.iconSection}>
          <View style={[styles.childIcon, { backgroundColor: colors.primaryLight }]}>
            <Text style={styles.childIconText}>👶</Text>
          </View>
          <Text style={[styles.iconSubtext, { color: colors.textSecondary }]}>Add your child's information</Text>
        </View>

        {/* Child Info */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Child Information</Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Child's Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder="Enter child's name"
              placeholderTextColor={colors.textMuted}
              value={childName}
              onChangeText={setChildName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Age</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder="Enter age"
              placeholderTextColor={colors.textMuted}
              value={childAge}
              onChangeText={setChildAge}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
        </View>

        {/* Roblox Link */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Link Roblox Account</Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
            Connect your child's Roblox account to start monitoring their activity.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Roblox Username</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: linked ? '#D1FAE5' : colors.inputBg, borderColor: linked ? '#6EE7B7' : colors.inputBorder, color: colors.text },
              ]}
              placeholder="Enter Roblox username"
              placeholderTextColor={colors.textMuted}
              value={robloxUsername}
              onChangeText={setRobloxUsername}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!linked}
            />
          </View>

          {!linked ? (
            <TouchableOpacity
              style={[styles.linkButton, { backgroundColor: colors.primary }, linking && styles.linkButtonDisabled]}
              onPress={handleLinkRoblox}
              disabled={linking}>
              <Text style={styles.linkButtonText}>
                {linking ? '🔄 Verifying...' : '🔗 Link Roblox Account'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.linkedBanner}>
              <Text style={styles.linkedIcon}>✅</Text>
              <Text style={styles.linkedText}>@{robloxUsername} linked successfully!</Text>
            </View>
          )}

          <View style={[styles.infoBox, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={[styles.infoText, { color: colors.text }]}>
              Game Guardian uses Roblox's public API. We never access your child's password or private messages.
            </Text>
          </View>
        </View>

        {/* Monitoring Options */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Monitoring Options</Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>These can be adjusted later in Settings.</Text>

          {[
            { icon: '🎮', title: 'Game Activity', desc: 'Track games played and playtime' },
            { icon: '👥', title: 'Friend Activity', desc: 'Monitor new friend additions' },
            { icon: '🛡️', title: 'Safety Alerts', desc: 'Get notified about risky activity' },
          ].map((item, i) => (
            <View key={i} style={[styles.optionRow, { borderBottomColor: colors.surfaceBorder }]}>
              <Text style={styles.optionIcon}>{item.icon}</Text>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
              </View>
              <Text style={styles.optionCheck}>✅</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: colors.primary },
            (!childName || !childAge || !linked || saving) && styles.saveButtonDisabled,
          ]}
          onPress={handleSaveChild}
          disabled={!childName || !childAge || !linked || saving}>
          <Text style={styles.saveButtonText}>
            {saving ? 'Adding...' : '➕ Add Child & Start Monitoring'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 3,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 32 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '600', textAlign: 'center' },
  content: { flex: 1, padding: 20 },
  iconSection: { alignItems: 'center', marginBottom: 20 },
  childIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  childIconText: { fontSize: 40 },
  iconSubtext: { fontSize: 14 },
  card: {
    borderRadius: 15, padding: 20, marginBottom: 15, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  cardDescription: { fontSize: 14, marginBottom: 16, lineHeight: 20 },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  linkButton: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  linkButtonDisabled: { opacity: 0.7 },
  linkButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkedBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5',
    borderRadius: 12, padding: 14, marginBottom: 12,
  },
  linkedIcon: { fontSize: 20, marginRight: 10 },
  linkedText: { color: '#065F46', fontSize: 14, fontWeight: '500', flex: 1 },
  infoBox: { flexDirection: 'row', borderRadius: 10, padding: 12, borderWidth: 1 },
  infoIcon: { fontSize: 16, marginRight: 8, marginTop: 2 },
  infoText: { fontSize: 12, lineHeight: 18, flex: 1 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  optionIcon: { fontSize: 24, marginRight: 12 },
  optionContent: { flex: 1 },
  optionTitle: { fontSize: 15, fontWeight: '500', marginBottom: 2 },
  optionDesc: { fontSize: 13 },
  optionCheck: { fontSize: 18 },
  saveButton: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 5 },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});