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
import LargeButton from '../../components/LargeButton';
import LargeTitle from '../../components/LargeTitle';
import LineDivider from '../../components/LineDivider';

// *************************************************************

// Take the provided phone number, from the user, and check it's validity + reCAPTCHA.
const RegisterPhone = ({ navigation }) => {

    const [phoneNumber, setPhoneNumber] = useState();
    const [verificationId, setVerificationId] = useState();
    const [confirm, setConfirm] = useState(null);
    const recaptchaVerifier = useRef(null);

    const goBackToPreviousScreen = () => {
        navigation.replace('UserAuth');
    };

    const phoneSubmit = async () => {
        try {
            console.log(phoneNumber)
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            navigation.navigate('VerifyPhone', { verificationId, phoneNumber });
            // showMessage({
            //   text: "Verification code has been sent to your phone.",
            // });
        } catch (err) {
            // showMessage({ text: `Error: ${err.message}`, color: "red" });
            console.log(err)
        }
    };

    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerBackTitle: 'Back to Login',
    //     })
    // }, [navigation])

    // useEffect(() => {
    //     navigation.setOptions({
    //         title: 'Registration',
    //         headerStyle: { backgroundColor: '#fff' },
    //         headerTitleStyle: { color: 'black' },
    //         headerTintColor: 'black',
    //         headerLeft: () => (
    //             <View style={{ marginLeft: 20 }}>
    //                 <TouchableOpacity activeOpacity={0.5} onPress={goBackToPreviousScreen}>
    //                     <Icon
    //                         name='md-chevron-back-sharp'
    //                         type='ionicon'
    //                         color='black'
    //                     />
    //                 </TouchableOpacity>
    //             </View>
    //         ),
    //         headerRight: '',
    //     });
    // }, [navigation]);

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>

                    <FirebaseRecaptchaVerifierModal
                        ref={recaptchaVerifier}
                        firebaseConfig={firebaseConfig}
                    />

                    <LargeTitle title='Phone Number:' />

                    <LineDivider />

                    <Text style={styles.subtext}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Mauris malesuada lorem vel dui porta, in molestie justo interdum.
                    </Text>

                    <View style={{ width: '90%' }}>
                        <Input
                            placeholder='+1 123 456 7890'
                            autoFocus
                            // autoCompleteType="tel"
                            // keyboardType="phone-pad"
                            // textContentType="telephoneNumber"
                            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                        />
                    </View>
                    
                    <View style={styles.button}>
                        <LargeButton
                            title='Submit'
                            type=''
                            onPress={phoneSubmit}
                            style={styles.button}
                        />
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
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
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        margin: 25,
    },
});

export default RegisterPhone;