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

// Verify the phone number, provided by the user.
const PhoneVerification = ({ navigation, route }) => {
  const verificationId = route.params.verificationId;
  const [verificationCode, setVerificationCode] = useState();
  const phoneNumber = route.params.phoneNumber;

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <Text style={{ marginTop: 20 }}>Enter verification code:</Text>

      <TextInput
        style={{ marginVertical: 10, fontSize: 17 }}
        editable={!!verificationId}
        placeholder='123456'
        onChangeText={setVerificationCode}
      />

      <Button
        title='Confirm Verification Code'
        disabled={!verificationId}
        onPress={async () => {
          try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
              verificationId,
              verificationCode
            );
            await auth.signInWithCredential(credential);
            navigation.navigate('PhoneSuccess', { phoneNumber })
            console.log('Phone authentication successful')
          } catch (err) {
            console.log(err)
          }
        }}
      />
    </View>
  );
}

export default PhoneVerification;