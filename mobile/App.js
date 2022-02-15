
// This is the starting point file for the mobile application.

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import 'react-native-gesture-handler';

// Temporary visual space for Front-End component testing.
import FrontEndTestSpace from './screens/deprecated/FrontEndTestSpace';

// Screen imports.
// ----------------- 'AUTHENTICATION' Screens
import UserAuth from './screens/0_Authentication/UserAuth';
import RegisterPhone from './screens/0_Authentication/RegisterPhone';
import Login from './screens/0_Authentication/Login';
import VerifyPhone from './screens/0_Authentication/VerifyPhone';
import PhoneSuccess from './screens/0_Authentication/PhoneSuccess';
import UserCreated from './screens/0_Authentication/UserCreated';

// ----------------- 'HOME' Screens
import HomeTab from './screens/1_Home/HomeTab';

// ----------------- 'GROUP CHATS' Screens
import GroupChatsTab from './screens/2_GroupChats/GroupChatsTab';
import AddChatScreen from './screens/2_GroupChats/AddChatScreen';
import ChatScreen from './screens/2_GroupChats/ChatScreen';
import FamilyChatScreen from './screens/2_GroupChats/FamilyChatScreen';
import Topics from './screens/2_GroupChats/Topics';

// ----------------- 'DMs' Screens
import DMsTab from './screens/3_DMs/DMsTab';

// ----------------- 'Profile' Screens
import ProfileTab from './screens/4_Profile/ProfileTab';

// Default values for 'navigation.setOptions'.
const globalScreenOptions = {
  headerStyle: { backgroundColor: '#2C6BED' },
  headerTitleStyle: { color: 'white' },
  headerBackTitleStyle: { color: 'white' },
  headerTintStyle: 'white'
}

// Imports for: Expo
import { StatusBar } from 'expo-status-bar';
import ImagePicker from 'expo-image-picker';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

// Imports for: Firebase
import {
  app,
  auth,
  db,
  firebaseConfig
} from './firebase';
import firebase from 'firebase/compat/app';
import { Icon } from 'react-native-elements/dist/icons/Icon';

// --

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name='UserAuth'
      component={UserAuth}
      options={{ title: 'Welcome to FamilyChat!' }}
    />
    <AuthStack.Screen
      name='RegisterPhone'
      component={RegisterPhone}
      options={{ title: 'Register your Phone #:' }}
    />
    <AuthStack.Screen
      name='Login'
      component={Login}
      options={{ title: 'Sign in:' }}
    />
    <AuthStack.Screen
      name='VerifyPhone'
      component={VerifyPhone}
      options={{ title: 'Verify your Phone #:' }}
    />
    <AuthStack.Screen
      name='PhoneSuccess'
      component={PhoneSuccess}
      options={{ title: 'User Information:' }}
    />
    <AuthStack.Screen
      name='UserCreated'
      component={UserCreated}
      options={{ title: 'Account Successfully Created!' }}
    />
  </AuthStack.Navigator>
);

const TabStack = createBottomTabNavigator();
const TabStackScreen = () => (
  <TabStack.Navigator
    headerMode="none"
    screenOptions={({ route }) => ({
      initialRouteName: "Home",
      headerShown: false,
      tabBarStyle: { height: 80 },
      backgroundColor: 'red',
      tabBarLabelStyle: {
        fontSize: 15,
        paddingBottom: 8,
      },
      tabBarIcon: ({ color, type, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
          type = 'material-community';
          size = 35;
        } else if (route.name === 'Groups') {
          iconName = 'group';
          type = 'material';
          size = 35;
        } else if (route.name === 'Messages') {
          iconName = 'direction';
          type = 'entypo';
          size = 28;
        } else if (route.name === 'Profile') {
          iconName = 'person-pin';
          type = 'material';
          size = 35;
        }

        return (
          <Icon
            name={iconName}
            type={type}
            size={size}
            color={color}
            style={{ paddingTop: 10 }}
          />
        );
      },
      tabBarActiveTintColor: "#1982FC",
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <TabStack.Screen
      name='Home'
      component={HomeStackScreen}
    />
    <TabStack.Screen
      name='Groups'
      component={GroupChatsStackScreen}
    />
    <TabStack.Screen
      name='Messages'
      component={DMsStackScreen}
    />
    <TabStack.Screen
      name='Profile'
      component={ProfileStackScreen}
    />
  </TabStack.Navigator>
);

// Stack of defined screens for the 'HOME' Tab
const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name='HomeTab'
      component={HomeTab}
    />
  </HomeStack.Navigator>
);

// Stack of defined screens for the 'GROUP CHATS' Tab
const GroupChatsStack = createStackNavigator();
const GroupChatsStackScreen = () => (
  <GroupChatsStack.Navigator>
    <GroupChatsStack.Screen
      name='GroupChatsTab'
      component={GroupChatsTab}
    />
    <GroupChatsStack.Screen
      name='AddChat'
      component={AddChatScreen}
    />
    <GroupChatsStack.Screen
      name='Chat'
      component={ChatScreen}
    />
    <GroupChatsStack.Screen
      name='Topics'
      component={Topics}
    />

    {/* Temporary Screens */}
    <GroupChatsStack.Screen
      name='FamilyChatScreen'
      component={FamilyChatScreen}
    />
    <HomeStack.Screen
      name='FrontEndTestSpace'
      component={FrontEndTestSpace}
    />
  </GroupChatsStack.Navigator>
);

// Stack of defined screens for the 'DIRECT MESSAGES' Tab
const DMsStack = createStackNavigator();
const DMsStackScreen = () => (
  <DMsStack.Navigator>
    <DMsStack.Screen
      name='DMsTab'
      component={DMsTab}
    />
  </DMsStack.Navigator>
);

// Stack of defined screens for the 'PROFILE' Tab
const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name='ProfileTab'
      component={ProfileTab}
    />
  </ProfileStack.Navigator>
);

// Application initialized.
export default function App() {

  const RootStack = createStackNavigator();

  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     console.log('userSignedIn');
  //   }
  // });

  return (
    <NavigationContainer>
      <RootStack.Navigator headerMode="none">
        {(auth.currentUser === null) ? (
          <RootStack.Screen
            name="AuthStack"
            component={AuthStackScreen}
            options={{ animationEnabled: false }}
          />
        ) : (
          <RootStack.Screen
            name="TabStack"
            component={TabStackScreen}
            options={{ animationEnabled: false }}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});