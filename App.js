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
  // Linking,
} from 'react-native';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {
  Alert,
  Avatar,
  Button,
  Icon,
  Image,
  Input,
  Tooltip,
} from 'react-native-elements';
import { MenuProvider } from 'react-native-popup-menu';
import 'react-native-gesture-handler';
import {
  NavigationContainer,
  useIsFocused
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

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
import ActiveEvents from './screens/1_Home/ActiveEvents';
import ViewEventHome from './screens/1_Home/ViewEventHome';
import ActivePolls from './screens/1_Home/ActivePolls';
import ViewPollHome from './screens/1_Home/ViewPollHome';

// ----------------- 'GROUP CHATS' Screens
import GroupChatsTab from './screens/2_GroupChats/GroupChatsTab';
import AddChatScreen from './screens/2_GroupChats/AddChatScreen';
import ChatScreen from './screens/2_GroupChats/ChatScreen';
import FamilyChatScreen from './screens/2_GroupChats/FamilyChatScreen';
import GroupsTab from './screens/2_GroupChats/GroupsTab';
import CreateGroup_1_NameImage from './screens/2_GroupChats/CreateGroup_1_NameImage';
import CreateGroup_2_Members from './screens/2_GroupChats/CreateGroup_2_Members';
import Topics from './screens/2_GroupChats/Topics';
import CreateTopic from './screens/2_GroupChats/CreateTopic';
import AddPin from './screens/2_GroupChats/AddPin';
import Pins from './screens/2_GroupChats/Pins';
import ViewPin from './screens/2_GroupChats/ViewPin';
import AddBanner from './screens/2_GroupChats/AddBanner';
import Banners from './screens/2_GroupChats/Banners';
import ViewBanner from './screens/2_GroupChats/ViewBanner';
import Events from './screens/2_GroupChats/Events';
import AddEvent from './screens/2_GroupChats/AddEvent';
import ViewEvent from './screens/2_GroupChats/ViewEvent';
import Polls from './screens/2_GroupChats/Polls';
import AddPoll from './screens/2_GroupChats/AddPoll';
import ViewPoll from './screens/2_GroupChats/ViewPoll';
import Images from './screens/2_GroupChats/Images';
import ViewImage from './screens/2_GroupChats/ViewImage';
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
import { Timestamp } from 'firebase/firestore';

const Stack = createStackNavigator();
const TabStack = createBottomTabNavigator();
const getInsets = () => {
  return useSafeAreaInsets();
}

const TabStackScreen = () => (
  <TabStack.Navigator
    headerMode="none"
    screenOptions={({ route }) => ({
      initialRouteName: "Home",
      headerShown: false,
      tabBarStyle: { height: (80 + getInsets().bottom) },
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
            style={{ paddingTop: 8 }}
          />
        );
      },
      tabBarActiveTintColor: "#1174EC",
      tabBarInactiveTintColor: '#808080',
    })}
  >

    <TabStack.Screen
      name='Home'
      component={HomeStackScreen}
      screenOptions={{gestureEnabled: false}}
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
  <Stack.Navigator screenOptions={{
    headerBackTitleVisible: false,
    headerTintColor: "#000",
    headerTitleAlign: 'center',
  }}>
    <Stack.Screen name='HomeTab' component={HomeTab} />
    <Stack.Screen name='ActiveEvents' component={ActiveEvents} />
    <Stack.Screen name='ViewEventHome' component={ViewEventHome} />
    <Stack.Screen name='ActivePolls' component={ActivePolls} />
    <Stack.Screen name='ViewPollHome' component={ViewPollHome} />
  </Stack.Navigator>
)

