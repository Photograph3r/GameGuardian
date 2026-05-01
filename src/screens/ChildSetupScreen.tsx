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
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import CustomAlert from '../components/CustomAlert';

const CHILD_KEY = '@gameguardian_child_profile';

export default function ChildSetupScreen({ onSetupComplete }: { onSetupComplete: () => void }) {
  const { colors } = useTheme();
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [robloxUsername, setRobloxUsername] = useState('');
  const [linking, setLinking] = useState(false);
  const [linked, setLinked] = useState(false);
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

  const handleNext = () => {
    if (step === 1) {
      if (!childName.trim() || !childAge.trim() || isNaN(Number(childAge))) {
        showAlert('Missing Info', 'Please enter your child\'s name and age.', '⚠️', [{ text: 'OK', style: 'default' }]);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!linked) {
        showAlert('Link Required', 'Please link your child\'s Roblox account to continue.', '🔗', [{ text: 'OK', style: 'default' }]);
        return;
      }
      setStep(3);
    }
  };

  const handleFinish = async () => {
    const childProfile = {
      id: 'child-' + Date.now(),
      name: childName.trim(),
      age: Number(childAge),
      robloxUsername: robloxUsername.trim(),
      timezone: 'EST',
      avatarColor: '#8B5CF6',
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(CHILD_KEY, JSON.stringify(childProfile));
    onSetupComplete();
  };

  const getAvatarColor = () => {
    const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    const index = childName.length % colors.length;
    return colors[index];
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

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>🛡️ Game Guardian</Text>
        <Text style={[styles.headerSubtitle, { color: colors.headerSubtext }]}>
          {step === 1 ? 'Step 1 of 3 — Child Info' :
           step === 2 ? 'Step 2 of 3 — Link Roblox' :
           'Step 3 of 3 — All Set!'}
        </Text>
        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 3) * 100}%`, backgroundColor: '#A5B4FC' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">

        {/* ===== STEP 1: Child Info ===== */}
        {step === 1 && (
          <>
            <View style={styles.stepIcon}>
              <Text style={styles.stepIconText}>👶</Text>
            </View>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Tell us about your child</Text>
            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
              This information helps Game Guardian tailor alerts and monitoring to your child's age group.
            </Text>

            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Child's Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
                  placeholder="e.g. Emma, Lucas, Jaylen"
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
                  placeholder="e.g. 10"
                  placeholderTextColor={colors.textMuted}
                  value={childAge}
                  onChangeText={setChildAge}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>

              {childName.trim() && (
                <View style={[styles.previewCard, { backgroundColor: colors.primaryLight }]}>
                  <View style={[styles.previewAvatar, { backgroundColor: getAvatarColor() }]}>
                    <Text style={styles.previewAvatarText}>{childName.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View>
                    <Text style={[styles.previewName, { color: colors.text }]}>{childName}</Text>
                    <Text style={[styles.previewAge, { color: colors.textSecondary }]}>
                      {childAge ? `Age ${childAge}` : 'Age not set'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </>
        )}

        {/* ===== STEP 2: Roblox Link ===== */}
        {step === 2 && (
          <>
            <View style={styles.stepIcon}>
              <Text style={styles.stepIconText}>🎮</Text>
            </View>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Link {childName}'s Roblox Account</Text>
            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
              Enter {childName}'s Roblox username to start monitoring their games, friends, and groups.
            </Text>

            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
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
                  <Text style={styles.linkedText}>
                    @{robloxUsername} linked successfully!
                  </Text>
                </View>
              )}

              <View style={[styles.infoBox, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
                <Text style={styles.infoIcon}>ℹ️</Text>
                <Text style={[styles.infoText, { color: colors.text }]}>
                  Game Guardian uses Roblox's public API to monitor activity. We never access your child's password or private messages.
                </Text>
              </View>
            </View>
          </>
        )}

        {/* ===== STEP 3: All Set ===== */}
        {step === 3 && (
          <>
            <View style={styles.stepIcon}>
              <Text style={styles.stepIconText}>🎉</Text>
            </View>
            <Text style={[styles.stepTitle, { color: colors.text }]}>You're all set!</Text>
            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
              Game Guardian is ready to monitor {childName}'s Roblox activity and keep them safe.
            </Text>

            <View style={[styles.summaryCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <View style={[styles.summaryAvatar, { backgroundColor: getAvatarColor() }]}>
                <Text style={styles.summaryAvatarText}>{childName.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={[styles.summaryName, { color: colors.text }]}>{childName}</Text>
              <Text style={[styles.summaryUsername, { color: colors.textSecondary }]}>@{robloxUsername}</Text>
              <Text style={[styles.summaryAge, { color: colors.textSecondary }]}>Age {childAge}</Text>

              <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

              {[
                { icon: '🎮', label: 'Game Activity Monitoring', active: true },
                { icon: '👥', label: 'Friend & Group Monitoring', active: true },
                { icon: '🛡️', label: 'Safety Alerts', active: true },
                { icon: '⚠️', label: 'Pattern Detection', active: true },
              ].map((item, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={styles.featureIcon}>{item.icon}</Text>
                  <Text style={[styles.featureLabel, { color: colors.text }]}>{item.label}</Text>
                  <Text style={styles.featureCheck}>✅</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Navigation Buttons */}
        <View style={styles.buttonRow}>
          {step > 1 && step < 3 && (
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
              onPress={() => setStep(step - 1)}>
              <Text style={[styles.backButtonText, { color: colors.text }]}>← Back</Text>
            </TouchableOpacity>
          )}

          {step < 3 && (
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: colors.primary }, step === 1 && { flex: 1 }]}
              onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {step === 2 && linked ? 'Continue →' : step === 1 ? 'Next →' : 'Next →'}
              </Text>
            </TouchableOpacity>
          )}

          {step === 3 && (
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: '#10B981', flex: 1 }]}
              onPress={handleFinish}>
              <Text style={styles.nextButtonText}>🛡️ Start Monitoring</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, marginBottom: 12 },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  content: { flex: 1, padding: 20 },
  stepIcon: { alignItems: 'center', marginBottom: 16 },
  stepIconText: { fontSize: 64 },
  stepTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  stepDesc: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  card: {
    borderRadius: 15, padding: 20, marginBottom: 20, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
  input: {
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 16,
  },
  previewCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    padding: 14, gap: 12, marginTop: 4,
  },
  previewAvatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  previewAvatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  previewName: { fontSize: 16, fontWeight: '600' },
  previewAge: { fontSize: 14 },
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
  summaryCard: {
    borderRadius: 20, padding: 24, marginBottom: 20,
    alignItems: 'center', borderWidth: 1,
  },
  summaryAvatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  summaryAvatarText: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold' },
  summaryName: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  summaryUsername: { fontSize: 16, marginBottom: 4 },
  summaryAge: { fontSize: 14, marginBottom: 16 },
  divider: { width: '100%', height: 1, marginBottom: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', width: '100%', paddingVertical: 8 },
  featureIcon: { fontSize: 20, marginRight: 12 },
  featureLabel: { flex: 1, fontSize: 15 },
  featureCheck: { fontSize: 16 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  backButton: {
    paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', borderWidth: 1,
  },
  backButtonText: { fontSize: 16, fontWeight: '500' },
  nextButton: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  nextButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});