import { Alert, Game, Friend, Group } from '../types';

interface PatternResult {
  type: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  detected: boolean;
}

const PatternService = {
  // Run all pattern checks against the data
  analyzeAll: (
    games: Game[],
    friends: Friend[],
    groups: Group[],
    alerts: Alert[],
  ): PatternResult[] => {
    const results: PatternResult[] = [];

    results.push(PatternService.checkLateNightGaming(alerts));
    results.push(PatternService.checkRapidFriends(friends));
    results.push(PatternService.checkRiskyGroups(groups));
    results.push(PatternService.checkAgeInappropriate(games, 10));
    results.push(PatternService.checkExcessivePlaytime(games));
    results.push(PatternService.checkHorrorGames(games, 10));

    return results.filter(r => r.detected);
  },

  // Pattern 1: Late night gaming
  // Flags if any alerts show gaming after 10 PM
  checkLateNightGaming: (alerts: Alert[]): PatternResult => {
    const lateNightAlerts = alerts.filter(a => a.type === 'late-night-gaming');
    const count = lateNightAlerts.length;
    return {
      type: 'late-night-pattern',
      severity: count >= 3 ? 'high' : count >= 1 ? 'medium' : 'low',
      title: 'Late Night Gaming Pattern',
      message: `Detected ${count} late night gaming session${count !== 1 ? 's' : ''} this week. Consider setting quiet hours.`,
      detected: count > 0,
    };
  },

  // Pattern 2: Rapid friend additions
  // Flags if 3+ new friends added recently
  checkRapidFriends: (friends: Friend[]): PatternResult => {
    const newFriends = friends.filter(f => f.status === 'new');
    const count = newFriends.length;
    return {
      type: 'rapid-friend-pattern',
      severity: count >= 5 ? 'high' : count >= 3 ? 'medium' : 'low',
      title: 'Rapid Friend Additions',
      message: `${count} new friend${count !== 1 ? 's' : ''} added recently. This may indicate contact from unknown users.`,
      detected: count >= 3,
    };
  },

  // Pattern 3: Risky group membership
  // Flags if child is in any risky groups
  checkRiskyGroups: (groups: Group[]): PatternResult => {
    const risky = groups.filter(g => g.isRisky);
    const count = risky.length;
    const names = risky.map(g => g.name).join(', ');
    return {
      type: 'risky-group-pattern',
      severity: count >= 2 ? 'high' : 'medium',
      title: 'Risky Group Memberships',
      message: `Child is a member of ${count} flagged group${count !== 1 ? 's' : ''}: ${names}. Review these groups for scam keywords.`,
      detected: count > 0,
    };
  },

  // Pattern 4: Age-inappropriate gaming
  // Flags games rated above child's age
  checkAgeInappropriate: (games: Game[], childAge: number): PatternResult => {
    const inappropriate = games.filter(g => {
      if (g.ageRating === '13+' && childAge < 13) return true;
      if (g.ageRating === '9+' && childAge < 9) return true;
      return false;
    });
    const count = inappropriate.length;
    const names = inappropriate.map(g => `${g.name} (${g.ageRating})`).join(', ');
    return {
      type: 'age-inappropriate-pattern',
      severity: count >= 3 ? 'high' : count >= 1 ? 'medium' : 'low',
      title: 'Age-Inappropriate Games',
      message: `${count} game${count !== 1 ? 's' : ''} above age rating: ${names}`,
      detected: count > 0,
    };
  },

  // Pattern 5: Excessive total playtime
  // Flags if total weekly playtime exceeds threshold
  checkExcessivePlaytime: (games: Game[]): PatternResult => {
    const totalMinutes = games.reduce((sum, g) => sum + g.playtime, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const threshold = 300; // 5 hours considered excessive
    return {
      type: 'excessive-playtime-pattern',
      severity: totalMinutes >= 600 ? 'high' : totalMinutes >= threshold ? 'medium' : 'low',
      title: 'High Weekly Playtime',
      message: `Total playtime this week: ${totalHours} hours ${totalMinutes % 60} minutes. The recommended limit is 5 hours per week.`,
      detected: totalMinutes >= threshold,
    };
  },

  // Pattern 6: Horror game exposure
  // Flags if young child is playing horror games
  checkHorrorGames: (games: Game[], childAge: number): PatternResult => {
    const horrorGames = games.filter(g => g.genre === 'Horror');
    const count = horrorGames.length;
    const names = horrorGames.map(g => g.name).join(', ');
    return {
      type: 'horror-exposure-pattern',
      severity: childAge < 9 ? 'high' : 'medium',
      title: 'Horror Game Exposure',
      message: `Child is playing ${count} horror genre game${count !== 1 ? 's' : ''}: ${names}. These may contain frightening content.`,
      detected: count > 0 && childAge < 12,
    };
  },

  // Generate a risk score from 0-100
  calculateRiskScore: (patterns: PatternResult[]): number => {
    if (patterns.length === 0) return 0;
    let score = 0;
    patterns.forEach(p => {
      if (p.severity === 'high') score += 25;
      else if (p.severity === 'medium') score += 15;
      else score += 5;
    });
    return Math.min(score, 100);
  },

  // Get risk level label
  getRiskLevel: (score: number): { label: string; color: string } => {
    if (score >= 70) return { label: 'High Risk', color: '#EF4444' };
    if (score >= 40) return { label: 'Medium Risk', color: '#F59E0B' };
    if (score > 0) return { label: 'Low Risk', color: '#10B981' };
    return { label: 'No Concerns', color: '#10B981' };
  },
};

export default PatternService;