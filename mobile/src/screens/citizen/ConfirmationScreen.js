import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bookAppointment } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';

const ConfirmationScreen = ({ navigation, route }) => {
  const { office, service, date, timeSlot } = route.params;
  const { user } = useAuth();
  const [loading, setLoading]         = useState(false);
  const [booked, setBooked]           = useState(null);

  const formatted = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const handleBook = async () => {
    try {
      setLoading(true);
      const res = await bookAppointment({
        officeId:   office._id,
        service:    service._id,
        date,
        timeSlot,
        priorityCategory: 'general', // could be pulled from user profile
      });
      setBooked(res.appointment);
    } catch (err) {
      Alert.alert('Booking Failed', err.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
        <ScrollView contentContainerStyle={styles.successScroll}>
          {/* Success banner */}
          <View style={styles.successBanner}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Booking Confirmed!</Text>
            <Text style={styles.successSub}>Your appointment has been booked successfully</Text>
          </View>

          {/* Token card */}
          <View style={styles.tokenCard}>
            <Text style={styles.tokenLabel}>Your Token Number</Text>
            <Text style={styles.tokenNumber}>#{booked.tokenNumber}</Text>
            <View style={styles.counterRow}>
              <Ionicons name="business" size={16} color="#0D47A1" />
              <Text style={styles.counterText}>Counter {booked.counterNumber}</Text>
            </View>
          </View>

          {/* Details */}
          <View style={styles.detailCard}>
            {[
              { icon: 'business',   label: 'Office',   val: booked.office },
              { icon: 'briefcase',  label: 'Service',  val: booked.service },
              { icon: 'calendar',   label: 'Date',     val: formatted },
              { icon: 'time',       label: 'Time Slot',val: booked.timeSlot },
              { icon: 'star',       label: 'Priority', val: booked.priorityCategory },
            ].map(({ icon, label, val }) => (
              <View key={label} style={styles.detailRow}>
                <Ionicons name={icon} size={16} color="#78909C" />
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailVal}>{val}</Text>
              </View>
            ))}
          </View>

          {/* Documents reminder */}
          {booked.documents?.length > 0 && (
            <View style={styles.docsCard}>
              <Text style={styles.docsTitle}>
                <Ionicons name="document-text" size={15} color="#E65100" /> Documents Required
              </Text>
              {booked.documents.map((doc, i) => (
                <View key={i} style={styles.docRow}>
                  <Ionicons name="ellipse" size={8} color="#E65100" />
                  <Text style={styles.docText}>{doc}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          >
            <Text style={styles.doneBtnText}>Go to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => navigation.navigate('MyAppointments')}
          >
            <Text style={styles.viewBtnText}>View My Appointments</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review & Confirm</Text>
      </View>

      <ScrollView contentContainerStyle={styles.reviewScroll}>
        <View style={styles.reviewCard}>
          <Text style={styles.reviewCardTitle}>Appointment Details</Text>
          {[
            { icon: 'business',  label: 'Office',    val: office.officeName },
            { icon: 'location',  label: 'City',      val: `${office.city} (${office.pincode})` },
            { icon: 'briefcase', label: 'Service',   val: service.serviceName },
            { icon: 'calendar',  label: 'Date',      val: formatted },
            { icon: 'time',      label: 'Time Slot', val: timeSlot },
          ].map(({ icon, label, val }) => (
            <View key={label} style={styles.reviewRow}>
              <Ionicons name={icon} size={18} color="#0D47A1" />
              <Text style={styles.reviewLabel}>{label}</Text>
              <Text style={styles.reviewVal}>{val}</Text>
            </View>
          ))}
        </View>

        <View style={styles.noticeBox}>
          <Ionicons name="information-circle" size={18} color="#1565C0" />
          <Text style={styles.noticeText}>
            A token number and counter will be assigned after booking. Please arrive 10 minutes before your slot.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, loading && { opacity: 0.6 }]}
          onPress={handleBook}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.confirmBtnText}>Confirm Booking</Text>
              </>
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelLink}>
          <Text style={styles.cancelLinkText}>← Go back and change</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: {
    backgroundColor: '#0D47A1', paddingTop: 20, paddingBottom: 20,
    paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  reviewScroll: { padding: 18, paddingBottom: 40 },
  reviewCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  reviewCardTitle: { fontSize: 16, fontWeight: '800', color: '#0D47A1', marginBottom: 16 },
  reviewRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderColor: '#F5F5F5',
  },
  reviewLabel: { flex: 1, color: '#78909C', fontSize: 13, marginLeft: 10 },
  reviewVal:   { fontSize: 14, fontWeight: '600', color: '#263238', flex: 2, textAlign: 'right' },
  noticeBox: {
    flexDirection: 'row', backgroundColor: '#E3F2FD', borderRadius: 12,
    padding: 14, marginVertical: 16, alignItems: 'flex-start',
  },
  noticeText: { fontSize: 13, color: '#1565C0', marginLeft: 10, flex: 1 },
  confirmBtn: {
    backgroundColor: '#0D47A1', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
  },
  confirmBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  cancelLink: { alignItems: 'center', marginTop: 14 },
  cancelLinkText: { color: '#78909C', fontSize: 14 },
  // Success
  successScroll:  { flexGrow: 1, paddingBottom: 40 },
  successBanner: {
    backgroundColor: '#2E7D32', paddingTop: 60, paddingBottom: 40,
    alignItems: 'center', paddingHorizontal: 24,
  },
  checkCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#FFFFFF' },
  successSub:   { fontSize: 14, color: '#C8E6C9', marginTop: 6, textAlign: 'center' },
  tokenCard: {
    backgroundColor: '#0D47A1', marginHorizontal: 18, marginTop: -20,
    borderRadius: 20, padding: 24, alignItems: 'center',
    shadowColor: '#0D47A1', shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  tokenLabel:  { fontSize: 13, color: '#90CAF9', fontWeight: '600' },
  tokenNumber: { fontSize: 56, fontWeight: '900', color: '#FFFFFF', marginTop: 6 },
  counterRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  counterText: { color: '#BBDEFB', fontSize: 15, fontWeight: '600', marginLeft: 6 },
  detailCard: {
    backgroundColor: '#FFFFFF', margin: 18, borderRadius: 18, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  detailRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderColor: '#F5F5F5',
  },
  detailLabel: { flex: 1, color: '#90A4AE', fontSize: 13, marginLeft: 10 },
  detailVal:   { fontSize: 14, fontWeight: '600', color: '#263238', flex: 2, textAlign: 'right' },
  docsCard: {
    backgroundColor: '#FFF3E0', marginHorizontal: 18, borderRadius: 14, padding: 16, marginBottom: 8,
  },
  docsTitle: { fontSize: 14, fontWeight: '700', color: '#E65100', marginBottom: 10 },
  docRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  docText:   { color: '#BF360C', fontSize: 13, marginLeft: 8 },
  doneBtn: {
    backgroundColor: '#0D47A1', marginHorizontal: 18, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', marginTop: 8,
  },
  doneBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  viewBtn: {
    marginHorizontal: 18, borderRadius: 14, borderWidth: 2, borderColor: '#0D47A1',
    paddingVertical: 13, alignItems: 'center', marginTop: 10,
  },
  viewBtnText: { color: '#0D47A1', fontWeight: '700', fontSize: 15 },
});

export default ConfirmationScreen;
