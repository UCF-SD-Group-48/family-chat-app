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

import { useIsFocused, useScrollToTop } from '@react-navigation/native';
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
import NewNotificationsBlock from '../../components/NewNotificationsBlock';
import DismissButton from '../../components/DismissButton';
import MyView from '../../components/MyView';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import { Timestamp } from 'firebase/firestore';

// *************************************************************
import helpers from '../../helperFunctions/helpers';

// First tab of the application: HOME.
const HomeTab = ({ navigation, route }) => {

  const [testData, setTestData] = useState([
    {
      groupColor: "red",
      groupID: "fedcba",
      groupImageNumber: 2,
      groupName: "The boiis",
      topics: [
        {
          missedMessages: [
            {
              messageText: "Are you okay?",
              messageTime: firebase.firestore.FieldValue.serverTimestamp(),
              senderFullName: "Jake Truemann",
              senderPFP: 3,
            },
            {
              messageText: "No I'm not :(",
              messageTime: firebase.firestore.FieldValue.serverTimestamp(),
              senderFullName: "Triabel Canderberry",
              senderPFP: 2,
            },
            {
              messageText: "bummer...",
              messageTime: firebase.firestore.FieldValue.serverTimestamp(),
              senderFullName: "Jake Truemann",
              senderPFP: 3,
            },
            {
              messageText: "umm, who is getting displayed??",
              messageTime: firebase.firestore.FieldValue.serverTimestamp(),
              senderFullName: "Triabel Canderberry",
              senderPFP: 2,
            },
          ],
          topicID: "abcdefg",
          topicName: "General",
        },
        {
          missedMessages: [
            {
              messageText: "Let's have an awesome usmmer",
              messageTime: firebase.firestore.FieldValue.serverTimestamp(),
              senderFullName: "Jake Truemann",
              senderPFP: 3,
            },
            {
              messageText: "yayaya",
              messageTime: firebase.firestore.FieldValue.serverTimestamp(),
              senderFullName: "Jake Truemann",
              senderPFP: 3,
            },
          ],
          topicID: "hfhfl",
          topicName: "Summer time",
        }
      ],
    }
  ]);

  // const [toggleWindowWidth, setToggleWindowWidth] = useState(() => {
  //   const windowWidth = Dimensions.get('window').width;
  //   return (windowWidth * .93);
  // });

  // const [count, setCount] = useState(0);

  // const navigateToAddGroup = () => {
  //   navigation.navigate('CreateGroup_1_NameImage')
  // }

  // const [blockHidden, setBlockHidden] = useState(false);
  // const [phoneNumber, setPhoneNumber] = useState((auth.currentUser.phoneNumber).substring(1));
  const [uid, setUID] = useState(auth.currentUser.uid);


  const [userData, setUserData] = useState(async () => {
    const initialState = await db
      .collection('users')
      .doc(uid)
      .get()
      .then(documentSnapshot => { if (documentSnapshot.exists) setUserData(documentSnapshot.data()) });
    return initialState;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Home',
      headerStyle: '',
      headerTitleStyle: { color: 'black' },
      headerTintColor: 'black',
      headerLeft: '',
      headerRight: '',
    });
  }, [navigation]);


  // const [missed, setMissed] = useState([])
  // const [missedID, setMissedID] = useState([])

  // // Sets date to check against for missed messages
  // useEffect(async () => {
  //   let previous;
  //   const userData = await db.collection('users').doc(auth.currentUser.uid).get()
  //   previous = userData.data().lastOn;
  //   // console.log("userData ", userData.data().lastOn)
  //   db.collection('users').doc(auth.currentUser.uid).update({
  //     prevOn: previous,
  //     lastOn: firebase.firestore.FieldValue.serverTimestamp()
  //   })

  // }, [])


  // // Collect missed messages ids
  // const missedMsg = async () => {

  //   let currentUser = await db.collection('users').doc(auth.currentUser.uid).get()
  //   const topicMap = currentUser.data().topicMap
  //   console.log("topicArray: ", (JSON.stringify(topicMap)));

  //   let values = []
  //   for (let key in topicMap) {
  //     values.push(key)
  //   }
  //   // console.log("values array: ", values);

  //   let lastTimeUserOn = currentUser.data().lastOn
  //   console.log("last time: ", lastTimeUserOn["seconds"])
  //   // for loop through user's topic  Map

  //   let totalMessages = 0;

  //   for (let topicIdFromMap of values) {
  //     console.log("current: " + topicIdFromMap + "  " + topicMap[topicIdFromMap])

  //     await db
  //       .collection('chats')
  //       .doc(topicIdFromMap) // do it this way because of batching
  //       .collection('messages')
  //       .where('timestamp', ">", topicMap[topicIdFromMap])
  //       .get()
  //       .then((getMessage) => {
  //         if (getMessage.docs.length > 0) {
  //           console.log("getMessageLength: ", getMessage.docs.length)
  //           totalMessages = getMessage.docs.length + totalMessages
  //         }
  //       })
  //       .catch((err) => console.log("Error: " + err))

  //   }

  //   if (totalMessages >= 99) {
  //     setCount(99)
  //   } else {
  //     setCount(totalMessages)
  //   }

  // }

  // Nested If Statements
  {
    // if (!userNotificationGroups.some(x => x.groupID === groupID)) { // If group doesn't exists

    //   let groupObjtest = [

    //     ...userNotificationGroups,
    //     {
    //       groupID: groupID,
    //       groupName: groupQueryData.groupName,
    //       groupColor: groupQueryData.color,
    //       groupImageNumber: groupQueryData.coverImageNumber,
    //     // groupMissedMessagesCount: (sum of all of the: topicMissedMessagesCount's)
    //       topics : []
    //     }
    //   ]

    //   // console.log("groupObjTest: ", JSON.stringify(groupObjtest, null, "\t"))
    //   // setUserNotificationGroups(groupObjtest)

    //   //                If Topic Doesn't Exist:
    //   //                     Add Topic information to that object
    //   let topicRef = groupObjtest.topics
    //   const found = topicRef.some(doc => doc.topicID === topicID);

    //   if (!found) {
    //     topicRef.push({ topicID: topicID,
    //       topicName: topicObject.data().topicName,
    //       topicMissedMessagesCount: missedMessages.length,
    //       missedMessages : [
    //         {
    //           senderPFP: messageSenderPFP,
    //           senderFullName: messageSenderFullName,
    //           messageText: messageText,
    //           messageTime: messageTimeSent
    //         }]
    //      });
    //   } else {
    //     // Add the missed message currently in iteration
    //     topicRef.missedMessages.push({
    //           senderPFP: messageSenderPFP,
    //           senderFullName: messageSenderFullName,
    //           messageText: messageText,
    //           messageTime: messageTimeSent
    //     })
    //   } 
    //   setUserNotificationGroups(groupObjtest)

    // } else { // else if group doesn't exist
    //   // find the index
    //   userNotificationGroups.indexOf()
    //   const index = userNotificationGroups.findIndex(object => {
    //     return object.id === groupID;
    //   });

    //   let topicRef = userNotificationGroups[index].groupObjtest.topics
    //   const found = topicRef.some(doc => doc.topicID === topicID);
    //   if (!found) {
    //     topicRef.push({ topicID: topicID,
    //       topicName: topicObject.data().topicName,
    //       topicMissedMessagesCount: missedMessages.length,
    //       missedMessages : [
    //         {
    //           senderPFP: messageSenderPFP,
    //           senderFullName: messageSenderFullName,
    //           messageText: messageText,
    //           messageTime: messageTimeSent
    //         }]
    //      });
    //   } else {
    //     // Add the missed message currently in iteration
    //       topicRef.missedMessages.push({
    //             senderPFP: messageSenderPFP,
    //             senderFullName: messageSenderFullName,
    //             messageText: messageText,
    //             messageTime: messageTimeSent
    //       })
    //     }

    //     setUserNotificationGroups(groupObjtest)

    // }
  }


  const isFocused = useIsFocused();
  const [userNotificationGroups, setUserNotificationGroups] = useState([])
  const [gArray, setGArray] = useState([])
  const [tArray, setTArray] = useState([])
  const [cArray, setCArray] = useState([])


  const getMissedMessages = async () => {

    // Set 'currentUserUID' from the currently logged in user
    const currentUserUID = auth.currentUser.uid;
    console.log("Initial userNotifcationGroups: ", userNotificationGroups)

    try {

      // Get the document of the currently logged in user
      const userQuery = await db
        .collection('users')
        .doc(currentUserUID)
        .get()
        .catch((error) => console.log(error));

      // Set the data from the user document as 'userQueryData' for easy parsing
      const userQueryData = userQuery.data();

      // Set the groups array for referencing, from the user document data
      const userGroupArray = userQueryData.groups;

      // Set the topicMap map field for referencing, from the user document data
      const userTopicMap = userQueryData.topicMap;

      // Create new array, comprised only of the topicID (keys) from the userTopicMap
      let userTopicArray = [];
      for (let topicID in userTopicMap) {
        userTopicArray.push(topicID);
      }

      // Map through the user's groups from 'userGroupArray'
      let groupArray = []
      userGroupArray.map(async (groupID, index) => {

        // Get the document of the user's group
        const groupQuery = await db
          .collection('groups')
          .doc(groupID)
          .get()

        // Set the data from the group document as 'groupQueryData' for easy parsing
        const groupQueryData = groupQuery.data();

        // Get all of the topics, from the current group
        const groupTopicsQuery = await db
          .collection('groups')
          .doc(groupID)
          .collection('topics')
          .get()

        //Add group information to first object in object array


        // Map through the group's topics from 'groupTopicsQuery'
        let topicArray = []
        groupTopicsQuery.docs.map(async (topicObject, index) => {

          // Check to see if the topic in question, is a part of the user's topicMapArray
          // We only want to do an additional database call, to find the missed messages, for only the relevant topics
          if (userTopicArray.includes(topicObject.id)) {

            //Add all relevent topics to object in object array

            // Defining the 'topicID' for ease of referencing
            const topicID = topicObject.id;
            // Query the database, in the 'chats' collection, for this current relevant topic
            // Get the "missed messages" (AKA, the messages where the timeStamp > the user's topicMap pair value)
            const chatsQuery = await db
              .collection('chats')
              .doc(topicID)
              .collection('messages')
              .where('timestamp', ">", userTopicMap[topicID])
              .get()
              .catch((error) => console.log(error));


            // Map through the missed messages
            let chatArray = []
            chatsQuery.docs.map(async (message, index) => {
              // Add the missed messages to the object in the object array

              // Set the data from the missedMessage document as 'messageData' for easy parsing
              const messageData = message.data();
              // console.log(JSON.stringify(messageData))

              // Query the database, in the 'users' collection, for the message sender's pfp, and name
              const messageSenderQuery = await db
                .collection('users')
                .doc(messageData.ownerUID)
                .get()

              // Set the data from the messageSenderQuery document as 'messageSenderQueryData' for easy parsing
              const messageSenderQueryData = messageSenderQuery.data();

              const messageSenderPFP = messageSenderQueryData.pfp;

              const messageSenderFullName = `${messageSenderQueryData.firstName} ${messageSenderQueryData.lastName}`

              const messageText = messageData.message;

              const messageTimeSent = messageData.timestamp.toDate().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

              // BUILD CHAT OBJECT HERE
              let chatObj = {
                senderPFP: messageSenderPFP,
                senderFullName: messageSenderFullName,
                messageText: messageText,
                messageTime: messageTimeSent,
              }


              chatArray.push(chatObj)

            }) // chats query
            setCArray(chatArray)

            // BUILD TOPIC ARRAY HERE
            let topicObj = {
              topicID: topicID,
              topicName: topicObject.data().topicName,
              missedMessages: cArray
            }

            topicArray.push(topicObj)

          } // if statement

          // If chat is not empty then 
        })

        setTArray(topicArray)

        // if the topic exists then build
        if (tArray.length !== 0) {
          let groupObj = {
            groupID: groupID,
            groupName: groupQueryData.groupName,
            groupColor: groupQueryData.color,
            groupImageNumber: groupQueryData.coverImageNumber,
            topics: tArray
          }

          groupArray.push(groupObj)

        }

      })

      setGArray(groupArray)

    } catch (error) { console.log(error) }


    console.log("Final userNotifcationGroups: ", userNotificationGroups)

    setUserNotificationGroups(gArray)


  }
  {
  }

  useEffect(async () => {

    await getMissedMessages();

  }, [isFocused]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        width={'100%'}
        contentContainerStyle={{
          justifyContent: "flex-start",
          flexDirection: "column",
        }}
      >
        {/* <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            setIsLoadingGroupSettings(true);
            goForward();
          }}
          style={styles.groupListItemComponent}
        >
          <View style={styles.groupSettingsContainer}>
            <View style={styles.groupSettingsLeftHalf}>
              <Icon
                name='folder-shared'
                type='material'
                color='#363732'
                size={35}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.overviewText}>
                View Group Settings
              </Text>

            </View>

            {(isLoadingGroupSettings)
              ? <ActivityIndicator
                size="small"
                color="#363732"
                style={{ marginRight: 10 }}
              />
              : <Icon
                name='chevron-right'
                type='entypo'
                color='#363732'
                size={30}
                style={{ marginRight: 10 }}
              />
            }
          </View>
        </TouchableOpacity> */}

        {/* <View style={styles.welcomeBackContainer}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={styles}
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
        </View> */}
        <View style={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeBackTopRow}>
              <Text style={[styles.welcomeBackText, {}]}>
                Welcome back,
              </Text>
              <Text style={[styles.welcomeBackText, { marginLeft: 3, fontWeight: '800' }]}>
                {userData.firstName}!
              </Text>
            </View>

            <View style={styles.welcomeBackBottomRow}>
              <Text style={[styles.welcomeBackText, {}]}>
                Let's see what you've missed...
              </Text>
            </View>
          </View>

          <Divider
            width={2}
            color={"#9D9D9D"}
          // style={{
          //   width: '90%',
          //   flexGrow: 1,
          //   flex: 1,
          //   alignSelf: 'center'
          // }}
          />

          {/* Events */}
          <View style={styles.interactFeaturesContainer}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => console.log("Test for users Notifications: ", gArray.length)}
            >
              <View style={[styles.interactiveFeatureButtonDisabled, { marginRight: 7 }]}>
                <View style={styles.interactiveFeatureLeftHalfDisabled}>
                  <View style={styles.interactiveFeatureIconBackgroundDisabled}>
                    <Icon
                      name='calendar'
                      type='entypo'
                      color='#9D9D9D'
                      size={25}
                    />
                  </View>
                </View>
                <View style={styles.interactiveFeatureRightHalfDisabled}>
                  <Text style={styles.interactiveFeatureTextDisabled}>
                    No Active Events
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Polls */}
            <TouchableOpacity
              activeOpacity={0.75}>
              <View style={[styles.interactiveFeatureButtonDisabled, { marginLeft: 7 }]}>
                <View style={styles.interactiveFeatureLeftHalfDisabled}>
                  <View style={styles.interactiveFeatureIconBackgroundDisabled}>
                    <Icon
                      name='bar-graph'
                      type='entypo'
                      color='#9D9D9D'
                      size={25}
                    />
                  </View>
                </View>
                <View style={styles.interactiveFeatureRightHalfDisabled}>
                  <Text style={styles.interactiveFeatureTextDisabled}>
                    No Active Polls
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

          </View>

          {/* You're all Caught Up Message */}
          <MyView hide={true}>
          <View style={styles.allCaughtUpContainer}>
            <View style={styles.allCaughtUpContent}>
              <Text style={{ fontSize: 55 }}>
                👍
              </Text>
              <View style={styles.allCaughtUpTextBlock}>
                <Text style={styles.allCaughtUpTextTop}>
                  You're all caught up!
                </Text>
                <Text style={styles.allCaughtUpTextBottom}>
                  No new messages.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.callToActionFooterText}>
            <Text style={{ width: 275, alignSelf: 'center', textAlign: 'center', color: '#363732' }}>
              Keep the conversation going by visiting one of your groups and sending your family a nice message.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate('GroupsTab')}
          >
            <View style={styles.buttonSpacing}>
              <View style={[styles.buttonGroups, { borderColor: '#363732', }]}>
                <Text style={styles.buttonGroupsText}>
                  GO TO GROUPS
                </Text>
                <Icon
                  name="arrow-right"
                  type="material-community"
                  size={24}
                  color="#363732"
                />
              </View>
            </View>
          </TouchableOpacity>
          </MyView>

          {testData.map((group) => (
            <View key={group.groupID} style={[{
              width: "100%", minHeight: 100, marginTop: 15, backgroundColor: "#fff",
              flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
              borderRadius: 25, borderWidth: 1, borderColor: "#777",
              paddingBottom: 15,
            },
            {
              shadowColor: "#000", shadowOffset: {width: 0, height: 3},
              shadowRadius: 3, shadowOpacity: 0.4,
            }]}>
              {/* Top Border */}
              <View style={{
                width: "100%", minHeight: 10, backgroundColor: "#CFC5BA",
                flexDirection: "row", justifyContent: "flex-end", alignItems: "center",
                borderTopLeftRadius: 25, borderTopRightRadius: 25,
                paddingVertical: 7,
              }}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => {}} style={{
                  backgroundColor: "#E3DFD9",
                  marginRight: 15,
                  flexDirection: "row", justifyContent: "flex-end", alignItems: "center",
                  borderWidth: 2, borderColor: "#333", borderRadius: 50,
                }}>
                  <Text style={{
                      fontSize: 14,
                      fontWeight: '800',
                      textAlign: "center",
                      maxWidth: 350,
                      paddingVertical: 5,
                      paddingHorizontal: 15,
                      color: "#555",
                    }}>
                    {"DISMISS"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Group Image & Title */}
              <View style={{
                width: "100%", minHeight: 10, backgroundColor: "#abe0",
                flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                borderBottomWidth: 1, borderBottomColor: "#777",
              }}>
                <Image
                    source={helpers.getGroupCoverImage(group.groupColor, group.groupImageNumber)}
                    style={{
                        width: 70, height: 70,
                        marginLeft: 15, marginVertical: 12,
                        borderRadius: 5,
                    }}
                />
                <View style={{
                  flex: 1, flexGrow: 1, height: 70, marginVertical: 12, marginLeft: 15, backgroundColor: "#abe0",
                  flexDirection: "column", justifyContent: "space-evenly", alignItems: "flex-start",
                }}>
                  <Text numberOfLines={1} style={{
                      fontSize: 20,
                      fontWeight: '800',
                      textAlign: "center",
                      maxWidth: 350,
                      paddingVertical: 5,
                      paddingRight: 15,
                      color: "#000",
                    }}>
                    {group.groupName}
                  </Text>
                  <View style={{
                    minHeight: 10, backgroundColor: "#abe0",
                    flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                    borderWidth: 1, borderColor: "#DF3D23", borderRadius: 2,
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '600',
                      textAlign: "center",
                      paddingVertical: 7,
                      paddingHorizontal: 12,
                      color: "#DF3D23",
                    }}>
                      <Text style={{ fontWeight: '800' }}>{"XX+ "}</Text>
                      {"Missed Messages"}
                  </Text>
                  </View>
                </View>
              </View>

              {/* Missed Messages -Topics */}
              {group.topics.map((topic) => (
              <View key={topic.topicID} style={{
                width: "100%", minHeight: 50, backgroundColor: "#CFC5BA00",
                flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
                // borderTopWidth: 1, borderTopColor: "#777",
                borderBottomLeftRadius: 25, borderBottomRightRadius: 25,
                paddingTop: 5, paddingBottom: 10,
              }}>
                
                {/* Topic Name Title */}
                <View style={{
                    minHeight: 10, backgroundColor: "#abe0",
                    flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                    paddingVertical: 3, paddingHorizontal: 15,
                    marginBottom: 3,
                  }}>
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color="black" />
                  <Text style={{
                      fontSize: 14,
                      fontWeight: '800',
                      textAlign: "center",
                      paddingVertical: 0,
                      paddingLeft: 6, paddingRight: 15,
                      color: "#000",
                    }}>
                      {topic.topicName}
                  </Text>
                  <Divider width={1} color={"#777"} style={{
                    flex: 1, flexGrow: 1,
                  }} />
                  <View style={{borderWidth: 1, borderColor: "#777", borderRadius: 50, marginRight: 0,}}>
                    <Text style={{
                        fontSize: 12,
                        fontWeight: '500',
                        textAlign: "center",
                        paddingVertical: 3,
                        paddingHorizontal: 7,
                        color: "#777",
                      }}>
                        {topic.missedMessages.length}
                    </Text>
                  </View>
                </View>
                
                {/* Messages */}
                {topic.missedMessages.map((message, index) => (
                
                (topic.missedMessages.length < 3 || index >= (topic.missedMessages.length - 3)) ? (
                <TouchableOpacity key={index} activeOpacity={0.7} onPress={() => {}}
                style={{
                  maxWidth: "100%", minHeight: 10, backgroundColor: "#F8F8F8",
                  flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                  borderWidth: 1, borderColor: "#777", borderRadius: 3,
                  marginHorizontal: 15, marginTop: -1,
                }}>
                  <Image source={imageSelection(message.senderPFP)}
                    style={{
                        width: 35, height: 35,
                        marginLeft: 10, marginVertical: 7,
                        borderRadius: 4, borderWidth: 0, borderColor: "#333",
                    }}/>
                  <View style={{
                    flex: 1, flexGrow: 1, height: 35, marginLeft: 10, backgroundColor: "#abe0",
                    flexDirection: "column", justifyContent: "space-evenly", alignItems: "flex-start",
                  }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '700',
                        textAlign: "center",
                        maxWidth: 350,
                        paddingVertical: 0,
                        paddingHorizontal: 0,
                        color: "#333",
                      }}>
                      {message.senderFullName}
                    </Text>
                    <Text numberOfLines={1} style={{
                      fontSize: 14,
                      fontWeight: '600',
                      textAlign: "center",
                      paddingRight: 15,
                      paddingLeft: 1,
                      color: "#777",
                    }}>
                      {message.messageText}
                    </Text>
                  </View>
                </TouchableOpacity>
                ) : (null)
                ))}

                {/* See all messages */}
                <MyView hide={topic.missedMessages.length < 3} style={{
                  maxWidth: "100%", minHeight: 10, backgroundColor: "#E5E5E5",
                  flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                  borderWidth: 1, borderColor: "#777", borderRadius: 3,
                  marginHorizontal: 15, marginTop: -1,
                }}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => {}}
                    style={{
                      flex: 1, flexGrow: 1,
                      flexDirection: "row", justifyContent: "center", alignItems: "center",
                    }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '800',
                        textAlign: "center",
                        paddingVertical: 10,
                        paddingHorizontal: 0,
                        color: "#333", marginRight: 10,
                      }}>
                      {"See all Messages"}
                    </Text>
                    <Icon
                        name='arrow-forward'
                        type='ionicon'
                        color='#363732'
                        size={24}
                    />
                  </TouchableOpacity>
                </MyView>

              </View>
              ))}

            </View>
          ))}

        </View>
      </ScrollView>
    </SafeAreaView>

    // <SafeAreaView>
    //   <ScrollView style={styles.container}>
    //     <View
    //       style={{
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //       }}
    //     >
    //       <View
    //         style={{ position: 'relative', width: 350, alignContent: 'center' }}
    //       >
    //         <Text
    //           style={{ color: 'black', fontSize: 23, paddingLeft: 25, paddingTop: 20 }}
    //         >
    //           Welcome back <Text style={{ fontWeight: 'bold' }}>{userDocument.firstName || "friend"},</Text>
    //         </Text>
    //         <Text
    //           style={{ color: 'black', fontSize: 23, paddingLeft: 25, paddingBottom: 0 }}
    //         >
    //           here's what you've missed:
    //         </Text>

    //       </View>

    //       <LineDivider style={{
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         marginLeft: 'auto',
    //         marginRight: 'auto',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         flex: 1,
    //       }} />
    //       {(blockHidden == false) ?
    //         <View style={{ width: '100%', alignItems: 'center' }}>
    //           <TouchableOpacity
    //             activeOpacity={0.75}
    //             style={{
    //               marginTop: 20,
    //               marginLeft: 'auto',
    //               marginRight: 20,
    //             }}
    //             onPress={() => {
    //               setBlockHidden(true)
    //               // missedMsg()
    //             }}
    //           >
    //             <DismissButton />
    //           </TouchableOpacity>

    //           <NewNotificationsBlock />
    //         </View> : <View>
    //           <View style={{
    //             padding: 20, borderWidth: 2, borderStyle: 'solid', borderColor: 'grey', borderRadius: 5, width: 325, justifyContent: 'center',
    //             alignItems: 'center', marginBottom: 20, marginTop: 20, backgroundColor: '#e3e6e8'
    //           }}>

    //             <Icon
    //               name='checkbox-outline'
    //               type='ionicon'
    //               color='black'
    //               size={100}
    //               style={{ paddingBottom: 20 }}
    //             />
    //             <Text
    //               style={{ fontSize: 18 }}
    //             >
    //               You're all up to date!
    //             </Text>
    //             <Text
    //               style={{ fontSize: 18, paddingBottom: 20 }}
    //             >
    //               No new notifications at this time.
    //             </Text>
    //           </View>

    //           <View style={{
    //             justifyContent: 'center',
    //             alignItems: 'center'
    //           }}>
    //             <TouchableOpacity
    //               onPress={() => {
    //                 // missedMsg()
    //                 navigateToAddGroup()
    //               }}
    //               // onPress={navigateToAddGroup}
    //               style={{
    //                 width: 300, height: 60, borderWidth: 2, borderStyle: 'solid', borderColor: 'black', borderRadius: 100, justifyContent: 'center',
    //                 alignItems: 'center', marginBottom: 20, flexDirection: "row", backgroundColor: '#7DBF7F'
    //               }}
    //             >
    //               <Icon
    //                 name='plus'
    //                 type='entypo'
    //                 color='black'
    //               />
    //               <Text
    //                 style={{ fontSize: 18, paddingLeft: 15 }}
    //               >
    //                 Start a new conversation
    //               </Text>
    //               <Text>
    //                 Count is {count}
    //               </Text>
    //             </TouchableOpacity>
    //           </View>
    //         </View>
    //       }
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
  );
};

