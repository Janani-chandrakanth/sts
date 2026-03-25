import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getServices, deleteService } from '../../services/superAdminService';

const ManageServicesScreen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load services');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = (id, name) => {
    Alert.alert('Delete Service', `Remove service ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteService(id);
            setServices(prev => prev.filter(s => s._id !== id));
            Alert.alert('Success', 'Service removed');
          } catch (err) {
            Alert.alert('Error', 'Could not remove service');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Ionicons name="construct" size={24} color="#43A047" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
          <Text style={styles.officeType}>{item.officeType.toUpperCase()}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item._id, item.serviceName)}>
          <Ionicons name="trash-outline" size={20} color="#E53935" />
        </TouchableOpacity>
      </View>
      <View style={styles.reqContainer}>
         <Text style={styles.reqTitle}>Requirements:</Text>
         <Text style={styles.reqText} numberOfLines={1}>
            {item.requirements?.join(', ') || 'No special requirements'}
         </Text>
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
        data={services}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchServices(); }} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="construct-outline" size={64} color="#CFD8DC" />
            <Text style={styles.emptyText}>No services found.</Text>
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
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#E8F5E9',
    justifyContent: 'center', alignItems: 'center',
  },
  headerInfo: { flex: 1, marginLeft: 12 },
  serviceName: { fontSize: 16, fontWeight: '700', color: '#2E7D32' },
  officeType: { fontSize: 12, color: '#78909C', marginTop: 2, fontWeight: '600' },
  reqContainer: {
    marginTop: 12, padding: 8, backgroundColor: '#FAFAFA', borderRadius: 8,
  },
  reqTitle: { fontSize: 10, fontWeight: '700', color: '#90A4AE', textTransform: 'uppercase' },
  reqText: { fontSize: 12, color: '#546E7A', marginTop: 2 },
  emptyText: { marginTop: 12, color: '#90A4AE', fontSize: 16, textAlign: 'center' },
});

export default ManageServicesScreen;
