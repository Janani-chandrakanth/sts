import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getOffices, deleteOffice } from '../../services/superAdminService';

const ManageOfficesScreen = () => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOffices = async () => {
    try {
      const data = await getOffices();
      setOffices(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load offices');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const handleDelete = (id, name) => {
    Alert.alert('Delete Office', `Are you sure you want to delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteOffice(id);
            setOffices(prev => prev.filter(o => o._id !== id));
            Alert.alert('Deleted', 'Office removed successfully');
          } catch (err) {
            Alert.alert('Error', 'Could not delete office');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Ionicons name="business" size={24} color="#1A237E" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.officeName}>{item.officeName}</Text>
          <Text style={styles.officeType}>{item.officeType.toUpperCase()} · {item.city}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item._id, item.officeName)}>
          <Ionicons name="trash-outline" size={22} color="#E53935" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="people" size={14} color="#78909C" />
          <Text style={styles.footerText}>{item.totalCounters} Counters</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="location" size={14} color="#78909C" />
          <Text style={styles.footerText}>{item.pincode}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.isActive ? '#E8F5E9' : '#FFEBEE' }]}>
            <Text style={[styles.statusText, { color: item.isActive ? '#2E7D32' : '#C62828' }]}>
                {item.isActive ? 'ACTIVE' : 'INACTIVE'}
            </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1A237E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={offices}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOffices(); }} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="business-outline" size={64} color="#CFD8DC" />
            <Text style={styles.emptyText}>No offices found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  list: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#E8EAF6',
    justifyContent: 'center', alignItems: 'center',
  },
  headerInfo: { flex: 1, marginLeft: 12 },
  officeName: { fontSize: 16, fontWeight: '700', color: '#263238' },
  officeType: { fontSize: 12, color: '#78909C', marginTop: 2, fontWeight: '600' },
  cardFooter: {
    flexDirection: 'row', alignItems: 'center', marginTop: 16,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F1F1',
  },
  footerItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  footerText: { fontSize: 12, color: '#546E7A', marginLeft: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 'auto' },
  statusText: { fontSize: 10, fontWeight: '800' },
  emptyText: { marginTop: 12, color: '#90A4AE', fontSize: 16, textAlign: 'center' },
});

export default ManageOfficesScreen;
