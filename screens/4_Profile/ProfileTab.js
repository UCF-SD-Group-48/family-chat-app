// *************************************************************
// Imports for: React, React Native, & React Native Elements
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
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
import { AntDesign, Feather, Entypo, Ionicons, FontAwesome5, Fontisto, Octicons, MaterialIcons } from "@expo/vector-icons";

// Imports for: Firebase
import {
  apps,
  auth,
  db,
  firebaseConfig,
  deleteUser
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
import MyView from '../../components/MyView';

// *************************************************************

const screenWidth = Dimensions.get('screen').width;

// Fourth tab of the application: PROFILE of currently logged in user.
const ProfileTab = ({ navigation }) => {

  const [editing, setEditing] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [statusEmoji, setStatusEmoji] = useState("");
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pfp, setPfp] = useState(0);

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
        <View style={{ marginRight: 12, }}>
          <Menu>
            <MenuTrigger>
              <Icon
                name='dots-three-horizontal'
                type='entypo'
                color='black'
                size={30}
              />
            </MenuTrigger>
            <MenuOptions
              style={{
                borderRadius: 12, backgroundColor: "#fff",
              }}
              customStyles={{
                optionsContainer: {
                  borderRadius: 15, backgroundColor: "#666",
                },
              }}>
              <MenuOption
                onSelect={() => deleteAccount()}
                style={{ marginBottom: 10, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name='trash'
                  type='feather'
                  color='red'
                  size={16}
                  style={{ marginLeft: 10, }}
                />
                <Text style={{ fontSize: 14, color: 'red', marginLeft: 11 }}>
                  Delete Account
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      ),
    });
  }, [navigation]);

  const deleteAccount = () => {
    console.log('Are you sure you want to delete your account?')
    setDeleted(true);

    Alert.alert(
      'Delete Account',
      'Are you sure that you want to delete your account? This will permanently erase data from your groups/topics.',
      [
        { text: "Cancel", style: 'cancel', onPress: () => setDeleted(false) },
        {
          text: 'Yes, Delete',
          style: 'destructive',
          onPress: () => {
            setDeleted(true);
            removeUserFromGroupsTopics();
          },
        },
      ]
    );
  }

  const [deleted, setDeleted] = useState(false)

  const removeUserFromGroupsTopics = async () => {

    // Get current user doc
    // identify groups
    // identify current user topicMap
    // check current user's groups
    // if the group is only one member = only with them, then delete group/topics/messages
    // if the group is owned by the current user, give to someone else
    // if the current user is owner of topics, give to someone else (if there are other members)
    // remove the DMs

    console.log('Removing user from Groups / Topics');

    await setDeleted(true);
    setEditing(false);

    Alert.alert(
      `Account Deleted`,
      `Your account was successfully deleted.`,
      [{ text: "OK" }]
    );

    const userQuery = await db
      .collection('users')
      .doc(auth.currentUser.uid)
      .delete()
      .then(() => {
        navigation.replace('UserAuth')
      })
      .catch((error) => console.log(error));

  }

  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.navigate('UserAuth')
    })
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
        if (deleted === false) {
          setUserSnapshotData(userSnapshot.data())
          setPushNotifications(userSnapshot.data().pushNotificationEnabled)
          setDiscoverable(userSnapshot.data().discoverableEnabled)
          setFormattedPhoneNumber(`(${userSnapshot.data().phoneNumber.slice(0, 3)}) ${userSnapshot.data().phoneNumber.slice(3, 6)}-${userSnapshot.data().phoneNumber.slice(6, 10)}`)

          setFirstName(userSnapshot.data().firstName);
          setLastName(userSnapshot.data().lastName);
          setStatus(userSnapshot.data().statusText);
          setStatusEmoji(userSnapshot.data().statusEmoji);
          setEmail(userSnapshot.data().email);
          setPhoneNumber(formatNumber(userSnapshot.data().phoneNumber));
          setPfp(userSnapshot.data().pfp);
        }
      });

    return () => {
      setUserSnapshotData({});
      setPushNotifications();
      setDiscoverable();
      setFormattedPhoneNumber()
      setFirstName();
      setLastName();
      setStatus();
      setStatusEmoji();
      setEmail();
      setPhoneNumber();
      setPfp();
      unsubscribe;
    }
  }, []);

  const formatNumber = (phoneEntry) => {
    return `(${phoneEntry.slice(0, 3)}) ${phoneEntry.slice(3, 6)}-${phoneEntry.slice(6, 10)}`
  }

  const viewAppTutorial = () => {
    navigate.replace('AppTutorial');
  }

  const visitFAQ = () => {
    Linking.openURL('https://www.familychat.app/#FAQ');
  }

  const contactDeveloper = () => {
    // Linking.openURL('mailto:familychatapp@gmail.com?subject=Inquiry&body=Hey,')
    Linking.openURL('mailto:parizeaujj@gmail.com?subject=FamilyChat&body=Help')
    // Linking.openURL('message://familychatapp@gmail.com?subject=Inquiry&body=Hey,')
  }

  const handleEmoji = (textChange) => {
    let newText = textChange;
    if (newText?.length >= 1) {
      if (newText?.length == 4) { //if it's two emoji's only take the last one
        newText = [...textChange].slice(1).join('');
      }
      else if (newText?.length == 2) { //if it's one emoji, take it as one character
        newText = [...textChange].slice(0, 1).join('');
      }
      else { //if it's anything else, set it to nothing
        newText = "";
      }
    }
    setStatusEmoji(newText);
  };

  const saveProfileData = async () => {

    await db.collection("users").doc(auth.currentUser.uid).update({
      firstName: firstName,
      lastName: lastName,
      statusEmoji: statusEmoji,
      statusText: status,
      email: email,
      pfp: pfp,
    });

  };

  const togglePFPSelection = () => {

  }

  const checkIfSelected = (imageNumber) => {
    if (pfp === imageNumber) {
      // Selected Profile Option
      return {
        width: 50,
        height: 50,
        borderRadius: 8,
        margin: 5,
        opacity: 1,
        borderWidth: 5,
        borderColor: '#2C6BED'
      }
    }
    else {
      // Default faded styling for profile options
      return {
        width: 50,
        height: 50,
        borderRadius: 8,
        margin: 5,
        opacity: .3
      }
    }
  };

  const getSelectedImage = () => {
    switch (pfp) {
      case 1: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_1.png')}
          style={styles.pfpSelection}
        />
      }
      case 2: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_2.png')}
          style={styles.pfpSelection}
        />
      }
      case 3: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_3.png')}
          style={styles.pfpSelection}
        />
      }
      case 4: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_4.png')}
          style={styles.pfpSelection}
        />
      }
      case 5: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_5.png')}
          style={styles.pfpSelection}
        />
      }
      case 6: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_6.png')}
          style={styles.pfpSelection}
        />
      }
      case 7: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_7.png')}
          style={styles.pfpSelection}
        />
      }
      case 8: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_8.png')}
          style={styles.pfpSelection}
        />
      }
      case 9: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_9.png')}
          style={styles.pfpSelection}
        />
      }
      case 10: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_10.png')}
          style={styles.pfpSelection}
        />
      }
      case 11: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_11.png')}
          style={styles.pfpSelection}
        />
      }
      case 12: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_12.png')}
          style={styles.pfpSelection}
        />
      }
      case 13: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_13.png')}
          style={styles.pfpSelection}
        />
      }
      case 14: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_14.png')}
          style={styles.pfpSelection}
        />
      }
      case 15: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_15.png')}
          style={styles.pfpSelection}
        />
      }
      case 16: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_16.png')}
          style={styles.pfpSelection}
        />
      }
      default: {
        return <Image
          source={require('../../assets/pfpOptions/avatar_1.png')}
          style={styles.pfpSelection}
        />
      }
    }
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
    <StatusBar style='dark' />
      <ScrollView
        width={'100%'}
        contentContainerStyle={{
          justifyContent: "flex-start",
          flexDirection: "column",
        }}
      >

        <View style={styles.innerContainer}>

          <View style={styles.headerBar} />

          <MyView hide={!editing} style={{
            width: "100%", minHeight: 50, backgroundColor: "#fff",
            justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
          }}>
            {/* Profile Picture */}
            <TouchableOpacity activeOpacity={0.85} onPress={() => togglePFPSelection(pfp)}
              style={{
                width: "90%", minHeight: 50, backgroundColor: "#abc0",
                justifyContent: "flex-start", alignItems: "flex-end", flexDirection: "row",
                marginTop: 15, marginBottom: 5,
              }}>
              <Tooltip
                width={toggleWindowWidth}
                backgroundColor={'#EFEAE2'}
                containerStyle={[styles.toolTipBlockImage, { alignItems: 'center' }]}
                popover={
                  <View style={[styles.imagesGridContainer, { alignSelf: 'center' }]}>

                    <View style={styles.imagesGridTop2}>
                      <View style={styles.Top2LeftHalf}>
                        {getSelectedImage()}
                      </View>
                      <View style={styles.Top2RightHalf}>
                        <View style={styles.imagesGridRow1}>
                          <View style={styles.imageOptions}>
                            <TouchableOpacity
                              activeOpacity={0.75}
                              onPress={() => setPfp(1)}
                            >
                              <Image
                                source={require('../../assets/pfpOptions/avatar_1.png')}
                                style={checkIfSelected(1)}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.imageOptions}>
                            <TouchableOpacity
                              activeOpacity={0.75}
                              onPress={() => setPfp(2)}
                            >
                              <Image
                                source={require('../../assets/pfpOptions/avatar_2.png')}
                                style={checkIfSelected(2)}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.imageOptions}>
                            <TouchableOpacity
                              activeOpacity={0.75}
                              onPress={() => setPfp(3)}
                            >
                              <Image
                                source={require('../../assets/pfpOptions/avatar_3.png')}
                                style={checkIfSelected(3)}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.imageOptions}>
                            <TouchableOpacity
                              activeOpacity={0.75}
                              onPress={() => setPfp(4)}
                            >
                              <Image
                                source={require('../../assets/pfpOptions/avatar_4.png')}
                                style={checkIfSelected(4)}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.imageOptions}>
                            <TouchableOpacity
                              activeOpacity={0.75}
                              onPress={() => setPfp(8)}
                            >
                              <Image
                                source={require('../../assets/pfpOptions/avatar_8.png')}
                                style={checkIfSelected(8)}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles.imagesGridRow2}>


                          <View style={styles.imageOptions}>
                            <TouchableOpacity
                              activeOpacity={0.75}
                              onPress={() => setPfp(12)}
                            >
                              <Image
                                source={require('../../assets/pfpOptions/avatar_12.png')}
                                style={checkIfSelected(12)}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.imageOptions}>
                            <TouchableOpacity
                              activeOpacity={0.75}
                              onPress={() => setPfp(13)}
                            >
                              <Image
                                source={require('../../assets/pfpOptions/avatar_13.png')}
                                style={checkIfSelected(13)}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.imageOptions}>
                            <TouchableOpacity
                              activeOpacity={0.75}
                              onPress={() => setPfp(14)}
                            >
                              <Image
                                source={require('../../assets/pfpOptions/avatar_14.png')}
                                style={checkIfSelected(14)}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.imageOptions}>
                            <TouchableOpacity
                              activeOpacity={0.75}
                              onPress={() => setPfp(15)}
                            >
                              <Image
                                source={require('../../assets/pfpOptions/avatar_15.png')}
                                style={checkIfSelected(15)}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.imageOptions}>
                            <TouchableOpacity
                              activeOpacity={0.75}
                              onPress={() => setPfp(5)}
                            >
                              <Image
                                source={require('../../assets/pfpOptions/avatar_5.png')}
                                style={checkIfSelected(5)}
                              />
                            </TouchableOpacity>
                          </View>

                        </View>
                      </View>
                    </View>
                    <View style={styles.imagesGridBottom3}>

                      <View style={styles.imagesGridRow3}>
                        <View style={styles.imageOptions}>
                          <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={() => setPfp(9)}
                          >
                            <Image
                              source={require('../../assets/pfpOptions/avatar_9.png')}
                              style={checkIfSelected(9)}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.imageOptions}>
                          <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={() => setPfp(6)}
                          >
                            <Image
                              source={require('../../assets/pfpOptions/avatar_6.png')}
                              style={checkIfSelected(6)}
                            />
                          </TouchableOpacity>
                        </View>

                        <View style={styles.imageOptions}>
                          <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={() => setPfp(11)}
                          >
                            <Image
                              source={require('../../assets/pfpOptions/avatar_11.png')}
                              style={checkIfSelected(11)}
                            />
                          </TouchableOpacity>
                        </View>

                        <View style={styles.imageOptions}>
                          <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={() => setPfp(18)}
                          >
                            <Image
                              source={require('../../assets/pfpOptions/avatar_18.png')}
                              style={checkIfSelected(18)}
                            />
                          </TouchableOpacity>
                        </View>


                        <View style={styles.imageOptions}>
                          <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={() => setPfp(16)}
                          >
                            <Image
                              source={require('../../assets/pfpOptions/avatar_16.png')}
                              style={checkIfSelected(16)}
                            />
                          </TouchableOpacity>
                        </View>

                      </View>
          
                    </View>
                  </View>
                }>

                <View style={{
                  width: "90%", minHeight: 50, backgroundColor: "#abc0",
                  justifyContent: "flex-start", alignItems: "flex-end", flexDirection: "row",
                  marginRight: 15,

                }}>
                  <Image
                    source={imageSelection(pfp)}
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 5,
                      marginRight: 13,
                      borderWidth: 2,
                      borderColor: "#777",

                    }}
                  />
                  {/* <TouchableOpacity activeOpacity={0.85} onPress={() => toggleCoverImageSelection(pfp)}
                                                style={{
                                                    width: 26, height: 26, backgroundColor: "#F8F8F8", borderRadius: 15, borderWidth: 2, borderColor: "#777",
                                                    marginLeft: -19, marginBottom: -7,
                                                    justifyContent: "center", alignItems: "center",
                                                }}> */}
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      backgroundColor: "#F8F8F8",
                      borderRadius: 15,
                      borderWidth: 2,
                      borderColor: "#777",
                      marginLeft: -35,
                      marginBottom: -5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Icon
                      name="mode-edit"
                      type="material"
                      color="#333"
                      size={15}
                      style={{ paddingLeft: 2, }}
                    />
                    {/* <MaterialIcons name="mode-edit" size={15} color="#333" style={{ paddingLeft: 2, }} /> */}
                  </View>
                  {/* </TouchableOpacity> */}
                </View>
              </Tooltip>
            </TouchableOpacity>

            <Divider width={1} color={"#777"} style={{ flex: 1, flexGrow: 1, minWidth: "90%", marginVertical: 10, }} />

            {/* First/Last Name */}
            <View style={{
              width: "90%", minHeight: 50, backgroundColor: "#abc0",
              justifyContent: "space-between", alignItems: "flex-start", flexDirection: "row",
              marginVertical: 10,
            }}>

              {/* First Name */}
              <View style={{
                width: "47%",
                justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column",
              }}>
                <Text style={{
                  textAlign: 'left', fontSize: 16, fontWeight: '700',
                  color: 'black', paddingLeft: 0,
                }}>
                  {"First:"}
                </Text>
                <View style={{
                  width: "100%", flexDirection: "row",
                }}>
                  <View style={{
                    width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                    marginTop: 2, marginHorizontal: 0, paddingTop: 7, paddingBottom: 7, paddingHorizontal: 15,
                    justifyContent: "flex-start", alignItems: "center",
                    borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                  }}>
                    <TextInput placeholder={"First Name"} onChangeText={setFirstName} value={firstName}
                      multiline={false} maxLength={15}
                      style={{
                        minHeight: 20, width: "100%",
                        backgroundColor: "#6660", color: '#222',
                        textAlign: 'left', fontSize: 16, fontWeight: '500',
                      }}
                    />
                  </View>
                </View>
                {/* How many Characters description.length >= 55*/}
                <MyView hide={firstName?.length < 10}
                  style={{
                    width: "100%",
                    paddingHorizontal: 0,
                    justifyContent: "flex-end", alignItems: "flex-start",
                    flexDirection: "row", direction: "ltr",
                    borderWidth: 2,
                    borderColor: "#0000",
                  }}>
                  <Text style={{
                    paddingLeft: 0,
                    textAlign: 'right',
                    fontSize: 14,
                    fontWeight: '500',
                    color: "#222",
                  }}>
                    {"Characters " + firstName?.length + "/15"}
                  </Text>
                </MyView>
              </View>

              {/* Last Name */}
              <View style={{
                width: "47%",
                justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column",
              }}>
                <Text style={{
                  textAlign: 'left', fontSize: 16, fontWeight: '700',
                  color: 'black', paddingLeft: 0,
                }}>
                  {"Last:"}
                </Text>
                <View style={{
                  width: "100%", flexDirection: "row",
                }}>
                  <View style={{
                    width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                    marginTop: 2, marginHorizontal: 0, paddingTop: 7, paddingBottom: 7, paddingHorizontal: 15,
                    justifyContent: "flex-start", alignItems: "center",
                    borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                  }}>
                    <TextInput placeholder={"Last Name"} onChangeText={setLastName} value={lastName}
                      multiline={false} maxLength={30}
                      style={{
                        minHeight: 20, width: "100%",
                        backgroundColor: "#6660", color: '#222',
                        textAlign: 'left', fontSize: 16, fontWeight: '500',
                      }}
                    />
                  </View>
                </View>
                {/* How many Characters description.length >= 55*/}
                <MyView hide={lastName?.length < 25}
                  style={{
                    width: "100%",
                    paddingHorizontal: 0,
                    justifyContent: "flex-end", alignItems: "flex-start",
                    flexDirection: "row", direction: "ltr",
                    borderWidth: 2,
                    borderColor: "#0000",
                  }}>
                  <Text style={{
                    paddingLeft: 0,
                    textAlign: 'right',
                    fontSize: 14,
                    fontWeight: '500',
                    color: "#222",
                  }}>
                    {"Characters " + lastName?.length + "/30"}
                  </Text>
                </MyView>
              </View>
            </View>

            {/* Status */}
            <View style={{
              width: "90%", minHeight: 50, backgroundColor: "#abc0",
              justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "row",
              marginVertical: 10,
            }}>

              {/* Status */}
              <View style={{
                maxWidth: "100%", flex: 1, flexGrow: 1,
                justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column",
              }}>
                <Text style={{
                  textAlign: 'left', fontSize: 16, fontWeight: '700',
                  color: 'black', paddingLeft: 0,
                }}>
                  {"Status:"}
                </Text>
                <View style={{
                  width: "100%", flexDirection: "row",
                }}>
                  <View style={{
                    width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "row",
                    marginTop: 2, marginHorizontal: 0,
                    justifyContent: "flex-start", alignItems: "center",
                    borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                  }}>
                    <View style={{
                      height: "100%", width: 40, backgroundColor: "#F8F8F8",
                      justifyContent: "center", alignItems: "center", flexDirection: "row",
                      borderTopLeftRadius: 3, borderBottomLeftRadius: 3,
                      borderRightWidth: 1, borderColor: "#333",
                    }}>
                      <TextInput placeholder={""} onChangeText={(textChange) => handleEmoji(textChange)}
                        value={statusEmoji} selectTextOnFocus={true}
                        multiline={false} maxLength={4}
                        style={{
                          height: "100%", width: "100%",
                          backgroundColor: "#6660", color: '#222',
                          textAlign: 'center', fontSize: 16, fontWeight: '500',
                        }}
                      />
                    </View>
                    <TextInput placeholder={"Status"} onChangeText={setStatus} value={status}
                      multiline={false} maxLength={50}
                      style={{
                        paddingTop: 7, paddingBottom: 7, paddingHorizontal: 15,
                        minHeight: 20, width: (screenWidth * .81 - 40),
                        backgroundColor: "#6660", color: '#222',
                        textAlign: 'left', fontSize: 16, fontWeight: '500',
                      }}
                    />
                  </View>
                </View>
                {/* How many Characters description.length >= 55*/}
                <MyView hide={status?.length < 40}
                  style={{
                    width: "100%",
                    paddingHorizontal: 0,
                    justifyContent: "flex-end", alignItems: "flex-start",
                    flexDirection: "row", direction: "ltr",
                    borderWidth: 2,
                    borderColor: "#0000",
                  }}>
                  <Text style={{
                    paddingLeft: 0,
                    textAlign: 'right',
                    fontSize: 14,
                    fontWeight: '500',
                    color: "#222",
                  }}>
                    {"Characters " + status?.length + "/50"}
                  </Text>
                </MyView>
              </View>
            </View>

            {/* Email */}
            <View style={{
              width: "90%", minHeight: 50, backgroundColor: "#abc0",
              justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
              marginVertical: 10,
            }}>

              {/* Email */}
              <View style={{
                width: "100%",
                justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column",
              }}>
                <Text style={{
                  textAlign: 'left', fontSize: 16, fontWeight: '700',
                  color: 'black', paddingLeft: 0,
                }}>
                  {"Email:"}
                </Text>
                <View style={{
                  width: "100%", flexDirection: "row",
                }}>
                  <View style={{
                    width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                    marginTop: 2, marginHorizontal: 0, paddingTop: 7, paddingBottom: 7, paddingHorizontal: 15,
                    justifyContent: "flex-start", alignItems: "center",
                    borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                  }}>
                    <TextInput placeholder={"Email"} onChangeText={setEmail} value={email}
                      multiline={false} maxLength={50}
                      style={{
                        minHeight: 20, width: "100%",
                        backgroundColor: "#6660", color: '#222',
                        textAlign: 'left', fontSize: 16, fontWeight: '500',
                      }}
                    />
                  </View>
                </View>
                {/* How many Characters description.length >= 55*/}
                <MyView hide={email?.length < 40}
                  style={{
                    width: "100%",
                    paddingHorizontal: 0,
                    justifyContent: "flex-end", alignItems: "flex-start",
                    flexDirection: "row", direction: "ltr",
                    borderWidth: 2,
                    borderColor: "#0000",
                  }}>
                  <Text style={{
                    paddingLeft: 0,
                    textAlign: 'right',
                    fontSize: 14,
                    fontWeight: '500',
                    color: "#222",
                  }}>
                    {"Characters " + email?.length + "/50"}
                  </Text>
                </MyView>
              </View>

            </View>

            {/* Phone Number */}
            <View style={{
              width: "90%", height: 50, backgroundColor: "#abc0",
              justifyContent: "space-between", alignItems: "center", flexDirection: "row",
              marginVertical: 10,
            }}>

              {/* Phone Number */}
              <View style={{
                width: "100%",
                justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column",
              }}>
                <Text style={{
                  textAlign: 'left', fontSize: 16, fontWeight: '700',
                  color: '#999', paddingLeft: 0,
                }}>
                  {"Phone Number:"}
                </Text>
                <View style={{
                  width: "100%", flexDirection: "row",
                }}>
                  <View style={{
                    width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "row",
                    marginTop: 2, marginHorizontal: 0, paddingTop: 7, paddingBottom: 7, paddingHorizontal: 15,
                    justifyContent: "flex-start", alignItems: "center",
                    borderWidth: 1, borderColor: "#999", borderRadius: 3, backgroundColor: "#F8F8F8"
                  }}>
                    <Text style={{
                      textAlign: 'left', fontSize: 16, fontWeight: '500',
                      color: '#aaa',
                    }}>
                      1+ {phoneNumber}
                    </Text>
                  </View>
                </View>
              </View>

            </View>

            {/* Save */}
            <View style={{
              width: "90%", height: 50, backgroundColor: "#abc0",
              justifyContent: "flex-end", alignItems: "center", flexDirection: "row",
              marginVertical: 10,
              marginBottom: 22,
            }}>

              <TouchableOpacity activeOpacity={0.7} onPress={() => { setEditing(false); saveProfileData(); }} style={{
                paddingVertical: 7, paddingHorizontal: 17,
                backgroundColor: "#1174EC", borderColor: "#333", borderWidth: 2.5, borderRadius: 50,
                justifyContent: "center", alignItems: "center", flexDirection: "row",
              }}>
                <Text style={{
                  textAlign: 'center', fontSize: 16, fontWeight: '800',
                  color: '#fff', marginRight: 10,
                }}>
                  {"SAVE"}
                </Text>
                <Octicons name="check" size={24} color="white" />
              </TouchableOpacity>

            </View>
          </MyView>

          <MyView hide={editing}>
            <View style={styles.publicInformation}>
              <View style={styles.userProfilePicture}>
                <Image
                  source={imageSelection(pfp)}
                  style={{ width: 80, height: 80, borderRadius: 5, }}
                />
              </View>
              <View style={styles.userText}>
                <Text style={styles.userName}>
                  {userSnapshotData?.firstName}
                </Text>
                <Text style={styles.userName}>
                  {userSnapshotData?.lastName}
                </Text>
                <Text style={styles.userStatus}>
                  {userSnapshotData?.statusEmoji}  {userSnapshotData?.statusText}
                </Text>
              </View>
            </View>

            <View style={styles.privateInformation}>
              <View style={styles.privateInformationHeader}>
                <Text style={{ fontSize: 16, fontWeight: '700' }}>
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
                {userSnapshotData?.email
                  ? <Text style={[styles.privateInformationEmailText, {}]}>
                    {userSnapshotData?.email}
                  </Text>
                  : <Text style={[styles.privateInformationEmailText, { fontStyle: 'italic', color: '#777777' }]}>
                    {"— No Email Listed"}
                  </Text>
                }
                {/* <Text style={[styles.privateInformationEmailText, {fontStyle: 'italic', color: '#777777'}]}>
                  {userSnapshotData.email || "— No Email Listed"}
                </Text> */}
              </View>
              <View style={styles.privateInformationPhone}>
                <Icon
                  name="phone"
                  type="material"
                  size={20}
                  color="#363732"
                />
                <Text style={styles.privateInformationPhoneText}>
                  1+ {formattedPhoneNumber}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => {
                setEditing(true);
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

          </MyView>

        </View>


        <View style={styles.applicationSettingsBreaker}>
          <Divider
            width={2}
            color={"#9D9D9D"}
            style={{ flex: 1, flexGrow: 1, alignSelf: 'center' }}
          />

          <Text style={styles.applicationSettingsText}>
            {/* Application Settings: */}
            Informational Help:
          </Text>

          <Divider
            width={2}
            color={"#9D9D9D"}
            style={{ flex: 1, flexGrow: 1, alignSelf: 'center' }}
          />
        </View>

        {/* <View style={[styles.toggleBox, { borderBottomWidth: 1, borderColor: '#C4C4C4' }]}>
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
        </View> */}

        <View style={styles.buttonExternalsContainer}>
          {/* 
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
          </TouchableOpacity> */}

          {/* FAQ Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => visitFAQ()}
            style={{ marginTop: 10 }}
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

          {/* Contact Developer Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => contactDeveloper()}
          >
            <View style={styles.buttonExternalsSpacing}>
              <View style={[styles.buttonExternalsEnabled, {}]}>
                <Text style={styles.buttonExternalsTextEnabled}>
                  Contact Developer
                </Text>
                <Icon
                  name="report"
                  type="material"
                  size={24}
                  color="#363732"
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



        {/* Log out Button */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            signOutUser();
          }}
        >
          <View style={styles.buttonDeleteSpacing}>
            <View style={[styles.buttonDeleteAccount, {}]}>
              <Text style={styles.buttonDeleteAccountText}>
                LOG OUT
              </Text>
              <Icon
                name='logout'
                type='material'
                size={24}
                color='#DF3D23'
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Delete Account Button */}
        {/* <TouchableOpacity
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
        </TouchableOpacity> */}

      </ScrollView>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({

  toolTipBlockImage: {
    height: 250,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2,
    shadowOpacity: .25,
    paddingBottom: 30
    // padding: 40,
  },

  mainContainer: {
    backgroundColor: '#EFEAE2',
    height: '100%',
  },

  contentContainer: {
    width: '100%',
    padding: 20,

  },

  // toolTipBlock: {
  //   height: 150,
  //   shadowColor: 'black',
  //   shadowOffset: { width: 0, height: 5 },
  //   shadowRadius: 2,
  //   shadowOpacity: .25,
  // },

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
    marginTop: 0,
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


  imagesGridContainer: {
    // marginBottom: 22,
    marginTop: 20,
    marginBottom: 20,

  },

  imagesGridTop2: {
    flexDirection: "row",
    marginTop: 30

  },

  Top2LeftHalf: {

  },

  Top2RightHalf: {

  },

  imagesGridRow1: {
    flexDirection: "row",
    marginBottom: 10,
  },

  imagesGridRow2: {
    flexDirection: "row",
    marginBottom: 10,
  },

  imagesGridRow3: {
    flexDirection: "row",
    marginBottom: 10,
  },

  imagesGridRow4: {
    flexDirection: "row",
    marginBottom: 10,
  },

  imagesGridRow5: {
    flexDirection: "row",
    marginBottom: 30,
  },

  coverImageSelection: {
    width: 100,
    height: 100,
    borderRadius: 250,
    marginLeft: 5,
    marginRight: 15,
    borderWidth: 5,
    borderColor: '#2352DF'
  },

  coverImageOption: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
  },

});

export default ProfileTab;