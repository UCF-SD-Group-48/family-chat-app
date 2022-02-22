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

// Fourth tab of the application: PROFILE of currently logged in user.
const ProfileTab = ({ navigation }) => {

  let [phoneNumber, setPhoneNumber] = useState('');
  let [userObject, setUserObject] = useState({});

  useEffect(() => {
    getUserFromDatabase()
      .then(setPushNotificationsChecked(userObject.pushNotificationEnabled))
      .then(setLocationServicesChecked(userObject.locationServicesEnabled))
      .then(setImportContactsChecked(userObject.importContactsEnabled))
  });

  const getUserFromDatabase = async () => {
    try {

      setPhoneNumber(auth.currentUser.phoneNumber)

      // Check the database, within the users collection, with the user's phone number
      const userDocs = db.collection('users');
      const snapshot = await userDocs.where('phoneNumber', '==', `${phoneNumber}`).get();

      snapshot.forEach(doc => {
        setUserObject(doc.data())
      });

    } catch (err) {
      console.log(err);
    }
  }

  const [pushNotificationsChecked, setPushNotificationsChecked] = useState(false);
  const [locationServicesChecked, setLocationServicesChecked] = useState(false);
  const [importContactsChecked, setImportContactsChecked] = useState(false);

  let currentSwitchState = (switchCase) => {
    switch (switchCase) {
      case 'pushNotifications': {
        if (pushNotificationsChecked === true) {
          return 'enabled'
        } else {
          return 'disabled'
        }
      }
      case 'locationServices': {
        if (locationServicesChecked === true) {
          return 'enabled'
        } else {
          return 'disabled'
        }
      }
      case 'importContacts': {
        if (importContactsChecked === true) {
          return 'enabled'
        } else {
          return 'disabled'
        }
      }
    }
  }

  const openWebsite = () => {
    Linking.openURL('https://www.familychat.app/FAQ')
  }

  const openGuidedTutorial = () => {
    console.log(userObject)
  }

  const reportProblem = () => {
  }

  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.replace('UserAuth');
    });
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>

        <View
          style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <Text
            style={{ position: 'relative', left: '-25%', marginBottom: 5, fontSize: 18 }}
          >
            Public Information
          </Text>
          <View
            style={{
              padding: 20, borderWidth: 2, borderStyle: 'solid', borderColor: 'black', borderRadius: 5, width: '90%', justifyContent: 'center', alignItems: 'center', marginBottom: 20,
            }}
          >
            <Text>
            </Text>
          </View>

          <Text
            style={{ position: 'relative', left: '-25%', marginBottom: 5, fontSize: 18 }}
          >
            Private Information
          </Text>
          <View
            style={{
              padding: 20, borderWidth: 2, borderStyle: 'solid', borderColor: 'lightgrey', borderRadius: 5, width: '90%', justifyContent: 'center', alignItems: 'center', marginBottom: 20,
            }}
          >
            <Text
              style={{}}
            >
              {phoneNumber}
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", alignContent: 'center', alignItems: 'center', width: '90%' }}
          >
            <Text style={{ fontWeight: 'bold' }}>Push Notifications</Text>
            <Text style={{ fontStyle: 'italic', color: 'grey' }}> (currently {currentSwitchState('pushNotifications')})</Text>
            <Switch
              value={pushNotificationsChecked}
              onValueChange={(value) => setPushNotificationsChecked(value)}
              style={{
                marginLeft: 'auto',
                marginRight: 0
              }}
            />
          </View>

          <View
            style={{ flexDirection: "row", alignContent: 'center', alignItems: 'center', width: '90%', marginTop: 20 }}
          >
            <Text style={{ fontWeight: 'bold' }}>Location Services</Text>
            <Text style={{ fontStyle: 'italic', color: 'grey' }}> (currently {currentSwitchState('locationServices')})</Text>
            <Switch
              value={locationServicesChecked}
              onValueChange={(value) => setLocationServicesChecked(value)}
              style={{
                marginLeft: 'auto',
                marginRight: 0
              }}
            />
          </View>

          <View
            style={{ flexDirection: "row", alignContent: 'center', alignItems: 'center', width: '90%', marginTop: 20, marginBottom: 10 }}
          >
            <Text style={{ fontWeight: 'bold' }}>Import Contacts</Text>
            <Text style={{ fontStyle: 'italic', color: 'grey' }}> (currently {currentSwitchState('importContacts')})</Text>
            <Switch
              value={importContactsChecked}
              onValueChange={(value) => setImportContactsChecked(value)}
              style={{
                marginLeft: 'auto',
                marginRight: 0
              }}
            />
          </View>

          <LineDivider />

          <View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={openWebsite}
              style={{
                width: 280, height: 60, borderWidth: 2, borderStyle: 'solid', borderColor: 'black', borderRadius: 15, justifyContent: 'center',
                alignItems: 'center', flexDirection: "row", backgroundColor: 'lightgray', marginTop: 30
              }}
            >
              <Icon
                name='live-help'
                type='material'
                color='black'
              />
              <Text
                style={{ fontSize: 18, paddingLeft: 15, paddingRight: 10 }}
              >
                Help Center
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={openGuidedTutorial}
              style={{
                width: 280, height: 60, borderWidth: 2, borderStyle: 'solid', borderColor: 'black', borderRadius: 15, justifyContent: 'center',
                alignItems: 'center', flexDirection: "row", backgroundColor: 'lightgray', marginTop: 20
              }}
            >
              <Icon
                name='tour'
                type='material'
                color='black'
              />
              <Text
                style={{ fontSize: 18, paddingLeft: 15, paddingRight: 10 }}
              >
                Guided Tutorial
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={reportProblem}
              style={{
                width: 280, height: 60, borderWidth: 2, borderStyle: 'solid', borderColor: 'black', borderRadius: 15, justifyContent: 'center',
                alignItems: 'center', marginBottom: 20, flexDirection: "row", backgroundColor: '#F3889C', marginTop: 20
              }}
            >
              <Icon
                name='report-problem'
                type='material'
                color='black'
              />
              <Text
                style={{ fontSize: 18, paddingLeft: 15, paddingRight: 10 }}
              >
                Report a concern
              </Text>
            </TouchableOpacity>
          </View>

          <LineDivider />

          <View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={signOutUser}
              style={{
                width: 280, height: 60, borderWidth: 2, borderStyle: 'solid', borderColor: 'black', borderRadius: 15, justifyContent: 'center',
                alignItems: 'center', marginBottom: 20, flexDirection: "row", backgroundColor: '#F3889C', marginTop: 30
              }}
            >
              <Icon
                name='logout'
                type='simple-line-icon'
                color='black'
              />
              <Text
                style={{ fontSize: 18, paddingLeft: 15, paddingRight: 10 }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default ProfileTab;