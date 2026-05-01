import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import ApiService from '../services/ApiService';
import { LoadingState, ErrorState, EmptyState } from '../components/SharedStates';
import { Game, Friend, Group } from '../types';
import { useTheme } from '../context/ThemeContext';

type TabType = 'games' | 'friends' | 'groups';

export default function ActivityScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('games');
  const [games, setGames] = useState<Game[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [gamesData, friendsData, groupsData] = await Promise.all([
        ApiService.getGames(),
        ApiService.getFriends(),
        ApiService.getGroups(),
      ]);
      setGames(gamesData);
      setFriends(friendsData);
      setGroups(groupsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load activity data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingState message="Loading activity..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const renderGames = () => {
    if (games.length === 0) {
      return <EmptyState icon="🎮" title="No Games Yet" message="Game activity will appear here" />;
    }
    return games.map(game => (
      <View key={game.id} style={[styles.gameCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <View style={[styles.gameIcon, { backgroundColor: colors.primary }]}>
          <Text style={styles.gameIconText}>{game.icon}</Text>
        </View>
        <View style={styles.gameInfo}>
          <Text style={[styles.gameName, { color: colors.text }]}>{game.name}</Text>
          <Text style={[styles.gameCreator, { color: colors.textSecondary }]}>by {game.creator}</Text>
          <View style={styles.gameTags}>
            <View style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.tagText, { color: colors.primary }]}>{game.genre}</Text>
            </View>
            <View style={[
              styles.tag,
              game.ageRating === '13+' ? styles.tagOrange :
              game.ageRating === '9+' ? styles.tagYellow : styles.tagGreen,
            ]}>
              <Text style={[
                styles.tagText,
                game.ageRating === '13+' ? styles.tagTextOrange :
                game.ageRating === '9+' ? styles.tagTextYellow : styles.tagTextGreen,
              ]}>
                {game.ageRating}
              </Text>
            </View>
          </View>
          <View style={styles.gameStats}>
            <Text style={[styles.statText, { color: colors.textSecondary }]}>⏱️ {game.playtime} min</Text>
            <Text style={[styles.separator, { color: colors.surfaceBorder }]}>•</Text>
            <Text style={[styles.statText, { color: colors.textSecondary }]}>{game.lastPlayed}</Text>
          </View>
        </View>
      </View>
    ));
  };

  const renderFriends = () => {
    if (friends.length === 0) {
      return <EmptyState icon="👥" title="No Friends Data" message="Friend activity will appear here" />;
    }
    return friends.map(friend => (
      <View key={friend.id} style={[styles.friendCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <View style={[
          styles.friendAvatar,
          { backgroundColor: friend.status === 'new' ? '#8B5CF6' : '#6B7280' },
        ]}>
          <Text style={styles.friendAvatarText}>
            {friend.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.friendInfo}>
          <Text style={[styles.friendName, { color: colors.text }]}>{friend.username}</Text>
          <Text style={[styles.friendDate, { color: colors.textSecondary }]}>Added {friend.addedDate}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          friend.status === 'new' ? styles.statusNew : { backgroundColor: colors.surface },
        ]}>
          <Text style={[
            styles.statusText,
            friend.status === 'new' ? styles.statusTextNew : { color: colors.textSecondary },
          ]}>
            {friend.status === 'new' ? 'NEW' : 'FRIEND'}
          </Text>
        </View>
      </View>
    ));
  };

  const renderGroups = () => {
    if (groups.length === 0) {
      return <EmptyState icon="👥" title="No Groups Data" message="Group activity will appear here" />;
    }
    return groups.map(group => (
      <TouchableOpacity
        key={group.id}
        style={[
          styles.groupCard,
          { backgroundColor: colors.cardBg, borderColor: group.isRisky ? '#FCA5A5' : colors.cardBorder },
          group.isRisky && styles.groupCardRisky,
        ]}
        onPress={() => navigation.navigate('GroupDetail', { group })}>
        <View style={styles.groupHeader}>
          <View style={[
            styles.groupIcon,
            { backgroundColor: group.isRisky ? '#FEE2E2' : colors.primaryLight },
          ]}>
            <Text style={styles.groupIconText}>{group.isRisky ? '⚠️' : '👥'}</Text>
          </View>
          <View style={styles.groupInfo}>
            <Text style={[styles.groupName, { color: colors.text }]}>{group.name}</Text>
            <Text style={[styles.groupMembers, { color: colors.textSecondary }]}>
              {group.memberCount.toLocaleString()} members
            </Text>
          </View>
          {group.isRisky && (
            <View style={styles.riskyBadge}>
              <Text style={styles.riskyText}>RISKY</Text>
            </View>
          )}
          <Text style={[styles.groupArrow, { color: colors.textMuted }]}>›</Text>
        </View>
        <Text style={[styles.groupDesc, { color: colors.textSecondary }]}>{group.description}</Text>
        {group.isRisky && group.riskKeywords && (
          <View style={styles.keywordsContainer}>
            <Text style={styles.keywordsLabel}>Flagged keywords:</Text>
            <View style={styles.keywordTags}>
              {group.riskKeywords.map((kw, i) => (
                <View key={i} style={styles.keywordTag}>
                  <Text style={styles.keywordText}>{kw}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </TouchableOpacity>
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.surfaceBorder }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.text }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Activity</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.surfaceBorder }]}>
        {([
          { key: 'games' as TabType, label: 'Games', count: games.length },
          { key: 'friends' as TabType, label: 'Friends', count: friends.length },
          { key: 'groups' as TabType, label: 'Groups', count: groups.length },
        ]).map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              { backgroundColor: activeTab === tab.key ? colors.primary : colors.background },
            ]}
            onPress={() => setActiveTab(tab.key)}>
            <Text style={[
              styles.tabText,
              { color: activeTab === tab.key ? '#FFFFFF' : colors.textSecondary },
            ]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {activeTab === 'games' && renderGames()}
        {activeTab === 'friends' && renderFriends()}
        {activeTab === 'groups' && renderGroups()}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
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
  tabs: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 8, borderBottomWidth: 1 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  tabText: { fontSize: 14, fontWeight: '500' },
  content: { flex: 1, padding: 20 },

  // Games
  gameCard: {
    borderRadius: 15, padding: 15, flexDirection: 'row', marginBottom: 12, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  gameIcon: { width: 64, height: 64, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  gameIconText: { fontSize: 32 },
  gameInfo: { flex: 1 },
  gameName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  gameCreator: { fontSize: 14, marginBottom: 8 },
  gameTags: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  tagGreen: { backgroundColor: '#D1FAE5' },
  tagYellow: { backgroundColor: '#FEF3C7' },
  tagOrange: { backgroundColor: '#FED7AA' },
  tagText: { fontSize: 11, fontWeight: '600' },
  tagTextGreen: { color: '#065F46' },
  tagTextYellow: { color: '#854D0E' },
  tagTextOrange: { color: '#9A3412' },
  gameStats: { flexDirection: 'row', alignItems: 'center' },
  statText: { fontSize: 14 },
  separator: { marginHorizontal: 8 },

  // Friends
  friendCard: {
    borderRadius: 15, padding: 15, flexDirection: 'row',
    alignItems: 'center', marginBottom: 12, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  friendAvatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  friendAvatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  friendInfo: { flex: 1 },
  friendName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  friendDate: { fontSize: 14 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusNew: { backgroundColor: '#EDE9FE' },
  statusText: { fontSize: 10, fontWeight: '700' },
  statusTextNew: { color: '#7C3AED' },

  // Groups
  groupCard: {
    borderRadius: 15, padding: 15, marginBottom: 12, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  groupCardRisky: { borderWidth: 2 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  groupIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  groupIconText: { fontSize: 22 },
  groupInfo: { flex: 1 },
  groupName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  groupMembers: { fontSize: 13 },
  riskyBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  riskyText: { color: '#991B1B', fontSize: 10, fontWeight: '700' },
  groupArrow: { fontSize: 24, marginLeft: 8 },
  groupDesc: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  keywordsContainer: { marginTop: 4 },
  keywordsLabel: { fontSize: 12, color: '#991B1B', fontWeight: '600', marginBottom: 6 },
  keywordTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  keywordTag: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  keywordText: { fontSize: 11, color: '#991B1B', fontWeight: '500' },
});