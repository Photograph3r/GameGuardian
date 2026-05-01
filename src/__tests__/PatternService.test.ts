import PatternService from '../services/PatternService';
import { Game, Friend, Group, Alert } from '../types';

// ===== MOCK DATA FOR TESTS =====

const mockLateNightAlerts: Alert[] = [
  {
    id: 'a1', type: 'late-night-gaming', severity: 'high',
    timestamp: '2026-04-27T02:00:00Z',
    title: 'Late Night Gaming', message: 'Gaming at 2AM',
    isRead: false,
  },
  {
    id: 'a2', type: 'late-night-gaming', severity: 'high',
    timestamp: '2026-04-26T01:00:00Z',
    title: 'Late Night Gaming', message: 'Gaming at 1AM',
    isRead: false,
  },
  {
    id: 'a3', type: 'late-night-gaming', severity: 'high',
    timestamp: '2026-04-25T03:00:00Z',
    title: 'Late Night Gaming', message: 'Gaming at 3AM',
    isRead: false,
  },
];

const mockNewFriends: Friend[] = [
  { id: 'f1', username: 'User1', addedDate: '1 day ago', status: 'new' },
  { id: 'f2', username: 'User2', addedDate: '2 days ago', status: 'new' },
  { id: 'f3', username: 'User3', addedDate: '3 days ago', status: 'new' },
  { id: 'f4', username: 'User4', addedDate: '4 days ago', status: 'new' },
];

const mockRiskyGroups: Group[] = [
  {
    id: 'g1', name: 'Free Robux', description: 'Get free robux',
    memberCount: 5000, isRisky: true,
    riskKeywords: ['free robux'],
  },
  {
    id: 'g2', name: 'Safe Group', description: 'Safe community',
    memberCount: 10000, isRisky: false,
  },
];

const mockGames: Game[] = [
  { id: 'game1', name: 'Blox Fruits', creator: 'Test', icon: '🍈', genre: 'Fighting', ageRating: '13+', lastPlayed: '1 day ago', playtime: 120 },
  { id: 'game2', name: 'Adopt Me', creator: 'Test', icon: '🏠', genre: 'Role-Playing', ageRating: 'All Ages', lastPlayed: '2 days ago', playtime: 60 },
  { id: 'game3', name: 'Murder Mystery', creator: 'Test', icon: '🔪', genre: 'Horror', ageRating: '13+', lastPlayed: '3 days ago', playtime: 90 },
  { id: 'game4', name: 'Doors', creator: 'Test', icon: '🚪', genre: 'Horror', ageRating: '9+', lastPlayed: '4 days ago', playtime: 45 },
];

// ===== TESTS =====

