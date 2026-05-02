import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AuthService from '../services/AuthService';
import {
  exchangeCodeForTokens,
  fetchRobloxUser,
  CLIENT_ID,
  REDIRECT_URI,
  DISCOVERY,
} from '../services/RobloxAuthService';
import { useRobloxAuth } from '../components/SharedStates';
import { useTheme } from '../context/ThemeContext';
import CustomAlert from '../components/CustomAlert';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation, onLoginSuccess }: any) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [robloxLoading, setRobloxLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: '🛡️',
    buttons: [] as any[],
  });

  const { login: robloxLogin } = useRobloxAuth();

  const showAlert = (title: string, message: string, icon: string) => {
    setAlertConfig({
      title,
      message,
      icon,
      buttons: [{ text: 'OK', style: 'default' }],
    });
    setAlertVisible(true);
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ['openid', 'profile'],
      usePKCE: true,
    },
    DISCOVERY
  );

  useEffect(() => {
    if (response?.type === 'success' && response.params?.code) {
      const handleResponse = async () => {
        setRobloxLoading(true);
        try {
          const tokens = await exchangeCodeForTokens(
            response.params.code,
            request?.codeVerifier ?? ''
          );
          // Save Roblox token for ChildSetupScreen to use
          await AsyncStorage.setItem('@gameguardian_roblox_token', JSON.stringify({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          }));
          const user = await fetchRobloxUser(tokens.accessToken);
          await robloxLogin(user, tokens.accessToken, tokens.refreshToken);
          if (onLoginSuccess) onLoginSuccess();
        } catch (err: any) {
          showAlert('Roblox Login Failed', err.message || 'Please try again.', '🎮');
        } finally {
          setRobloxLoading(false);
        }
      };
      handleResponse();
    } else if (response?.type === 'error') {
      showAlert('Roblox Login Failed', response.error?.message || 'Authorization error.', '🎮');
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email.trim()) {
      showAlert('Missing Info', 'Please enter your email.', '⚠️');
      return;
    }
    if (!password.trim()) {
      showAlert('Missing Info', 'Please enter your password.', '⚠️');
      return;
    }
    setLoading(true);
    try {
      await AuthService.login(email.trim(), password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err: any) {
      showAlert('Login Failed', err.message || 'Invalid email or password.', '🚫');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        buttons={alertConfig.buttons}
        onDismiss={() => setAlertVisible(false)}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.shieldIcon}>🛡️</Text>
          <Text style={styles.title}>Game Guardian</Text>
          <Text style={styles.subtitle}>Protect your child's gaming experience</Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Welcome Back</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => showAlert('Reset Password', 'Password reset will be available soon.', '🔑')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.robloxButton, (robloxLoading || !request) && styles.buttonDisabled]}
            onPress={() => promptAsync()}
            disabled={robloxLoading || !request}>
            {robloxLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.robloxIcon}>🎮</Text>
                <Text style={styles.robloxButtonText}>Sign in with Roblox</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}> Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4F46E5' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  headerSection: { alignItems: 'center', marginBottom: 40 },
  shieldIcon: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#C7D2FE', textAlign: 'center' },
  formSection: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  formTitle: { fontSize: 22, fontWeight: '600', color: '#1F2937', marginBottom: 20, textAlign: 'center' },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: '#1F2937',
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  eyeButton: { position: 'absolute', right: 12, padding: 8 },
  eyeText: { fontSize: 20 },
  loginButton: {
    backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 16,
    alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  forgotButton: { alignItems: 'center', marginTop: 12 },
  forgotText: { color: '#4F46E5', fontSize: 14 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 12, color: '#9CA3AF', fontSize: 14 },
  robloxButton: {
    backgroundColor: '#00B2FF', borderRadius: 12, paddingVertical: 16,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  robloxIcon: { fontSize: 20 },
  robloxButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  footerSection: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#C7D2FE', fontSize: 14 },
  signupLink: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});