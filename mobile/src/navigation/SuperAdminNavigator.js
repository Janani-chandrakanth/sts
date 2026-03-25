import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens from the superadmin folder
import SuperAdminDashboard from '../screens/superadmin/SuperAdminDashboard.js';
import ManageOfficesScreen from '../screens/superadmin/ManageOfficesScreen.js';
import ManageOfficersScreen from '../screens/superadmin/ManageOfficersScreen.js';
import ManageServicesScreen from '../screens/superadmin/ManageServicesScreen.js';

const Stack = createStackNavigator();

const SuperAdminNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerStyle: { backgroundColor: '#1A237E' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="SuperAdminDashboard" 
        component={SuperAdminDashboard} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ManageOffices" 
        component={ManageOfficesScreen} 
        options={{ title: 'Manage Offices' }}
      />
      <Stack.Screen 
        name="ManageOfficers" 
        component={ManageOfficersScreen} 
        options={{ title: 'Manage Officers' }}
      />
      <Stack.Screen 
        name="ManageServices" 
        component={ManageServicesScreen} 
        options={{ title: 'Manage Services' }}
      />
    </Stack.Navigator>
  );
};

export default SuperAdminNavigator;
