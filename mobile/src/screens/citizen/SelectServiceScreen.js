import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getServicesByOfficeType } from '../../services/officeService';

const SelectServiceScreen = ({ navigation, route }) => {
  const { office } = route.params;
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getServicesByOfficeType(office.officeType);
        setServices(data);
      } catch (err) {
        Alert.alert('Error', err.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('SelectDate', { office, service: item })}
    >
      <View style={styles.cardLeft}>
        <View style={styles.codeBox}>
          <Text style={styles.code}>{item.serviceCode || '—'}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name}>{item.serviceName}</Text>
          {item.description ? (
            <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
          ) : null}
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={13} color="#78909C" />
            <Text style={styles.metaText}>{item.processingTime || '~30 mins'}</Text>
            {item.priorityAllowed && (
              <>
                <Ionicons name="star" size={13} color="#FBC02D" style={{ marginLeft: 10 }} />
                <Text style={styles.metaText}>Priority allowed</Text>
              </>
            )}
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#B0BEC5" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ marginLeft: 14 }}>
          <Text style={styles.headerTitle}>Select Service</Text>
          <Text style={styles.headerSub}>Step 2 of 4 — {office.officeName}</Text>
        </View>
      </View>

      {/* Step indicator */}
      <View style={styles.stepRow}>
        {[1,2,3,4].map(s => (
          <View key={s} style={[styles.stepDot, s <= 2 && styles.stepDotActive]}>
            <Text style={[styles.stepNum, s <= 2 && styles.stepNumActive]}>{s}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color="#0D47A1" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={services}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No services available for {office.officeType}</Text>
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
  stepRow:     { flexDirection: 'row', justifyContent: 'center', padding: 14, gap: 10, backgroundColor: '#FFFFFF' },
  stepDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center',
  },
  stepDotActive: { backgroundColor: '#0D47A1' },
  stepNum:       { fontSize: 14, fontWeight: '700', color: '#9E9E9E' },
  stepNumActive: { color: '#FFFFFF' },
  list:   { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    borderWidth: 1, borderColor: '#E8F0FE',
  },
  cardLeft:  { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  codeBox: {
    backgroundColor: '#E3F2FD', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 6, minWidth: 44, alignItems: 'center',
  },
  code:    { fontSize: 11, fontWeight: '700', color: '#1565C0' },
  name:    { fontSize: 15, fontWeight: '700', color: '#263238' },
  desc:    { fontSize: 12, color: '#78909C', marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  metaText:{ color: '#78909C', fontSize: 12, marginLeft: 4 },
  empty:   { textAlign: 'center', color: '#90A4AE', marginTop: 40, fontSize: 14 },
});

export default SelectServiceScreen;
