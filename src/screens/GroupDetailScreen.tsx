import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert as RNAlert,
} from 'react-native';
import { Group } from '../types';

export default function GroupDetailScreen({ route, navigation }: any) {
  const { group }: { group: Group } = route.params;
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  const getRecommendations = () => {
    if (group.isRisky) {
      return [
        'Talk to your child about this group and why it may be unsafe',
        'Explain how "free Robux" and item giveaway scams work',
        'Help your child leave this group from their Roblox account',
        'Check if your child has shared any personal information',
        'Report the group to Roblox if it violates their terms of service',
        'Review your child\'s other group memberships for similar activity',
      ];
    }
    return [
      'This group appears safe based on our analysis',
      'Continue to monitor your child\'s participation',
      'Ask your child about what they do in this group',
      'Check the group periodically for any content changes',
    ];
  };

  const handleLeaveGroup = () => {
    RNAlert.alert(
      'Leave Group',
      `Would you like to flag "${group.name}" for removal? Your child will be reminded to leave this group.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Flag for Removal',
          style: 'destructive',
          onPress: () => {
            setActionTaken('flagged');
            RNAlert.alert('Flagged', `"${group.name}" has been flagged. Remind your child to leave this group from their Roblox account.`);
          },
        },
      ]
    );
  };

  const handleMarkSafe = () => {
    setActionTaken('safe');
    RNAlert.alert('Marked Safe', `"${group.name}" has been reviewed and marked as safe.`);
  };

  const handleReport = () => {
    RNAlert.alert(
      'Report Group',
      'This will open Roblox\'s report system. You can report this group for violating Roblox\'s community guidelines.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          onPress: () => {
            setActionTaken('reported');
            RNAlert.alert('Reported', 'Thank you. This group has been reported to Roblox for review.');
          },
        },
      ]
    );
  };

  const riskColor = group.isRisky
    ? { header: '#EF4444', badge: '#FEE2E2', badgeText: '#991B1B' }
    : { header: '#4F46E5', badge: '#D1FAE5', badgeText: '#065F46' };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: riskColor.header }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.groupIconContainer}>
            <Text style={styles.groupIconText}>{group.isRisky ? '⚠️' : '👥'}</Text>
          </View>
          <View style={styles.groupHeaderText}>
            <View style={[styles.statusBadge, { backgroundColor: riskColor.badge }]}>
              <Text style={[styles.statusBadgeText, { color: riskColor.badgeText }]}>
                {group.isRisky ? '⚠️ RISKY GROUP' : '✅ SAFE GROUP'}
              </Text>
            </View>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupMembers}>
              {group.memberCount.toLocaleString()} members
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Action taken banner */}
        {actionTaken && (
          <View style={[
            styles.actionBanner,
            actionTaken === 'safe' ? styles.actionBannerSafe :
            actionTaken === 'flagged' ? styles.actionBannerWarning :
            styles.actionBannerInfo
          ]}>
            <Text style={styles.actionBannerText}>
              {actionTaken === 'safe' && '✅ Group marked as safe'}
              {actionTaken === 'flagged' && '🚩 Group flagged for removal'}
              {actionTaken === 'reported' && '📢 Group reported to Roblox'}
            </Text>
          </View>
        )}

        {/* Group Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About This Group</Text>
          <Text style={styles.cardText}>{group.description}</Text>
        </View>

        {/* Risk Keywords */}
        {group.isRisky && group.riskKeywords && (
          <View style={styles.keywordsCard}>
            <Text style={styles.cardTitle}>🚨 Flagged Keywords</Text>
            <Text style={styles.cardDesc}>
              These words were found in the group description and are commonly associated with scams targeting children.
            </Text>
            <View style={styles.keywordsRow}>
              {group.riskKeywords.map((kw, i) => (
                <View key={i} style={styles.keywordTag}>
                  <Text style={styles.keywordText}>"{kw}"</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Group Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Group Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Members</Text>
            <Text style={styles.detailValue}>{group.memberCount.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Risk Status</Text>
            <Text style={[styles.detailValue, { color: group.isRisky ? '#EF4444' : '#10B981' }]}>
              {group.isRisky ? 'Flagged as Risky' : 'No Concerns Found'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Keywords Found</Text>
            <Text style={styles.detailValue}>
              {group.riskKeywords ? group.riskKeywords.length : 0}
            </Text>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.recommendCard}>
          <View style={styles.recommendHeader}>
            <Text style={styles.recommendIcon}>🛡️</Text>
            <Text style={styles.recommendTitle}>Recommended Actions</Text>
          </View>
          {getRecommendations().map((rec, i) => (
            <Text key={i} style={styles.recommendItem}>• {rec}</Text>
          ))}
        </View>

        {/* Action Buttons */}
        {!actionTaken && group.isRisky && (
          <>
            <TouchableOpacity style={styles.flagButton} onPress={handleLeaveGroup}>
              <Text style={styles.flagButtonText}>🚩 Flag for Removal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
              <Text style={styles.reportButtonText}>📢 Report to Roblox</Text>
            </TouchableOpacity>
          </>
        )}

        {!actionTaken && !group.isRisky && (
          <TouchableOpacity style={styles.safeButton} onPress={handleMarkSafe}>
            <Text style={styles.safeButtonText}>✅ Mark as Reviewed</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center', marginBottom: 15 },
  backText: { fontSize: 32, color: '#FFFFFF' },
  headerContent: { flexDirection: 'row', alignItems: 'flex-start' },
  groupIconContainer: {
    width: 60, height: 60, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  groupIconText: { fontSize: 32 },
  groupHeaderText: { flex: 1 },
  statusBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, marginBottom: 8,
  },
  statusBadgeText: { fontSize: 10, fontWeight: '700' },
  groupName: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  groupMembers: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  content: { flex: 1, padding: 20 },
  actionBanner: { borderRadius: 12, padding: 14, marginBottom: 15 },
  actionBannerSafe: { backgroundColor: '#D1FAE5', borderWidth: 1, borderColor: '#6EE7B7' },
  actionBannerWarning: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5' },
  actionBannerInfo: { backgroundColor: '#DBEAFE', borderWidth: 1, borderColor: '#93C5FD' },
  actionBannerText: { fontSize: 14, fontWeight: '600', color: '#1F2937', textAlign: 'center' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 15, padding: 20, marginBottom: 15,
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 10 },
  cardText: { fontSize: 15, color: '#374151', lineHeight: 22 },
  cardDesc: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 12 },
  keywordsCard: {
    backgroundColor: '#FEF2F2', borderRadius: 15, padding: 20, marginBottom: 15,
    borderWidth: 1, borderColor: '#FCA5A5',
  },
  keywordsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  keywordTag: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  keywordText: { fontSize: 13, fontWeight: '600', color: '#991B1B' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  detailLabel: { fontSize: 14, color: '#6B7280' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  divider: { height: 1, backgroundColor: '#F3F4F6' },
  recommendCard: {
    backgroundColor: '#EFF6FF', borderRadius: 15, padding: 20, marginBottom: 15,
    borderWidth: 1, borderColor: '#BFDBFE',
  },
  recommendHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  recommendIcon: { fontSize: 20, marginRight: 8 },
  recommendTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  recommendItem: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 4 },
  flagButton: {
    backgroundColor: '#EF4444', borderRadius: 25, paddingVertical: 15,
    alignItems: 'center', marginBottom: 10,
  },
  flagButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  reportButton: {
    backgroundColor: '#FFFFFF', borderRadius: 25, paddingVertical: 15,
    alignItems: 'center', borderWidth: 2, borderColor: '#E5E7EB', marginBottom: 10,
  },
  reportButtonText: { color: '#374151', fontSize: 16, fontWeight: '600' },
  safeButton: {
    backgroundColor: '#10B981', borderRadius: 25, paddingVertical: 15,
    alignItems: 'center', marginBottom: 10,
  },
  safeButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});