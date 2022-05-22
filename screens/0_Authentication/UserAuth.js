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
import LargeButton from '../../components/LargeButton';
import LargeTitle from '../../components/LargeTitle';
import Logo from '../../assets/appLogo.svg';

// *************************************************************

// First page the user sees when they open the application.
const UserAuth = ({ navigation }) => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [loginButtonDisabled, setLoginButtonDisabled] = useState(true);

    useEffect(() => {
        setLoginButtonDisabled((phoneNumber.length === 10) ? false : ((phoneNumber.length === 3) ? ((phoneNumber === '000') ? false : true) : true));
        return () => {setLoginButtonDisabled(true)}
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
            const newUserRegistration = false;
            const phoneNumberFormatted = '+1 ' + phoneNumber.slice(0, 3) + ' ' + phoneNumber.slice(3, 6) + ' ' + phoneNumber.slice(6, 10);
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

    const goToRegisterPhone = () => {
        // if (phoneNumber.length === 10) {
        //     navigation.navigate('VerifyPhone', { phoneNumber });
        // } else {
        //     navigation.navigate('VerifyPhone');
        // }
        navigation.navigate('RegisterPhone');
    };

    return (
        <SafeAreaView style={{backgroundColor: "#FCF3EA"}}>
            <StatusBar style='dark' />
            <ScrollView
            contentContainerStyle={{alignItems: "center",}}
            style={styles.container}
            >

                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                />

                <LargeTitle title='💬 FamilyChat' topSpacing={1} />

                <View
                    style={{
                        width: '76%',
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    <Divider
                        width={2}
                        color={'#e3e6e8'}
                    />
                </View>

                <View style={{ marginTop: 20, }}>
                    <Text
                        style={{
                            fontSize: 25,
                            textAlign: 'center',
                            fontWeight: '500'
                        }}>
                        Enter your phone number:
                    </Text>
                </View>

                <View style={styles.elements}>

                    <View
                        style={{
                            flexDirection: 'row',
                            marginBottom: 35,
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}
                    >
                        {/* <View
                            style={{
                                width: 75,
                                height: 50,
                                borderColor: 'grey',
                                borderRadius: '0%',
                                borderWidth: 2,
                                backgroundColor: 'white',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 32 }}>🇺🇸</Text>
                            <Icon
                                name='caret-down-sharp'
                                type='ionicon'
                                color='black'
                                size={12}
                                style={{ alignSelf: 'flex-end', marginLeft: 5 }}
                            />
                        </View> */}
                        <View
                            style={(
                                phoneNumber.length === 0)
                                ? styles.phoneInputStart
                                : ((phoneNumber.length === 10)
                                    ? styles.phoneInputEnd
                                    : styles.phoneInputDuring
                                )}
                        >
                            <Text style={{ marginLeft: 30, fontWeight: 'bold', fontSize: 22}}>+1 </Text>
                            <TextInput
                                onChangeText={(textChange) => handlePhoneInput(textChange)}
                                placeholder={'(201) 555-0123'}
                                hideUnderline
                                value={shownPhoneText}
                                keyboardType={'phone-pad'}
                                maxLength={14}
                                autoFocus={false}
                                style={{ fontSize: 22, marginLeft: 3, marginRight: 15 }}
                            />
                        </View>
                    </View>

                    {loginButtonDisabled
                        ? <View>
                            <TouchableOpacity
                                style={styles.loginButtonDisabledStyling}
                                disabled={true}
                            >
                                <Text style={styles.loginButtonTextDisabledStyling}>Login</Text>
                            </TouchableOpacity>
                        </View>
                        : <View>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                // onPress={(event => { navigation.navigate('Login') })}
                                onPress={phoneSubmit}
                                style={styles.loginButtonEnabledStyling}
                                disabled={false}
                            >
                                <Text style={styles.loginButtonTextEnabledStyling}>Login</Text>
                                <Icon
                                    name='arrow-forward'
                                    type='ionicon'
                                    color='white'
                                    size={28}
                                />
                            </TouchableOpacity>
                        </View>
                    }

                    <TouchableOpacity
                        onPress={goToRegisterPhone}
                        activeOpacity={0.5}
                    >
                        <Text style={{ fontSize: 15 }}>New to FamilyChat? <Text style={{ fontWeight: 'bold' }}>Sign Up</Text></Text>
                    </TouchableOpacity>
                </View>
                <View style={
                    {
                        width: '100%',
                        alignItems: 'center',
                        // position: 'absolute',
                        // bottom: 0,
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: 50,
                        justifyContent: 'center'
                    }}>
                    <Image
                        source={require('../../assets/abstractBlob.png')}
                        style={{ width: 350, height: 250, alignSelf: 'center', marginLeft: 60 }}
                    />
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

    elements: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 25,
        marginTop: 0,
    },

    phoneInputStart: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 60,
        width: 300,
        borderRadius: 2,
        alignItems: 'center',
        marginLeft: 13,
        paddingLeft: 13,
        borderColor: 'grey',
        borderWidth: 2,
    },

    phoneInputDuring: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 60,
        width: 300,
        alignItems: 'center',
        marginLeft: 13,
        paddingLeft: 13,
        borderColor: '#F9C977',
        borderWidth: 2,
    },

    phoneInputEnd: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 60,
        width: 300,
        alignItems: 'center',
        marginLeft: 13,
        paddingLeft: 13,
        borderColor: '#4492D2',
        borderWidth: 2,
    },

    loginButtonEnabledStyling: {
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

    loginButtonTextEnabledStyling: {
        fontSize: 25,
        fontWeight: '600',
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 7,
        marginLeft: 12,
    },

    loginButtonDisabledStyling: {
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

    loginButtonTextDisabledStyling: {
        fontSize: 25,
        fontWeight: '500',
        color: 'lightgrey',
    },
});

export default UserAuth;