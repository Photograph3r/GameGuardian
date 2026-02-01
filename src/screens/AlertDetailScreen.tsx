// ============================================
// ALERT DETAIL SCREEN
// Shows full details of a specific alert
// Includes recommendations and action buttons
// ============================================

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function AlertDetailScreen({route, navigation}: any) {
  // Get the alert data passed from the previous screen
  const {alert} = route.params;

  // ===== HELPER FUNCTIONS =====

  // Get colors based on severity level
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return {gradient: '#EF4444', bg: '#FEE2E2', text: '#991B1B'};
      case 'medium':
        return {gradient: '#F97316', bg: '#FED7AA', text: '#9A3412'};
      case 'low':
        return {gradient: '#EAB308', bg: '#FEF3C7', text: '#854D0E'};
      default:
        return {gradient: '#6B7280', bg: '#F3F4F6', text: '#374151'};
    }
  };

  const colors = getSeverityColor(alert.severity);

  // Get icon based on alert type
  const getIcon = () => {
    switch (alert.type) {
      case 'late-night-gaming':
        return '⏰';
      case 'rapid-friends':
        return '👥';
      case 'risky-group':
        return '🛡️';
      case 'out-of-age-gaming':
        return '⚠️';
      default:
        return '⚠️';
    }
  };

  // Format timestamp into readable date/time
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

  return (
    <View style={styles.container}>
      {/* ===== COLORED HEADER WITH ALERT INFO ===== */}
      <View style={[styles.header, {backgroundColor: colors.gradient}]}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          {/* Icon in rounded square */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{getIcon()}</Text>
          </View>
          
          <View style={styles.headerText}>
            {/* Severity badge */}
            <View style={[styles.severityBadge, {backgroundColor: colors.bg}]}>
              <Text style={[styles.severityText, {color: colors.text}]}>
                {alert.severity.toUpperCase()} SEVERITY
              </Text>
            </View>
            
            {/* Alert title */}
            <Text style={styles.title}>{alert.title}</Text>
            
            {/* Timestamp */}
            <Text style={styles.timestamp}>{formatTimestamp(alert.timestamp)}</Text>
          </View>
        </View>
      </View>

      {/* ===== SCROLLABLE CONTENT ===== */}
      <ScrollView style={styles.content}>
        
        {/* ===== DETAILS CARD ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details</Text>
          <Text style={styles.cardText}>{alert.message}</Text>
        </View>

        {/* ===== ADDITIONAL INFO (if available) ===== */}
        {alert.details && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Additional Information</Text>
            <View style={styles.detailsList}>
              {/* Loop through all details and display them */}
              {Object.entries(alert.details).map(([key, value]) => (
                <View key={key} style={styles.detailRow}>
                  {/* Format key: turn "gameRating" into "Game Rating" */}
                  <Text style={styles.detailLabel}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </Text>
                  {/* Handle arrays vs single values */}
                  <Text style={styles.detailValue}>
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ===== RECOMMENDATIONS CARD ===== */}
        <View style={styles.recommendCard}>
          <View style={styles.recommendHeader}>
            <Text style={styles.recommendIcon}>🛡️</Text>
            <Text style={styles.recommendTitle}>Recommended Actions</Text>
          </View>
          
          {/* Different recommendations based on alert type */}
          <View style={styles.recommendList}>
            {alert.type === 'late-night-gaming' && (
              <>
                <Text style={styles.recommendItem}>
                  • Discuss healthy gaming schedules with your child
                </Text>
                <Text style={styles.recommendItem}>
                  • Set device curfews or bedtime reminders
                </Text>
                <Text style={styles.recommendItem}>
                  • Ensure adequate sleep for their age group
                </Text>
              </>
            )}
            {alert.type === 'risky-group' && (
              <>
                <Text style={styles.recommendItem}>
                  • Review the group with your child
                </Text>
                <Text style={styles.recommendItem}>
                  • Explain dangers of "free Robux" scams
                </Text>
                <Text style={styles.recommendItem}>
                  • Consider leaving groups with suspicious activity
                </Text>
              </>
            )}
            {alert.type === 'rapid-friends' && (
              <>
                <Text style={styles.recommendItem}>
                  • Ask your child about their new friends
                </Text>
                <Text style={styles.recommendItem}>
                  • Review friend privacy settings together
                </Text>
                <Text style={styles.recommendItem}>
                  • Remind them about online stranger safety
                </Text>
              </>
            )}
            {alert.type === 'out-of-age-gaming' && (
              <>
                <Text style={styles.recommendItem}>
                  • Review the game's age rating and content
                </Text>
                <Text style={styles.recommendItem}>
                  • Decide if the content is appropriate for your child
                </Text>
                <Text style={styles.recommendItem}>
                  • Consider setting parental controls on Roblox
                </Text>
              </>
            )}
          </View>
        </View>

        {/* ===== ACTION BUTTONS ===== */}
        
        {/* Green "Mark as Resolved" button */}
        <TouchableOpacity style={styles.resolveButton}>
          <Text style={styles.resolveButtonText}>✓ Mark as Resolved</Text>
        </TouchableOpacity>

        {/* White "Remind Me Later" button */}
        <TouchableOpacity style={styles.laterButton}>
          <Text style={styles.laterButtonText}>Remind Me Later</Text>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={{height: 30}} />
      </ScrollView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 15,
  },
  backText: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 32,
  },
  headerText: {
    flex: 1,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  detailsList: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  recommendCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  recommendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  recommendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  recommendList: {
    gap: 8,
  },
  recommendItem: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  resolveButton: {
    backgroundColor: '#10B981',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resolveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  laterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  laterButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});