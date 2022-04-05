// *************************************************************
// Imports for: React, React Native, & React Native Elements
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
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
  Linking,
} from 'react-native';
import {
  Alert,
  Avatar,
  Button,
  CheckBox,
  Divider,
  Icon,
  Image,
  Input,
  Tooltip,
  Overlay,
  Switch
} from 'react-native-elements';
import { HoldItem } from 'react-native-hold-menu';

// Imports for: Expo
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import ImagePicker from 'expo-image-picker';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import {
  Menu,
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AntDesign, Feather, Entypo, Ionicons, FontAwesome5, Fontisto } from "@expo/vector-icons";

// Imports for: Firebase
import {
  apps,
  auth,
  db,
  firebaseConfig
} from '../../firebase';
import firebase from 'firebase/compat/app';
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";

import { useIsFocused } from '@react-navigation/native';
import { G } from 'react-native-svg';

import { getHexValue, imageSelection } from '../5_Supplementary/GenerateProfileIcon';

import SkeletonContent from 'react-native-skeleton-content';

// Imports for: Components
import CustomListItem from '../../components/CustomListItem';
import LargeButton from '../../components/LargeButton';
import LargeTitle from '../../components/LargeTitle';
import LineDivider from '../../components/LineDivider';
import LoginInput from '../../components/LoginInput';
import LoginText from '../../components/LoginText';
import UserPrompt from '../../components/UserPrompt';
import { set } from 'react-native-reanimated';

// *************************************************************

