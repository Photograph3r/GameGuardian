import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import ApiService from '../services/ApiService';
import PatternService from '../services/PatternService';
import { LoadingState, ErrorState } from '../components/SharedStates';
import { Game, Friend, Group, Alert, ActivitySummary } from '../types';

export default function AnalyticsDashboardScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<ActivitySummary | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [gamesData, friendsData, groupsData, alertsData, summaryData] = await Promise.all([
        ApiService.getGames(),
        ApiService.getFriends(),
        ApiService.getGroups(),
        ApiService.getAlerts(),
        ApiService.getActivitySummary(),
      ]);
      setGames(gamesData);
      setFriends(friendsData);
      setGroups(groupsData);
      setAlerts(alertsData);
      setSummary(summaryData);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Analyzing patterns..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  // Run pattern detection
  const patterns = PatternService.analyzeAll(games, friends, groups, alerts);
  const riskScore = PatternService.calculateRiskScore(patterns);
  const riskLevel = PatternService.getRiskLevel(riskScore);

  // Stats
  const totalPlaytime = games.reduce((sum, g) => sum + g.playtime, 0);
  const newFriendsCount = friends.filter(f => f.status === 'new').length;
  const riskyGroupCount = groups.filter(g => g.isRisky).length;
  const unreadAlerts = alerts.filter(a => !a.isRead).length;
  const highAlerts = alerts.filter(a => a.severity === 'high').length;
  const mediumAlerts = alerts.filter(a => a.severity === 'medium').length;
  const lowAlerts = alerts.filter(a => a.severity === 'low').length;

  // Top games by playtime
  const topGames = [...games].sort((a, b) => b.playtime - a.playtime).slice(0, 5);

  // Genre breakdown
  const genres: Record<string, number> = {};
  games.forEach(g => {
    genres[g.genre] = (genres[g.genre] || 0) + g.playtime;
  });
  const genreList = Object.entries(genres).sort((a, b) => b[1] - a[1]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Risk Score */}
        <View style={styles.riskCard}>
          <Text style={styles.riskLabel}>Safety Risk Score</Text>
          <View style={styles.riskScoreRow}>
            <Text style={[styles.riskScore, { color: riskLevel.color }]}>{riskScore}</Text>
            <Text style={styles.riskOutOf}>/100</Text>
          </View>
          <View style={styles.riskBarBg}>
            <View style={[styles.riskBarFill, { width: `${riskScore}%`, backgroundColor: riskLevel.color }]} />
          </View>
          <Text style={[styles.riskLevelText, { color: riskLevel.color }]}>{riskLevel.label}</Text>
        </View>

        {/* Pattern Detection Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pattern Detection ({patterns.length} found)</Text>
          {patterns.length === 0 ? (
            <View style={styles.noPatterns}>
              <Text style={styles.noPatternsIcon}>✅</Text>
              <Text style={styles.noPatternsText}>No concerning patterns detected</Text>
            </View>
          ) : (
            patterns.map((pattern, index) => (
              <View key={index} style={styles.patternCard}>
                <View style={[
                  styles.patternSeverity,
                  {
                    backgroundColor: pattern.severity === 'high' ? '#FEE2E2'
                      : pattern.severity === 'medium' ? '#FED7AA' : '#FEF3C7'
                  }
                ]}>
                  <Text style={[
                    styles.patternSeverityText,
                    {
                      color: pattern.severity === 'high' ? '#991B1B'
                        : pattern.severity === 'medium' ? '#9A3412' : '#854D0E'
                    }
                  ]}>
                    {pattern.severity.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.patternTitle}>{pattern.title}</Text>
                <Text style={styles.patternMessage}>{pattern.message}</Text>
              </View>
            ))
          )}
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatIcon}>⏱️</Text>
              <Text style={styles.miniStatValue}>{Math.floor(totalPlaytime / 60)}h {totalPlaytime % 60}m</Text>
              <Text style={styles.miniStatLabel}>Total Playtime</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatIcon}>🎮</Text>
              <Text style={styles.miniStatValue}>{games.length}</Text>
              <Text style={styles.miniStatLabel}>Games Played</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatIcon}>👥</Text>
              <Text style={styles.miniStatValue}>{newFriendsCount}</Text>
              <Text style={styles.miniStatLabel}>New Friends</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatIcon}>⚠️</Text>
              <Text style={styles.miniStatValue}>{riskyGroupCount}</Text>
              <Text style={styles.miniStatLabel}>Risky Groups</Text>
            </View>
          </View>
        </View>

        {/* Alert Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alert Breakdown</Text>
          <View style={styles.alertBreakdown}>
            <View style={styles.alertBreakdownRow}>
              <View style={[styles.alertDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.alertBreakdownLabel}>High Severity</Text>
              <Text style={styles.alertBreakdownCount}>{highAlerts}</Text>
            </View>
            <View style={styles.alertBreakdownRow}>
              <View style={[styles.alertDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.alertBreakdownLabel}>Medium Severity</Text>
              <Text style={styles.alertBreakdownCount}>{mediumAlerts}</Text>
            </View>
            <View style={styles.alertBreakdownRow}>
              <View style={[styles.alertDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.alertBreakdownLabel}>Low Severity</Text>
              <Text style={styles.alertBreakdownCount}>{lowAlerts}</Text>
            </View>
            <View style={[styles.alertBreakdownRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.alertDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.alertBreakdownLabel}>Unread</Text>
              <Text style={styles.alertBreakdownCount}>{unreadAlerts}</Text>
            </View>
          </View>
        </View>

        {/* Top Games */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Games by Playtime</Text>
          <View style={styles.card}>
            {topGames.map((game, index) => {
              const maxTime = topGames[0].playtime;
              const barWidth = (game.playtime / maxTime) * 100;
              return (
                <View key={game.id} style={styles.topGameRow}>
                  <Text style={styles.topGameRank}>#{index + 1}</Text>
                  <Text style={styles.topGameIcon}>{game.icon}</Text>
                  <View style={styles.topGameInfo}>
                    <Text style={styles.topGameName}>{game.name}</Text>
                    <View style={styles.topGameBarBg}>
                      <View style={[styles.topGameBarFill, { width: `${barWidth}%` }]} />
                    </View>
                  </View>
                  <Text style={styles.topGameTime}>{game.playtime}m</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Genre Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genre Breakdown</Text>
          <View style={styles.card}>
            {genreList.map(([genre, minutes]) => (
              <View key={genre} style={styles.genreRow}>
                <Text style={styles.genreName}>{genre}</Text>
                <Text style={styles.genreTime}>{Math.floor(minutes / 60)}h {minutes % 60}m</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Chart */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Activity</Text>
            <View style={styles.card}>
              <View style={styles.chartBars}>
                {summary.chartData.map((day, index) => {
                  const maxMin = Math.max(...summary.chartData.map(d => d.minutes));
                  const height = maxMin > 0 ? (day.minutes / maxMin) * 100 : 5;
                  return (
                    <View key={index} style={styles.barContainer}>
                      <Text style={styles.barValue}>{day.minutes > 0 ? day.minutes : ''}</Text>
                      <View style={[styles.bar, { height, backgroundColor: day.minutes > 0 ? '#4F46E5' : '#E5E7EB' }]} />
                      <Text style={styles.barLabel}>{day.day}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
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
  riskCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, marginBottom: 20,
    alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  riskLabel: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  riskScoreRow: { flexDirection: 'row', alignItems: 'baseline' },
  riskScore: { fontSize: 56, fontWeight: 'bold' },
  riskOutOf: { fontSize: 20, color: '#9CA3AF', marginLeft: 4 },
  riskBarBg: { width: '100%', height: 10, backgroundColor: '#E5E7EB', borderRadius: 5, marginTop: 16, overflow: 'hidden' },
  riskBarFill: { height: '100%', borderRadius: 5 },
  riskLevelText: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 15, padding: 16, borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  noPatterns: { alignItems: 'center', padding: 20 },
  noPatternsIcon: { fontSize: 36, marginBottom: 8 },
  noPatternsText: { fontSize: 16, color: '#10B981', fontWeight: '500' },
  patternCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  patternSeverity: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  patternSeverityText: { fontSize: 10, fontWeight: '700' },
  patternTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  patternMessage: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  miniStat: {
    width: '48%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB',
  },
  miniStatIcon: { fontSize: 24, marginBottom: 6 },
  miniStatValue: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  miniStatLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  alertBreakdown: {
    backgroundColor: '#FFFFFF', borderRadius: 15, overflow: 'hidden',
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  alertBreakdownRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  alertDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  alertBreakdownLabel: { flex: 1, fontSize: 15, color: '#374151' },
  alertBreakdownCount: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  topGameRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  topGameRank: { fontSize: 14, fontWeight: '600', color: '#9CA3AF', width: 30 },
  topGameIcon: { fontSize: 24, marginRight: 10 },
  topGameInfo: { flex: 1, marginRight: 10 },
  topGameName: { fontSize: 14, fontWeight: '500', color: '#1F2937', marginBottom: 4 },
  topGameBarBg: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  topGameBarFill: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 3 },
  topGameTime: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  genreRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  genreName: { fontSize: 15, color: '#374151' },
  genreTime: { fontSize: 15, fontWeight: '500', color: '#1F2937' },
  chartBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, marginBottom: 8 },
  barContainer: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barValue: { fontSize: 10, color: '#4F46E5', fontWeight: '600', marginBottom: 4 },
  bar: { width: 20, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  barLabel: { fontSize: 10, color: '#6B7280', marginTop: 4 },
});