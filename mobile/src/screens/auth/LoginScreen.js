import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { loginCitizen } from '../../services/authService';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      const data = await loginCitizen(email.trim(), password);
      // Save session; citizen role
      await login(data.token, data.role || 'citizen', data.name, data.email);
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.iconCircle}>
            <Ionicons name="person" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Citizen Login</Text>
          <Text style={styles.subtitle}>Welcome back! Sign in to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={20} color="#90A4AE" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#B0BEC5"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#90A4AE" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Your password"
              placeholderTextColor="#B0BEC5"
              secureTextEntry={!showPwd}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPwd(v => !v)}>
              <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={20} color="#90A4AE" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>{loading ? 'Signing in…' : 'Sign In'}</Text>
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Register here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  scroll:    { flexGrow: 1 },
  header: {
    backgroundColor: '#0D47A1', paddingTop: 56,
    paddingBottom: 40, paddingHorizontal: 24,
    alignItems: 'center',
  },
  backBtn: { position: 'absolute', top: 56, left: 20 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  title:    { fontSize: 26, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#BBDEFB', marginTop: 4 },
  form: {
    backgroundColor: '#FFFFFF', margin: 20, borderRadius: 20,
    padding: 24,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
    elevation: 4,
  },
  label:   { fontSize: 13, fontWeight: '600', color: '#455A64', marginBottom: 6, marginTop: 14 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 12,
    paddingHorizontal: 12, backgroundColor: '#F8FAFF',
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1, paddingVertical: 12, fontSize: 15, color: '#263238',
  },
  loginBtn: {
    backgroundColor: '#0D47A1', borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', marginTop: 24,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  signupRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  signupText: { color: '#78909C', fontSize: 14 },
  signupLink: { color: '#0D47A1', fontSize: 14, fontWeight: '700' },
});

export default LoginScreen;