// alignSelf: 'center',
// flexDirection: "row",
// alignItems: 'center',
// justifyContent: "space-between",

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#EFEAE2',
    height: '100%',
  },

  contentContainer: {
    width: '100%',
    padding: 20,

  },

  welcomeContainer: {
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    marginBottom: 22,

  },

  welcomeBackTopRow: {
    flexDirection: "row",
    marginBottom: 3,
  },

  welcomeBackBottomRow: {

  },

  welcomeBackText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600'
  },

  interactFeaturesContainer: {
    width: '100%',
    flexDirection: "row",
    marginTop: 22,
    marginBottom: 22,
    justifyContent: 'space-between'
  },

  interactiveFeatureButtonDisabled: {
    // flex: 1,
    // flexGrow: 1,
    width: 160,
    borderWidth: 2,
    borderColor: '#9D9D9D',
    borderRadius: 5,
    flexDirection: "row",
    alignItems: 'center',
  },

  interactiveFeatureLeftHalfDisabled: {
    flexDirection: "row",

  },

  interactiveFeatureIconBackgroundDisabled: {
    backgroundColor: '#CFC5BA',
    padding: 5,
    alignItems: 'center',
    flexDirection: "row",
  },

  interactiveFeatureRightHalfDisabled: {
    alignSelf: 'center',
    // flexDirection: "row",
    alignItems: 'center',

  },

  interactiveFeatureTextDisabled: {
    marginLeft: 11,
    fontSize: 11,
    fontWeight: '800',
    color: '#9D9D9D',
  },

  allCaughtUpContainer: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#9D9D9D',
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#DFD7CE',
    justifyContent: 'center',
  },

  allCaughtUpContent: {
    top: -10,
    alignItems: 'center',

  },

  allCaughtUpTextBlock: {
    alignItems: 'center',
    marginTop: 7,
  },

  allCaughtUpTextTop: {
    fontSize: 22,
    fontWeight: '700',
    padding: 3
  },

  allCaughtUpTextBottom: {
    fontSize: 20,
    padding: 3
  },

  callToActionFooterText: {
    margin: 15,
    marginBottom: 20
  },


  buttonSpacing: {
    flexDirection: "row",
    alignSelf: 'center',
  },

  buttonGroups: {
    width: 210,
    height: 48,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },

  buttonGroupsText: {
    color: '#363732',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 5,
  },





  // innerContainer: {
  //   marginLeft: 20,
  //   marginRight: 20,
  //   marginBottom: 30,
  //   backgroundColor: 'white',
  //   shadowColor: 'black',
  //   shadowOffset: { width: 0, height: 10 },
  //   shadowRadius: 5,
  //   shadowOpacity: .2,
  // },
})

export default HomeTab;