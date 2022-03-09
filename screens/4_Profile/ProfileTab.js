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
  TextInputComponent,
} from 'react-native';
import {
  Alert,
  Avatar,
  Button,
  Icon,
  Image,
  Overlay,
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
import { set } from 'react-native-reanimated';

// *************************************************************

// Fourth tab of the application: PROFILE of currently logged in user.
const ProfileTab = ({ navigation }) => {

  const [phoneNumber, setPhoneNumber] = useState((auth.currentUser.phoneNumber).substring(2));
  const [uid, setUID] = useState(auth.currentUser.uid);
  const [userDocument, setUserDocument] = useState(async () => {
    const initialState = await db
      .collection('users')
      .doc(uid)
      .get()
      .then((documentSnapshot) => { if (documentSnapshot.exists) setUserDocument(documentSnapshot.data()) });
    return initialState;
  });

  // const [pushNotificationsChecked, setPushNotificationsChecked] = useState(userDocument.pushNotificationEnabled);
  // const [locationServicesChecked, setLocationServicesChecked] = useState(userDocument.locationServicesEnabled);
  // const [importContactsChecked, setImportContactsChecked] = useState(userDocument.importContactsEnabled);


  const [editMode, setEditMode] = useState(false)

  const [firstName, setFirstName] = useState(auth.currentUser.firstName)
  const [lastName, setLastName] = useState(auth.currentUser.lastName)
  const [status, setStatus] = useState(userDocument.status)

  const [email, setEmail] = useState(userDocument.email)

  const updateProfile = async () => {
    
    console.log(firstName, lastName, status, email );
   
    (status === undefined) ? setStatus('') : setStatus(status);
    (email === undefined) ? setEmail('') : setEmail(email);

    try{
      await db.collection('users').doc(auth.currentUser.uid).update({
        firstName: firstName,
        lastName: lastName,
        status: status,
        email: email,

      // pushNotificationEnabled: pushNotificationsChecked,
      // locationServicesEnabled: locationServicesChecked,
      // importContactsEnabled: importContactsChecked
    })

  }
  catch(err){
    console.log(err)
  }
    
 setEditMode(false)
    console.log(editMode)
  }

  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);

  };

  const [showEmail, setShowEmail] = useState(true);
  const [showNumber, setShowNumber] = useState(true);

  // let currentSwitchState = (switchCase) => {
  //   switch (switchCase) {
  //     case 'pushNotifications': {
  //       if (pushNotificationsChecked === true) {
  //         return 'enabled'
  //       } else {
  //         return 'disabled'
  //       }
  //     }
  //     case 'locationServices': {
  //       if (locationServicesChecked === true) {
  //         return 'enabled'
  //       } else {
  //         return 'disabled'
  //       }
  //     }
  //     case 'importContacts': {
  //       if (importContactsChecked === true) {
  //         return 'enabled'
  //       } else {
  //         return 'disabled'
  //       }
  //     }
  //   }
  // }



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

  useLayoutEffect(() => {
		navigation.setOptions({
			title: "Profile",
			headerLeft: '',
		});
	}, [navigation]);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>

        <View
          style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginBottom: 5, alignItems: 'flex-end' }}>
            <Text
              style={{ position: 'relative', fontSize: 18 }}
            >
              Public Information
            </Text>

            {

              editMode
                ?
                <TouchableOpacity
                  style={{ width: 45, height: 32, backgroundColor: '#C4C4C4', borderRadius: 10, borderStyle: 'solid', borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}
                  onPress={updateProfile}
                >
                  <Text> Save </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity
                  style={{ width: 45, height: 32, backgroundColor: '#C4C4C4', borderRadius: 10, borderStyle: 'solid', borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => setEditMode(true)}
                >
                  <Text> Edit </Text>
                </TouchableOpacity>
            }
          </View>
          <View
            style={{
              padding: 20, borderWidth: 2, borderStyle: 'solid', borderColor: '#8D8D8D', borderRadius: 5, width: '90%', justifyContent: 'center', marginBottom: 20,
            }}
          >

            <View style={{ flexDirection: 'row' }}>

              <Image source={imageSelection(userDocument.pfp)} style={{ width: 60, height: 60, borderRadius: 5, marginRight: 10 }} />


              {
                !editMode
                  ?
                  <View style={{justifyContent: 'center', paddingHorizontal: 5 }}>

                    <Text
                      style={{ fontSize: 25, fontWeight: '600' }}
                    >
                      {firstName} {lastName}
                    </Text>

                  </View>
                  :
                  <View>
                    <TextInput
                      style={{ borderWidth: 2, width: 200, height: 32, marginBottom: 3 }}
                      value={firstName}
                      onChangeText={text => setFirstName(text)}
                      placeholder='First Name'
                    />

                    <TextInput
                      style={{ borderWidth: 2, width: 200, height: 32 }}
                      value={lastName}
                      onChangeText={text => setLastName(text)}
                      placeholder='Last Name'
                    />

                  </View>

              }


            </View>

            <View>
              <Text style={{ fontSize: 18, textAlign: 'justify', paddingTop: 20, paddingBottom: 5, fontWeight: '500' }}>
                Current Status
              </Text>
              <View style={{ flexDirection: 'row' }}>

                <Image source={imageSelection(userDocument.statusEmoji)} style={{ width: 45, height: 45, borderRadius: 3, marginRight: 5 }} />

                <TextInput
                  style={{ fontSize: 16, borderStyle: 'solid', borderWidth: 2, width: '80%' }}
                  editable={editMode}
                  value={status}
                  onChangeText={(text) => setStatus(text)}
                />



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

              <View style={{ paddingBottom: 10 }}>
                <View style={{ flexDirection: 'row' }}>

                  <View style={{ paddingRight: 10 }}>
                    <Text style={{ fontSize: 12 }}>
                      Email
                    </Text>
                    <TextInput style={{ borderWidth: 2, width: 250, height: 32 }}
                      onChangeText={(text) => setEmail(text)}
                      editable={editMode}
                    >

                    </TextInput>
                  </View>

                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 12 }}>
                      Visibility
                    </Text>

                    <Switch
                      value={showEmail}
                      onValueChange={(value) => (value)}
                      style={{ marginLeft: 'auto', marginRight: 0 }}
                      disabled={!editMode}
                    />

                  </View>
                </View>

              </View>

              <View>
                <View style={{ flexDirection: 'row' }}>

                  <View style={{ paddingRight: 10 }}>
                    <Text style={{ fontSize: 12 }}>
                      Phone Number
                    </Text>
                    <TextInput
                      style={{ borderWidth: 2, width: 250, height: 32, backgroundColor: '#D3D3D3', color: '#616161' }}
                      editable={false}
                      value={phoneNumber}
                    />
                  </View>

                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 12 }}>
                      Visibility
                    </Text>
                    <Switch
                      value={showNumber}
                      onValueChange={(value) => setShowNumber(value)}
                      style={{ marginLeft: 'auto', marginRight: 0 }}
                      disabled={!editMode}
                    />
                  </View>
                </View>

              </View>

            </View>

          </View>

          {/* <View
            style={{ flexDirection: "row", alignContent: 'center', alignItems: 'center', width: '90%' }}
          >
            <Text style={{ fontWeight: 'bold' }}>Push Notifications</Text>
            <Text style={{ fontStyle: 'italic', color: 'grey' }}> (currently {currentSwitchState('pushNotifications')})</Text>
            <Switch
              value={pushNotificationsChecked}
              onValueChange={(value) => setPushNotificationsChecked(value)}
              style={{marginLeft: 'auto',marginRight: 0}}
              disabled={!editMode}
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
              disabled={!editMode}
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
              disabled={!editMode}
            />
          </View> */}

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
              onPress={toggleOverlay}
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


            <Overlay
              isVisible={visible}
              onBackdropPress={toggleOverlay}
              style={{ borderStyle: 'solid', position: 'absolute', width: 500, height: 500 }}
            >

              <Text style={{ fontSize: 20, fontWeight: '600' }}>
                Report Your Concern
              </Text>
              <Text>
                Please write a brief description about your issue.
              </Text>
              <TextInput style={{ alignSelf: 'center', width: 300, height: 300, borderWidth: 2, borderStyle: 'solid', borderRadius: 5 }} multiline={true}>
                This is a text box that will tell me what my issues are.
                Shouldn't be too long.
              </TextInput>

              <TouchableOpacity style={{ position: 'relative', width: 100, height: 40, borderWidth: 2, borderStyle: 'solid', backgroundColor: 'black', borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', right: 5, margin: 10 }}>

                <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}
                  onPress={toggleOverlay}
                >
                  Submit
                </Text>
              </TouchableOpacity>

            </Overlay>
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