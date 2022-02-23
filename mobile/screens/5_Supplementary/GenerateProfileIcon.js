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

export const imageSelection = (pfpDatabaseValue) => {
    switch (pfpDatabaseValue) {
        case 1: {
            return require('../../assets/pfpOptions/avatar_1.png')
        }
        case 2: {
            return require('../../assets/pfpOptions/avatar_2.png')
        }
        case 3: {
            return require('../../assets/pfpOptions/avatar_3.png')
        }
        case 4: {
            return require('../../assets/pfpOptions/avatar_4.png')
        }
        case 5: {
            return require('../../assets/pfpOptions/avatar_5.png')
        }
        case 6: {
            return require('../../assets/pfpOptions/avatar_6.png')
        }
        case 7: {
            return require('../../assets/pfpOptions/avatar_7.png')
        }
        case 8: {
            return require('../../assets/pfpOptions/avatar_8.png')
        }
        case 9: {
            return require('../../assets/pfpOptions/avatar_9.png')
        }
        case 10: {
            return require('../../assets/pfpOptions/avatar_10.png')
        }
        case 11: {
            return require('../../assets/pfpOptions/avatar_11.png')
        }
        case 12: {
            return require('../../assets/pfpOptions/avatar_12.png')
        }
        case 13: {
            return require('../../assets/pfpOptions/avatar_13.png')
        }
        case 14: {
            return require('../../assets/pfpOptions/avatar_14.png')
        }
        case 15: {
            return require('../../assets/pfpOptions/avatar_15.png')
        }
        case 16: {
            return require('../../assets/pfpOptions/avatar_16.png')
        }
        case 17: {
            return require('../../assets/pfpOptions/avatar_17.png')
        }
        case 18: {
            return require('../../assets/pfpOptions/avatar_18.png')
        }
        default: {
            return;
        }
    }
}

const GenerateProfileIcon = (props) => {

    const [phoneNumber, setPhoneNumber] = useState((auth.currentUser.phoneNumber).substring(1));
    const [userDocument, setUserDocument] = useState(async () => {
        const initialState = await db
            .collection('users')
            .doc(phoneNumber)
            .get()
            .then((documentSnapshot) => { if (documentSnapshot.exists) setUserDocument(documentSnapshot.data()) });
        return initialState;
    });
    const [profileImageNumber, setProfileImageNumber] = useState()

    useEffect(() => {
        getUserFromDatabase()
            .then(setProfileImageNumber(userDocument.pfp))
    });

    const getUserFromDatabase = async () => {
        try {
            props.passedPhoneNumberValue ? setPhoneNumber(props.passedPhoneNumberValue) : setPhoneNumber(auth.currentUser.phoneNumber)

            // Check the database, within the users collection, with the user's phone number
            const userDocs = db.collection('users');
            const snapshot = await userDocs.where('phoneNumber', '==', `${phoneNumber}`).get();

            snapshot.forEach(doc => {
                setUserDocument(doc.data());
                setProfileImageNumber(userDocument.pfp);
            });

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View>
            <Image
                source={imageSelection(profileImageNumber)}
                style={{ width: 30, height: 30, borderRadius: 8, position: 'relative', top: 20 }}
            />
            <Badge
                status="success"
                containerStyle={{ position: 'absolute', bottom: 10, left: 26, }}
            />
        </View>
    )
}

export default GenerateProfileIcon;