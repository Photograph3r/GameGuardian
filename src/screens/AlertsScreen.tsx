import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import ApiService from '../services/ApiService';
import { useTheme } from '../context/ThemeContext';
import CustomAlert from '../components/CustomAlert';

export default function AlertDetailScreen({ route, navigation }: any) {
  const { alert } = route.params;
  const { colors } = useTheme();
  const [resolved, setResolved] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: '🛡️',
    buttons: [] as any[],
  });

  const showAlert = (title: string, message: string, icon: string, buttons: any[]) => {
    setAlertConfig({ title, message, icon, buttons });
    setAlertVisible(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return { gradient: '#EF4444', bg: '#FEE2E2', text: '#991B1B' };
      case 'medium': return { gradient: '#F97316', bg: '#FED7AA', text: '#9A3412' };
      case 'low': return { gradient: '#EAB308', bg: '#FEF3C7', text: '#854D0E' };
      default: return { gradient: '#6B7280', bg: '#F3F4F6', text: '#374151' };
    }
  };

  const severityColors = getSeverityColor(alert.severity);

  const getIcon = () => {
    switch (alert.type) {
      case 'late-night-gaming': return '⏰';
      case 'rapid-friends': return '👥';
      case 'risky-group': return '🛡️';
      case 'out-of-age-gaming': return '⚠️';
      case 'excessive-playtime': return '⏳';
      case 'inappropriate-chat': return '💬';
      case 'purchase-attempt': return '💳';
      case 'new-game-flagged': return '🎮';
      default: return '⚠️';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  };

  const handleResolve = async () => {
    showAlert(
      'Resolve Alert',
      'Are you sure you want to mark this alert as resolved?',
      '✅',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          style: 'default',
          onPress: async () => {
            await ApiService.resolveAlert(alert.id);
            setResolved(true);
            setTimeout(() => navigation.goBack(), 800);
          },
        },
      ]
    );
  };

  const handleRemindLater = () => {
    showAlert(
      'Reminder Set',
      'You will be reminded about this alert later.',
      '🔔',
      [{ text: 'OK', style: 'default' }]
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
          'Review the group with your child immediately',
          'Explain dangers of "free Robux" and account-sharing scams',
          'Help your child leave groups with suspicious activity',
          'Report the group to Roblox if it violates their terms',
        ];
      case 'rapid-friends':
        return [
          'Ask your child about their new friends',
          'Review friend privacy settings together',
          'Remind them about online stranger safety',
          'Check if new friends are from known real-life connections',
        ];
      case 'out-of-age-gaming':
        return [
          'Review the game\'s age rating and content with your child',
          'Decide together if the content is appropriate',
          'Consider enabling age-based game restrictions on Roblox',
          'Monitor their reaction to mature content',
        ];
      case 'excessive-playtime':
        return [
          'Set a daily screen time limit together',
          'Encourage breaks every 30-60 minutes',
          'Suggest alternative activities (outdoor play, reading)',
          'Use the Screen Time Limits feature in Settings',
        ];
      case 'inappropriate-chat':
        return [
          'Talk to your child about what happened in the chat',
          'Remind them never to share personal information online',
          'Review Roblox\'s chat filter and privacy settings',
          'Report the user to Roblox if the behavior was serious',
        ];
      case 'purchase-attempt':
        return [
          'Discuss in-app purchases and spending limits with your child',
          'Review your payment method settings on Roblox',
          'Set a monthly Robux allowance if appropriate',
          'Enable purchase approval requirements in Roblox settings',
        ];
      case 'new-game-flagged':
        return [
          'Look up the game to understand its content',
          'Play the game together to assess if it\'s appropriate',
          'Check reviews from other parents',
          'Discuss any concerns with your child',
        ];
      default:
        return ['Review this alert and take appropriate action'];
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Alert Modal */}
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        buttons={alertConfig.buttons}
        onDismiss={() => setAlertVisible(false)}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: severityColors.gradient }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{getIcon()}</Text>
          </View>
          <View style={styles.headerText}>
            <View style={[styles.severityBadge, { backgroundColor: severityColors.bg }]}>
              <Text style={[styles.severityText, { color: severityColors.text }]}>
                {alert.severity.toUpperCase()} SEVERITY
              </Text>
            </View>
            <Text style={styles.title}>{alert.title}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(alert.timestamp)}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Resolved Banner */}
        {resolved && (
          <View style={styles.resolvedBanner}>
            <Text style={styles.resolvedText}>✓ This alert has been resolved</Text>
          </View>
        )}

        {/* Details */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Details</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>{alert.message}</Text>
        </View>

        {/* Additional Info */}
        {alert.details && (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Additional Information</Text>
            {Object.entries(alert.details).map(([key, value]) => (
              <View key={key} style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Recommendations */}
        <View style={[styles.recommendCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
          <View style={styles.recommendHeader}>
            <Text style={styles.recommendIcon}>🛡️</Text>
            <Text style={[styles.recommendTitle, { color: colors.text }]}>Recommended Actions</Text>
          </View>
          {getRecommendations().map((rec, index) => (
            <Text key={index} style={[styles.recommendItem, { color: colors.textSecondary }]}>• {rec}</Text>
          ))}
        </View>

        {/* Action Buttons */}
        {!resolved && (
          <>
            <TouchableOpacity style={styles.resolveButton} onPress={handleResolve}>
              <Text style={styles.resolveButtonText}>✓ Mark as Resolved</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.laterButton, { backgroundColor: colors.cardBg, borderColor: colors.surfaceBorder }]}
              onPress={handleRemindLater}>
              <Text style={[styles.laterButtonText, { color: colors.text }]}>Remind Me Later</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center', marginBottom: 15 },
  backText: { fontSize: 32, color: '#FFFFFF' },
  headerContent: { flexDirection: 'row', alignItems: 'flex-start' },
  iconContainer: {
    width: 60, height: 60, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  icon: { fontSize: 32 },
  headerText: { flex: 1 },
  severityBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  severityText: { fontSize: 10, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6 },
  timestamp: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  content: { flex: 1, padding: 20 },
  resolvedBanner: {
    backgroundColor: '#D1FAE5', borderRadius: 12, padding: 15,
    marginBottom: 15, borderWidth: 1, borderColor: '#6EE7B7',
  },
  resolvedText: { color: '#065F46', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  card: {
    borderRadius: 15, padding: 20, marginBottom: 15, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  cardText: { fontSize: 15, lineHeight: 22 },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  detailLabel: { fontSize: 14, textTransform: 'capitalize' },
  detailValue: { fontSize: 14, fontWeight: '500', textAlign: 'right', flex: 1, marginLeft: 10 },
  recommendCard: {
    borderRadius: 15, padding: 20, marginBottom: 15, borderWidth: 1,
  },
  recommendHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  recommendIcon: { fontSize: 20, marginRight: 8 },
  recommendTitle: { fontSize: 16, fontWeight: '600' },
  recommendItem: { fontSize: 14, lineHeight: 22, marginBottom: 4 },
  resolveButton: {
    backgroundColor: '#10B981', borderRadius: 25, paddingVertical: 15,
    alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  resolveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  laterButton: {
    borderRadius: 25, paddingVertical: 15,
    alignItems: 'center', borderWidth: 2,
  },
  laterButtonText: { fontSize: 16, fontWeight: '600' },
});