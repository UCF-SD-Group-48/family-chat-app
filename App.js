// This is the starting point file for the mobile application.

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';
import {
  Alert,
  Avatar,
  Button,
  Icon,
  Image,
  Input,
  Tooltip,
} from 'react-native-elements';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// ----------------- Temporary visual space for Front-End component testing.
// import FrontEndTestSpace from './screens/deprecated/FrontEndTestSpace';

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
import Groups from './screens/2_GroupChats/Groups';
import AddGroup from './screens/2_GroupChats/AddGroup';
import Topics from './screens/2_GroupChats/Topics';
import AddTopic from './screens/2_GroupChats/AddTopic';
import AddPin from './screens/2_GroupChats/AddPin';
import Pins from './screens/2_GroupChats/Pins';
import GroupInvite from './screens/2_GroupChats/GroupInvite';
import GroupMembers from './screens/2_GroupChats/GroupMembers';
import GroupSettings from './screens/2_GroupChats/GroupSettings';
import TopicInvite from './screens/2_GroupChats/TopicInvite';
import TopicMembers from './screens/2_GroupChats/TopicMembers';
import TopicSettings from './screens/2_GroupChats/TopicSettings';

// ----------------- 'DMs' Screens
import DMsTab from './screens/3_DMs/DMsTab';

// ----------------- 'Profile' Screens
import ProfileTab from './screens/4_Profile/ProfileTab';

// ----------------- 'Supplementary' Functions
import GenerateProfileIcon from './screens/5_Supplementary/GenerateProfileIcon';

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
import { Tab } from 'react-native-elements/dist/tab/Tab';

const Stack = createStackNavigator();
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
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: () => <GenerateProfileIcon />
      }}
    />
  </TabStack.Navigator>
);

const HomeStackScreen = () => (
  <Stack.Navigator  screenOptions={{
    headerBackTitleVisible: false,
    headerTintColor: "#000",
    headerTitleAlign: 'center',
  }}>
    <Stack.Screen name='HomeTab' component={HomeTab} />
  </Stack.Navigator>
)

const GroupChatsStackScreen = () => (
  <Stack.Navigator screenOptions={{
      headerBackTitleVisible: false,
      headerTintColor: "#000",
      headerTitleAlign: 'center',
    }}>
    <Stack.Screen name='Groups' component={Groups} />
    <Stack.Screen name='AddChat' component={AddChatScreen} />
    <Stack.Screen name='Chat' component={ChatScreen} />
    <Stack.Screen name='Topics' component={Topics} />
    <Stack.Screen name='AddGroup' component={AddGroup} />
    <Stack.Screen name='AddTopic' component={AddTopic} />
    <Stack.Screen name='AddPin' component={AddPin} />
    <Stack.Screen name='Pins' component={Pins} />
    <Stack.Screen name='GroupInvite' component={GroupInvite} />
    <Stack.Screen name='GroupMembers' component={GroupMembers} />
    <Stack.Screen name='GroupSettings' component={GroupSettings} />
    <Stack.Screen name='TopicInvite' component={TopicInvite} />
    <Stack.Screen name='TopicMembers' component={TopicMembers} />
    <Stack.Screen name='TopicSettings' component={TopicSettings} />
    <Stack.Screen name='FamilyChatScreen' component={FamilyChatScreen} />
  </Stack.Navigator>
)

const DMsStackScreen = () => (
  <Stack.Navigator screenOptions={{
    headerBackTitleVisible: false,
    headerTintColor: "#000",
    headerTitleAlign: 'center',
  }}>
    <Stack.Screen name='DMsTab' component={DMsTab} />
    <Stack.Screen name='Chat' component={ChatScreen} />

  </Stack.Navigator>
)

const ProfileStackScreen = () => (
  <Stack.Navigator screenOptions={{
    headerBackTitleVisible: false,
    headerTintColor: "#000",
    headerTitleAlign: 'center',
  }}>
    <Stack.Screen name='ProfileTab' component={ProfileTab} />
  </Stack.Navigator>
)


// Screen definitions for the application.
export default function App() {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <NavigationContainer>
        {/* <Stack.Navigator screenOptions={globalScreenOptions} > */}
        <Stack.Navigator>

          {/* Authentication Screens */}
          <Stack.Screen name='UserAuth' component={UserAuth} options={{ headerShown: false }}/>
          <Stack.Screen name='RegisterPhone' component={RegisterPhone} />
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='VerifyPhone' component={VerifyPhone} />
          <Stack.Screen name="PhoneSuccess" component={PhoneSuccess} />
          <Stack.Screen name="UserCreated" component={UserCreated} />

          {/* Tabbed Screens */}
          <Stack.Screen name="TabStack" component={TabStackScreen} options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeAreaContainer: {
    flex: 1,
  },
});