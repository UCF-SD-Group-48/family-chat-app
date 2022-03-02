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
import NewNotificationsBlock from '../../components/NewNotificationsBlock';
import DismissButton from '../../components/DismissButton';
import MyView from '../../components/MyView';

// *************************************************************

// First tab of the application: HOME.
const HomeTab = ({ navigation, route }) => {

  const navigateToAddGroup = () => {
    navigation.navigate('AddGroup')
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
              onPress={navigateToAddGroup}
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