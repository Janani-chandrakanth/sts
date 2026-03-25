import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { registerCitizen } from '../../services/authService';

const PRIORITIES = [
  { label: 'General',   value: 'general' },
  { label: 'Senior Citizen', value: 'senior' },
  { label: 'Disabled',  value: 'disabled' },
  { label: 'Emergency', value: 'emergency' },
];

const Field = ({ label, icon, ...props }) => (
  <View style={{ marginBottom: 4 }}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      <Ionicons name={icon} size={20} color="#90A4AE" style={styles.inputIcon} />
      <TextInput style={[styles.input, { flex: 1 }]} placeholderTextColor="#B0BEC5" {...props} />
    </View>
  </View>
);

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', age: '', pincode: '', priorityCategory: 'general',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    const { name, email, password, age, pincode } = form;
    if (!name || !email || !password || !age || !pincode) {
      Alert.alert('Missing fields', 'Please fill all required fields.');
      return;
    }
    try {
      setLoading(true);
      await registerCitizen({ ...form, age: Number(age) });
      Alert.alert('Success! 🎉', 'Account created – you can now log in.', [
        { text: 'Go to Login', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      Alert.alert('Registration Failed', err.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.iconCircle}>
            <Ionicons name="person-add" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register to book government services</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Field label="Full Name *"     icon="person-outline"   placeholder="John Doe"         value={form.name}     onChangeText={set('name')} />
          <Field label="Email *"         icon="mail-outline"     placeholder="you@example.com"  value={form.email}    onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" />

          <Text style={styles.label}>Password *</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#90A4AE" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Minimum 6 characters"
              placeholderTextColor="#B0BEC5"
              secureTextEntry={!showPwd}
              value={form.password}
              onChangeText={set('password')}
            />
            <TouchableOpacity onPress={() => setShowPwd(v => !v)}>
              <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={20} color="#90A4AE" />
            </TouchableOpacity>
          </View>

          <Field label="Age *"    icon="calendar-outline" placeholder="35"       value={form.age}     onChangeText={set('age')}    keyboardType="numeric" />
          <Field label="Pincode * " icon="location-outline" placeholder="600001" value={form.pincode} onChangeText={set('pincode')} keyboardType="numeric" />

          {/* Priority Category */}
          <Text style={styles.label}>Priority Category</Text>
          <View style={styles.priorityGrid}>
            {PRIORITIES.map(p => (
              <TouchableOpacity
                key={p.value}
                style={[styles.priorityChip, form.priorityCategory === p.value && styles.priorityChipActive]}
                onPress={() => set('priorityCategory')(p.value)}
              >
                <Text style={[styles.priorityText, form.priorityCategory === p.value && styles.priorityTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.btnText}>{loading ? 'Creating Account…' : 'Create Account'}</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
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
    paddingBottom: 40, paddingHorizontal: 24, alignItems: 'center',
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
    backgroundColor: '#FFFFFF', margin: 20, borderRadius: 20, padding: 24,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  label:    { fontSize: 13, fontWeight: '600', color: '#455A64', marginBottom: 6, marginTop: 14 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 12,
    paddingHorizontal: 12, backgroundColor: '#F8FAFF',
  },
  inputIcon: { marginRight: 8 },
  input:    { flex: 1, paddingVertical: 12, fontSize: 15, color: '#263238' },
  priorityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  priorityChip: {
    borderWidth: 1.5, borderColor: '#B0BEC5', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, marginBottom: 8,
  },
  priorityChipActive: { backgroundColor: '#0D47A1', borderColor: '#0D47A1' },
  priorityText:       { color: '#546E7A', fontSize: 13, fontWeight: '600' },
  priorityTextActive: { color: '#FFFFFF' },
  btn: {
    backgroundColor: '#0D47A1', borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', marginTop: 20,
  },
  btnText:   { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  loginRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  loginText: { color: '#78909C', fontSize: 14 },
  loginLink: { color: '#0D47A1', fontSize: 14, fontWeight: '700' },
});

export default RegisterScreen;
