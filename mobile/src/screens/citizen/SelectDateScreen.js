import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAvailableDates } from '../../services/appointmentService';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SelectDateScreen = ({ navigation, route }) => {
  const { office, service } = route.params;
  const [dates, setDates]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAvailableDates(office._id);
        setDates(data);
      } catch (err) {
        Alert.alert('Error', err.message || 'Failed to load dates');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const renderDate = ({ item }) => {
    const dateObj  = new Date(item.date + 'T00:00:00');
    const dayName  = DAYS[dateObj.getDay()];
    const dayNum   = dateObj.getDate();
    const month    = dateObj.toLocaleString('default', { month: 'short' });
    const isFull   = item.availableTokens === 0;

    return (
      <TouchableOpacity
        style={[styles.dateCard, isFull && styles.dateCardFull]}
        disabled={isFull}
        onPress={() => navigation.navigate('SelectTimeSlot', { office, service, date: item.date })}
      >
        <View style={[styles.dayBox, isFull && styles.dayBoxFull]}>
          <Text style={[styles.dayName, isFull && styles.dayNameFull]}>{dayName}</Text>
          <Text style={[styles.dayNum, isFull && styles.dayNumFull]}>{dayNum}</Text>
          <Text style={[styles.month, isFull && styles.monthFull]}>{month}</Text>
        </View>
        <View style={styles.tokenInfo}>
          {isFull ? (
            <>
              <Ionicons name="close-circle" size={20} color="#EF9A9A" />
              <Text style={styles.fullText}>Fully Booked</Text>
            </>
          ) : (
            <>
              <Ionicons name="ticket" size={20} color="#0D47A1" />
              <Text style={styles.tokenText}>{item.availableTokens} slots left</Text>
            </>
          )}
        </View>
        {!isFull && <Ionicons name="chevron-forward" size={20} color="#90CAF9" />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ marginLeft: 14 }}>
          <Text style={styles.headerTitle}>Select Date</Text>
          <Text style={styles.headerSub}>Step 3 of 4 — {service.serviceName}</Text>
        </View>
      </View>

      <View style={styles.stepRow}>
        {[1,2,3,4].map(s => (
          <View key={s} style={[styles.stepDot, s <= 3 && styles.stepDotActive]}>
            <Text style={[styles.stepNum, s <= 3 && styles.stepNumActive]}>{s}</Text>
          </View>
        ))}
      </View>

      <View style={styles.officeInfo}>
        <Ionicons name="business" size={16} color="#1565C0" />
        <Text style={styles.officeInfoText}>{office.officeName} · {office.city}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#0D47A1" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={dates}
          keyExtractor={item => item.date}
          renderItem={renderDate}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No available dates found</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: {
    backgroundColor: '#0D47A1', paddingTop: 20, paddingBottom: 20,
    paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  headerSub:   { fontSize: 12, color: '#BBDEFB', marginTop: 2 },
  stepRow:   { flexDirection: 'row', justifyContent: 'center', padding: 14, gap: 10, backgroundColor: '#FFFFFF' },
  stepDot:   { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  stepDotActive: { backgroundColor: '#0D47A1' },
  stepNum:       { fontSize: 14, fontWeight: '700', color: '#9E9E9E' },
  stepNumActive: { color: '#FFFFFF' },
  officeInfo: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E3F2FD', paddingHorizontal: 16, paddingVertical: 10,
  },
  officeInfoText: { color: '#1565C0', fontSize: 13, fontWeight: '600', marginLeft: 8 },
  list:    { padding: 14, paddingBottom: 40 },
  dateCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    borderWidth: 1.5, borderColor: '#E3F2FD',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  dateCardFull: { backgroundColor: '#FAFAFA', borderColor: '#E0E0E0' },
  dayBox:    { width: 56, alignItems: 'center', marginRight: 16 },
  dayBoxFull: {},
  dayName:   { fontSize: 12, fontWeight: '600', color: '#78909C' },
  dayNameFull: { color: '#B0BEC5' },
  dayNum:    { fontSize: 26, fontWeight: '800', color: '#0D47A1' },
  dayNumFull: { color: '#BDBDBD' },
  month:     { fontSize: 12, color: '#78909C', fontWeight: '500' },
  monthFull: { color: '#B0BEC5' },
  tokenInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  tokenText: { color: '#0D47A1', fontSize: 14, fontWeight: '600', marginLeft: 8 },
  fullText:  { color: '#EF5350', fontSize: 13, marginLeft: 8 },
  empty:     { textAlign: 'center', color: '#90A4AE', marginTop: 40, fontSize: 14 },
});

export default SelectDateScreen;
