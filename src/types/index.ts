// ============================================
// TYPE DEFINITIONS
// These define the structure of our data
// TypeScript uses these to catch errors early
// ============================================

export interface Child {
    id: string;
    name: string;
    age: number;
    timezone: string;
    robloxUsername: string;
    avatarColor: string;
}

export interface Game {
    id: string;
    name: string;
    creator: string;
    icon: string;
    genre: string;
    ageRating: string;
    lastPlayed: string;
    playtime: number;
}

export interface Friend {
    id: string;
    username: string;
    addedDate: string;
    status: 'new' | 'existing' | 'removed';
}

export interface Group {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    isRisky: boolean;
    riskKeywords?: string[];
}

export interface Alert {
    id: string;
    type: 'late-night-gaming' |
          'rapid-friends' |
          'risky-group' |
          'out-of-age-gaming' |
          'excessive-playtime' |
          'inappropriate-chat' |
          'purchase-attempt' |
          'new-game-flagged';
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
    title: string;
    message: string;
    details?: any;
    isRead: boolean;
}

export interface ActivitySummary {
    totalPlaytime: number;
    gamesPlayed: number;
    newFriends: number;
    newGroups: number;
    chartData: {
        day: string;
        minutes: number;
    }[];
}