import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddChatScreen from './screens/AddChatScreen';
import ChatScreen from './screens/ChatScreen';
import LandingPage from './screens/LandingPage';
import RegisterPage from './screens/RegisterPage';
import VerifyPage from './screens/VerifyPage';
import PhoneVerification from './screens/PhoneVerification'; 
import FrontEndTestSpace from './screens/FrontEndTestSpace';


const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: '#2C6BED' },
  headerTitleStyle: { color: 'white' },
  headerBackTitleStyle: { color: 'white' }, 
  headerTintStyle: 'white'
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={ globalScreenOptions }>
        <Stack.Screen name='Landing Page' component={ LandingPage }/>
        <Stack.Screen name="Register Page" component={ RegisterPage }/>
        <Stack.Screen name="PhoneVerification" component={ PhoneVerification }/>
        <Stack.Screen name="Verify Page" component={ VerifyPage }/>
        <Stack.Screen name='Login' component={ LoginScreen } />
        <Stack.Screen name='Register' component={ RegisterScreen } />    
        <Stack.Screen name='Home' component={ HomeScreen } />    
        <Stack.Screen name='AddChat' component={ AddChatScreen } /> 
        <Stack.Screen name='Chat' component={ ChatScreen } />    

        <Stack.Screen name='FrontEndTestSpace' component={ FrontEndTestSpace } />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});