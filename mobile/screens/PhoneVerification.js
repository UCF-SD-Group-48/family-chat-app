import { Text, View, TextInput, Button, StyleSheet, TouchableOpacity, Platform, Alert } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import {apps, auth, firebaseConfig} from '../firebase';
import firebase from 'firebase/compat/app';
import {useRef, useState} from 'react'



const PhoneVerification = ({ navigation, route }) => {
    const verificationId = route.params.verificationId;
    const [verificationCode, setVerificationCode] = useState();
    const phoneNumber = route.params.phoneNumber;


  return (
    <View style={{ padding: 20, marginTop: 50 }}>
     
      <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17 }}
        editable={!!verificationId}
        placeholder="123456"
        onChangeText={setVerificationCode}
      />
      <Button
        title="Confirm Verification Code"
        disabled={!verificationId}
        onPress={async () => {
          try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
              verificationId,
              verificationCode
            );
            await auth.signInWithCredential(credential);
            navigation.navigate('Success', {phoneNumber})
            console.log("Phone authentication successful")
          } catch (err) {
            console.log(err)
          }
        }}
      />
    </View>
  );
}


export default PhoneVerification;