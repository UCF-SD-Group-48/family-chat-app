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
    Dimensions,
} from 'react-native';
import {
    Alert,
    Avatar,
    Button,
    Icon,
    Image,
    Input,
    ListItem,
    Tooltip,
} from 'react-native-elements';

// Imports for: Expo
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
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
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";


// Imports for: Components
import MyView from '../../components/MyView';

const PendingInvite = ({navigation}) => {
    const [invites, setInvite] = useState([])
    // db.collection("groups").doc(groupId).update({
                //     members: arrayUnion(snapshot.id) 
                // })
    useEffect(async () => {
        const pendingInvite = await db.collection('users').doc(auth.currentUser.uid).get()

        if (pendingInvite) {

            const arrayOfInvites = pendingInvite.data().pendingInvite
            setInvite(arrayOfInvites)
            
        } else {
            alert("Not a valid user")
        }
        
    }, []);

  return (

    
    <View>
        {invites.forEach(() => {
            <Button></Button>
        })}
      <Text>PendingInvite</Text>
    </View>
  )
}

export default PendingInvite

const styles = StyleSheet.create({})