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
    Touchable,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {
    Alert,
    Avatar,
    Badge,
    Button,
    Icon,
    Image,
    Input,
    Tab,
    TabView,
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
} from '../firebase';
import firebase from 'firebase/compat/app';
import LineDivider from './LineDivider';

// *************************************************************

const DismissButton = () => {

    return (
        <View
            style={{
                height: 35,
                width: 100,
                borderWidth: 2,
                borderRadius: '5%',
                borderColor: 'black',
                justifyContent: 'center',
            }}
        >
            <Text
                style={{
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: '600',
                }}
            >
                DISMISS
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({

});

export default DismissButton;