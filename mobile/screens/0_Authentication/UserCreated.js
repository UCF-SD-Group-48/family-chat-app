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
import LargeButton from '../../components/LargeButton'
import LargeTitle from '../../components/LargeTitle'
import Logo from '../../assets/appLogo.svg'

// *************************************************************

// Confirm to the user that their account was created, and give them the option to view a Guided Tour OR go straight to the Home screen.
const UserCreated = ({ navigation, route }) => {
  const firstName = route.params.firstName;
  const lastName = route.params.lastName;
  const profilePic = route.params.profilePic;

  const isLoggedIn = () => {
    if (auth.currentUser === null) {
      return false;
    } else {
      return true;
    }
  };

  console.log(isLoggedIn() + '' + auth.currentUser.phoneNumber);

  console.log(auth.currentUser != null)

  return (
    <>
      <Text h3 style={{ marginBottom: 50 }}>
        Welcome {firstName} {lastName}
      </Text>
      <Image
        source={{ uri: profilePic }}
        style={{ width: 100, height: 100 }}
      />
      <LargeButton
        style={styles.button}
        title='Guided Tour'
      />
      <LargeButton
        onPress={() => {
          navigation.replace('Home');
        }}
        style={styles.button}
        title='Go to Home Screen'
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    margin: 25,
  },
});

export default UserCreated;