// Fourth tab of the application: PROFILE of currently logged in user.
const ProfileTab = ({ navigation }) => {

  const [toggleWindowWidth, setToggleWindowWidth] = useState(() => {
    const windowWidth = Dimensions.get('window').width;
    return (windowWidth * .93);
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Profile',
      headerStyle: '',
      headerTitleStyle: { color: 'black' },
      headerTintColor: 'black',
      headerLeft: '',
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            marginRight: 12,
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => signOutUser()}
          >
            <Icon
              name='logout'
              type='material'
              size={24}
              color='#363732'
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.replace('UserAuth');
    });
  };

  const [discoverable, setDiscoverable] = useState();

  const toggleDiscoverable = () => {
    const newBooleanValue = !discoverable;
    setPushNotifications(newBooleanValue);

    const discoverableQuery = db
      .collection('users')
      .doc(auth.currentUser.uid)
      .update({
        discoverableEnabled: newBooleanValue
      })
      .catch((error) => console.log(error));
  }

  const [pushNotifications, setPushNotifications] = useState();

  const togglePushNotifications = () => {
    const newBooleanValue = !pushNotifications;
    setPushNotifications(newBooleanValue);

    const pushNotificationsQuery = db
      .collection('users')
      .doc(auth.currentUser.uid)
      .update({
        pushNotificationEnabled: newBooleanValue
      })
      .catch((error) => console.log(error));
  }

  const [userSnapshotData, setUserSnapshotData] = useState({});
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('')

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .onSnapshot(async (userSnapshot) => {
        // console.log(userSnapshot.data())
        setUserSnapshotData(userSnapshot.data())
        setPushNotifications(userSnapshot.data().pushNotificationEnabled)
        setDiscoverable(userSnapshot.data().discoverableEnabled)
        setFormattedPhoneNumber(`(${userSnapshot.data().phoneNumber.slice(0, 3)}) ${userSnapshot.data().phoneNumber.slice(3, 6)}-${userSnapshot.data().phoneNumber.slice(6, 10)}`)
      });

    return () => {
      setUserSnapshotData({});
      setPushNotifications();
      setDiscoverable();
      setFormattedPhoneNumber()
      unsubscribe;
    }
  }, []);

  const viewAppTutorial = () => {
    navigate.replace('AppTutorial');
  }

  const visitFAQ = () => {
    Linking.openURL('https://www.familychat.app/');
  }

  const contactDeveloper = () => {
    // Linking.openURL('mailto:familychatapp@gmail.com?subject=Inquiry&body=Hey,')
    // Linking.openURL('message://familychatapp@gmail.com?subject=Inquiry&body=Hey,')
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        width={'100%'}
        contentContainerStyle={{
          justifyContent: "flex-start",
          flexDirection: "column",
        }}
      >

        <View style={styles.innerContainer}>

          <View style={styles.headerBar} />

          <View style={styles.publicInformation}>
            <View style={styles.userProfilePicture}>
              <Image
                source={imageSelection(userSnapshotData.pfp)}
                style={{ width: 80, height: 80, borderRadius: 5, }}
              />
            </View>
            <View style={styles.userText}>
              <Text style={styles.userName}>
                {userSnapshotData.firstName}
              </Text>
              <Text style={styles.userName}>
                {userSnapshotData.lastName}
              </Text>
              <Text style={styles.userStatus}>
                {userSnapshotData.statusEmoji}  {userSnapshotData.statusText}
              </Text>
            </View>
          </View>

          <View style={styles.privateInformation}>
            <View style={styles.privateInformationHeader}>
              <Text style={{ fontSize: 16, fontWeight: '700'}}>
                Private Information:
              </Text>
              {/* <TouchableOpacity
                activeOpacity={0.75}
              >
                <Tooltip
                  width={toggleWindowWidth}
                  backgroundColor={'#DFD7CE'}
                  containerStyle={styles.toolTipBlock}
                  popover={
                    <View style={{ margin: 15 }}>
                      <Text style={{ fontSize: 18, textAlign: 'center' }}>
                        The "Edit Account Details" function has been disabled for STEM Day.
                      </Text>
                    </View>

                  }>
                  <Icon
                    name="info"
                    type="material"
                    size={20}
                    color="#363732"
                  />
                </Tooltip>
              </TouchableOpacity> */}
            </View>

            <View style={styles.privateInformationEmail}>
              <Icon
                name="email"
                type="material"
                size={20}
                color="#363732"
              />
              <Text style={styles.privateInformationEmailText}>
                {userSnapshotData.email}
              </Text>
            </View>
            <View style={styles.privateInformationPhone}>
              <Icon
                name="phone"
                type="material"
                size={20}
                color="#363732"
              />
              <Text style={styles.privateInformationPhoneText}>
                {formattedPhoneNumber}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              alert(
                `The "Edit Account Details" function has been disabled for STEM Day.`,
                "My Alert Msg",
                [{ text: "OK" }]
              );
            }}
          >
            <View style={styles.buttonSpacing}>
              <View style={[styles.buttonEdit, { borderColor: '#363732', }]}>
                <Text style={styles.buttonEditText}>
                  EDIT
                </Text>
                <Icon
                  name="edit"
                  type="material"
                  size={20}
                  color="#363732"
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>


        <View style={styles.applicationSettingsBreaker}>
          <Divider
            width={2}
            color={"#9D9D9D"}
            style={{ flex: 1, flexGrow: 1, alignSelf: 'center' }}
          />

          <Text style={styles.applicationSettingsText}>
            Application Settings:
          </Text>

          <Divider
            width={2}
            color={"#9D9D9D"}
            style={{ flex: 1, flexGrow: 1, alignSelf: 'center' }}
          />
        </View>

        <View style={[styles.toggleBox, { borderBottomWidth: 1, borderColor: '#C4C4C4' }]}>
          <Text style={pushNotifications ? styles.toggleBoxTextEnabled : styles.toggleBoxTextDisabled}>
            Push Notifications
          </Text>
          <Switch
            value={pushNotifications}
            onValueChange={() => togglePushNotifications()}
          />
        </View>
        <View style={styles.toggleBox}>
          <View style={styles.toggleBoxLeftHalf}>
            <Text style={pushNotifications ? styles.toggleBoxTextEnabled : styles.toggleBoxTextDisabled}>
              Discoverable
            </Text>
            <Icon
              name="info"
              type="material"
              size={20}
              color="#363732"
              style={{ marginLeft: 10 }}
            />
          </View>
          <Switch
            value={discoverable}
            onValueChange={() => toggleDiscoverable()}
          />
        </View>

        <View style={styles.buttonExternalsContainer}>
          <TouchableOpacity
            activeOpacity={0.75}
          // onPress={() => viewAppTutorial()}
          >
            <View style={styles.buttonExternalsSpacing}>
              <View style={[styles.buttonExternalsDisabled, {}]}>
                <Text style={styles.buttonExternalsTextDisabled}>
                  View App Tutorial
                </Text>
                <Icon
                  name="play-circle"
                  type="material-community"
                  size={24}
                  color="#9D9D9D"
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => visitFAQ()}
          >
            <View style={styles.buttonExternalsSpacing}>
              <View style={[styles.buttonExternalsEnabled, {}]}>
                <Text style={styles.buttonExternalsTextEnabled}>
                  Visit our FAQ
                </Text>
                <Icon
                  name="help"
                  type="material"
                  size={24}
                  color="#363732"
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
          // onPress={() => contactDeveloper()}
          >
            <View style={styles.buttonExternalsSpacing}>
              <View style={[styles.buttonExternalsDisabled, {}]}>
                <Text style={styles.buttonExternalsTextDisabled}>
                  Contact Developer
                </Text>
                <Icon
                  name="report"
                  type="material"
                  size={24}
                  color="#9D9D9D"
                />
              </View>
            </View>
          </TouchableOpacity>

        </View>

        <Divider
          width={2}
          color={"#9D9D9D"}
          style={{ width: '90%', alignSelf: 'center' }}
        />

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            alert(
              `The "Delete User Account" function has been disabled for STEM Day.`,
              "My Alert Msg",
              [{ text: "OK" }]
            );
          }}
        >
          <View style={styles.buttonDeleteSpacing}>
            <View style={[styles.buttonDeleteAccount, {}]}>
              <Text style={styles.buttonDeleteAccountText}>
                DELETE ACCOUNT
              </Text>
              <Icon
                name="delete"
                type="material"
                size={24}
                color="#DF3D23"
              />
            </View>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({

  mainContainer: {
    backgroundColor: '#EFEAE2',
    height: '100%',
  },

  contentContainer: {
    width: '100%',
    padding: 20,

  },

  toolTipBlock: {
    height: 115,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2,
    shadowOpacity: .25,
  },

  innerContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 30,
    marginTop: 25,
    backgroundColor: '#E4E6E8',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 5,
    shadowOpacity: .2,
  },

  headerBar: {
    width: '100%',
    height: 20,
    backgroundColor: '#CFC5BA'
  },

  publicInformation: {
    textAlign: 'center',
    flexDirection: 'row',
    padding: 20,
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'white'
  },

  userProfilePicture: {
    marginRight: 20,
  },

  userText: {
  },

  userName: {
    fontSize: 25,
    fontWeight: '700',

  },

  userStatus: {
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },

  privateInformation: {
    height: 115,
    width: '90%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'grey',
    marginTop: 15,
    marginBottom: 22,
    padding: 15,
  },

  privateInformationHeader: {
  },

  privateInformationEmail: {
    flexDirection: 'row',
    margin: 10,
  },

  privateInformationEmailText: {
    marginLeft: 15
  },

  privateInformationPhone: {
    flexDirection: 'row',
    marginLeft: 10,
  },

  privateInformationPhoneText: {
    marginLeft: 15

  },

  buttonSpacing: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 22,
  },

  buttonEdit: {
    width: 115,
    height: 45,
    borderWidth: 3,
    borderStyle: 'solid',
    borderRadius: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 15,
  },

  buttonEditText: {
    color: '#363732',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 7,
  },


  applicationSettingsBreaker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30
  },

  applicationSettingsText: {
    fontSize: 17,
    color: 'black',
    fontWeight: '700',
    marginLeft: 20,
    marginRight: 20,
  },

  toggleBox: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    width: '90%',
    height: 55,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2,
    shadowOpacity: .25,
  },

  toggleBoxLeftHalf: {
    flexDirection: 'row',
  },

  toggleBoxTextEnabled: {
    fontSize: 15,
    color: 'black',
    fontWeight: '700'
  },

  toggleBoxTextDisabled: {
    fontSize: 15,
    color: '#777777',
    fontWeight: '700'
  },

  buttonExternalsContainer: {
    marginTop: 40,
    marginBottom: 30,
  },

  buttonDeleteSpacing: {
    flexDirection: "row",
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 25,
  },

  buttonExternalsSpacing: {
    flexDirection: "row",
    alignSelf: 'center',
    marginBottom: 15,
  },

  buttonExternalsDisabled: {
    width: '75%',
    height: 55,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    borderColor: '#9D9D9D',
    // backgroundColor: 'white',
  },

  buttonExternalsTextDisabled: {
    color: '#9D9D9D',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
  },

  buttonExternalsEnabled: {
    width: '75%',
    height: 55,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    borderColor: '#777777',
    backgroundColor: 'white',
  },

  buttonExternalsTextEnabled: {
    color: '#363732',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
  },

  buttonDeleteSpacing: {
    flexDirection: "row",
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 25,
  },

  buttonDeleteAccount: {
    width: 225,
    height: 45,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    borderColor: '#DF3D23'
  },

  buttonDeleteAccountText: {
    color: '#DF3D23',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 5,
  },



  // page: {
  //   flexDirection: 'column',
  //   justifyContent: 'flex-start',
  //   alignItems: 'center'
  // },

  // resources: {
  //   width: 280,
  //   height: 60,
  //   backgroundColor: 'lightgray',
  //   borderColor: 'black',
  //   borderStyle: 'solid',
  //   borderWidth: 2,
  //   borderRadius: 15,
  //   flexDirection: "row",
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 20
  // },

  // delete: {
  //   width: 300,
  //   height: 60,
  //   backgroundColor: '#F3889C',
  //   borderStyle: 'solid',
  //   borderColor: 'black',
  //   borderWidth: 2,
  //   borderRadius: 15,
  //   flexDirection: "row",
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 20,
  //   marginTop: 30
  // }
});

export default ProfileTab;