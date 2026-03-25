import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OfficerLoginScreen from '../screens/auth/OfficerLoginScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome"       component={WelcomeScreen} />
    <Stack.Screen name="Login"         component={LoginScreen} />
    <Stack.Screen name="Register"      component={RegisterScreen} />
    <Stack.Screen name="OfficerLogin"  component={OfficerLoginScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
