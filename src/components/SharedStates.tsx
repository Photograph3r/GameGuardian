// ============================================
// SHARED UI COMPONENTS
// Reusable loading, error, and empty states
// These make the app feel intentional even
// when data fails or hasn't loaded yet
// ============================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

// ===== LOADING STATE =====
interface LoadingProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingProps) {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

// ===== ERROR STATE =====
interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong',
  onRetry,
}: ErrorProps) {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Oops!</Text>
      <Text style={styles.errorMessage}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ===== EMPTY STATE =====
interface EmptyProps {
  icon?: string;
  title?: string;
  message?: string;
}

export function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  message = 'Check back later for updates',
}: EmptyProps) {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6B7280',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    paddingHoriz