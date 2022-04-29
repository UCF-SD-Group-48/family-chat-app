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

export const getHexValue = (colorName) => {
    switch (colorName) {
        case 'purple': {
            return '#C0B7CC'
        }
        case 'blue': {
            return '#9DAFD1'
        }
        case 'green': {
            return '#87AC7B'
        }
        case 'yellow': {
            return '#DFCF8C'
        }
        case 'orange': {
            return '#D5B592'
        }
        case 'red': {
            return '#CB9B99'
        }
        default: {
            return '#777777'
        }
    }
}

export const imageSelection = (pfpDatabaseValue) => {
    switch (pfpDatabaseValue) {
        case 1: {
            return require('../../assets/pfpOptions/pfp_face_1.png')
        }
        case 2: {
            return require('../../assets/pfpOptions/pfp_face_2.png')
        }
        case 3: {
            return require('../../assets/pfpOptions/pfp_face_3.png')
        }
        case 4: {
            return require('../../assets/pfpOptions/pfp_face_4.png')
        }
        case 5: {
            return require('../../assets/pfpOptions/pfp_face_5.png')
        }
        case 6: {
            return require('../../assets/pfpOptions/pfp_face_6.png')
        }
        case 7: {
            return require('../../assets/pfpOptions/pfp_face_7.png')
        }
        case 8: {
            return require('../../assets/pfpOptions/pfp_face_8.png')
        }
        case 9: {
            return require('../../assets/pfpOptions/pfp_face_9.png')
        }
        case 10: {
            return require('../../assets/pfpOptions/pfp_face_10.png')
        }
        case 11: {
            return require('../../assets/pfpOptions/pfp_face_11.png')
        }
        case 12: {
            return require('../../assets/pfpOptions/pfp_face_12.png')
        }
        case 13: {
            return require('../../assets/pfpOptions/pfp_face_13.png')
        }
        case 14: {
            return require('../../assets/pfpOptions/pfp_face_14.png')
        }
        case 15: {
            return require('../../assets/pfpOptions/pfp_face_15.png')
        }
        default: {
            return;
        }
    }
}

const GenerateProfileIcon = (props) => {
    const [phoneNumber, setPhoneNumber] = useState((auth.currentUser.phoneNumber).substring(1));
    const [uid, setUID] = useState(auth.currentUser.uid);
    const [userDocument, setUserDocument] = useState(async () => {
        const initialState = await db
            .collection('users')
            .doc(uid)
            .get()
            .then((documentSnapshot) => { if (documentSnapshot.exists) setUserDocument(documentSnapshot.data()) });
        return initialState;
    });
    const [profileImageNumber, setProfileImageNumber] = useState(userDocument.pfp)


    useEffect(async () => {
		const unsubscribe = db
			.collection('users')
            .doc(uid)
			.onSnapshot((snapshot) => {
                setProfileImageNumber(snapshot?.data().pfp)
			});
		return unsubscribe;
	}, []);


    // useEffect(async () => {

    //     const unsubscribe = await db
    //         .collection('users')
    //         .doc(uid)
    //         .get()
    //         .then((documentSnapshot) => { if (documentSnapshot.exists) setUserDocument(documentSnapshot.data()) });
    //     return initialState;
    //     setProfileImageNumber(userDocument.pfp)
    // });

    return (
        <View>
            <Image
                source={imageSelection(profileImageNumber)}
                style={{ width: 37, height: 37, borderRadius: 8, position: 'relative', top: 25 }}
            />
            <Badge
                status="success"
                containerStyle={{ position: 'absolute', bottom: 15, left: 30, }}
            />
        </View>
    )
}

export default GenerateProfileIcon;