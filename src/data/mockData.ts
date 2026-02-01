//Mock Data
//Sample data for dev/testing
// In the real app, this would come from Roblox API


import { Child, Game, Alert, ActivitySummary, Friend, Group } from '../types';

// Sample children being monitored
export const mockChildren: Child[] = [
    {
        id: 'child-001',
        name: 'Emma',
        age: 10,
        timezone: 'EST',
        robloxUsername: 'EmmaPlays123',
        avatarColor: 'bg-purple-500'
    },
    {
        id: 'child-002',
        name: 'Lucas',
        age: 8,
        timezone: 'EST',
        robloxUsername: 'LucasGamer',
        avatarColor: 'bg-blue-500'
    }
];

// Sample games the child has played
export const mockGames: Game[] = [
    {
        id: 'game-001',
        name: 'Adopt Me!',
        creator: 'Uplift Games',
        icon: '🏡',
        genre: 'Role-Playing',
        ageRating: 'All Ages',
        lastPlayed: '2 hours ago',
        playtime: 45
    },
    {
        id: 'game-002',
        name: 'Brookhaven RP',
        creator: 'Wolfpaq',
        icon: '🏘️',
        genre: 'Town & City',
        ageRating: 'All Ages',
        lastPlayed: '5 hours ago',
        playtime: 32
    },
    {
        id: 'game-003',
        name: 'Tower of Hell',
        creator: 'YXCeptional Studios',
        icon: '🗼',
        genre: 'Platformer',
        ageRating: '9+',
        lastPlayed: 'Yesterday',
        playtime: 28
    },
    {
        id: 'game-004',
        name: 'Blox Fruits',
        creator: 'Gamer Robot Inc.',
        icon: '🍊',
        genre: 'Fighting',
        ageRating: '13+',
        lastPlayed: '2 days ago',
        playtime: 67
    },
    {
        id: 'game-005',
        name: 'Rainbow Friends',
        creator: 'Roy & Charcle',
        icon: '🌈',
        genre: 'Horror',
        ageRating: '9+',
        lastPlayed: '3 days ago',
        playtime: 41
    }
];

// Sample friends
export const mockFriends: Friend[] = [
    {
        id: 'friend-001',
        username: 'GamerKid2014',
        addedDate: '2 days ago',
        status: 'new'
    },
    {
        id: 'friend-002',
        username: 'BuildMaster99',
        addedDate: 'Jan 15, 2026',
        status: 'existing'
    },
    {
        id: 'friend-003',
        username: 'CoolPlayer456',
        addedDate: 'Jan 10, 2026',
        status: 'existing'
    },
    {
        id: 'friend-004',
        username: 'ProGamer123',
        addedDate: 'Yesterday',
        status: 'new'
    }
];

// Sample groups
export const mockGroups: Group[] = [
    {
        id: 'group-001',
        name: 'Roblox Builders Club',
        description: 'A community for creative builders',
        memberCount: 15420,
        isRisky: false
    },
    {
        id: 'group-002',
        name: 'Free Robux Giveaway',
        description: 'Get free robux here! Trade and sell accounts',
        memberCount: 8932,
        isRisky: true,
        riskKeywords: ['free robux', 'trade', 'sell accounts']
    },
    {
        id: 'group-003',
        name: 'Adopt Me Trading Community',
        description: 'Safe trading for Adopt Me pets',
        memberCount: 24103,
        isRisky: false
    }
];

// Sample alerts
export const mockAlerts: Alert[] = [
    {
        id: 'alert-001',
        type: 'late-night-gaming',
        severity: 'high',
        timestamp: '2026-01-30T02:15:00Z',
        title: 'Late Night Gaming Detected',
        message: 'Emma was playing Blox Fruits at 2:15 AM, past the recommended bedtime.',
        details: {
            game: 'Blox Fruits',
            time: '2:15 AM',
            duration: '45 minutes'
        },
        isRead: false
    },
    {
        id: 'alert-002',
        type: 'risky-group',
        severity: 'high',
        timestamp: '2026-01-29T16:30:00Z',
        title: 'Joined Potentially Risky Group',
        message: 'Emma joined "Free Robux Giveaway" which contains keywords associated with scams.',
        details: {
            groupName: 'Free Robux Giveaway',
            keywords: ['free robux', 'trade', 'sell accounts'],
            memberCount: 8932
        },
        isRead: false
    },
    {
        id: 'alert-003',
        type: 'rapid-friends',
        severity: 'medium',
        timestamp: '2026-01-28T14:20:00Z',
        title: 'Multiple New Friends',
        message: 'Emma added 3 new friends in the last 24 hours.',
        details: {
            count: 3,
            friends: ['GamerKid2014', 'ProGamer123', 'NewPlayer789']
        },
        isRead: true
    },
    {
        id: 'alert-004',
        type: 'out-of-age-gaming',
        severity: 'medium',
        timestamp: '2026-01-27T19:45:00Z',
        title: 'Playing Above Age Rating',
        message: 'Emma (age 10) played "Blox Fruits" which has a 13+ rating for 67 minutes.',
        details: {
            game: 'Blox Fruits',
            childAge: 10,
            gameRating: '13+',
            duration: 67
        },
        isRead: true
    }
];

// Weekly activity summary
export const mockActivitySummary: ActivitySummary = {
    totalPlaytime: 213,  // Total minutes this week
    gamesPlayed: 5,
    newFriends: 2,
    newGroups: 1,
    chartData: [
        { day: 'Mon', minutes: 25 },
        { day: 'Tue', minutes: 42 },
        { day: 'Wed', minutes: 38 },
        { day: 'Thu', minutes: 51 },
        { day: 'Fri', minutes: 32 },
        { day: 'Sat', minutes: 0 },
        { day: 'Sun', minutes: 25 }
    ]
};