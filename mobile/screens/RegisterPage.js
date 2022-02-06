import { StatusBar } from 'expo-status-bar';
import React, {useState, useLayoutEffect, useRef} from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Text, TextInput, TouchableOpacity, Platform, Alert } from 'react-native-elements';
import { KeyboardAvoidingView  } from 'react-native';
import { auth, firebaseConfig } from '../firebase';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import firebase from 'firebase/compat/app';


const RegisterPage = ({ navigation }) => {
    const[phoneNumber, setPhoneNumber] = useState();
    const[confirm, setConfirm] = useState(null);
    const recaptchaVerifier = useRef(null);
    const [verificationId, setVerificationId] = useState();
    // const [message, showMessage] = useState((!firebaseConfig || Platform.OS === 'web'));
    // //   ? { text: "To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device."}
    // //   : undefined);

    const phoneSubmit = async () => {
         try {
             console.log("hey hey hey")
             console.log(phoneNumber)
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
              phoneNumber,
              recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            navigation.navigate('PhoneVerification', { verificationId, phoneNumber });
            // showMessage({
            //   text: "Verification code has been sent to your phone.",
            // });
          } catch (err) {
            // showMessage({ text: `Error: ${err.message}`, color: "red" });
            console.log(err)
          }
    };
    

  return (
    <KeyboardAvoidingView behavior='padding' style={ styles.container }>
        <StatusBar style='light'/>
        <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
        />

        <Text h3 style={{ marginBottom: 50 }}>
            ENTER PHONE #
        </Text>

        <View style={styles.inputContainer}>
            <Input
                placeholder="+1 999 999 9999"
                autoFocus
                // autoCompleteType="tel"
                // keyboardType="phone-pad"
                // textContentType="telephoneNumber"
                onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
            />

        </View>
        <Button 
            style={styles.button}
            raised
            onPress={ phoneSubmit }
            title='Submit'
            
        />
        {/* {message ? (
        <TouchableOpacity
          style={[StyleSheet.absoluteFill, { backgroundColor: 0xffffffee, justifyContent: "center" }]}
          onPress={() => showMessage(undefined)}>
          <Text style={{color: message.color || "blue", fontSize: 17, textAlign: "center", margin: 20, }}>
            {message.text}
          </Text>
        </TouchableOpacity>
      ) : undefined} */}
        <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    button: {
        width: 200,
        marginTop: 10,
    },
    inputContainer: {
        width: 300,
    }
});