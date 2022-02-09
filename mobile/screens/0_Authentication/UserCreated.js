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
  return (
    <>
    <Text h3 style={{ marginBottom: 50 }}>
      Welcome {firstName} {lastName}
			</Text>
      <LargeButton 
        style={styles.button}
        title= 'Guided Tour'
      />
      <LargeButton 
        onPress={() => navigation.replace('HomeTab')}
        style={styles.button}
        title= 'Go to Home Screen'
      />
    </>
  );
};

export default UserCreated;

const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 200,
      margin: 25,
  },
})