describe('PatternService', () => {

  // ===== checkLateNightGaming =====
  describe('checkLateNightGaming', () => {
    test('returns high severity when 3 or more late night alerts', () => {
      const result = PatternService.checkLateNightGaming(mockLateNightAlerts);
      expect(result.detected).toBe(true);
      expect(result.severity).toBe('high');
    });

    test('returns medium severity for 1-2 late night alerts', () => {
      const result = PatternService.checkLateNightGaming([mockLateNightAlerts[0]]);
      expect(result.detected).toBe(true);
      expect(result.severity).toBe('medium');
    });

    test('returns not detected when no late night alerts', () => {
      const result = PatternService.checkLateNightGaming([]);
      expect(result.detected).toBe(false);
    });
  });

  // ===== checkRapidFriends =====
  describe('checkRapidFriends', () => {
    test('detects rapid friend additions when 3 or more new friends', () => {
      const result = PatternService.checkRapidFriends(mockNewFriends);
      expect(result.detected).toBe(true);
    });

    test('returns high severity when 5 or more new friends', () => {
      const manyFriends = [...mockNewFriends,
        { id: 'f5', username: 'User5', addedDate: '5 days ago', status: 'new' as const },
      ];
      const result = PatternService.checkRapidFriends(manyFriends);
      expect(result.severity).toBe('high');
    });

    test('does not detect when fewer than 3 new friends', () => {
      const result = PatternService.checkRapidFriends([mockNewFriends[0]]);
      expect(result.detected).toBe(false);
    });
  });

  // ===== checkRiskyGroups =====
  describe('checkRiskyGroups', () => {
    test('detects risky groups when at least one exists', () => {
      const result = PatternService.checkRiskyGroups(mockRiskyGroups);
      expect(result.detected).toBe(true);
    });

    test('returns high severity when 2 or more risky groups', () => {
      const twoRisky: Group[] = [
        { id: 'g1', name: 'Risky1', description: 'bad', memberCount: 100, isRisky: true, riskKeywords: ['scam'] },
        { id: 'g2', name: 'Risky2', description: 'bad', memberCount: 200, isRisky: true, riskKeywords: ['hack'] },
      ];
      const result = PatternService.checkRiskyGroups(twoRisky);
      expect(result.severity).toBe('high');
    });

    test('does not detect when no risky groups', () => {
      const safeGroups: Group[] = [
        { id: 'g1', name: 'Safe', description: 'safe', memberCount: 1000, isRisky: false },
      ];
      const result = PatternService.checkRiskyGroups(safeGroups);
      expect(result.detected).toBe(false);
    });
  });

  // ===== checkAgeInappropriate =====
  describe('checkAgeInappropriate', () => {
    test('detects age-inappropriate games for a 10-year-old', () => {
      const result = PatternService.checkAgeInappropriate(mockGames, 10);
      expect(result.detected).toBe(true);
    });

    test('does not flag age-appropriate games', () => {
      const safeGames: Game[] = [
        { id: 'g1', name: 'Adopt Me', creator: 'Test', icon: '🏠', genre: 'RP', ageRating: 'All Ages', lastPlayed: 'today', playtime: 30 },
      ];
      const result = PatternService.checkAgeInappropriate(safeGames, 10);
      expect(result.detected).toBe(false);
    });
  });

  // ===== checkExcessivePlaytime =====
  describe('checkExcessivePlaytime', () => {
    test('detects excessive playtime over 300 minutes', () => {
      const result = PatternService.checkExcessivePlaytime(mockGames);
      expect(result.detected).toBe(true);
    });

    test('does not detect when playtime is under threshold', () => {
      const lowPlaytimeGames: Game[] = [
        { id: 'g1', name: 'Adopt Me', creator: 'Test', icon: '🏠', genre: 'RP', ageRating: 'All Ages', lastPlayed: 'today', playtime: 30 },
      ];
      const result = PatternService.checkExcessivePlaytime(lowPlaytimeGames);
      expect(result.detected).toBe(false);
    });
  });

  // ===== calculateRiskScore =====
  describe('calculateRiskScore', () => {
    test('returns 0 when no patterns detected', () => {
      const score = PatternService.calculateRiskScore([]);
      expect(score).toBe(0);
    });

    test('caps score at 100', () => {
      const manyHighPatterns = Array(10).fill({
        type: 'test', severity: 'high' as const,
        title: 'Test', message: 'Test', detected: true,
      });
      const score = PatternService.calculateRiskScore(manyHighPatterns);
      expect(score).toBeLessThanOrEqual(100);
    });

    test('high severity pattern adds 25 points', () => {
      const patterns = [{
        type: 'test', severity: 'high' as const,
        title: 'Test', message: 'Test', detected: true,
      }];
      const score = PatternService.calculateRiskScore(patterns);
      expect(score).toBe(25);
    });
  });

  // ===== getRiskLevel =====
  describe('getRiskLevel', () => {
    test('returns No Concerns for score of 0', () => {
      const level = PatternService.getRiskLevel(0);
      expect(level.label).toBe('No Concerns');
    });

    test('returns High Risk for score of 70 or above', () => {
      const level = PatternService.getRiskLevel(70);
      expect(level.label).toBe('High Risk');
    });

    test('returns Medium Risk for score between 40 and 69', () => {
      const level = PatternService.getRiskLevel(50);
      expect(level.label).toBe('Medium Risk');
    });

    test('returns Low Risk for score between 1 and 39', () => {
      const level = PatternService.getRiskLevel(20);
      expect(level.label).toBe('Low Risk');
    });
  });

  // ===== analyzeAll =====
  describe('analyzeAll', () => {
    test('returns array of detected patterns', () => {
      const results = PatternService.analyzeAll(
        mockGames,
        mockNewFriends,
        mockRiskyGroups,
        mockLateNightAlerts,
      );
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    test('all returned patterns have detected = true', () => {
      const results = PatternService.analyzeAll(
        mockGames, mockNewFriends, mockRiskyGroups, mockLateNightAlerts,
      );
      results.forEach(pattern => {
        expect(pattern.detected).toBe(true);
      });
    });
  });
});