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

// ************************************************************

// Stylesheet to be imported for the Authentication Screen.
export default StyleSheet.create({
    container: {
        height: '100%',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    top_centerAligned_view: {
        width: '100%',
        flex: -1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    middle_centerAligned_view: {
        flex: 1,
        flexGrow: 1,
    },
    bottom_centerAligned_view: {
        height: Platform.OS === 'ios' ? 22 : 0,
    }
});