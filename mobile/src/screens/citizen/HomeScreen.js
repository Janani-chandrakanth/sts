import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getMyAppointments } from '../../services/appointmentService';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [upcoming, setUpcoming]   = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUpcoming = async () => {
    try {
      const all = await getMyAppointments();
      const pending = all.find(a => a.status === 'pending');
      setUpcoming(pending || null);
    } catch { /* silently fail */ }
  };

  useEffect(() => { fetchUpcoming(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUpcoming();
    setRefreshing(false);
  };

  const QuickCard = ({ icon, label, color, onPress }) => (
    <TouchableOpacity style={[styles.quickCard, { borderTopColor: color }]} onPress={onPress}>
      <View style={[styles.quickIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#90A4AE" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D47A1']} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || user?.name || 'Citizen'} 👋</Text>
            <Text style={styles.subGreeting}>What would you like to do today?</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={28} color="#FFFFFF" />
          </View>
        </View>

        {/* Upcoming Appointment Card */}
        <View style={styles.section}>
          {upcoming ? (
            <TouchableOpacity
              style={styles.upcomingCard}
              onPress={() => navigation.navigate('MyAppointments')}
            >
              <View style={styles.upcomingTop}>
                <View style={styles.tokenBadge}>
                  <Text style={styles.tokenNum}>#{upcoming.tokenNumber}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.upcomingTitle}>
                    {upcoming.office?.officeName || 'Office'}
                  </Text>
                  <Text style={styles.upcomingService}>
                    {upcoming.service?.serviceName || 'Service'}
                  </Text>
                </View>
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingText}>Pending</Text>
                </View>
              </View>
              <View style={styles.upcomingMeta}>
                <Ionicons name="calendar" size={14} color="#BBDEFB" />
                <Text style={styles.upcomingMetaText}>{upcoming.date}</Text>
                <Ionicons name="time" size={14} color="#BBDEFB" style={{ marginLeft: 12 }} />
                <Text style={styles.upcomingMetaText}>{upcoming.timeSlot}</Text>
                <Ionicons name="business" size={14} color="#BBDEFB" style={{ marginLeft: 12 }} />
                <Text style={styles.upcomingMetaText}>Counter {upcoming.counterNumber}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.noAppointment}>
              <Ionicons name="calendar-outline" size={36} color="#B0BEC5" />
              <Text style={styles.noApptText}>No upcoming appointments</Text>
              <Text style={styles.noApptSub}>Book one using the button below</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <QuickCard
          icon="calendar"      color="#0D47A1"
          label="Book Appointment"
          onPress={() => navigation.navigate('Book')}
        />
        <QuickCard
          icon="list"          color="#00897B"
          label="My Appointments"
          onPress={() => navigation.navigate('MyAppointments')}
        />
        <QuickCard
          icon="person-circle" color="#7B1FA2"
          label="My Profile"
          onPress={() => navigation.navigate('Profile')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F0F4FF' },
  scroll:      { paddingBottom: 30 },
  header: {
    backgroundColor: '#0D47A1', paddingTop: 20, paddingBottom: 30,
    paddingHorizontal: 22, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  greeting:    { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  subGreeting: { fontSize: 13, color: '#BBDEFB', marginTop: 2 },
  avatarCircle: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  section: { paddingHorizontal: 18, marginTop: -10 },
  upcomingCard: {
    backgroundColor: '#1565C0', borderRadius: 18,
    padding: 18,
    shadowColor: '#0D47A1', shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  upcomingTop:    { flexDirection: 'row', alignItems: 'center' },
  tokenBadge: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  tokenNum:    { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  upcomingTitle:   { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  upcomingService: { fontSize: 13, color: '#BBDEFB', marginTop: 2 },
  pendingBadge: {
    backgroundColor: '#FFF9C4', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  pendingText: { color: '#F57F17', fontSize: 11, fontWeight: '700' },
  upcomingMeta: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 14, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)',
  },
  upcomingMetaText: { color: '#BBDEFB', fontSize: 12, marginLeft: 4 },
  noAppointment: {
    backgroundColor: '#FFFFFF', borderRadius: 18,
    padding: 28, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  noApptText: { fontSize: 16, fontWeight: '600', color: '#90A4AE', marginTop: 10 },
  noApptSub:  { fontSize: 13, color: '#B0BEC5', marginTop: 4 },
  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: '#37474F',
    marginTop: 22, marginBottom: 10, marginHorizontal: 18,
  },
  quickCard: {
    backgroundColor: '#FFFFFF', marginHorizontal: 18, marginBottom: 10,
    borderRadius: 14, padding: 16, flexDirection: 'row',
    alignItems: 'center', borderTopWidth: 3,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  quickIcon:  {
    width: 46, height: 46, borderRadius: 23,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  quickLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#37474F' },
});

export default HomeScreen;
