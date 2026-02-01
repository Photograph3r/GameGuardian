// SETTINGS SCREEN (Child Profile)
// Shows child profile info and monitoring settings
// Parents can toggle tracking features on/off

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Switch,
} from 'react-native';
import { mockChildren } from '../data/mockData';

export default function SettingsScreen({ navigation }: any) {
    // Get first child from mock data
    const child = mockChildren[0];

    // ===== STATE FOR TOGGLE SWITCHES =====
    // useState hook manages the on/off state of each setting
    const [activityTracking, setActivityTracking] = React.useState(true);
    const [patternDetection, setPatternDetection] = React.useState(true);
    const [pushNotifications, setPushNotifications] = React.useState(true);

    return (
        <View style={styles.container}>
            {/* ===== COLORED HEADER WITH CHILD INFO ===== */}
            <View style={styles.header}>
                {/* Large avatar circle */}
                <View style={[styles.avatar, { backgroundColor: '#8B5CF6' }]}>
                    <Text style={styles.avatarText}>{child.name.charAt(0)}</Text>
                </View>

                {/* Child's name */}
                <Text style={styles.headerName}>{child.name}</Text>

                {/* Subtitle */}
                <Text style={styles.headerSubtitle}>Child Profile</Text>
            </View>

            {/* ===== SCROLLABLE CONTENT ===== */}
            <ScrollView style={styles.content}>

                {/* ===== PROFILE INFORMATION SECTION ===== */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Profile Information</Text>
                        {/* Edit button (non-functional in this demo) */}
                        <TouchableOpacity style={styles.editButton}>
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoCard}>
                        {/* Age Row */}
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Text style={styles.infoIconText}>👤</Text>
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Age</Text>
                                <Text style={styles.infoValue}>{child.age} years old</Text>
                            </View>
                        </View>

                        {/* Divider line */}
                        <View style={styles.divider} />

                        {/* Timezone Row */}
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Text style={styles.infoIconText}>🌍</Text>
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Timezone</Text>
                                <Text style={styles.infoValue}>{child.timezone}</Text>
                            </View>
                        </View>

                        {/* Divider line */}
                        <View style={styles.divider} />

                        {/* Roblox Username Row */}
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Text style={styles.infoIconText}>🔗</Text>
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Roblox Username</Text>
                                <Text style={styles.infoValue}>@{child.robloxUsername}</Text>
                            </View>
                            {/* "Linked" badge */}
                            <View style={styles.linkedBadge}>
                                <Text style={styles.linkedText}>Linked</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ===== MONITORING SETTINGS SECTION ===== */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Monitoring Settings</Text>

                    <View style={styles.settingCard}>
                        {/* Activity Tracking Toggle */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingTitle}>Activity Tracking</Text>
                                <Text style={styles.settingDescription}>
                                    Games, friends, and groups
                                </Text>
                            </View>
                            {/* Switch component - tapping toggles between on/off */}
                            <Switch
                                value={activityTracking}
                                onValueChange={setActivityTracking}
                                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                thumbColor={activityTracking ? '#3B82F6' : '#F3F4F6'}
                            />
                        </View>

                        <View style={styles.divider} />

                        {/* Pattern Detection Toggle */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingTitle}>Pattern Detection</Text>
                                <Text style={styles.settingDescription}>
                                    Late night gaming, risky groups
                                </Text>
                            </View>
                            <Switch
                                value={patternDetection}
                                onValueChange={setPatternDetection}
                                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                thumbColor={patternDetection ? '#3B82F6' : '#F3F4F6'}
                            />
                        </View>

                        <View style={styles.divider} />

                        {/* Push Notifications Toggle */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingTitle}>Push Notifications</Text>
                                <Text style={styles.settingDescription}>
                                    High priority alerts only
                                </Text>
                            </View>
                            <Switch
                                value={pushNotifications}
                                onValueChange={setPushNotifications}
                                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                thumbColor={pushNotifications ? '#3B82F6' : '#F3F4F6'}
                            />
                        </View>
                    </View>
                </View>

                {/* ===== PRIVACY NOTICE ===== */}
                <View style={styles.privacyCard}>
                    <Text style={styles.privacyTitle}>Privacy & Safety</Text>
                    <Text style={styles.privacyText}>
                        Game Guardian monitors public activity like games played, friends
                        added, and group memberships. We do NOT monitor in-game chat or
                        private messages. All data is stored securely and only accessible by
                        you.
                    </Text>
                </View>

                {/* ===== LAST SYNC INFO ===== */}
                <Text style={styles.syncText}>Last synced: 15 minutes ago</Text>

                {/* Bottom spacing */}
                <View style={{ height: 30 }} />
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
        backgroundColor: '#4F46E5',
        paddingTop: 50,
        paddingBottom: 30,
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: 'bold',
    },
    headerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#C7D2FE',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    editButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    editButtonText: {
        color: '#3B82F6',
        fontSize: 14,
        fontWeight: '500',
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoIconText: {
        fontSize: 20,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
    },
    linkedBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    linkedText: {
        color: '#065F46',
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 15,
    },
    settingCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 14,
        color: '#6B7280',
    },
    privacyCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        marginBottom: 15,
    },
    privacyTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    privacyText: {
        fontSize: 12,
        color: '#4B5563',
        lineHeight: 18,
    },
    syncText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#6B7280',
    },
});