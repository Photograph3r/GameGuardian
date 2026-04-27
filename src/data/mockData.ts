import { Child, Game, Alert, ActivitySummary, Friend, Group } from '../types';

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

export const mockGames: Game[] = [
    {
        id: 'game-001',
        name: 'Adopt Me!',
        creator: 'Uplift Games',
        icon: '🏠',
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
        icon: '🍎',
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
    },
    {
        id: 'game-006',
        name: 'Murder Mystery 2',
        creator: 'Nikilis',
        icon: '🔪',
        genre: 'Horror',
        ageRating: '13+',
        lastPlayed: '1 hour ago',
        playtime: 55
    },
    {
        id: 'game-007',
        name: 'Jailbreak',
        creator: 'Badimo',
        icon: '🚔',
        genre: 'Action',
        ageRating: '9+',
        lastPlayed: '4 hours ago',
        playtime: 38
    },
    {
        id: 'game-008',
        name: 'Royale High',
        creator: 'callmehbob',
        icon: '👑',
        genre: 'Role-Playing',
        ageRating: 'All Ages',
        lastPlayed: 'Yesterday',
        playtime: 52
    },
    {
        id: 'game-009',
        name: 'The Mimic',
        creator: 'MUCDICH',
        icon: '👹',
        genre: 'Horror',
        ageRating: '13+',
        lastPlayed: '3 hours ago',
        playtime: 23
    },
    {
        id: 'game-010',
        name: 'MeepCity',
        creator: 'alexnewtron',
        icon: '🎉',
        genre: 'Social',
        ageRating: 'All Ages',
        lastPlayed: '6 hours ago',
        playtime: 18
    }
];

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
    },
    {
        id: 'friend-005',
        username: 'xX_DarkLord_Xx',
        addedDate: '3 hours ago',
        status: 'new'
    },
    {
        id: 'friend-006',
        username: 'PrincessRoblox',
        addedDate: 'Dec 20, 2025',
        status: 'existing'
    },
    {
        id: 'friend-007',
        username: 'TradeMe4Free',
        addedDate: 'Today',
        status: 'new'
    },
    {
        id: 'friend-008',
        username: 'MinecraftFan22',
        addedDate: 'Feb 1, 2026',
        status: 'existing'
    }
];

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
    },
    {
        id: 'group-004',
        name: 'DM Me For Free Stuff',
        description: 'Private message for exclusive items and robux generators',
        memberCount: 3201,
        isRisky: true,
        riskKeywords: ['DM me', 'free stuff', 'robux generator', 'private message']
    },
    {
        id: 'group-005',
        name: 'Roblox Art & Design',
        description: 'Share your Roblox creations and get feedback',
        memberCount: 45200,
        isRisky: false
    },
    {
        id: 'group-006',
        name: 'Account Boosting Service',
        description: 'Give us your login to level up your account fast',
        memberCount: 1520,
        isRisky: true,
        riskKeywords: ['give us your login', 'account boosting', 'level up fast']
    }
];

