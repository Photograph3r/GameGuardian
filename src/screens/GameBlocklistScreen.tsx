import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ALL_GAMES = [
  { id: 'game-001', name: 'Adopt Me!', icon: '🏠', genre: 'Role-Playing', ageRating: 'All Ages' },
  { id: 'game-002', name: 'Brookhaven RP', icon: '🏘️', genre: 'Town & City', ageRating: 'All Ages' },
  { id: 'game-003', name: 'Tower of Hell', icon: '🗼', genre: 'Platformer', ageRating: '9+' },
  { id: 'game-004', name: 'Blox Fruits', icon: '🍈', genre: 'Fighting', ageRating: '13+' },
  { id: 'game-005', name: 'Rainbow Friends', icon: '🌈', genre: 'Horror', ageRating: '9+' },
  { id: 'game-006', name: 'Murder Mystery 2', icon: '🔪', genre: 'Horror', ageRating: '13+' },
  { id: 'game-007', name: 'Doors', icon: '🚪', genre: 'Horror', ageRating: '9+' },
  { id: 'game-008', name: 'Pet Simulator X', icon: '🐾', genre: 'Simulator', ageRating: 'All Ages' },
  { id: 'game-009', name: 'Arsenal', icon: '🔫', genre: 'Shooter', ageRating: '13+' },
  { id: 'game-010', name: 'Natural Disaster Survival', icon: '🌪️', genre: 'Survival', ageRating: 'All Ages' },
];

export default function GameBlocklistScreen({ navigation }: any) {
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [blockByAge, setBlockByAge] = useState(false);

  useEffect(() => {
    loadBlocklist();
  }, []);

  const loadBlocklist = async () => {
    try {
      const data = await AsyncStorage.getItem('@gameguardian_blocklist');
      if (data) {
        const parsed = JSON.parse(data);
        setBlockedIds(parsed.blockedIds || []);
        setBlockByAge(parsed.blockByAge || false);
      }
    } catch {}
  };

  const saveBlocklist = async (ids: string[], ageBlock: boolean) => {
    try {
      await AsyncStorage.setItem('@gameguardian_blocklist', JSON.stringify({
        blockedIds: ids,
        blockByAge: ageBlock,
      }));
    } catch {}
  };

  const toggleGame = (gameId: string) => {
    const newList = blockedIds.includes(gameId)
      ? blockedIds.filter(id => id !== gameId)
      : [...blockedIds, gameId];
    setBlockedIds(newList);
    saveBlocklist(newList, blockByAge);
  };

  const toggleAgeBlock = () => {
    const newVal = !blockByAge;
    setBlockByAge(newVal);
    if (newVal) {
      const ageBlockedIds = ALL_GAMES
        .filter(g => g.ageRating === '13+')
        .map(g => g.id);
      const merged = [...new Set([...blockedIds, ...ageBlockedIds])];
      setBlockedIds(merged);
      saveBlocklist(merged, newVal);
    } else {
      saveBlocklist(blockedIds, newVal);
    }
  };

  const isBlocked = (gameId: string) => blockedIds.includes(gameId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game Blocklist</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Auto-block by age */}
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleContent}>
              <Text style={styles.toggleTitle}>Auto-Block 13+ Games</Text>
              <Text style={styles.toggleDesc}>Automatically block games rated 13+ for Emma (age 10)</Text>
            </View>
            <Switch
              value={blockByAge}
              onValueChange={toggleAgeBlock}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={blockByAge ? '#3B82F6' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{blockedIds.length}</Text>
            <Text style={styles.statLabel}>Blocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{ALL_GAMES.length - blockedIds.length}</Text>
            <Text style={styles.statLabel}>Allowed</Text>
          </View>
        </View>

        {/* Game List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>All Games</Text>
          <Text style={styles.cardDesc}>Tap to block or unblock a game</Text>

          {ALL_GAMES.map(game => {
            const blocked = isBlocked(game.id);
            return (
              <TouchableOpacity
                key={game.id}
                style={[styles.gameRow, blocked && styles.gameRowBlocked]}
                onPress={() => toggleGame(game.id)}>
                <View style={styles.gameIcon}>
                  <Text style={styles.gameIconText}>{game.icon}</Text>
                </View>
                <View style={styles.gameInfo}>
                  <Text style={[styles.gameName, blocked && styles.gameNameBlocked]}>{game.name}</Text>
                  <View style={styles.gameTags}>
                    <Text style={styles.gameGenre}>{game.genre}</Text>
                    <View style={[
                      styles.ageBadge,
                      game.ageRating === '13+' && styles.ageBadgeWarning,
                    ]}>
                      <Text style={[
                        styles.ageText,
                        game.ageRating === '13+' && styles.ageTextWarning,
                      ]}>{game.ageRating}</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.statusBadge, blocked ? styles.statusBlocked : styles.statusAllowed]}>
                  <Text style={[styles.statusText, blocked ? styles.statusTextBlocked : styles.statusTextAllowed]}>
                    {blocked ? '🚫 Blocked' : '✅ Allowed'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Blocked games will trigger an alert if your child attempts to play them. The game will still be accessible on Roblox but you will be notified.
          </Text>
        </View>

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
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 15, padding: 20, marginBottom: 15,
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  toggleRow: { flexDirection: 'row', alignItems: 'center' },
  toggleContent: { flex: 1 },
  toggleTitle: { fontSize: 16, fontWeight: '500', color: '#1F2937', marginBottom: 4 },
  toggleDesc: { fontSize: 14, color: '#6B7280' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 15 },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 15, padding: 15,
    alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB',
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  statLabel: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  gameRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  gameRowBlocked: { opacity: 0.7 },
  gameIcon: {
    width: 44, height: 44, borderRadius: 10, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  gameIconText: { fontSize: 24 },
  gameInfo: { flex: 1 },
  gameName: { fontSize: 15, fontWeight: '500', color: '#1F2937', marginBottom: 4 },
  gameNameBlocked: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  gameTags: { flexDirection: 'row', gap: 6 },
  gameGenre: { fontSize: 12, color: '#6B7280' },
  ageBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ageBadgeWarning: { backgroundColor: '#FED7AA' },
  ageText: { fontSize: 10, fontWeight: '600', color: '#065F46' },
  ageTextWarning: { color: '#9A3412' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  statusBlocked: { backgroundColor: '#FEE2E2' },
  statusAllowed: { backgroundColor: '#D1FAE5' },
  statusText: { fontSize: 11, fontWeight: '600' },
  statusTextBlocked: { color: '#991B1B' },
  statusTextAllowed: { color: '#065F46' },
  infoBox: {
    flexDirection: 'row', backgroundColor: '#EFF6FF', borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: '#BFDBFE',
  },
  infoIcon: { fontSize: 16, marginRight: 8, marginTop: 2 },
  infoText: { fontSize: 13, color: '#1E40AF', lineHeight: 18, flex: 1 },
});