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
import LargeButton from '../../components/LargeButton'
import LargeTitle from '../../components/LargeTitle'
import Logo from '../../assets/appLogo.svg'

// *************************************************************

// First page the user sees when they open the application.
const UserAuth = ({ navigation }) => {

    const goToRegisterPhone = () => {
        navigation.navigate('RegisterPhone');
    };

    const goToLogin = () => {
        navigation.replace('Login');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { color: 'black' },
            headerLeft: '',
            headerRight: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginRight: 20,
                    }}
                >
                    <Tooltip
                        popover={
                            <Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Mauris malesuada lorem vel dui porta, in molestie justo interdum.
                                Phasellus blandit ipsum non tortor eleifend accumsan ornare vel turpis.
                                Quisque dictum.
                            </Text>
                        }
                        backgroundColor={'lightgray'}
                        containerStyle={{ width: null, height: null }}
                    >
                        <Icon
                            name='info'
                            type='feather'
                            color='black'
                        />
                    </Tooltip>
                </View>
            )
        });
    }, [navigation]);

    console.log(auth.currenUser);

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>

                <LargeTitle title="Family Chat" />

                <View style={styles.elements}>
                    <Logo width={150} height={150} />
                </View>

                <View style={styles.elements}>
                    <LargeButton title="Create an Account" type="" onPress={goToRegisterPhone} />
                    <LargeButton title="Login" type="Secondary" onPress={goToLogin} />
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

    elements: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 25,
        paddingHorizontal: 25,
        marginTop: 10,
    },
});

export default UserAuth;