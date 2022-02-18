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

/*  Verify that the provided phone number is real,
    by checking if the entered code matches the one sent. 
*/
const VerifyPhone = ({ navigation, route }) => {
    const verificationId = route.params.verificationId;
    const [verificationCode, setVerificationCode] = useState();
    let phoneNumber = route.params.phoneNumber;
    const [inputText, onChangeText] = useState('');

    const goBackToPreviousScreen = () => {
        navigation.navigate('RegisterPhone');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
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
            headerRight: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginRight: 20,
                    }}
                >
                    <Text>
                        *VERIFY YOUR PHONE*
                    </Text>
                </View>
            )
        });
    }, [navigation]);

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>

                <LargeTitle title='Verify' />

                <View style={styles.centered}>
                    <LineDivider />
                </View>

                <View style={styles.subtext}>
                    <Text style={{ fontSize: 18 }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Mauris malesuada lorem vel dui porta, in molestie justo interdum.
                    </Text>
                </View>
                <View style={styles.centered}>
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

                                /*
                                    The way the app should function, instead of what is shown below is:
                                        The user enters a phone number,
                                        We remove the spaces from that input,
                                        We check the database for a user with that phone number (also assuming there's only one),
                                        If there exists a user, then forward them to "VerifyPhone"
                                            If there ISN'T an account, then show an error, and give them the option to Register.
                                */

                                // Verify Phone: Check the given code with the generated code
                                const credential = firebase.auth.PhoneAuthProvider.credential(
                                    verificationId,
                                    verificationCode,
                                );

                                // Login
                                await auth.signInWithCredential(credential);

                                console.log('Phone Verified.');

                                // go from "route.params.phoneNumber" which has the spaces
                                // and override with the value of the currentUser (AKA what's in the database)
                                // that value in the database, doesn't have spaces
                                phoneNumber = auth.currentUser.phoneNumber;

                                // Check the database, within the users collection, with the user's phone number
                                const userDocs = db.collection('users');
                                const snapshot = await userDocs.where('phoneNumber', '==', `${phoneNumber}`).get();

                                // Is there an existing account with the provided phone number?
                                if (snapshot.empty) {
                                    console.log('No account found with given phone number.');
                                    console.log('User forwarded to Registration (instead of HomeTab.)');

                                    // No account found, phone is verified, navigate to Registration (UserCreated) screen.
                                    navigation.navigate('PhoneSuccess', { phoneNumber });
                                    return;
                                } else {
                                    let userInformation;
                                    console.log('Account found.');

                                    // Print user account data for console.
                                    snapshot.forEach(doc => {
                                        console.log(doc.id, '=>', doc.data());
                                        userInformation = doc.data();
                                    });

                                    console.log('Successful login attempt.');
                                    console.log('User forwarded to HomeTab.');

                                    // User exists, phone is verified, logged in, navigate to HomeTab.
                                    navigation.navigate('HomeTab', { userInformation });
                                    return;
                                }
                            } catch (err) {
                                console.log(err);
                            }
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: 'white',
    },
    subtext: {
        width: '85%',
        position: 'relative',
        textAlign: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 25,
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
    }
});

export default VerifyPhone;