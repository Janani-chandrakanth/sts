import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen             from '../screens/citizen/HomeScreen';
import BookAppointmentScreen  from '../screens/citizen/BookAppointmentScreen';
import SelectServiceScreen    from '../screens/citizen/SelectServiceScreen';
import SelectDateScreen       from '../screens/citizen/SelectDateScreen';
import SelectTimeSlotScreen   from '../screens/citizen/SelectTimeSlotScreen';
import ConfirmationScreen     from '../screens/citizen/ConfirmationScreen';
import MyAppointmentsScreen   from '../screens/citizen/MyAppointmentsScreen';
import ProfileScreen          from '../screens/citizen/ProfileScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack inside the "Book" tab so booking has back navigation
const BookingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BookAppointment"  component={BookAppointmentScreen} />
    <Stack.Screen name="SelectService"    component={SelectServiceScreen} />
    <Stack.Screen name="SelectDate"       component={SelectDateScreen} />
    <Stack.Screen name="SelectTimeSlot"   component={SelectTimeSlotScreen} />
    <Stack.Screen name="Confirmation"     component={ConfirmationScreen} />
  </Stack.Navigator>
);

const CitizenNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#0D47A1',
        borderTopWidth: 0,
        height: 60,
        paddingBottom: 8,
      },
      tabBarActiveTintColor:   '#FFFFFF',
      tabBarInactiveTintColor: '#90CAF9',
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Home:           'home',
          Book:           'calendar',
          MyAppointments: 'list',
          Profile:        'person',
        };
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home"           component={HomeScreen} />
    <Tab.Screen name="Book"           component={BookingStack}          options={{ title: 'Book' }} />
    <Tab.Screen name="MyAppointments" component={MyAppointmentsScreen}  options={{ title: 'My Bookings' }} />
    <Tab.Screen name="Profile"        component={ProfileScreen} />
  </Tab.Navigator>
);

export default CitizenNavigator;
