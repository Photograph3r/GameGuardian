import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert as RNAlert,
} from 'react-native';
import ApiService from '../services/ApiService';

export default function AlertDetailScreen({ route, navigation }: any) {
  const { alert } = route.params;
  const [resolved, setResolved] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return { gradient: '#EF4444', bg: '#FEE2E2', text: '#991B1B' };
      case 'medium':
        return { gradient: '#F97316', bg: '#FED7AA', text: '#9A3412' };
      case 'low':
        return { gradient: '#EAB308', bg: '#FEF3C7', text: '#854D0E' };
      default:
        return { gradient: '#6B7280', bg: '#F3F4F6', text: '#374151' };
    }
  };

  const colors = getSeverityColor(alert.severity);

  const getIcon = () => {
    switch (alert.type) {
      case 'late-night-gaming': return '⏰';
      case 'rapid-friends': return '👥';
      case 'risky-group': return '🛡️';
      case 'out-of-age-gaming': return '⚠️';
      case 'excessive-playtime': return '⏱️';
      case 'inappropriate-chat': return '💬';
      case 'purchase-attempt': return '💳';
      case 'new-game-flagged': return '🎮';
      default: return '⚠️';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleResolve = async () => {
    try {
      await ApiService.resolveAlert(alert.id);
      setResolved(true);
      RNAlert.alert(
        'Alert Resolved',
        'This alert has been marked as resolved.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      RNAlert.alert('Error', 'Could not resolve alert. Please try again.');
    }
  };

  const handleRemindLater = () => {
    RNAlert.alert(
      'Reminder Set',
      'You will be reminded about this alert later.',
      [{ text: 'OK' }],
    );
  };

  const getRecommendations = () => {
    switch (alert.type) {
      case 'late-night-gaming':
        return [
          'Discuss healthy gaming schedules with your child',
          'Set device curfews or bedtime reminders',
          'Ensure adequate sleep for their age group',
          'Consider enabling Quiet Hours in Game Guardian settings',
        ];
      case 'risky-group':
        return [
          'Review the group with your child',
          'Explain dangers of "free Robux" scams',
          'Consider leaving groups with suspicious activity',
          'Report the group to Roblox if it violates their terms',
        ];
      case 'rapid-friends':
        return [
          'Ask your child about their new friends',
          'Review friend privacy settings together',
          'Remind them about online stranger safety',
          'Check if any new friends are sending suspicious messages',
        ];
      case 'out-of-age-gaming':
        return [
          'Review the game\'s age rating and content',
          'Decide if the content is appropriate for your child',
          'Consider setting parental controls on Roblox',
          'Discuss why age ratings exist with your child',
        ];
      case 'excessive-playtime':
        return [
          'Set a daily screen time limit together',
          'Encourage breaks every 30-60 minutes',
          'Suggest alternative activities (outdoor play, reading)',
          'Use Game Guardian\'s Screen Time Limits feature',
        ];
      case 'inappropriate-chat':
        return [
          'Talk to your child about what information is private',
          'Review the messages together if possible',
          'Block the user sending inappropriate messages',
          'Report the user to Roblox for harassment',
          'Remind your child to never share personal details online',
        ];
      case 'purchase-attempt':
        return [
          'Discuss in-game purchases and spending limits',
          'Review Roblox parental spending controls',
          'Set up purchase approval requirements',
          'Explain the value of money and virtual currencies',
        ];
      case 'new-game-flagged':
        return [
          'Review the new game together with your child',
          'Check the game\'s reviews and community feedback',
          'Discuss what types of games are appropriate',
          'Consider playing the game together first',
        ];
      default:
        return ['Review this alert and take appropriate action'];
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.gradient }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{getIcon()}</Text>
          </View>
          <View style={styles.headerText}>
            <View style={[styles.severityBadge, { backgroundColor: colors.bg }]}>
              <Text style={[styles.severityText, { color: colors.text }]}>
                {alert.severity.toUpperCase()} SEVERITY
              </Text>
            </View>
            <Text style={styles.title}>{alert.title}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(alert.timestamp)}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {resolved && (
          <View style={styles.resolvedBanner}>
            <Text style={styles.resolvedText}>✓ This alert has been resolved</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details</Text>
          <Text style={styles.cardText}>{alert.message}</Text>
        </View>

        {alert.details && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Additional Information</Text>
            <View style={styles.detailsList}>
              {Object.entries(alert.details).map(([key, value]) => (
                <View key={key} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </Text>
                  <Text style={styles.detailValue}>
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.recommendCard}>
          <View style={styles.recommendHeader}>
            <Text style={styles.recommendIcon}>🛡️</Text>
            <Text style={styles.recommendTitle}>Recommended Actions</Text>
          </View>
          <View style={styles.recommendList}>
            {getRecommendations().map((rec, index) => (
              <Text key={index} style={styles.recommendItem}>• {rec}</Text>
            ))}
          </View>
        </View>

        {!resolved && (
          <>
            <TouchableOpacity style={styles.resolveButton} onPress={handleResolve}>
              <Text style={styles.resolveButtonText}>✓ Mark as Resolved</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.laterButton} onPress={handleRemindLater}>
              <Text style={styles.laterButtonText}>Remind Me Later</Text>
            </TouchableOpacity>
          </>
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
  iconContainer: {
    width: 60, height: 60, borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  icon: { fontSize: 32 },
  headerText: { flex: 1 },
  severityBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  severityText: { fontSize: 10, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6 },
  timestamp: { fontSize: 14, color: 'rgba(255, 255, 255, 0.9)' },
  content: { flex: 1, padding: 20 },
  resolvedBanner: {
    backgroundColor: '#D1FAE5', borderRadius: 12, padding: 15,
    marginBottom: 15, borderWidth: 1, borderColor: '#6EE7B7',
  },
  resolvedText: { color: '#065F46', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 15, padding: 20, marginBottom: 15,
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
  cardText: { fontSize: 15, color: '#374151', lineHeight: 22 },
  detailsList: { gap: 10 },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  detailLabel: { fontSize: 14, color: '#6B7280', textTransform: 'capitalize' },
  detailValue: { fontSize: 14, fontWeight: '500', color: '#1F2937', textAlign: 'right', flex: 1, marginLeft: 10 },
  recommendCard: {
    backgroundColor: '#EFF6FF', borderRadius: 15, padding: 20,
    marginBottom: 15, borderWidth: 1, borderColor: '#BFDBFE',
  },
  recommendHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  recommendIcon: { fontSize: 20, marginRight: 8 },
  recommendTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  recommendList: { gap: 8 },
  recommendItem: { fontSize: 14, color: '#374151', lineHeight: 20 },
  resolveButton: {
    backgroundColor: '#10B981', borderRadius: 25, paddingVertical: 15,
    alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  resolveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  laterButton: {
    backgroundColor: '#FFFFFF', borderRadius: 25, paddingVertical: 15,
    alignItems: 'center', borderWidth: 2, borderColor: '#E5E7EB',
  },
  laterButtonText: { color: '#374151', fontSize: 16, fontWeight: '600' },
});