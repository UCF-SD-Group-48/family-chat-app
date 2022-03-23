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
  Divider,
  Icon,
  Image,
  Overlay,
  Input,
  Tooltip,
  Switch,
} from 'react-native-elements';

import { AntDesign, Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';

// Imports for: Expo
import { StatusBar } from 'expo-status-bar';
import ImagePicker from 'expo-image-picker';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

// Imports for: Firebase
import {
  apps,
  auth,
  db,
  deleteUser,
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
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserDocument(documentSnapshot.data())

          setFirstName(documentSnapshot.data().firstName)
          setLastName(documentSnapshot.data().lastName)
          setStatus(documentSnapshot.data().statusText)
          setEmail(documentSnapshot.data().email)
          setPushNotification(documentSnapshot.data().pushNotificationEnabled)
          setDiscoverable(documentSnapshot.data().discoverableEnabled)

        }
      });
    return initialState;
  });


  const [editMode, setEditMode] = useState(false);
  const [visible, setVisible] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');

  const [pushNotification, setPushNotification] = useState();
  const [discoverable, setDiscoverable] = useState();





  const updateProfile = async () => {

    // console.log(`Variables | Database\nfirstName: ${firstName} | ${userDocument.firstName}  \nlastName: ${lastName} | ${userDocument.lastName}\nstatus: ${status} | ${userDocument.statusText}\nemail: ${email} | ${userDocument.email}\n`);

    try {
      await db.collection('users').doc(auth.currentUser.uid).update({
        firstName: firstName,
        lastName: lastName,
        statusText: status,
        email: email

      })

    }
    catch (error) {
      console.log(`Error: ${error}`)
    }

    setEditMode(false)
  }

  const togglePush = () => {
    setPushNotification(prevState => !prevState)
  }

  useEffect(async () => {
    try {
      await db.collection('users').doc(auth.currentUser.uid).update({
        pushNotificationEnabled: pushNotification
      })
        .then(
          console.log(`Push Notification set to: ${pushNotification}`)
        )
    }
    catch (err) {
      console.log(`Error: ${err}`)
    }
  }, [pushNotification])

  const toggleDisc = () => {
    setDiscoverable(prevState => !prevState)
  }

  useEffect(async () => {
    // console.log(`[BEFORE] Push: ${pushNotification} | ${userDocument.pushNotificationEnabled}`)
    try {
      await db.collection('users').doc(auth.currentUser.uid).update({
        discoverableEnabled: discoverable
      })
        .then(
          console.log(`Discoverable set to: ${discoverable}`)
        )
    }
    catch (err) {
      console.log(`Error: ${err}`)
    }
  }, [discoverable])

  let currentSwitchState = (switchCase) => {
    switch (switchCase) {
      case 'pushNotifications':
        return ((pushNotification === true) ? 'enabled' : 'disabled');

      case 'discoverable':
        return ((discoverable === true) ? 'enabled' : 'disabled');
    }
  };

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

  const toggleOverlay = () => {
    setVisible(prev => !prev)
  }


  const deleteAcc = () => {
    deleteUser(auth.currentUser.uid).then(() => {
      navigation.replace('UserAuth');
    }).catch((error) => {
      // An error ocurred
      // ...
    });
  }


  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Profile",
      headerLeft: '',
    });
  }, [navigation]);

  return (

    <SafeAreaView>
      <ScrollView style={styles.container}>

        {
          editMode
            ?

            <View style={styles.page}>
              <Image source={imageSelection(userDocument.pfp)} style={{ width: 100, height: 100, borderRadius: 5, marginRight: 10 }} />

              <View style={{ width: '80%', height: 550, backgroundColor: 'white' }}>

                <View style={{ width: '100%', height: 30, backgroundColor: '#CFC5BA', marginBottom: 20 }} />

                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                  <View style={{ marginRight: 5 }}>
                    <Text style={{ fontSize: 18 }}>
                      First:
                    </Text>
                    <TextInput
                      style={{ borderWidth: 2, width: 120, height: 32 }}
                      value={firstName}
                      onChangeText={text => setFirstName(text)}
                    />
                  </View>
                  <View>
                    <Text style={{ fontSize: 18 }}>
                      Last:
                    </Text>
                    <TextInput
                      style={{ borderWidth: 2, width: 120, height: 32 }}
                      value={lastName}
                      onChangeText={text => setLastName(text)}
                    />
                  </View>

                </View>

                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 18, textAlign: 'justify', paddingTop: 20, paddingBottom: 5, fontWeight: '500' }}>
                    Status:
                  </Text>
                  <View style={{ flexDirection: 'row' }}>

                    <Image source={imageSelection(userDocument.statusEmoji)} style={{ width: 32, height: 32, borderRadius: 3, marginRight: 5 }} />

                    <TextInput
                      style={{ fontSize: 16, borderStyle: 'solid', borderWidth: 2, width: '80%' }}
                      onChangeText={(val) => setStatus(val)}
                      value={status}
                    />
                  </View>
                </View>

                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 18 }}>
                    Email:
                  </Text>
                  <TextInput style={{ borderWidth: 2, width: '80%', height: 32 }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                  />

                </View>

                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 18 }}>
                    Phone Number:
                  </Text>
                  <TextInput
                    style={{ borderWidth: 2, width: '80%', height: 32, backgroundColor: '#D3D3D3', color: '#616161' }}
                    editable={false}
                    value={phoneNumber}
                  />
                </View>

                <Button
                  title={'Save'}
                  style={{ right: 0, width: 80, height: 50, backgroundColor: 'blue', borderRadius: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' }}
                  onPress={updateProfile}
                />

              </View>

            </View>
            :
            <View style={styles.page}>

              <Image source={imageSelection(userDocument.pfp)} style={{ width: 100, height: 100, borderRadius: 5, marginRight: 10 }} />

              <View
                style={{ width: '80%', height: 450, backgroundColor: 'white' }}
              >

                <View
                  style={{ width: '100%', height: '45%', backgroundColor: 'white', alignItems: 'center' }}
                >

                  <View style={{ width: '100%', height: 30, backgroundColor: '#CFC5BA', marginBottom: 30 }} />

                  <Text
                    style={{ fontSize: 32, marginBottom: 10 }}
                  >
                    {firstName} {lastName}
                  </Text>

                  <View
                    style={{ flexDirection: 'row' }}>
                    <Image source={imageSelection(userDocument.statusEmoji)} style={{ width: 20, height: 20, borderRadius: 5, marginRight: 10 }} />
                    <Text
                      style={{ fontSize: 20 }}>
                      {userDocument.statusText}
                    </Text>
                  </View>

                </View>

                <View style={{ backgroundColor: 'gray', width: '100%', height: '55%', padding: 30 }}>

                  <View style={{ backgroundColor: 'white', width: '90%', height: '55%', borderRadius: 10, flexDirection: 'column', justifyContent: 'space-between', alignSelf: 'center', padding: 10 }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 20, marginBottom: 5 }}>
                        Private Information:
                      </Text>
                      <Ionicons name="information-circle" size={24} color="black" />
                    </View>

                    <View style={{ flexDirection: 'row' }}>

                      <Entypo name="email" size={24} color="black" />
                      <Text style={{ fontSize: 18, marginBottom: 5, marginLeft: 5 }}>
                        {userDocument.email}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                      <Feather name="phone" size={24} color="black" />
                      <Text style={{ fontSize: 18, marginLeft: 5 }}>
                        {userDocument.phoneNumber}
                      </Text>
                    </View>
                  </View>

                  <Button
                    title={'Edit'}
                    style={{ width: 80, height: 50, bottom: 0, backgroundColor: 'blue', borderRadius: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' }}
                    onPress={() => setEditMode(true)}
                  />
                </View>

              </View>
           </View>
        }
              <View style={styles.page}>
                <View style={{
                  marginTop: 30,
                  flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                }}>
                  <Divider width={2} color={"#777"}
                    style={{
                      minWidth: "10%",
                      flexGrow: 1, flex: 1,
                    }} />
                  <Text style={{
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: '700',
                    color: 'black', marginHorizontal: 10
                  }}>
                    Application Settings
                  </Text>
                  <Divider width={2} color={"#777"}
                    style={{
                      minWidth: "10%",
                      flexGrow: 1, flex: 1,
                    }} />
                </View>



                <View
                  style={{ flexDirection: "row", alignContent: 'center', alignItems: 'center', width: '90%' }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Push Notifications</Text>
                  <Text style={{ fontStyle: 'italic', color: 'grey' }}> (Currently {currentSwitchState('pushNotifications')})</Text>
                  <Switch
                    value={pushNotification}
                    onValueChange={togglePush}
                    style={{ marginLeft: 'auto', marginRight: 0 }}
                  />
                </View>


                <View
                  style={{ flexDirection: "row", alignContent: 'center', alignItems: 'center', width: '90%' }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Discoverable</Text>
                  <Text style={{ fontStyle: 'italic', color: 'grey' }}> (Currently {currentSwitchState('discoverable')})</Text>
                  <Switch
                    value={discoverable}
                    onValueChange={toggleDisc}
                    style={{ marginLeft: 'auto', marginRight: 0 }}
                  />
                </View>


                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={openGuidedTutorial}
                  style={{
                    width: 280, height: 60, borderWidth: 2, borderStyle: 'solid', borderColor: 'black', borderRadius: 15, justifyContent: 'center',
                    alignItems: 'center', flexDirection: "row", backgroundColor: 'lightgray', marginTop: 20
                  }}
                >
                  <Text
                    style={{ fontSize: 18, paddingLeft: 15, paddingRight: 10 }}
                  >
                    View our App Tutorial
                  </Text>

                  <FontAwesome name="play-circle" size={24} color="black" />

                </TouchableOpacity>


                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={openWebsite}
                  style={styles.resources}
                >

                  <Text
                    style={{ fontSize: 18, paddingLeft: 15, paddingRight: 10 }}
                  >
                    Questions? Visit the FAQ
                  </Text>

                  <AntDesign name="questioncircle" size={24} color="black" />
                </TouchableOpacity>


                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={reportProblem}
                  style={styles.resources}
                >

                  <Text
                    style={{ fontSize: 18, paddingLeft: 15, paddingRight: 10 }}
                  >
                    Contact Developer
                  </Text>

                  <AntDesign name="exclamationcircle" size={24} color="black" />
                </TouchableOpacity>

                <LineDivider />


                <View>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={signOutUser}
                    style={styles.delete}
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

                <View>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={toggleOverlay}
                    style={styles.delete}
                  >
                    <Icon
                      name='logout'
                      type='simple-line-icon'
                      color='black'
                    />
                    <Text
                      style={{ fontSize: 18, paddingLeft: 15, paddingRight: 10 }}
                    >
                      Delete Account
                    </Text>
                  </TouchableOpacity>



                  <Overlay
                    isVisible={visible}
                    onBackdropPress={toggleOverlay}
                    style={{ borderStyle: 'solid', position: 'absolute', width: 500, height: 500 }}
                  >
                    <Text>
                      Are you sure you want to delete your account?
                    </Text>

                    <Button style={{ position: 'relative', width: 100, height: 40, borderWidth: 2, borderStyle: 'solid', backgroundColor: 'red', borderRadius: 10, justifyContent: 'center', alignItems: 'center', margin: 10 }}
                      onPress={toggleOverlay}
                      title='Delete'
                    />

                  </Overlay>

                </View>

              </View>

            </ScrollView >
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({


  page: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  resources: {
    width: 280,
    height: 60,
    backgroundColor: 'lightgray',
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },

  delete: {
    width: 300,
    height: 60,
    backgroundColor: '#F3889C',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30
  }
});

export default ProfileTab;