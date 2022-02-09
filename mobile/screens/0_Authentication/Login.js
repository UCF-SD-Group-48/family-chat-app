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
    const [confirm, setConfirm] = useState(null);
    const recaptchaVerifier = useRef(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.replace('HomeTab');
            }
        });
        return unsubscribe;
    }, []);

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password).catch(error => alert(error));
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
        } catch (err) {
            console.log(err)
        }
    };


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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Text>

                    {/* Email + Password input fields */}
                    {/* <Input placeholder='Email'
                        autoFocus
                        type='email'
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />
                    <Input placeholder='Password'
                        secureTextEntry
                        type='password'
                        value={password}
                        onChangeText={text => setPassword(text)}
                        onSubmitEditing={signIn}
                    /> */}

                    <Input
                        placeholder='+1 123 456 7890'
                        autoFocus
                        // autoCompleteType="tel"
                        // keyboardType="phone-pad"
                        // textContentType="telephoneNumber"
                        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                    />

                    <LargeButton
                        title='Submit'
                        type=''
                        onPress={phoneSubmit}
                        style={styles.button}
                    />

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