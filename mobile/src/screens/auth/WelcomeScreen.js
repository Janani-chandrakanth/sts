import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, SafeAreaView, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
      <LinearGradient colors={['#0D47A1', '#1565C0', '#1976D2']} style={styles.gradient}>
        {/* Header / Branding */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="business" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.appName}>GovQueue</Text>
          <Text style={styles.tagline}>Government Office Queue Management</Text>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          {/* Citizen Section */}
          <View style={styles.card}>
            <Ionicons name="person-circle" size={32} color="#0D47A1" />
            <Text style={styles.cardTitle}>Citizen Portal</Text>
            <Text style={styles.cardSubtitle}>Book appointments & track your tokens</Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.primaryBtnText}>Citizen Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.outlineBtnText}>New Registration</Text>
            </TouchableOpacity>
          </View>

          {/* Officer Section */}
          <TouchableOpacity
            style={styles.officerCard}
            onPress={() => navigation.navigate('OfficerLogin')}
          >
            <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.officerTitle}>Officer Login</Text>
              <Text style={styles.officerSub}>Manage queues & appointments</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#90CAF9" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Powered by Smart Token System</Text>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:  { flex: 1 },
  gradient:   { flex: 1, paddingHorizontal: 24 },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  iconCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 36, fontWeight: '800', color: '#FFFFFF',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14, color: '#BBDEFB', marginTop: 4, textAlign: 'center',
  },
  cardsContainer: { flex: 1 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24,
    alignItems: 'center', marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  cardTitle:    { fontSize: 20, fontWeight: '700', color: '#0D47A1', marginTop: 8 },
  cardSubtitle: { fontSize: 13, color: '#78909C', marginTop: 4, marginBottom: 20, textAlign: 'center' },
  primaryBtn: {
    backgroundColor: '#0D47A1', borderRadius: 12,
    paddingVertical: 13, paddingHorizontal: 40,
    width: '100%', alignItems: 'center', marginBottom: 12,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  outlineBtn: {
    borderWidth: 2, borderColor: '#0D47A1', borderRadius: 12,
    paddingVertical: 11, paddingHorizontal: 40,
    width: '100%', alignItems: 'center',
  },
  outlineBtnText: { color: '#0D47A1', fontWeight: '700', fontSize: 15 },
  officerCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  officerTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  officerSub:   { color: '#BBDEFB', fontSize: 12, marginTop: 2 },
  footer: {
    textAlign: 'center', color: '#90CAF9', fontSize: 12,
    paddingBottom: 24, paddingTop: 16,
  },
});

export default WelcomeScreen;
