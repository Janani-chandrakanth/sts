import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { loginOfficer } from '../../services/authService';

const OfficerLoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Enter your username and password.');
      return;
    }
    try {
      setLoading(true);
      const data = await loginOfficer(username.trim(), password);
      await login(data.token, data.role || 'officer', data.name, data.email);
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Invalid officer credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Officer Portal</Text>
          <Text style={styles.subtitle}>Sign in to manage your queue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#1565C0" />
            <Text style={styles.infoText}>
              Use your officer credentials assigned by the admin.
            </Text>
          </View>

          <Text style={styles.label}>Username</Text>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={20} color="#90A4AE" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="officer_username"
              placeholderTextColor="#B0BEC5"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#90A4AE" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password"
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
            style={[styles.btn, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>{loading ? 'Signing in…' : 'Officer Sign In'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ECEFF1' },
  scroll:    { flexGrow: 1 },
  header: {
    backgroundColor: '#1A237E', paddingTop: 56,
    paddingBottom: 44, paddingHorizontal: 24, alignItems: 'center',
  },
  backBtn: { position: 'absolute', top: 56, left: 20 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  title:    { fontSize: 26, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#C5CAE9', marginTop: 4 },
  form: {
    backgroundColor: '#FFFFFF', margin: 20, borderRadius: 20, padding: 24,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#E3F2FD', borderRadius: 10, padding: 12, marginBottom: 16,
  },
  infoText: { color: '#1565C0', fontSize: 13, marginLeft: 8, flex: 1 },
  label:    { fontSize: 13, fontWeight: '600', color: '#455A64', marginBottom: 6, marginTop: 14 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 12,
    paddingHorizontal: 12, backgroundColor: '#F8FAFF',
  },
  inputIcon: { marginRight: 8 },
  input:    { flex: 1, paddingVertical: 12, fontSize: 15, color: '#263238' },
  btn: {
    backgroundColor: '#1A237E', borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', marginTop: 24,
    flexDirection: 'row', justifyContent: 'center',
  },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default OfficerLoginScreen;
