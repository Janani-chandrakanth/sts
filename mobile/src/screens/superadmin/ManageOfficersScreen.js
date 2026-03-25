import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getOfficers, deleteOfficer } from '../../services/superAdminService';

const ManageOfficersScreen = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOfficers = async () => {
    try {
      const data = await getOfficers();
      setOfficers(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load officers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const handleDelete = (id, username) => {
    Alert.alert('Delete Officer', `Remove officer ${username}?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Remove', 
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteOfficer(id);
            setOfficers(prev => prev.filter(o => o._id !== id));
            Alert.alert('Success', 'Officer removed');
          } catch (err) {
            Alert.alert('Error', 'Could not remove officer');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Ionicons name="person" size={24} color="#7E57C2" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.officerName}>{item.username}</Text>
          <Text style={styles.officeName}>{item.office?.officeName || 'Independent'}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item._id, item.username)}>
          <Ionicons name="trash-outline" size={20} color="#E53935" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="calculator" size={14} color="#78909C" />
          <Text style={styles.footerText}>Counter {item.counterNumber}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="shield" size={14} color="#78909C" />
          <Text style={styles.footerText}>{item.role.toUpperCase()}</Text>
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
        data={officers}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOfficers(); }} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="people-outline" size={64} color="#CFD8DC" />
            <Text style={styles.emptyText}>No officers found.</Text>
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
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3E5F5',
    justifyContent: 'center', alignItems: 'center',
  },
  headerInfo: { flex: 1, marginLeft: 12 },
  officerName: { fontSize: 16, fontWeight: '700', color: '#1A237E' },
  officeName: { fontSize: 12, color: '#78909C', marginTop: 2, fontWeight: '600' },
  cardFooter: {
    flexDirection: 'row', alignItems: 'center', marginTop: 14,
    paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F1F1',
  },
  footerItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  footerText: { fontSize: 11, color: '#546E7A', marginLeft: 4 },
  emptyText: { marginTop: 12, color: '#90A4AE', fontSize: 16, textAlign: 'center' },
});

export default ManageOfficersScreen;
