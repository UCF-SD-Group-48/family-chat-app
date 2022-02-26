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
import { imageSelection } from '../5_Supplementary/GenerateProfileIcon';

// *************************************************************

// Fourth tab of the application: PROFILE of currently logged in user.
const ProfileTab = ({ navigation }) => {

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

  useEffect(() => {
    setPushNotificationsChecked(userDocument.pushNotificationEnabled)
    setLocationServicesChecked(userDocument.locationServicesEnabled)
    setImportContactsChecked(userDocument.importContactsEnabled)
  });

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
    console.log(userDocument)
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
              padding: 20, borderWidth: 2, borderStyle: 'solid', borderColor: '#8D8D8D', borderRadius: 5, width: '90%', justifyContent: 'center', marginBottom: 20,
            }}
          >

            <View style={{ flexDirection: 'row' }}>

              <Image source={imageSelection(userDocument.pfp)} style={{ width: 60, height: 60, borderRadius: 5, marginRight: 10 }} />

              <View style={{ borderStyle: 'solid', borderWidth: 2, justifyContent: 'center', paddingHorizontal: 5 }}>
                <Text style={{ fontSize: 25, fontWeight: '600' }}>
                  {/* John Doaberman */}
                  {userDocument.firstName}
                </Text>
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 18, textAlign: 'justify', paddingTop: 20, paddingBottom: 5, fontWeight: '500' }}>
                Current Status
              </Text>
              <View style={{ flexDirection: 'row' }}>

                <Image source={imageSelection(userDocument.statusEmoji)} style={{ width: 45, height: 45, borderRadius: 3, marginRight: 5 }} />

                <View style={{ borderStyle: 'solid', borderWidth: 2, width: '80%' }}>
                  <Text style={{ fontSize: 16 }}>
                    {/* This is my current status and it will change soon... */}
                    {userDocument.status}
                  </Text>
                </View>

              </View>
            </View>
          </View>

          <Text
            style={{ position: 'relative', left: '-25%', marginBottom: 5, fontSize: 18 }}
          >
            Private Information
          </Text>
          <View
            style={{
              padding: 20, borderWidth: 2, borderStyle: 'solid', borderColor: 'lightgrey', borderRadius: 5, width: '90%', justifyContent: 'center', marginBottom: 20,
            }}
          >
            <View>
            
            <View style={{paddingBottom: 10}}>
              <View style={{flexDirection:'row'}}> 

                <View style={{paddingRight: 10}}>
                  <Text style={{ fontSize: 12 }}>
                    Email
                  </Text>
                  <TextInput style={{ borderWidth: 2, width: 250, height: 32 }}>
                    Email goes here.....
                  </TextInput>
                </View>

                <View style={{alignItems: 'center'}}>
                  <Text style={{fontSize: 12}}>
                    Visibility
                  </Text>
                  <TouchableOpacity style={{width: 45, height: 32, backgroundColor:'#C4C4C4', borderRadius: 10, borderStyle:'solid', borderWidth: 2, justifyContent: 'center', alignItems:'center'}}>
                    <Text>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              </View>

              <View>
              <View style={{flexDirection:'row'}}> 

                <View style={{paddingRight: 10}}>
                  <Text style={{ fontSize: 12 }}>
                    Phone Number
                  </Text>
                  <TextInput style={{ borderWidth: 2, width: 250, height: 32 }}>
                    (999) 555 - 1234
                    {/* {phoneNumber} */}
                  </TextInput>
                </View>

                <View style={{alignItems: 'center'}}>
                  <Text style={{fontSize: 12}}>
                    Visibility
                  </Text>
                  <TouchableOpacity style={{width: 45, height: 32, backgroundColor:'#C4C4C4', borderRadius: 10, borderStyle:'solid', borderWidth: 2, justifyContent: 'center', alignItems:'center'}}>
                    <Text>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              </View>

            </View>

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