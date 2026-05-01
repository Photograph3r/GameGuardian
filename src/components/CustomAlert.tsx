import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
  icon?: string;
}

export default function CustomAlert({
  visible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  onDismiss,
  icon,
}: CustomAlertProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={[styles.alertBox, { backgroundColor: colors.cardBg, borderColor: colors.primary }]}>
          {/* Shield Icon Header */}
          <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.iconText}>{icon || '🛡️'}</Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

          {/* Message */}
          {message && (
            <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
          )}

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

          {/* Buttons */}
          <View style={[
            styles.buttonRow,
            buttons.length === 1 && styles.buttonRowSingle,
          ]}>
            {buttons.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  buttons.length > 1 && index < buttons.length - 1 && styles.buttonBorder,
                  btn.style === 'destructive' && { backgroundColor: '#FEE2E2' },
                  btn.style === 'cancel' && { backgroundColor: colors.background },
                  btn.style === 'default' || !btn.style ? { backgroundColor: colors.primaryLight } : null,
                ]}
                onPress={() => {
                  if (btn.onPress) btn.onPress();
                  if (onDismiss) onDismiss();
                }}>
                <Text style={[
                  styles.buttonText,
                  btn.style === 'destructive' && { color: '#991B1B' },
                  btn.style === 'cancel' && { color: colors.textSecondary },
                  (!btn.style || btn.style === 'default') && { color: colors.primary },
                ]}>
                  {btn.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  alertBox: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  iconContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginHorizontal: 0,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  buttonRowSingle: {
    flexDirection: 'column',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonBorder: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});