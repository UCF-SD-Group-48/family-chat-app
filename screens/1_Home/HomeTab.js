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

import { useIsFocused } from '@react-navigation/native';


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
import NewNotificationsBlock from '../../components/NewNotificationsBlock';
import DismissButton from '../../components/DismissButton';
import MyView from '../../components/MyView';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import { Timestamp } from 'firebase/firestore';

// *************************************************************

// First tab of the application: HOME.
const HomeTab = ({ navigation, route }) => {

  const[count, setCount] = useState(0);

  const navigateToAddGroup = () => {
    navigation.navigate('CreateGroup_1_NameImage')
  }

  const [blockHidden, setBlockHidden] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState((auth.currentUser.phoneNumber).substring(1));
  const [uid, setUID] = useState(auth.currentUser.uid);
  const [userDocument, setUserDocument] = useState(async () => {
    const initialState = await db
      .collection('users')
      .doc(uid)
      .get()
      .then(documentSnapshot => { if (documentSnapshot.exists) setUserDocument(documentSnapshot.data()) });
    return initialState;
  });
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Home",
			headerLeft: '',
		});

	}, [navigation]);


  const isFocused = useIsFocused();

    useEffect(() => {
       
      const unsubscribe = missedMsg()
      return unsubscribe;

    }, [isFocused]);

  
  const [missed, setMissed] = useState([])
  const [missedID, setMissedID] = useState([])

  // Sets date to check against for missed messages
  useEffect(async() => {
    let previous;
    const userData = await db.collection('users').doc(auth.currentUser.uid).get()
    previous = userData.data().lastOn;
    // console.log("userData ", userData.data().lastOn)
    db.collection('users').doc(auth.currentUser.uid).update({
      prevOn: previous,
      lastOn: firebase.firestore.FieldValue.serverTimestamp()
    })

  }, [])
  

  // Collect missed messages ids
  const missedMsg = async () => {

    let currentUser = await db.collection('users').doc(auth.currentUser.uid).get()
    const topicMap = currentUser.data().topicMap
    console.log("topicArray: ", (JSON.stringify(topicMap)));

    let values = []
    for (let key in topicMap) {
      values.push(key)
    }
    // console.log("values array: ", values);

    let lastTimeUserOn = currentUser.data().lastOn
    console.log("last time: ", lastTimeUserOn["seconds"])
    // for loop through user's topic  Map

    let totalMessages = 0;

    for (let topicIdFromMap of values) {
      console.log("current: " + topicIdFromMap + "  " + topicMap[topicIdFromMap])
 
      await db
      .collection('chats')
      .doc(topicIdFromMap) // do it this way because of batching
      .collection('messages')
      .where('timestamp', ">", topicMap[topicIdFromMap])
      .get()
      .then((getMessage) => {
        if(getMessage.docs.length > 0) {
          console.log("getMessageLength: ", getMessage.docs.length)
          totalMessages = getMessage.docs.length + totalMessages
        }
      })
      .catch((err) => console.log("Error: " + err))

      }

      setCount(totalMessages)
   
  }  

 

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{ position: 'relative', width: 350, alignContent: 'center' }}
          >
            <Text
              style={{ color: 'black', fontSize: 23, paddingLeft: 25, paddingTop: 20 }}
            >
              Welcome back <Text style={{ fontWeight: 'bold' }}>{userDocument.firstName || "friend"},</Text>
            </Text>
            <Text
              style={{ color: 'black', fontSize: 23, paddingLeft: 25, paddingBottom: 0 }}
            >
              here's what you've missed:
            </Text>

          </View>

          <LineDivider style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }} />
          {(blockHidden == false) ?
          <View style={{width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
          activeOpacity={0.75}
          style={{
            marginTop: 20,
            marginLeft: 'auto',
            marginRight: 20,
          }}
          onPress={() => {
            setBlockHidden(true)
            // missedMsg()
          }}
        >
          <DismissButton />
        </TouchableOpacity>

        <NewNotificationsBlock />
        </View> : <View>
        <View style={{
            padding: 20, borderWidth: 2, borderStyle: 'solid', borderColor: 'grey', borderRadius: 5, width: 325, justifyContent: 'center',
            alignItems: 'center', marginBottom: 20, marginTop: 20, backgroundColor: '#e3e6e8'
          }}>

            <Icon
              name='checkbox-outline'
              type='ionicon'
              color='black'
              size={100}
              style={{ paddingBottom: 20 }}
            />
            <Text
              style={{ fontSize: 18 }}
            >
              You're all up to date!
            </Text>
            <Text
              style={{ fontSize: 18, paddingBottom: 20 }}
            >
              No new notifications at this time.
            </Text>
          </View>

          <View style={{justifyContent: 'center',
            alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                // missedMsg()
                navigateToAddGroup()
              }}
              // onPress={navigateToAddGroup}
              style={{
                width: 300, height: 60, borderWidth: 2, borderStyle: 'solid', borderColor: 'black', borderRadius: 100, justifyContent: 'center',
                alignItems: 'center', marginBottom: 20, flexDirection: "row", backgroundColor: '#7DBF7F'
              }}
            >
              <Icon
                name='plus'
                type='entypo'
                color='black'
              />
              <Text
                style={{ fontSize: 18, paddingLeft: 15 }}
              >
                Start a new conversation
              </Text>
              <Text>
               Count is {count}
              </Text>
            </TouchableOpacity>
          </View>
          </View>
        }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
})

export default HomeTab;