export const mockAlerts: Alert[] = [
    {
        id: 'alert-001',
        type: 'late-night-gaming',
        severity: 'high',
        timestamp: '2026-04-18T02:15:00Z',
        title: 'Late Night Gaming Detected',
        message: 'Emma was playing Blox Fruits at 2:15 AM, well past the recommended bedtime for a 10-year-old.',
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
        timestamp: '2026-04-17T16:30:00Z',
        title: 'Joined Potentially Risky Group',
        message: 'Emma joined "Free Robux Giveaway" which contains keywords commonly associated with scams targeting children.',
        details: {
            groupName: 'Free Robux Giveaway',
            keywords: ['free robux', 'trade', 'sell accounts'],
            memberCount: 8932
        },
        isRead: false
    },
    {
        id: 'alert-003',
        type: 'inappropriate-chat',
        severity: 'high',
        timestamp: '2026-04-17T11:45:00Z',
        title: 'Suspicious Chat Activity',
        message: 'A user named "TradeMe4Free" sent Emma multiple private messages requesting personal information.',
        details: {
            sender: 'TradeMe4Free',
            messageCount: 7,
            flaggedContent: 'Requested age, school name, and Discord username'
        },
        isRead: false
    },
    {
        id: 'alert-004',
        type: 'purchase-attempt',
        severity: 'high',
        timestamp: '2026-04-16T19:20:00Z',
        title: 'Robux Purchase Attempted',
        message: 'Emma attempted to purchase 800 Robux ($9.99) through the Roblox store.',
        details: {
            amount: '800 Robux',
            cost: '$9.99',
            status: 'Blocked by parental controls'
        },
        isRead: false
    },
    {
        id: 'alert-005',
        type: 'rapid-friends',
        severity: 'medium',
        timestamp: '2026-04-16T14:20:00Z',
        title: 'Rapid Friend Additions',
        message: 'Emma added 4 new friends in the last 6 hours. This is higher than her usual pattern.',
        details: {
            count: 4,
            timeframe: '6 hours',
            friends: ['GamerKid2014', 'ProGamer123', 'xX_DarkLord_Xx', 'TradeMe4Free']
        },
        isRead: false
    },
    {
        id: 'alert-006',
        type: 'out-of-age-gaming',
        severity: 'medium',
        timestamp: '2026-04-15T19:45:00Z',
        title: 'Playing Above Age Rating',
        message: 'Emma (age 10) played "Murder Mystery 2" which has a 13+ rating for 55 minutes.',
        details: {
            game: 'Murder Mystery 2',
            childAge: 10,
            gameRating: '13+',
            duration: '55 minutes'
        },
        isRead: false
    },
    {
        id: 'alert-007',
        type: 'excessive-playtime',
        severity: 'medium',
        timestamp: '2026-04-15T21:00:00Z',
        title: 'Excessive Daily Playtime',
        message: 'Emma has played for 3 hours and 42 minutes today, exceeding the recommended 2-hour daily limit.',
        details: {
            totalMinutes: 222,
            recommendedLimit: 120,
            gamesPlayed: ['Adopt Me!', 'Murder Mystery 2', 'Brookhaven RP']
        },
        isRead: true
    },
    {
        id: 'alert-008',
        type: 'risky-group',
        severity: 'medium',
        timestamp: '2026-04-14T10:30:00Z',
        title: 'Joined Suspicious Group',
        message: 'Emma joined "Account Boosting Service" which asks users to share login credentials.',
        details: {
            groupName: 'Account Boosting Service',
            keywords: ['give us your login', 'account boosting'],
            memberCount: 1520
        },
        isRead: true
    },
    {
        id: 'alert-009',
        type: 'new-game-flagged',
        severity: 'low',
        timestamp: '2026-04-14T15:10:00Z',
        title: 'New Horror Game Played',
        message: 'Emma started playing "The Mimic", a horror game. This is a new genre for her gaming history.',
        details: {
            game: 'The Mimic',
            genre: 'Horror',
            ageRating: '13+',
            note: 'First time playing horror genre'
        },
        isRead: true
    },
    {
        id: 'alert-010',
        type: 'late-night-gaming',
        severity: 'low',
        timestamp: '2026-04-13T22:30:00Z',
        title: 'Gaming Past Bedtime',
        message: 'Emma was still playing Royale High at 10:30 PM on a school night.',
        details: {
            game: 'Royale High',
            time: '10:30 PM',
            duration: '20 minutes',
            note: 'Slightly past recommended 10 PM cutoff'
        },
        isRead: true
    },
    {
        id: 'alert-011',
        type: 'new-game-flagged',
        severity: 'low',
        timestamp: '2026-04-12T16:00:00Z',
        title: 'New Game Detected',
        message: 'Emma started playing "Jailbreak" for the first time. This game involves police and criminal role-playing.',
        details: {
            game: 'Jailbreak',
            genre: 'Action',
            ageRating: '9+',
            note: 'New game added to play history'
        },
        isRead: true
    }
];

export const mockActivitySummary: ActivitySummary = {
    totalPlaytime: 399,
    gamesPlayed: 10,
    newFriends: 4,
    newGroups: 3,
    chartData: [
        { day: 'Mon', minutes: 45 },
        { day: 'Tue', minutes: 62 },
        { day: 'Wed', minutes: 38 },
        { day: 'Thu', minutes: 71 },
        { day: 'Fri', minutes: 55 },
        { day: 'Sat', minutes: 83 },
        { day: 'Sun', minutes: 45 }
    ]
};