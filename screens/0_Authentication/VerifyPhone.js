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
    Divider,
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

/*  Verify that the provided phone number is real,
    by checking if the entered code matches the one sent. 
*/

const VerifyPhone = ({ navigation, route }) => {

    let [phoneNumber, setPhoneNumber] = useState(route.params.phoneNumberToPass);
    const newUserRegistration = route.params.newUserRegistration;

    const phoneNumberFormatted = () => {
        if (newUserRegistration) {
            const noCountryCode = phoneNumber.substring(2)
            const beginning = noCountryCode.slice(0, 3);
            const middle = noCountryCode.slice(3, 6);
            const end = noCountryCode.slice(6, 10);
            return '(' + beginning + ') ' + middle + '-' + end;
        } else {
            const noCountryCode = phoneNumber.substring(3)
            const beginning = noCountryCode.slice(0, 3);
            const middle = noCountryCode.slice(4, 7);
            const end = noCountryCode.slice(8, 12);
            return '(' + beginning + ') ' + middle + '-' + end;
        }
    }

    const goBackToPreviousScreen = () => {
        if (newUserRegistration) navigation.navigate('RegisterPhone');
        else navigation.navigate('UserAuth');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Phone Verification',
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

    const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(true);
    const verificationId = route.params.verificationId;
    const [verificationCode, setVerificationCode] = useState('');

    useEffect(() => {
        setConfirmButtonDisabled((verificationCode.length === 6) ? false : true);
    }, [verificationCode]);

    const [shownPhoneText, setShownPhoneText] = useState('');

    function formatcodeInput(value) {
        if (!value) {
            if (verificationCode.length === 1) setVerificationCode('');
            return value;
        };
        const phoneEntry = value.replace(/[^\d]/g, '');
        setVerificationCode(phoneEntry);
        return phoneEntry;
    }

    const handleVerificationCodeInput = (textChange) => {
        const codeInputFormatted = formatcodeInput(textChange);
        setShownPhoneText(codeInputFormatted);
    };

    const confirmationSubmit = async () => {
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                verificationCode
            );
            const user = await auth.signInWithCredential(credential)
            if (newUserRegistration) {


                // No account found, phone is verified, navigate to Registration (UserCreated) screen.
                navigation.navigate('PhoneSuccess', { phoneNumber });
            } else {
                navigation.replace('TabStack');
            }
        } catch (err) {
            console.log("verification code " + verificationCode)
            console.log("verifcationId " + verificationId)
            console.log("failed")
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <View style={styles.subtext}>
                    <Text style={{ fontSize: 30, textAlign: 'center', marginBottom: 10, fontWeight: 'bold' }}>
                        We sent a code to:
                    </Text>
                    <View style={{
                        backgroundColor: 'white',
                        width: 250,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: '#e3e6e8',
                        borderRadius: 10,
                    }}>
                        <Text style={{ fontSize: 20, textAlign: 'center', margin: 15, fontWeight: '600' }}>
                            {phoneNumberFormatted()}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 30 }}>
                        Check your phone and enter the provided verification code:
                    </Text>
                </View>
                <View style={styles.centered}>
                    <TextInput
                        style={(
                            verificationCode.length === 0)
                            ? styles.codeInputStart
                            : ((verificationCode.length === 6)
                                ? styles.codeInputEnd
                                : styles.codeInputDuring
                            )}
                        onChangeText={(textChange) => handleVerificationCodeInput(textChange)}
                        placeholder={'123456'}
                        hideUnderline
                        value={shownPhoneText}
                        keyboardType={'phone-pad'}
                        maxLength={6}
                        autoFocus={true}
                    />

                    {confirmButtonDisabled
                        ? <View>
                            <TouchableOpacity
                                style={styles.confirmButtonDisabledStyling}
                                disabled={true}
                            >
                                <Text style={styles.confirmButtonTextEnabledStyling}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                        : <TouchableOpacity
                            style={styles.confirmButtonEnabledStyling}
                            onPress={confirmationSubmit}
                        // onPress={async () => {
                        //     try {
                        //         // Verify Phone: Check the given code with the generated code
                        //         const credential = firebase.auth.PhoneAuthProvider.credential(
                        //             verificationId,
                        //             verificationCode,
                        //         );

                        //         // Login
                        //         await auth.signInWithCredential(credential);

                        //         console.log('Phone Verified.');

                        //         // go from "route.params.phoneNumber" which has the spaces
                        //         // and override with the value of the currentUser (AKA what's in the database)
                        //         // that value in the database, doesn't have spaces
                        //         phoneNumber = auth.currentUser.phoneNumber;

                        //         // Check the database, within the users collection, with the user's phone number
                        //         const userDocs = db.collection('users');
                        //         const snapshot = await userDocs.where('phoneNumber', '==', `${phoneNumber}`).get();

                        //         // Is there an existing account with the provided phone number?
                        //         if (snapshot.empty) {
                        //             console.log('No account found with given phone number.');
                        //             console.log('User forwarded to Registration (instead of HomeTab.)');

                        //             // No account found, phone is verified, navigate to Registration (UserCreated) screen.
                        //             navigation.navigate('PhoneSuccess', { phoneNumber });
                        //             return;
                        //         } else {
                        //             let userInformation;
                        //             console.log('Account found.');

                        //             // Print user account data for console.
                        //             snapshot.forEach(doc => {
                        //                 console.log(doc.id, '=>', doc.data());
                        //                 userInformation = doc.data();
                        //             });

                        //             console.log('Successful login attempt.');
                        //             console.log('User forwarded to HomeTab.');

                        //             // User exists, phone is verified, logged in, navigate to HomeTab.
                        //             navigation.navigate('TabStack', { userInformation });
                        //             return;
                        //         }
                        //     } catch (err) {
                        //         console.log(err);
                        //     }
                        // }
                        >
                            <Text style={styles.confirmButtonTextEnabledStyling}>Confirm</Text>
                            <Icon
                                name='arrow-forward'
                                type='ionicon'
                                color='white'
                                size={28}
                            />
                        </TouchableOpacity>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#FCF3EA',
    },
    subtext: {
        width: '85%',
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
        marginTop: 10,
        paddingVertical: 25,
        paddingHorizontal: 25,
        borderWidth: 2,
        borderColor: '#888',
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

    codeInputStart: {
        backgroundColor: 'white',
        height: 50,
        width: 200,
        alignItems: 'center',
        marginLeft: 13,
        paddingLeft: 13,
        borderColor: 'grey',
        borderWidth: 2,
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        fontSize: 17,
        backgroundColor: 'white',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 15,
    },
    codeInputDuring: {
        backgroundColor: 'white',
        height: 50,
        width: 200,
        alignItems: 'center',
        marginLeft: 13,
        paddingLeft: 13,
        borderColor: '#F9C977',
        borderWidth: 2,
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        fontSize: 17,
        backgroundColor: 'white',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 15,
    },
    codeInputEnd: {
        backgroundColor: 'white',
        height: 50,
        width: 200,
        alignItems: 'center',
        marginLeft: 13,
        paddingLeft: 13,
        borderColor: '#4492D2',
        borderWidth: 2,
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        fontSize: 17,
        backgroundColor: 'white',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 15,
    },

    confirmButtonEnabledStyling: {
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
    confirmButtonTextEnabledStyling: {
        fontSize: 25,
        fontWeight: '600',
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 7,
        marginLeft: 12,
    },

    confirmButtonDisabledStyling: {
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
    confirmButtonTextDisabledStyling: {
        fontSize: 25,
        fontWeight: '500',
        color: 'lightgrey',
    },
});

export default VerifyPhone;