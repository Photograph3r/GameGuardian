import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function AddChildScreen({ navigation }: any) {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [robloxUsername, setRobloxUsername] = useState('');
  const [linking, setLinking] = useState(false);
  const [linked, setLinked] = useState(false);

  const handleLinkRoblox = async () => {
    if (!robloxUsername.trim()) {
      Alert.alert('Error', 'Please enter a Roblox username');
      return;
    }
    setLinking(true);
    // Simulate Roblox verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLinking(false);
    setLinked(true);
    Alert.alert('Success', `Roblox account "${robloxUsername}" has been linked!`);
  };

  const handleSaveChild = () => {
    if (!childName.trim()) {
      Alert.alert('Error', 'Please enter your child\'s name');
      return;
    }
    if (!childAge.trim() || isNaN(Number(childAge))) {
      Alert.alert('Error', 'Please enter a valid age');
      return;
    }
    if (!linked) {
      Alert.alert('Error', 'Please link a Roblox account first');
      return;
    }

    Alert.alert(
      'Child Added!',
      `${childName} (@${robloxUsername}) has been added to your account. You'll start receiving activity alerts soon.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Child</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.iconSection}>
          <View style={styles.childIcon}>
            <Text style={styles.childIconText}>👶</Text>
          </View>
          <Text style={styles.iconSubtext}>Add your child's information</Text>
        </View>

        {/* Child Info Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Child Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Child's Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter child's name"
              placeholderTextColor="#9CA3AF"
              value={childName}
              onChangeText={setChildName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter age"
              placeholderTextColor="#9CA3AF"
              value={childAge}
              onChangeText={setChildAge}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
        </View>

        {/* Roblox Link Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Link Roblox Account</Text>
          <Text style={styles.cardDescription}>
            Connect your child's Roblox account to start monitoring their activity, friends, and groups.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Roblox Username</Text>
            <TextInput
              style={[styles.input, linked && styles.inputLinked]}
              placeholder="Enter Roblox username"
              placeholderTextColor="#9CA3AF"
              value={robloxUsername}
              onChangeText={setRobloxUsername}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!linked}
            />
          </View>

          {!linked ? (
            <TouchableOpacity
              style={[styles.linkButton, linking && styles.linkButtonDisabled]}
              onPress={handleLinkRoblox}
              disabled={linking}>
              <Text style={styles.linkButtonText}>
                {linking ? 'Verifying...' : '🔗 Link Roblox Account'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.linkedBanner}>
              <Text style={styles.linkedIcon}>✅</Text>
              <Text style={styles.linkedText}>
                Roblox account linked successfully!
              </Text>
            </View>
          )}

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Game Guardian uses Roblox's public API to monitor activity. We never access your child's password or private messages.
            </Text>
          </View>
        </View>

        {/* Monitoring Options */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monitoring Options</Text>
          <Text style={styles.cardDescription}>
            These can be adjusted later in Settings.
          </Text>

          <View style={styles.optionRow}>
            <Text style={styles.optionIcon}>🎮</Text>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Game Activity</Text>
              <Text style={styles.optionDesc}>Track games played and playtime</Text>
            </View>
            <Text style={styles.optionCheck}>✅</Text>
          </View>

          <View style={styles.optionRow}>
            <Text style={styles.optionIcon}>👥</Text>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Friend Activity</Text>
              <Text style={styles.optionDesc}>Monitor new friend additions</Text>
            </View>
            <Text style={styles.optionCheck}>✅</Text>
          </View>

          <View style={styles.optionRow}>
            <Text style={styles.optionIcon}>🛡️</Text>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Safety Alerts</Text>
              <Text style={styles.optionDesc}>Get notified about risky activity</Text>
            </View>
            <Text style={styles.optionCheck}>✅</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, (!childName || !childAge || !linked) && styles.saveButtonDisabled]}
          onPress={handleSaveChild}
          disabled={!childName || !childAge || !linked}>
          <Text style={styles.saveButtonText}>Add Child & Start Monitoring</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  iconSection: { alignItems: 'center', marginBottom: 20 },
  childIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#EDE9FE',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  childIconText: { fontSize: 40 },
  iconSubtext: { fontSize: 14, color: '#6B7280' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 15, padding: 20, marginBottom: 15,
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 6 },
  cardDescription: { fontSize: 14, color: '#6B7280', marginBottom: 16, lineHeight: 20 },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1F2937',
  },
  inputLinked: { backgroundColor: '#D1FAE5', borderColor: '#6EE7B7' },
  linkButton: {
    backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginBottom: 12,
  },
  linkButtonDisabled: { opacity: 0.7 },
  linkButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkedBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5',
    borderRadius: 12, padding: 14, marginBottom: 12,
  },
  linkedIcon: { fontSize: 20, marginRight: 10 },
  linkedText: { color: '#065F46', fontSize: 14, fontWeight: '500', flex: 1 },
  infoBox: {
    flexDirection: 'row', backgroundColor: '#EFF6FF', borderRadius: 10,
    padding: 12, borderWidth: 1, borderColor: '#BFDBFE',
  },
  infoIcon: { fontSize: 16, marginRight: 8, marginTop: 2 },
  infoText: { fontSize: 12, color: '#1E40AF', lineHeight: 18, flex: 1 },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  optionIcon: { fontSize: 24, marginRight: 12 },
  optionContent: { flex: 1 },
  optionTitle: { fontSize: 15, fontWeight: '500', color: '#1F2937', marginBottom: 2 },
  optionDesc: { fontSize: 13, color: '#6B7280' },
  optionCheck: { fontSize: 18 },
  saveButton: {
    backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 16,
    alignItems: 'center', marginTop: 5,
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});
