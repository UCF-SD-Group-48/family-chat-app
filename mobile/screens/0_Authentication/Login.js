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
    firebaseConfig,
} from '../../firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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

// Check the user's phone number, send them a code, and log them in if successful.
const Login = ({ navigation }) => {
    const goBackToPreviousScreen = () => {
        navigation.replace('UserAuth');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Login',
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { color: 'black' },
            headerTintColor: 'black',
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={goBackToPreviousScreen}>
                        <Icon
                            name='md-chevron-back-sharp'
                            type='ionicon'
                            color='black'
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: '',
        });
    }, [navigation]);

    const [phoneNumber, setPhoneNumber] = useState();
    const [verificationId, setVerificationId] = useState();
    const [verificationCode, setVerificationCode] = useState();
    const recaptchaVerifier = useRef(null);

    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged((authUser) => {
    //         if (authUser) {
    //             navigation.replace('HomeTab');
    //         }
    //     });
    //     return unsubscribe;
    // }, []);
 

    const phoneSubmit = async () => {
        try {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
                (phoneNumber == "Dev") ? "+1 650 555 1234" : phoneNumber,
            recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            console.log("line 130");
            
        } catch (err) {
            console.log("error caught " + err)
        }
    };

    const confirmationSubmit = async () => {
        try {
            let user;
            const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            verificationCode
            );
            console.log("credential " + credential)
            user = await auth.signInWithCredential(credential)
            if (user){
                console.log("user is authenticated")
                navigation.replace('TabStack');
            } else {
                navigation.navigate('Login')
            }

        } catch (err) {
            console.log("verification code " + verificationCode)
            console.log("verifcationId " + verificationId)
            console.log("failed")
        }
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>

                    <FirebaseRecaptchaVerifierModal
                        ref={recaptchaVerifier}
                        firebaseConfig={firebaseConfig}
                    />

                    <LargeTitle title='Welcome back!' />

                    <LineDivider />

                    <Text style={styles.subtext}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elitcam.
                        Quick use: '+1 650 555 1234'
                    </Text>
                    
                        <Input
                            placeholder='+1 123 456 7890'
                            autoFocus
                            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                        />

                    <Button
                            title="Send Verification Code"
                            disabled={!phoneNumber}
                            onPress={phoneSubmit}
                    />

                    <Button
                        title="Confirm Verification Code"
                        disabled={!verificationId}
                        onPress={confirmationSubmit}
                    />  

                        <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
                            <TextInput
                                style={{ marginVertical: 10, fontSize: 17 }}
                                editable={!!verificationId}
                                placeholder="123456"
                                onChangeText={setVerificationCode}
                            />

                        <LargeButton
                            title='Submit'
                            type=''
                            onPress={phoneNumber}
                            style={styles.button}
                        />

                    {/* <Input
                        placeholder='john123@email.com'
                        autoFocus
                        onChangeText={(email) => setEmail(email)}
                    />
                    <Input
                        placeholder='******'
                        autoFocus
                        onChangeText={(password) => setPassword(password)}
                    />
                    <LargeButton
                        title='Submit'
                        type=''
                        onPress={signIn}
                        style={styles.button}
                    /> */}

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',

    },
    subtext: {
        width: '85%',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        margin: 10,
        padding: 15,
        fontSize: 18,
        textAlign: 'center',

    },
    elements: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 25,
        paddingHorizontal: 25,
    },
    inputContainer: {
        width: 300,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        margin: 25,
    },
});

export default Login;