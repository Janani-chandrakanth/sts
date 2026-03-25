import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllOffices } from '../../services/officeService';

const OFFICE_TYPES = [
  { label: 'RTO',     icon: 'car',          color: '#1565C0', desc: 'Vehicle registration, licence' },
  { label: 'VAO',     icon: 'leaf',          color: '#2E7D32', desc: 'Village administrative office' },
  { label: 'Revenue', icon: 'document-text', color: '#6A1B9A', desc: 'Land records, revenue services' },
];

const BookAppointmentScreen = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [offices, setOffices]           = useState([]);
  const [loading, setLoading]           = useState(false);

  const fetchOffices = async (type) => {
    try {
      setLoading(true);
      const all = await getAllOffices();
      setOffices(all.filter(o => o.officeType === type));
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to fetch offices');
    } finally {
      setLoading(false);
    }
  };

  const selectType = (type) => {
    setSelectedType(type);
    fetchOffices(type);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <Text style={styles.headerSub}>Step 1 of 4 — Select Office</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Step indicator */}
        <View style={styles.stepRow}>
          {[1,2,3,4].map(s => (
            <View key={s} style={[styles.stepDot, s === 1 && styles.stepDotActive]}>
              <Text style={[styles.stepNum, s === 1 && styles.stepNumActive]}>{s}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Select Office Type</Text>
        {OFFICE_TYPES.map(({ label, icon, color, desc }) => (
          <TouchableOpacity
            key={label}
            style={[styles.typeCard, selectedType === label && { borderColor: color, borderWidth: 2 }]}
            onPress={() => selectType(label)}
          >
            <View style={[styles.typeIcon, { backgroundColor: color + '18' }]}>
              <Ionicons name={icon} size={26} color={color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.typeLabel, selectedType === label && { color }]}>{label}</Text>
              <Text style={styles.typeDesc}>{desc}</Text>
            </View>
            {selectedType === label && <Ionicons name="checkmark-circle" size={22} color={color} />}
          </TouchableOpacity>
        ))}

        {selectedType && (
          <>
            <Text style={styles.sectionTitle}>Select an Office</Text>
            {loading ? (
              <ActivityIndicator color="#0D47A1" size="large" style={{ marginTop: 20 }} />
            ) : offices.length === 0 ? (
              <Text style={styles.noOffice}>No offices found for {selectedType}</Text>
            ) : (
              offices.map(office => (
                <TouchableOpacity
                  key={office._id}
                  style={styles.officeCard}
                  onPress={() => navigation.navigate('SelectService', { office })}
                >
                  <View style={styles.officeLeft}>
                    <Ionicons name="business" size={22} color="#0D47A1" />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.officeName}>{office.officeName}</Text>
                      <Text style={styles.officeCity}>{office.city} — {office.pincode}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#B0BEC5" />
                </TouchableOpacity>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F0F4FF' },
  header: {
    backgroundColor: '#0D47A1', paddingTop: 20,
    paddingBottom: 24, paddingHorizontal: 22,
  },
  headerTitle:  { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  headerSub:    { fontSize: 13, color: '#BBDEFB', marginTop: 3 },
  scroll:       { padding: 16, paddingBottom: 40 },
  stepRow:      { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 10 },
  stepDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center',
  },
  stepDotActive: { backgroundColor: '#0D47A1' },
  stepNum:       { fontSize: 14, fontWeight: '700', color: '#9E9E9E' },
  stepNumActive: { color: '#FFFFFF' },
  sectionTitle:  { fontSize: 15, fontWeight: '700', color: '#455A64', marginBottom: 10, marginTop: 4 },
  typeCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    borderWidth: 1.5, borderColor: '#E0E0E0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  typeIcon:  { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  typeLabel: { fontSize: 16, fontWeight: '700', color: '#263238' },
  typeDesc:  { fontSize: 12, color: '#90A4AE', marginTop: 2 },
  noOffice:  { textAlign: 'center', color: '#90A4AE', marginTop: 20 },
  officeCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 10, borderWidth: 1.5, borderColor: '#E8F0FE',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  officeLeft:  { flexDirection: 'row', alignItems: 'center', flex: 1 },
  officeName:  { fontSize: 15, fontWeight: '700', color: '#263238' },
  officeCity:  { fontSize: 12, color: '#78909C', marginTop: 2 },
});

export default BookAppointmentScreen;
