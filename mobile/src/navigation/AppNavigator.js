import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator   from './AuthNavigator';
import CitizenNavigator from './CitizenNavigator';
import OfficerNavigator from './OfficerNavigator';
import SuperAdminNavigator from './SuperAdminNavigator';

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D47A1' }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (!user) {
    return <AuthNavigator />;
  }

  if (user.role === 'superadmin') {
    return <SuperAdminNavigator />;
  }

  if (user.role === 'officer') {
    return <OfficerNavigator />;
  }

  return <CitizenNavigator />;
};

export default AppNavigator;
