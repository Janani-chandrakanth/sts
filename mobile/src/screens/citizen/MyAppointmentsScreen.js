import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMyAppointments, cancelAppointment } from '../../services/appointmentService';

const STATUS_CONFIG = {
  pending:   { color: '#F57F17', bg: '#FFF9C4', label: 'Pending',   icon: 'time' },
  completed: { color: '#2E7D32', bg: '#E8F5E9', label: 'Completed', icon: 'checkmark-circle' },
  cancelled: { color: '#C62828', bg: '#FFEBEE', label: 'Cancelled', icon: 'close-circle' },
  called:    { color: '#1565C0', bg: '#E3F2FD', label: 'Called',    icon: 'megaphone' },
};

const MyAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [tab, setTab]                   = useState('all');

  const fetch = async () => {
    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const onRefresh = () => { setRefreshing(true); fetch(); };

  const handleCancel = (id) => {
    Alert.alert('Cancel Appointment', 'Are you sure you want to cancel?', [
      { text: 'No' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelAppointment(id);
            fetch();
          } catch (err) {
            Alert.alert('Error', err.message || 'Could not cancel');
          }
        },
      },
    ]);
  };

  const filtered = tab === 'all'
    ? appointments
    : appointments.filter(a => a.status === tab);

  const renderItem = ({ item }) => {
    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
    return (
      <View style={styles.card}>
        {/* Top row */}
        <View style={styles.cardTop}>
          <View style={styles.tokenBox}>
            <Text style={styles.tokenHash}>#</Text>
            <Text style={styles.tokenNum}>{item.tokenNumber}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.officeName}>{item.office?.officeName}</Text>
            <Text style={styles.serviceName}>{item.service?.serviceName}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icon} size={13} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>
        {/* Date / Slot */}
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color="#90A4AE" />
          <Text style={styles.metaText}>{item.date}</Text>
          <Ionicons name="time-outline" size={14} color="#90A4AE" style={{ marginLeft: 14 }} />
          <Text style={styles.metaText}>{item.timeSlot}</Text>
          <Ionicons name="layers-outline" size={14} color="#90A4AE" style={{ marginLeft: 14 }} />
          <Text style={styles.metaText}>Counter {item.counterNumber}</Text>
        </View>
        {/* Cancel */}
        {item.status === 'pending' && (
          <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item._id)}>
            <Ionicons name="close" size={14} color="#C62828" />
            <Text style={styles.cancelText}>Cancel Appointment</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <Text style={styles.headerSub}>{appointments.length} total</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['all', 'pending', 'completed', 'cancelled'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color="#0D47A1" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D47A1']} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={48} color="#B0BEC5" />
              <Text style={styles.emptyText}>No {tab === 'all' ? '' : tab} appointments</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: {
    backgroundColor: '#0D47A1', paddingTop: 20, paddingBottom: 20, paddingHorizontal: 22,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  headerSub:   { fontSize: 13, color: '#BBDEFB', marginTop: 2 },
  tabs: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    paddingHorizontal: 12, borderBottomWidth: 1, borderColor: '#E0E0E0',
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive:     { borderBottomWidth: 3, borderColor: '#0D47A1' },
  tabText:       { fontSize: 12, color: '#90A4AE', fontWeight: '600' },
  tabTextActive: { color: '#0D47A1' },
  list: { padding: 14, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  cardTop:      { flexDirection: 'row', alignItems: 'center' },
  tokenBox: {
    flexDirection: 'row', alignItems: 'baseline',
    backgroundColor: '#E8F0FE', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  tokenHash: { fontSize: 12, color: '#5C6BC0', fontWeight: '700' },
  tokenNum:  { fontSize: 20, fontWeight: '900', color: '#0D47A1' },
  officeName:  { fontSize: 14, fontWeight: '700', color: '#263238' },
  serviceName: { fontSize: 12, color: '#78909C', marginTop: 2 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  statusText: { fontSize: 11, fontWeight: '700', marginLeft: 4 },
  metaRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 12, paddingTop: 10,
    borderTopWidth: 1, borderColor: '#F0F4FF',
  },
  metaText:  { color: '#78909C', fontSize: 12, marginLeft: 4 },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 12, paddingTop: 10,
    borderTopWidth: 1, borderColor: '#FFEBEE',
  },
  cancelText: { color: '#C62828', fontSize: 13, fontWeight: '600', marginLeft: 6 },
  empty:      { flex: 1, alignItems: 'center', paddingTop: 60 },
  emptyText:  { fontSize: 15, color: '#90A4AE', marginTop: 12 },
});

export default MyAppointmentsScreen;
