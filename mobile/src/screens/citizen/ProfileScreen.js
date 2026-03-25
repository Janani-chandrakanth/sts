import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIconBox}>
        <Ionicons name={icon} size={18} color="#0D47A1" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={44} color="#FFFFFF" />
          </View>
          <Text style={styles.name}>{user?.name || 'Citizen'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Registered Citizen</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Information</Text>
          <InfoRow icon="mail"     label="Email"    value={user?.email} />
          <InfoRow icon="person"   label="Username" value={user?.name} />
          <InfoRow icon="ribbon"   label="Role"     value={user?.role || 'citizen'} />
        </View>

        {/* Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="log-out" size={20} color="#C62828" />
            </View>
            <Text style={[styles.actionText, { color: '#C62828' }]}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={18} color="#EF9A9A" />
          </TouchableOpacity>
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>Smart Token System · Government Queue Management</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  scroll:    { paddingBottom: 40 },
  header: {
    backgroundColor: '#0D47A1', paddingTop: 30, paddingBottom: 40,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 5, marginTop: 8,
  },
  roleText:  { color: '#E3F2FD', fontSize: 13, fontWeight: '600' },
  card: {
    backgroundColor: '#FFFFFF', margin: 16, borderRadius: 18, padding: 18,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
    marginTop: 0,
  },
  cardTitle:  { fontSize: 13, fontWeight: '700', color: '#90A4AE', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderColor: '#F5F5F5',
  },
  infoIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  infoLabel: { fontSize: 12, color: '#90A4AE', fontWeight: '500' },
  infoValue: { fontSize: 15, fontWeight: '600', color: '#263238', marginTop: 2 },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
  },
  actionIcon: {
    width: 38, height: 38, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  actionText: { flex: 1, fontSize: 15, fontWeight: '600' },
  footerNote: { alignItems: 'center', paddingVertical: 24 },
  footerText: { color: '#B0BEC5', fontSize: 12 },
  footerVersion: { color: '#CFD8DC', fontSize: 11, marginTop: 4 },
});

export default ProfileScreen;
