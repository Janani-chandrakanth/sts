import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, Alert, RefreshControl,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats, getLiveTokens } from '../../services/superAdminService';

const { width } = Dimensions.get('window');

const SuperAdminDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [liveTokens, setLiveTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsData, tokensData] = await Promise.all([
        getDashboardStats(),
        getLiveTokens()
      ]);
      setStats(statsData);
      setLiveTokens(tokensData || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
        getLiveTokens().then(setLiveTokens).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A237E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerWelcome}>Welcome Back,</Text>
          <Text style={styles.headerName}>{user?.name || 'SuperAdmin'}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A237E']} />}
      >
        {/* KPI Grid */}
        <View style={styles.statsGrid}>
          <StatCard icon="business" label="Offices" value={stats?.totalOffices || 0} color="#3F51B5" />
          <StatCard icon="people" label="Officers" value={stats?.totalOfficers || 0} color="#7E57C2" />
          <StatCard icon="bookmarks" label="Total" value={stats?.totalAppointments || 0} color="#43A047" />
          <StatCard icon="today" label="Today" value={stats?.todayAppointments || 0} color="#FB8C00" />
          <StatCard icon="hourglass" label="Pending" value={stats?.pendingTokens || 0} color="#E53935" />
          <StatCard icon="checkmark-done" label="Success" value={stats?.completedTokens || 0} color="#1E88E5" />
        </View>

        {/* Management Actions */}
        <Text style={styles.sectionTitle}>System Management</Text>
        <View style={styles.actionRow}>
          <ActionButton 
            icon="business-outline" 
            label="Offices" 
            onPress={() => navigation.navigate('ManageOffices')} 
            color="#3F51B5"
          />
          <ActionButton 
            icon="people-outline" 
            label="Officers" 
            onPress={() => navigation.navigate('ManageOfficers')} 
            color="#7E57C2"
          />
          <ActionButton 
            icon="construct-outline" 
            label="Services" 
            onPress={() => navigation.navigate('ManageServices')} 
            color="#43A047"
          />
        </View>

        {/* Live Token Monitor */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Activity</Text>
            <View style={styles.liveBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.liveText}>LIVE</Text>
            </View>
        </View>

        <View style={styles.liveContainer}>
          {liveTokens.map((item, idx) => (
            <View key={idx} style={styles.liveCard}>
              <View>
                <Text style={styles.liveOffice}>{item.office}</Text>
                <Text style={styles.liveCounter}>Counter #{item.counter}</Text>
              </View>
              <View style={styles.liveTokenBox}>
                <Text style={styles.liveTokenNum}>#{item.currentToken}</Text>
                <Text style={[styles.liveStatus, { color: item.status === 'called' ? '#1E88E5' : '#FB8C00' }]}>
                    {item.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
          {liveTokens.length === 0 && (
            <Text style={styles.emptyText}>No active tokens at the moment.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconBox, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.statInfo}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const ActionButton = ({ icon, label, onPress, color }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <View style={[styles.actionIconBox, { backgroundColor: color }]}>
       <Ionicons name={icon} size={28} color="#FFFFFF" />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: '#1A237E', paddingHorizontal: 24, paddingTop: 20,
    paddingBottom: 30, flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  headerWelcome: { color: '#C5CAE9', fontSize: 14 },
  headerName: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  logoutBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { padding: 20 },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    marginTop: -15, // Overlap header a bit
  },
  statCard: {
    backgroundColor: '#FFFFFF', width: (width - 60) / 2,
    borderRadius: 20, padding: 16, marginBottom: 15,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  statIconBox: {
    width: 36, height: 36, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  statInfo: { marginLeft: 12 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#263238' },
  statLabel: { fontSize: 11, color: '#78909C', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#263238', marginVertical: 15 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionBtn: { alignItems: 'center', width: (width - 80) / 3 },
  actionIconBox: {
    width: '100%', height: 75, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 5,
    marginBottom: 8,
  },
  actionLabel: { fontSize: 12, fontWeight: '700', color: '#455A64' },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E8F5E9', paddingHorizontal: 10,
    paddingVertical: 5, borderRadius: 12,
  },
  pulseDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#43A047', marginRight: 6,
  },
  liveText: { fontSize: 10, fontWeight: '800', color: '#43A047' },
  liveContainer: { marginTop: 10 },
  liveCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12, borderWidth: 1, borderColor: '#E0E7FF',
  },
  liveOffice: { fontSize: 14, fontWeight: '700', color: '#263238' },
  liveCounter: { fontSize: 12, color: '#78909C', marginTop: 2 },
  liveTokenBox: { alignItems: 'flex-end' },
  liveTokenNum: { fontSize: 20, fontWeight: '900', color: '#1A237E' },
  liveStatus: { fontSize: 10, fontWeight: '800', marginTop: 2 },
  emptyText: { textAlign: 'center', color: '#90A4AE', marginTop: 20, fontStyle: 'italic' },
});

export default SuperAdminDashboard;
