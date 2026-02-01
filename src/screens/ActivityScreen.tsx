
// ACTIVITY SCREEN
// Shows games, friends, and groups
// Has tabs to switch between different views

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {mockGames} from '../data/mockData';

export default function ActivityScreen({navigation}: any) {
  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Activity</Text>
        
        {/* Empty view for centering the title */}
        <View style={{width: 40}} />
      </View>

      {/* ===== TABS ===== */}
      {/* Note: In a real app, these would be functional tabs */}
      {/* For now, "Games" is always active */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabTextActive}>Games</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Groups</Text>
        </TouchableOpacity>
      </View>

      {/* ===== GAMES LIST ===== */}
      <ScrollView style={styles.content}>
        {/* Loop through each game and display it */}
        {mockGames.map(game => (
          <View key={game.id} style={styles.gameCard}>
            {/* Game icon with colored background */}
            <View style={styles.gameIcon}>
              <Text style={styles.gameIconText}>{game.icon}</Text>
            </View>

            {/* Game information */}
            <View style={styles.gameInfo}>
              {/* Game name */}
              <Text style={styles.gameName}>{game.name}</Text>
              
              {/* Creator name */}
              <Text style={styles.gameCreator}>by {game.creator}</Text>

              {/* Tags for genre and age rating */}
              <View style={styles.gameTags}>
                {/* Genre tag (always blue) */}
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{game.genre}</Text>
                </View>
                
                {/* Age rating tag (green for All Ages, orange for 13+) */}
                <View
                  style={[
                    styles.tag,
                    game.ageRating === '13+'
                      ? styles.tagOrange
                      : styles.tagGreen,
                  ]}>
                  <Text
                    style={[
                      styles.tagText,
                      game.ageRating === '13+'
                        ? styles.tagTextOrange
                        : styles.tagTextGreen,
                    ]}>
                    {game.ageRating}
                  </Text>
                </View>
              </View>

              {/* Game statistics */}
              <View style={styles.gameStats}>
                <Text style={styles.statText}>⏱️ {game.playtime} min</Text>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.statText}>{game.lastPlayed}</Text>
              </View>
            </View>
          </View>
        ))}
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
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 32,
    color: '#374151',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  gameIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  gameIconText: {
    fontSize: 32,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  gameCreator: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  gameTags: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagGreen: {
    backgroundColor: '#D1FAE5',
  },
  tagOrange: {
    backgroundColor: '#FED7AA',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E40AF',
  },
  tagTextGreen: {
    color: '#065F46',
  },
  tagTextOrange: {
    color: '#9A3412',
  },
  gameStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
  },
  separator: {
    marginHorizontal: 8,
    color: '#D1D5DB',
  },
});