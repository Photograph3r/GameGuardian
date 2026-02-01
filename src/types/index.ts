// ============================================
// TYPE DEFINITIONS
// These define the structure of our data
// TypeScript uses these to catch errors early
// ============================================

// Represents a child being monitored
export interface Child {
    id: string;              // Unique identifier for the child
    name: string;            // Child's name (e.g., "Emma")
    age: number;             // Child's age (e.g., 10)
    timezone: string;        // Time zone (e.g., "EST")
    robloxUsername: string;  // Their Roblox account name
    avatarColor: string;     // Color for their avatar display
}

// Represents a Roblox game
export interface Game {
    id: string;           // Unique game ID
    name: string;         // Game name (e.g., "Adopt Me!")
    creator: string;      // Who made the game
    icon: string;         // Emoji icon for display
    genre: string;        // Game category (e.g., "Role-Playing")
    ageRating: string;    // Age appropriateness (e.g., "All Ages", "13+")
    lastPlayed: string;   // When they last played (e.g., "2 hours ago")
    playtime: number;     // Total minutes played
}

// Represents a Roblox friend
export interface Friend {
    id: string;           // Unique friend ID
    username: string;     // Friend's Roblox username
    addedDate: string;    // When they became friends
    status: 'new' | 'existing' | 'removed';  // Friend status
}

// Represents a Roblox group
export interface Group {
    id: string;              // Unique group ID
    name: string;            // Group name
    description: string;     // What the group is about
    memberCount: number;     // How many members
    isRisky: boolean;        // Does it have risky keywords?
    riskKeywords?: string[]; // What keywords were flagged (optional)
}

// Represents a safety alert
export interface Alert {
    id: string;                          // Unique alert ID
    type: 'late-night-gaming' |          // Type of alert:
    'rapid-friends' |              // - Gaming past bedtime
    'risky-group' |                // - Too many new friends quickly
    'out-of-age-gaming';           // - Joined suspicious group
    // - Playing above age rating
    severity: 'low' | 'medium' | 'high'; // How serious is it?
    timestamp: string;                   // When it happened (ISO date)
    title: string;                       // Alert headline
    message: string;                     // Description of what happened
    details?: any;                       // Extra info (optional)
    isRead: boolean;                     // Has parent seen it yet?
}

// Represents weekly activity summary
export interface ActivitySummary {
    totalPlaytime: number;   // Total minutes played this week
    gamesPlayed: number;     // Number of different games
    newFriends: number;      // New friends added this week
    newGroups: number;       // New groups joined this week
    chartData: {             // Data for the activity chart
        day: string;           // Day name (e.g., "Mon")
        minutes: number;       // Minutes played that day
    }[];
}