import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import {
  getTodayQueue, callNextToken, completeToken,
} from '../../services/officeService';

const TODAY = new Date().toISOString().slice(0, 10);

const TABS = ['pending', 'called', 'completed', 'cancelled'];

const OfficerDashboardScreen = () => {
  const { user, logout } = useAuth();
  const [queue, setQueue]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [calling, setCalling]     = useState(false);
  const [tab, setTab]             = useState('pending');

  const fetchQueue = useCallback(async () => {
    try {
      const data = await getTodayQueue(TODAY);
      setQueue(Array.isArray(data) ? data : []);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to fetch queue');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const onRefresh = () => { setRefreshing(true); fetchQueue(); };

  const handleCallNext = async () => {
    try {
      setCalling(true);
      const res = await callNextToken(TODAY);
      Alert.alert('📢 Next Token Called', res.message || `Token #${res.tokenNumber} → Counter ${res.counter}`, [
        { text: 'OK', onPress: fetchQueue },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not call next token');
    } finally {
      setCalling(false);
    }
  };

  const handleComplete = (id, tokenNum) => {
    Alert.alert('Complete Token', `Mark token #${tokenNum} as completed?`, [
      { text: 'Cancel' },
      {
        text: 'Complete',
        onPress: async () => {
          try {
            await completeToken(id);
            fetchQueue();
          } catch (err) {
            Alert.alert('Error', err.message || 'Could not complete');
          }
        },
      },
    ]);
  };

  const filtered = queue.filter(a => a.status === tab);

  // Summary counts
  const counts = TABS.reduce((acc, t) => {
    acc[t] = queue.filter(a => a.status === t).length;
    return acc;
  }, {});

  const renderToken = ({ item }) => (
    <View style={styles.tokenCard}>
      <View style={styles.tokenLeft}>
        <View style={styles.numBox}>
          <Text style={styles.hashSign}>#</Text>
          <Text style={styles.numText}>{item.tokenNumber}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.tokenName}>
            {item.user?.name || 'Citizen'}
          </Text>
          <Text style={styles.tokenService}>
            {item.service?.serviceName || item.service || 'Service'}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="time" size={12} color="#90A4AE" />
            <Text style={styles.metaText}>{item.timeSlot}</Text>
            {item.priorityCategory !== 'general' && (
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityText}>{item.priorityCategory?.toUpperCase()}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      {tab === 'pending' && (
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={() => handleComplete(item._id, item.tokenNumber)}
        >
          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Officer Dashboard</Text>
          <Text style={styles.headerSub}>{TODAY} · Today's Queue</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Summary row */}
      <View style={styles.summaryRow}>
        {TABS.map(t => (
          <View key={t} style={styles.summaryBox}>
            <Text style={styles.summaryCount}>{counts[t]}</Text>
            <Text style={styles.summaryLabel}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
          </View>
        ))}
      </View>

      {/* Call Next Button */}
      <TouchableOpacity
        style={[styles.callBtn, calling && { opacity: 0.6 }]}
        onPress={handleCallNext}
        disabled={calling}
      >
        <Ionicons name="megaphone" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.callBtnText}>{calling ? 'Calling…' : 'Call Next Token'}</Text>
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)} {counts[t] > 0 ? `(${counts[t]})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator color="#1A237E" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={renderToken}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A237E']} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="checkmark-done-circle" size={48} color="#B0BEC5" />
              <Text style={styles.emptyText}>No {tab} tokens</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ECEFF1' },
  header: {
    backgroundColor: '#1A237E', paddingHorizontal: 20, paddingTop: 16,
    paddingBottom: 20, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  headerSub:   { fontSize: 12, color: '#9FA8DA', marginTop: 2 },
  logoutBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row', backgroundColor: '#283593',
    paddingVertical: 12, paddingHorizontal: 12,
  },
  summaryBox:    { flex: 1, alignItems: 'center' },
  summaryCount:  { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  summaryLabel:  { fontSize: 10, color: '#9FA8DA', marginTop: 2, fontWeight: '600' },
  callBtn: {
    backgroundColor: '#0D47A1', marginHorizontal: 16, marginTop: 16,
    borderRadius: 14, paddingVertical: 14, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#0D47A1', shadowOpacity: 0.35, shadowRadius: 8, elevation: 5,
  },
  callBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  tabs: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', marginTop: 12,
    borderBottomWidth: 1, borderColor: '#E0E0E0',
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive:     { borderBottomWidth: 3, borderColor: '#1A237E' },
  tabText:       { fontSize: 10, color: '#90A4AE', fontWeight: '600' },
  tabTextActive: { color: '#1A237E', fontWeight: '700' },
  list:   { padding: 12, paddingBottom: 40 },
  tokenCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  tokenLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  numBox: {
    flexDirection: 'row', alignItems: 'baseline',
    backgroundColor: '#E8EAF6', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 8,
  },
  hashSign: { fontSize: 12, color: '#5C6BC0', fontWeight: '700' },
  numText:  { fontSize: 22, fontWeight: '900', color: '#1A237E' },
  tokenName:    { fontSize: 14, fontWeight: '700', color: '#263238' },
  tokenService: { fontSize: 12, color: '#78909C', marginTop: 2 },
  metaRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaText: { color: '#90A4AE', fontSize: 11, marginLeft: 4, marginRight: 8 },
  priorityBadge: {
    backgroundColor: '#FCE4EC', borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  priorityText: { color: '#C62828', fontSize: 9, fontWeight: '700' },
  completeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center',
  },
  empty:     { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: '#90A4AE', marginTop: 12 },
});

export default OfficerDashboardScreen;
