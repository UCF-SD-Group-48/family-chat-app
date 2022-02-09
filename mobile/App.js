
// This is the starting point file for the mobile application.

import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

// Temporary visual space for Front-End component testing.
import FrontEndTestSpace from './screens/deprecated/FrontEndTestSpace';

// Screen imports.
// ----------------- "AUTHENTICATION" Screens
import UserAuth from './screens/0_Authentication/UserAuth';
import RegisterPhone from './screens/0_Authentication/RegisterPhone';
import Login from './screens/0_Authentication/Login';
import VerifyPhone from './screens/0_Authentication/VerifyPhone';
import PhoneSuccess from './screens/0_Authentication/PhoneSuccess';
import UserCreated from './screens/0_Authentication/UserCreated';

// ----------------- "HOME" Screens
import HomeTab from './screens/1_Home/HomeTab';

// ----------------- "GROUP CHATS" Screens
import GroupChatsTab from './screens/2_GroupChats/GroupChatsTab';
import AddChatScreen from './screens/2_GroupChats/AddChatScreen';
import ChatScreen from './screens/2_GroupChats/ChatScreen';
import FamilyChatScreen from './screens/2_GroupChats/FamilyChatScreen';

// ----------------- "DMs" Screens
import DMsTab from './screens/3_DMs/DMsTab';

// ----------------- "Profile" Screens
import ProfileTab from './screens/4_Profile/ProfileTab';

// Global settings.
const Stack = createStackNavigator();

// Default values for "navigation.setOptions".
const globalScreenOptions = {
  headerStyle: { backgroundColor: '#2C6BED' },
  headerTitleStyle: { color: 'white' },
  headerBackTitleStyle: { color: 'white' },
  headerTintStyle: 'white'
}

// Screen definitions for the application.
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions} >

        {/* 0 - Authentication */}
        <Stack.Screen name='UserAuth' component={UserAuth} />
        <Stack.Screen name='RegisterPhone' component={RegisterPhone} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='VerifyPhone' component={VerifyPhone} />
        <Stack.Screen name="PhoneSuccess" component={PhoneSuccess} />
        <Stack.Screen name="UserCreated" component={UserCreated} />

        {/* 1 - Home */}
        <Stack.Screen name='HomeTab' component={HomeTab} />

        {/* 2 - Group Chats */}
        <Stack.Screen name='GroupChatsTab' component={GroupChatsTab} />
        <Stack.Screen name='AddChat' component={AddChatScreen} />
        <Stack.Screen name='Chat' component={ChatScreen} />
        <Stack.Screen name='FamilyChatScreen' component={FamilyChatScreen} />

        {/* 3 - DMs */}
        <Stack.Screen name='DMsTab' component={DMsTab} />

        {/* 4 - Profile */}
        <Stack.Screen name='ProfileTab' component={ProfileTab} />

        {/* Front-End Test Screens */}
        <Stack.Screen name='FrontEndTestSpace' component={FrontEndTestSpace} />

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