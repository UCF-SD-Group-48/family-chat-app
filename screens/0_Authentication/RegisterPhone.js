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
const RegisterPhone = ({ navigation, route }) => {

    // const [phoneNumber, setPhoneNumber] = useState();
    // const [verificationId, setVerificationId] = useState();
    // const [confirm, setConfirm] = useState(null);
    // const recaptchaVerifier = useRef(null);

    const goBackToPreviousScreen = () => {
        navigation.navigate('UserAuth');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Register Phone',
            headerStyle: { backgroundColor: '#FFE5B8' },
            headerTitleStyle: { color: 'black' },
            headerTintColor: 'black',
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={goBackToPreviousScreen}>
                        <Icon
                            name='arrow-back'
                            type='ionicon'
                            color='black'
                            size={28}
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: ''
        });
    }, [navigation]);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

    useEffect(() => {
        setSubmitButtonDisabled((phoneNumber.length === 10) ? false : true);
        return () => {setSubmitButtonDisabled(true)}
    }, [phoneNumber]);

    const [shownPhoneText, setShownPhoneText] = useState('');

    function formatPhoneInput(value) {
        if (!value) {
            if (phoneNumber.length === 1) setPhoneNumber('');
            return value;
        };
        const phoneEntry = value.replace(/[^\d]/g, '');
        setPhoneNumber(phoneEntry);
        const phoneEntryLength = phoneEntry.length;
        if (phoneEntryLength < 4) return phoneEntry;
        if (phoneEntryLength < 7) return `(${phoneEntry.slice(0, 3)}) ${phoneEntry.slice(3)}`;
        return `(${phoneEntry.slice(0, 3)}) ${phoneEntry.slice(3, 6)}-${phoneEntry.slice(6, 10)}`;
    }

    const handlePhoneInput = (textChange) => {
        const phoneInputFormatted = formatPhoneInput(textChange);
        setShownPhoneText(phoneInputFormatted);
    };

    const [verificationId, setVerificationId] = useState();
    const recaptchaVerifier = useRef(null);

    const phoneSubmit = async () => {
        try {
            const newUserRegistration = true;
            const phoneNumberFormatted = '+1' + phoneNumber.slice(0, 3) + '' + phoneNumber.slice(3, 6) + '' + phoneNumber.slice(6, 10);
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
                ((phoneNumber).toLowerCase() === '000') ? '+1 650 555 1234' : phoneNumberFormatted,
                recaptchaVerifier.current
            );
            setVerificationId(verificationId);

            if (verificationId) {
                const phoneNumberToPass = (phoneNumber.length > 3) ? phoneNumberFormatted : '+1 650 555 1234';
                navigation.navigate('VerifyPhone', { verificationId, phoneNumberToPass, newUserRegistration });
            };
        } catch (error) {
            console.log('[UserAuth.js] phoneSubmit() / ERROR: ' + error);
        }
    };

    return (
        <SafeAreaView style={{backgroundColor: "#FCF3EA"}}>
            <StatusBar style='dark' />
            <ScrollView style={styles.container}>

                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                />
                <View style={styles.title}>
                    <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: 'bold' }}>
                        Register your phone:
                    </Text>
                    <View style={{ width: '85%' }}>

                        <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>
                            Create a new account by first providing your phone number:
                        </Text>
                    </View>
                </View>
                <View style={styles.elements}>

                    <View
                        style={{
                            flexDirection: 'row',
                            marginBottom: 16,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={(
                                phoneNumber.length === 0)
                                ? styles.phoneInputStart
                                : ((phoneNumber.length === 10)
                                    ? styles.phoneInputEnd
                                    : styles.phoneInputDuring
                                )}
                        >
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>+1 </Text>
                            <TextInput
                                onChangeText={(textChange) => handlePhoneInput(textChange)}
                                placeholder={'(201) 555-0123'}
                                hideUnderline
                                value={shownPhoneText}
                                keyboardType={'phone-pad'}
                                maxLength={14}
                                autoFocus={true}
                                style={{ fontSize: 18, marginLeft: 3, marginRight: 15 }}
                            />
                        </View>
                    </View>

                    {submitButtonDisabled
                        ? <View>
                            <TouchableOpacity
                                style={styles.submitButtonDisabledStyling}
                                disabled={true}
                            >
                                <Text style={styles.submitButtonTextDisabledStyling}>Register</Text>
                            </TouchableOpacity>
                        </View>
                        : <View>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                onPress={phoneSubmit}
                                style={styles.submitButtonEnabledStyling}
                                disabled={false}
                            >
                                <Text style={styles.submitButtonTextEnabledStyling}>Register</Text>
                                <Icon
                                    name='arrow-forward'
                                    type='ionicon'
                                    color='white'
                                    size={28}
                                />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                {/* </View> */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#FCF3EA',
    },
    title: {
        position: 'relative',
        textAlign: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    elements: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 25,
    },
    centered: {
        width: '90%',
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    phoneInputStart: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 50,
        width: 200,
        alignItems: 'center',
        marginLeft: 13,
        paddingLeft: 13,
        borderColor: 'grey',
        borderWidth: 2,
    },

    phoneInputDuring: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 50,
        width: 200,
        alignItems: 'center',
        marginLeft: 13,
        paddingLeft: 13,
        borderColor: '#F9C977',
        borderWidth: 2,
    },

    phoneInputEnd: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 50,
        width: 200,
        alignItems: 'center',
        marginLeft: 13,
        paddingLeft: 13,
        borderColor: '#4492D2',
        borderWidth: 2,
    },

    submitButtonEnabledStyling: {
        height: 65,
        width: 250,
        textAlign: 'center',
        marginBottom: 15,
        backgroundColor: '#4A5060',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'black',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    submitButtonTextEnabledStyling: {
        fontSize: 25,
        fontWeight: '600',
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 7,
        marginLeft: 12,
    },

    submitButtonDisabledStyling: {
        height: 65,
        width: 250,
        textAlign: 'center',
        marginBottom: 15,
        backgroundColor: '#e3e6e8',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'lightgrey',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonTextDisabledStyling: {
        fontSize: 25,
        fontWeight: '500',
        color: 'lightgrey',
    },
});

export default RegisterPhone;