const GroupChatsStackScreen = () => (
  <Stack.Navigator screenOptions={{
    headerBackTitleVisible: false,
    headerTintColor: "#000",
    headerTitleAlign: 'center',
  }}>
    <Stack.Screen name='GroupsTab' component={GroupsTab} />
    <Stack.Screen name='AddChat' component={AddChatScreen} />
    <Stack.Screen name='Chat' component={ChatScreen} />
    <Stack.Screen name='Topics' component={Topics} />
    <Stack.Screen name='CreateGroup_1_NameImage' component={CreateGroup_1_NameImage} />
    <Stack.Screen name='CreateGroup_2_Members' component={CreateGroup_2_Members} />
    <Stack.Screen name='CreateTopic' component={CreateTopic} />
    <Stack.Screen name='AddPin' component={AddPin} />
    <Stack.Screen name='Pins' component={Pins} />
    <Stack.Screen name='ViewPin' component={ViewPin} />
    <Stack.Screen name='AddBanner' component={AddBanner} />
    <Stack.Screen name='Banners' component={Banners} />
    <Stack.Screen name='ViewBanner' component={ViewBanner} />
    <Stack.Screen name='Events' component={Events} />
    <Stack.Screen name='AddEvent' component={AddEvent} />
    <Stack.Screen name='ViewEvent' component={ViewEvent} />
    <Stack.Screen name='Polls' component={Polls} />
    <Stack.Screen name='AddPoll' component={AddPoll} />
    <Stack.Screen name='ViewPoll' component={ViewPoll} />
    <Stack.Screen name='Images' component={Images} />
    <Stack.Screen name='ViewImage' component={ViewImage} />
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const prefix = Linking.createURL('/');
// familychat://
// exp://10.186.150.80:19000/--/
// chat/topicId/topicName/groupId/groupName/groupOwner/color/coverImageNumber/lastReadTimeSeconds

const config = {
  screens: {
    TabStack: {
      initialRouteName: "HomeTab",
      screens: {
        Home: {
          initialRouteName: "HomeTab",
          screens: {
            HomeTab: {path: 'home', exact: true},
          },
        },
        Groups: {
          initialRouteName: "GroupsTab",
          screens: {
            GroupsTab: "GroupsTab",
            Chat: {exact: true,
              path: 'chat/:topicId/:topicName/:groupId/:groupName/:groupOwner/:color/:coverImageNumber/:lastReadTimeSeconds',
              parse: {
                lastReadTimeSeconds: seconds => {new Timestamp(seconds, 0)}
              }
            },
            Banners: 'banners',
            Events: 'events',
            Polls: 'polls',
          },
        },
        Messages: {
          screens: {
            DMsTab: {
              exact: true,
              path: 'dms'
            },
          },
        },
        Profile: {
          screens: {
            ProfileTab: 'profile',
          },
        },
      },
    },
  },
};
const linking = {
  prefixes: [prefix],
  config: config,
};

// Screen definitions for the application.
export default function App() {

  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("data = "+JSON.stringify(response.notification.request.content.data))
      const url = response.notification.request.content.data.url;
      Linking.openURL(url);
    });
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
    <MenuProvider customStyles={{
      backdrop: {
        opacity: 0.35, backgroundColor: "#000"
      },
    }}>
      {/* <SafeAreaView style={styles.safeAreaContainer}> */}
        <NavigationContainer linking={linking}>
          {/* <Stack.Navigator screenOptions={globalScreenOptions} > */}
          <Stack.Navigator>

            {/* Authentication Screens */}
            <Stack.Screen name='UserAuth' component={UserAuth} options={{ headerShown: false }} />
            <Stack.Screen name='RegisterPhone' component={RegisterPhone} />
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='VerifyPhone' component={VerifyPhone} />
            <Stack.Screen name="PhoneSuccess" component={PhoneSuccess} />
            <Stack.Screen name="UserCreated" component={UserCreated} />

            {/* Tabbed Screens */}
            <Stack.Screen name="TabStack" component={TabStackScreen} options={{ headerShown: false }} />

          </Stack.Navigator>
        </NavigationContainer>
      {/* </SafeAreaView> */}
    </MenuProvider>
    </SafeAreaProvider>
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