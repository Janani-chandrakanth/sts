import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTimeSlots } from '../../services/appointmentService';

const SelectTimeSlotScreen = ({ navigation, route }) => {
  const { office, service, date } = route.params;
  const [slots, setSlots]       = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getTimeSlots(office._id, date);
        setSlots(data);
      } catch (err) {
        Alert.alert('Error', err.message || 'Failed to load time slots');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Format date nicely
  const formatted = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ marginLeft: 14 }}>
          <Text style={styles.headerTitle}>Select Time Slot</Text>
          <Text style={styles.headerSub}>Step 4 of 4 — {formatted}</Text>
        </View>
      </View>

      <View style={styles.stepRow}>
        {[1,2,3,4].map(s => (
          <View key={s} style={[styles.stepDot, styles.stepDotActive]}>
            <Text style={styles.stepNumActive}>{s}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? (
          <ActivityIndicator color="#0D47A1" size="large" style={{ marginTop: 40 }} />
        ) : slots.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="time-outline" size={48} color="#B0BEC5" />
            <Text style={styles.emptyText}>No slots available for this date</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
              <Text style={styles.backLinkText}>Choose another date</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.hint}>Tap a slot to select it, then confirm below</Text>
            <View style={styles.grid}>
              {slots.map(slot => (
                <TouchableOpacity
                  key={slot}
                  style={[styles.chip, selected === slot && styles.chipSelected]}
                  onPress={() => setSelected(slot)}
                >
                  <Ionicons
                    name="time"
                    size={14}
                    color={selected === slot ? '#FFFFFF' : '#1565C0'}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.chipText, selected === slot && styles.chipTextSelected]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {selected && (
        <View style={styles.footer}>
          <View style={styles.selectedInfo}>
            <Ionicons name="checkmark-circle" size={20} color="#43A047" />
            <Text style={styles.selectedText}>{selected}</Text>
          </View>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() =>
              navigation.navigate('Confirmation', { office, service, date, timeSlot: selected })
            }
          >
            <Text style={styles.confirmBtnText}>Confirm Slot →</Text>
          </TouchableOpacity>
        </View>
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
  stepRow:     { flexDirection: 'row', justifyContent: 'center', padding: 14, gap: 10, backgroundColor: '#FFFFFF' },
  stepDot:     { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  stepDotActive: { backgroundColor: '#0D47A1' },
  stepNumActive: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  scroll:    { padding: 16, paddingBottom: 100 },
  hint:      { fontSize: 13, color: '#78909C', marginBottom: 14 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#90CAF9',
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14,
  },
  chipSelected: { backgroundColor: '#0D47A1', borderColor: '#0D47A1' },
  chipText:     { fontSize: 13, fontWeight: '600', color: '#1565C0' },
  chipTextSelected: { color: '#FFFFFF' },
  emptyBox:   { flex: 1, alignItems: 'center', paddingTop: 60 },
  emptyText:  { fontSize: 16, color: '#90A4AE', marginTop: 14 },
  backLink:   { marginTop: 16 },
  backLinkText: { color: '#0D47A1', fontWeight: '700', fontSize: 14 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', padding: 16,
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderColor: '#E0E0E0',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 8,
  },
  selectedInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  selectedText: { fontSize: 14, fontWeight: '700', color: '#263238', marginLeft: 8 },
  confirmBtn: {
    backgroundColor: '#0D47A1', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 20,
  },
  confirmBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});

export default SelectTimeSlotScreen;
