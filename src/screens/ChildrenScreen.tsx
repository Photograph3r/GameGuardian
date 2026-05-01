import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import StorageService from '../services/StorageService';
import { useTheme } from '../context/ThemeContext';
import CustomAlert from '../components/CustomAlert';

export default function ChildrenScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [children, setChildren] = useState<any[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', icon: '🛡️', buttons: [] as any[] });

  const showAlert = (title: string, message: string, icon: string, buttons: any[]) => {
    setAlertConfig({ title, message, icon, buttons });
    setAlertVisible(true);
  };

  const loadChildren = useCallback(async () => {
    const profiles = await StorageService.getChildProfiles();
    setChildren(profiles);
    const activeId = await StorageService.getSelectedChildId();
    setActiveChildId(activeId || (profiles[0]?.id ?? null));
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadChildren();
    const unsubscribe = navigation.addListener('focus', loadChildren);
    return unsubscribe;
  }, [navigation, loadChildren]);

  const handleSetActive = async (childId: string) => {
    await StorageService.setSelectedChildId(childId);
    setActiveChildId(childId);
    showAlert(
      'Profile Switched',
      'Dashboard will now show this child\'s activity.',
      '✅',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleDeleteChild = (child: any) => {
    showAlert(
      'Remove Child',
      `Remove ${child.name} from your account? This cannot be undone.`,
      '⚠️',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await StorageService.removeChildProfile(child.id);
            const updated = children.filter(c => c.id !== child.id);
            setChildren(updated);
            if (activeChildId === child.id && updated.length > 0) {
              await StorageService.setSelectedChildId(updated[0].id);
              setActiveChildId(updated[0].id);
            }
          },
        },
      ]
    );
  };

  const getAvatarColor = (child: any) => child.avatarColor || '#8B5CF6';

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>Manage Children</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddChild')}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadChildren(); }} />}>

        {children.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👶</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Children Added</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Add your child's profile to start monitoring their Roblox activity.
            </Text>
            <TouchableOpacity
              style={[styles.addChildButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AddChild')}>
              <Text style={styles.addChildButtonText}>➕ Add Child</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              {children.length} child{children.length !== 1 ? 'ren' : ''} on your account
            </Text>

            {children.map(child => (
              <View key={child.id} style={[
                styles.childCard,
                { backgroundColor: colors.cardBg, borderColor: activeChildId === child.id ? colors.primary : colors.cardBorder },
                activeChildId === child.id && styles.childCardActive,
              ]}>
                <View style={[styles.avatar, { backgroundColor: getAvatarColor(child) }]}>
                  <Text style={styles.avatarText}>{child.name.charAt(0).toUpperCase()}</Text>
                </View>

                <View style={styles.childInfo}>
                  <View style={styles.childNameRow}>
                    <Text style={[styles.childName, { color: colors.text }]}>{child.name}</Text>
                    {activeChildId === child.id && (
                      <View style={[styles.activeBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.activeBadgeText}>Active</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.childUsername, { color: colors.textSecondary }]}>
                    @{child.robloxUsername}
                  </Text>
                  <Text style={[styles.childAge, { color: colors.textMuted }]}>
                    Age {child.age}
                  </Text>
                </View>

                <View style={styles.childActions}>
                  {activeChildId !== child.id && (
                    <TouchableOpacity
                      style={[styles.setActiveButton, { borderColor: colors.primary }]}
                      onPress={() => handleSetActive(child.id)}>
                      <Text style={[styles.setActiveText, { color: colors.primary }]}>Set Active</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteChild(child)}>
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.addAnotherButton, { backgroundColor: colors.cardBg, borderColor: colors.primary }]}
              onPress={() => navigation.navigate('AddChild')}>
              <Text style={[styles.addAnotherText, { color: colors.primary }]}>➕ Add Another Child</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  backText: { fontSize: 32, color: '#FFFFFF' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '600', textAlign: 'center' },
  addButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  addButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  content: { flex: 1, padding: 20 },
  sectionLabel: { fontSize: 14, marginBottom: 12 },
  childCard: {
    borderRadius: 15, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  childCardActive: { borderWidth: 2 },
  avatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  childInfo: { flex: 1 },
  childNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  childName: { fontSize: 17, fontWeight: '600' },
  activeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  activeBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  childUsername: { fontSize: 14, marginBottom: 2 },
  childAge: { fontSize: 13 },
  childActions: { gap: 8, alignItems: 'flex-end' },
  setActiveButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  setActiveText: { fontSize: 12, fontWeight: '600' },
  deleteButton: { padding: 6 },
  deleteButtonText: { fontSize: 20 },
  addAnotherButton: {
    borderRadius: 15, padding: 16, alignItems: 'center',
    marginTop: 4, borderWidth: 2, borderStyle: 'dashed',
  },
  addAnotherText: { fontSize: 16, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  emptyDesc: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 24, paddingHorizontal: 20 },
  addChildButton: { borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 },
  addChildButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});