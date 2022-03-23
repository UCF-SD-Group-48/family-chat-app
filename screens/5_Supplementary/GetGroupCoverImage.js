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
    Linking,
} from 'react-native';
import {
    Alert,
    Avatar,
    Badge,
    Button,
    Icon,
    Image,
    Input,
    Tooltip,
    Switch,
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

export default getGroupCoverImage = (color, number) => {
    console.log(color, number)
    if (color === 'purple') {
        switch (number) {
            case 1: {
                return require('../../assets/groupCoverImages/cover_P1.png')
            }
            case 2: {
                return require('../../assets/groupCoverImages/cover_P2.png')
            }
            case 3: {
                return require('../../assets/groupCoverImages/cover_P3.png')
            }
            case 4: {
                return require('../../assets/groupCoverImages/cover_P4.png')
            }
        }
    } else if (color === 'blue') {
        switch (number) {
            case 1: {
                return require('../../assets/groupCoverImages/cover_B1.png')
            }
            case 2: {
                return require('../../assets/groupCoverImages/cover_B2.png')
            }
            case 3: {
                return require('../../assets/groupCoverImages/cover_B3.png')
            }
            case 4: {
                return require('../../assets/groupCoverImages/cover_B4.png')
            }
        }
    } else if (color === 'green') {
        switch (number) {
            case 1: {
                return require('../../assets/groupCoverImages/cover_G1.png')
            }
            case 2: {
                return require('../../assets/groupCoverImages/cover_G2.png')
            }
            case 3: {
                return require('../../assets/groupCoverImages/cover_G3.png')
            }
            case 4: {
                return require('../../assets/groupCoverImages/cover_G4.png')
            }
        }
    } else if (color === 'yellow') {
        switch (number) {
            case 1: {
                return require('../../assets/groupCoverImages/cover_Y1.png')
            }
            case 2: {
                return require('../../assets/groupCoverImages/cover_Y2.png')
            }
            case 3: {
                return require('../../assets/groupCoverImages/cover_Y3.png')
            }
            default: {
                return;
            }
        }
    } else if (color === 'orange') {
        switch (number) {
            case 1: {
                return require('../../assets/groupCoverImages/cover_O1.png')
            }
            case 2: {
                return require('../../assets/groupCoverImages/cover_O2.png')
            }
            case 3: {
                return require('../../assets/groupCoverImages/cover_O3.png')
            }
            default: {
                return;
            }
        }
    } else if (color === 'red') {
        switch (number) {
            case 1: {
                return require('../../assets/groupCoverImages/cover_R1.png')
            }
            case 2: {
                return require('../../assets/groupCoverImages/cover_R2.png')
            }
            case 3: {
                return require('../../assets/groupCoverImages/cover_R3.png')
            }
            default: {
                return;
            }
        }
    }
}