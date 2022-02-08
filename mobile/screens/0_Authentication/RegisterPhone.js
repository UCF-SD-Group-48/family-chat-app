import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import {
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {
    Alert,
    Button,
    Icon,
    Input,
    Platform,
    Text,
    TouchableOpacity,
} from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth, firebaseConfig } from '../../firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import firebase from 'firebase/compat/app';

import LargeTitle from '../../components/LargeTitle';
import LineDivider from '../../components/LineDivider';
import LargeButton from '../../components/LargeButton';

const RegisterPhone = ({ navigation }) => {

    const[phoneNumber, setPhoneNumber] = useState();
    const[confirm, setConfirm] = useState(null);
    const recaptchaVerifier = useRef(null);
    const [verificationId, setVerificationId] = useState();

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
            navigation.navigate('PhoneVerification', { verificationId, phoneNumber });
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