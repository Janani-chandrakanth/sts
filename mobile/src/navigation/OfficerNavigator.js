import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OfficerDashboardScreen from '../screens/officer/OfficerDashboardScreen';

const Stack = createStackNavigator();

const OfficerNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OfficerDashboard" component={OfficerDashboardScreen} />
  </Stack.Navigator>
);

export default OfficerNavigator;
