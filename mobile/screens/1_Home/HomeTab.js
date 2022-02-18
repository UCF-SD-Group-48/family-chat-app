// *************************************************************
// Imports for: React, React Native, & React Native Elements
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
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

// Imports for: Expo
import { StatusBar } from 'expo-status-bar';
import ImagePicker from 'expo-image-picker';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

// Imports for: Firebase
import {
  apps,
  auth,
  db,
  firebaseConfig
} from '../../firebase';
import firebase from 'firebase/compat/app';

// Imports for: Components
import CustomListItem from '../../components/CustomListItem';
import LargeButton from '../../components/LargeButton';
import LargeTitle from '../../components/LargeTitle';
import LineDivider from '../../components/LineDivider';
import LoginInput from '../../components/LoginInput';
import LoginText from '../../components/LoginText';
import UserPrompt from '../../components/UserPrompt';

// *************************************************************

// First tab of the application: HOME.
const DirectMessagesTab = ({ navigation }) => {


  const goToHome = () => {
    navigation.navigate('HomeTab');
  }

  const goToGroupChats = () => {
    navigation.navigate('GroupChatsTab');
  }

  const goToDMs = () => {
    navigation.navigate('DMsTab');
  }

  const goToProfile = () => {
    navigation.navigate('ProfileTab');
  }

  useEffect(() => {
    // navigation.replace('GroupChatsTab');
    console.log('Current User: ', JSON.stringify(auth.currentUser));
  }, []);

  console.log("CHCIEKN SDFSDFSDF", auth.currentUser.displayName)

  return (

    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{ position: 'relative', width: 350, alignContent: 'center' }}
      >
        <Text
          style={{ color: 'black', fontSize: 25, paddingLeft: 25, paddingTop: 20 }}
        >
          Welcome back {auth.currentUser.displayName || "friend"},
        </Text>
        <Text
          style={{ color: 'black', fontSize: 25, paddingLeft: 25, paddingBottom: 10 }}
        >
          here's what you've missed:
        </Text>

      </View>

      <LineDivider style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }} />

      <Text>Home Tab Screen</Text>
      <LargeButton
        onPress={() => { navigation.navigate('Topics') }}
      >
        Go to a Topic
      </LargeButton>

      {/* 
      <LargeButton onPress={() => { navigation.navigate('HomeTab') }}>Home</LargeButton>
      <LargeButton onPress={() => { navigation.navigate('GroupChatsTab') }}>Group Chats</LargeButton>
      <LargeButton onPress={() => { navigation.navigate('DMsTab') }}>Direct Messages</LargeButton>
      <LargeButton onPress={() => { navigation.navigate('ProfileTab') }}>Profile</LargeButton>
      */}

      <View style={{ padding: 20, borderWidth: 2, borderStyle: 'solid', borderColor: 'black', width: 200 }}>
        <TouchableOpacity activeOpacity={0.5} onPress={goToHome} style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0 }}>
          <Icon
            name='home'
            type='material-community'
            color='black'
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={goToGroupChats} style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0, marginLeft: 30 }}>
          <Icon
            name='group'
            type='material'
            color='black'
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={goToDMs} style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0, marginLeft: 60 }}>
          <Icon
            name='direction'
            type='entypo'
            color='black'
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={goToProfile} style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0, marginLeft: 90 }}>
          <Icon
            name='person-pin'
            type='material'
            color='black'
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default DirectMessagesTab;