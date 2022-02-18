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
const HomeTab = ({ navigation, route }) => {

  const goToTestHome = () => {
    navigation.navigate('Home');
  }

  const goToAddChat = () => {
    navigation.navigate('AddChat');
  }

  const goToHome = () => {
    navigation.navigate('HomeTab');
  }

  const goToGroupChats = () => {
    navigation.navigate('Groups');
  }

  const goToDMs = () => {
    navigation.navigate('DMsTab');
  }

  const goToProfile = () => {
    navigation.navigate('ProfileTab');
  }

  useEffect(() => {
    console.log('Current User: ', JSON.stringify(auth.currentUser));
  }, []);

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
          Welcome back {route.params?.userInformation?.firstName || "friend"},
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

      {/* <Text>Home Tab Screen</Text>
      <LargeButton
        onPress={() => { navigation.navigate('Topics') }}
      >
        Go to a Topic
      </LargeButton> */}

      <View style={{
        padding: 20, borderWidth: 2, borderStyle: 'solid', borderColor: 'black', borderRadius: 5, width: 325, justifyContent: 'center',
        alignItems: 'center', marginBottom: 20, marginTop: 20
      }}>

        <Icon
          name='checkbox-outline'
          type='ionicon'
          color='black'
          size={100}
          style={{ paddingBottom: 20 }}
        />
        <Text
          style={{ fontSize: 18 }}
        >
          You're all up to date!
        </Text>
        <Text
          style={{ fontSize: 18, paddingBottom: 20 }}
        >
          No new notifications at this time.
        </Text>
      </View>

      <View>
        <TouchableOpacity
          onPress={goToAddChat}
          style={{
            width: 300, height: 60, borderWidth: 2, borderStyle: 'solid', borderColor: 'black', borderRadius: 15, justifyContent: 'center',
            alignItems: 'center', marginBottom: 20, flexDirection: "row", backgroundColor: '#7DBF7F'
          }}
        >
          <Icon
            name='plus'
            type='entypo'
            color='black'
          />
          <Text
            style={{ fontSize: 18, paddingLeft: 15 }}
          >
            Start a new conversation
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default HomeTab;