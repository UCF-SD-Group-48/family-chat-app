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
  RefreshControl,
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

import { useIsFocused, useScrollToTop, useFocusEffect } from '@react-navigation/native';
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
import { set } from 'react-native-reanimated';

// First tab of the application: HOME.
const HomeTab = ({ navigation, route }) => {

  // const [testData, setTestData] = useState([
  //   {
  //     groupColor: "red",
  //     groupID: "fedcba",
  //     groupImageNumber: 2,
  //     groupName: "The boiis",
  //     topics: [
  //       {
  //         missedMessages: [
  //           {
  //             messageText: "Are you okay?",
  //             messageTime: firebase.firestore.FieldValue.serverTimestamp(),
  //             senderFullName: "Jake Truemann",
  //             senderPFP: 3,
  //           },
  //           {
  //             messageText: "No I'm not :(",
  //             messageTime: firebase.firestore.FieldValue.serverTimestamp(),
  //             senderFullName: "Triabel Canderberry",
  //             senderPFP: 2,
  //           },
  //           {
  //             messageText: "bummer...",
  //             messageTime: firebase.firestore.FieldValue.serverTimestamp(),
  //             senderFullName: "Jake Truemann",
  //             senderPFP: 3,
  //           },
  //           {
  //             messageText: "umm, who is getting displayed??",
  //             messageTime: firebase.firestore.FieldValue.serverTimestamp(),
  //             senderFullName: "Triabel Canderberry",
  //             senderPFP: 2,
  //           },
  //         ],
  //         topicID: "abcdefg",
  //         topicName: "General",
  //       },
  //       {
  //         missedMessages: [
  //           {
  //             messageText: "Let's have an awesome usmmer",
  //             messageTime: firebase.firestore.FieldValue.serverTimestamp(),
  //             senderFullName: "Jake Truemann",
  //             senderPFP: 3,
  //           },
  //           {
  //             messageText: "yayaya",
  //             messageTime: firebase.firestore.FieldValue.serverTimestamp(),
  //             senderFullName: "Jake Truemann",
  //             senderPFP: 3,
  //           },
  //         ],
  //         topicID: "hfhfl",
  //         topicName: "Summer time",
  //       }
  //     ],
  //   },
  //   {
  //     groupColor: "blue",
  //     groupID: "hfhfhfl",
  //     groupImageNumber: 1,
  //     groupName: "The gurls",
  //     topics: [
  //       {
  //         missedMessages: [
  //           {
  //             messageText: "Why not the pink tho??",
  //             messageTime: firebase.firestore.FieldValue.serverTimestamp(),
  //             senderFullName: "Jill Truemann",
  //             senderPFP: 4,
  //           },
  //           {
  //             messageText: "Not here for it",
  //             messageTime: firebase.firestore.FieldValue.serverTimestamp(),
  //             senderFullName: "Trinity Canderberry",
  //             senderPFP: 5,
  //           },
  //           {
  //             messageText: "whatever",
  //             messageTime: firebase.firestore.FieldValue.serverTimestamp(),
  //             senderFullName: "Jill Truemann",
  //             senderPFP: 4,
  //           },
  //         ],
  //         topicID: "hhhh",
  //         topicName: "General",
  //       },
  //     ],
  //   },
  // ]);

  const [groupToData, setGroupToData] = useState([]);
  const [numEvents, setNumEvents] = useState(0);
  const [numPolls, setNumPolls] = useState(0);
  const [groupsWithMissedMessages, setGroupsWithMissedMessages] = useState(0);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsContentLoading(true);
    getAllData()
    .then(() => {
      setRefreshing(false);
      setIsContentLoading(false);
    });
  }, []);


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
  const [uid, setUID] = useState(auth?.currentUser?.uid);


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

  const isFocused = useIsFocused();
  const [userNotificationGroups, setUserNotificationGroups] = useState([])
  const [gArray, setGArray] = useState([])
  const [tArray, setTArray] = useState([])
  const [cArray, setCArray] = useState([])
  const [isContentLoading, setIsContentLoading] = useState(true);

  // useLayoutEffect(() => {
  //   setIsContentLoading(true);
  //   getAllData();

  //   return () => {
  //     setIsContentLoading(false);
  //     setNumEvents();
  //     setNumPolls();
  //     setGroupsWithMissedMessages();
  //     setGroupToData([]);
  //     setIsContentLoading(false);
  //   }
  // }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      setIsContentLoading(true);
      getAllData();

      return () => {
        setIsContentLoading(false);
        setNumEvents();
        setNumPolls();
        setGroupsWithMissedMessages();
        setGroupToData([]);
        setIsContentLoading(false);
      };
    }, [isFocused])
  );

  const getAllData = async () => {

    let groups = [];
    let groupUIDtoData = {};
    let groupUIDToTopics = {};
    let topicUIDtoData = {};
    let memberUIDToData = {};

    try {

      //getting current user's groups
      await db.collection('users').doc(auth?.currentUser?.uid).get()
        .then((result) => {
          groups = [...result.data().groups];
        });

      for (const groupUID of groups) {

        //getting a list of topic ids
        let topics = [];
        const snapshot = await db.collection('groups').doc(groupUID).collection("topics").get();
        for (const topic of snapshot.docs) {
          topics.push(topic.id);
          topicUIDtoData[topic.id] = topic.data();
        }
        //settings the list of topic ids under a key of the group UID
        groupUIDToTopics[groupUID] = [...topics];

        //getting group data per group (and members)
        let members = [];
        await db.collection('groups').doc(groupUID).get()
          .then((result) => {
            const resultData = result.data();
            groupUIDtoData[groupUID] = resultData;
            resultData.members.map((memberUID) =>
              members.push(memberUID)
            );
          });

        for (const member of members) {
          if (!memberUIDToData.hasOwnProperty(member)) {
            await db.collection('users').doc(member).get()
              .then((result) => {
                memberUIDToData[member] = result.data();
              });
          }
        }
      }

      let groupData = [];
      let numActiveEvents = 0;
      let numActivePolls = 0;
      let totalMissedMessages = 0;
      let numGroupsWithMissedMessages = 0;
      for (const groupUID of groups) {

        totalMissedMessages = 0;
        let topics = [];
        let events = [];
        let polls = [];
        for (const topicUID of groupUIDToTopics[groupUID]) {

          //getting all the messages per topic
          let missedMessages = [];
          //does the topic's member list include the current user
          if(topicUIDtoData[topicUID].members.includes(auth.currentUser.uid)) {
            const snapshot = await db.collection('chats').doc(topicUID).collection("messages")
              .where('timestamp', ">", memberUIDToData[auth.currentUser.uid].topicMap[topicUID])
              // .where('ownerUID', "==", !auth.currentUser.uid)
              .orderBy('timestamp', 'asc').get();

            if (snapshot.docs.length > 0) {
              totalMissedMessages += snapshot.docs.length;
              for (const message of snapshot.docs) {
                //TODO only push the last three?
                missedMessages.push({
                  messageText: message.data().message,
                  messageTime: message.data().timestamp,
                  senderFullName: memberUIDToData[message.data().ownerUID].firstName + " " + memberUIDToData[message.data().ownerUID].lastName,
                  senderPFP: memberUIDToData[message.data().ownerUID].pfp,
                });
              }

              //pushing missed messages to topics array
              topics.push({
                missedMessages: missedMessages,
                topicID: topicUID,
                topicName: topicUIDtoData[topicUID].topicName,
              });

            }
          }

          //saving all events
          const snapshot = await db.collection('chats').doc(topicUID).collection("events")
            .where("endTime", ">", new Date()).orderBy('endTime', 'desc').get();
          for (const event of snapshot.docs) {
            events.push({
              id: event.id,
              data: event.data(),
              topicId: topicUID,
              topicName: topicUIDtoData[topicUID].topicName,
              groupOwner: groupUIDtoData[groupUID].groupOwner,
            });
          }

          //saving all events
          const pollSnapshot = await db.collection('chats').doc(topicUID).collection("polls")
            .where("endTime", ">", new Date()).orderBy('endTime', 'desc').get();
          for (const poll of pollSnapshot.docs) {
            polls.push({
              id: poll.id,
              data: poll.data(),
              topicId: topicUID,
              topicName: topicUIDtoData[topicUID].topicName,
              groupOwner: groupUIDtoData[groupUID].groupOwner,
            });
          }
        }

        //updating counters
        if (topics.length > 0) {
          numGroupsWithMissedMessages = numGroupsWithMissedMessages + 1;
        }
        if (events.length > 0) {
          numActiveEvents = numActiveEvents + 1;
        }
        if (polls.length > 0) {
          numActivePolls = numActivePolls + 1;
        }

        //pushing to final object groupData
        if (topics.length > 0 || events.length > 0 || polls.length > 0) {
          groupData.push({
            activeEvents: [...events],
            activePolls: [...polls],
            groupID: groupUID,
            topics: [...topics],
            totalMissedMessages: totalMissedMessages,
            groupName: groupUIDtoData[groupUID].groupName,
            groupColor: groupUIDtoData[groupUID].color,
            groupImageNumber: groupUIDtoData[groupUID].coverImageNumber,
            groupOwner: groupUIDtoData[groupUID].groupOwner,

          });
        }
      }

      //saving to state groupToData
      setNumEvents(numActiveEvents);
      setNumPolls(numActivePolls);
      setGroupsWithMissedMessages(numGroupsWithMissedMessages);
      setGroupToData(groupData);
      setIsContentLoading(false);

    } catch (error) { console.log(error) };

  }

  const dismissButtonPressed = async (group) => {
    for (const topic of group.topics) {
      const topicMapString = "topicMap." + topic.topicID;
      await db.collection("users").doc(auth.currentUser.uid).update({
        [topicMapString]: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }


    let result = groupToData.filter(function (item) {
      return item !== group
    });
    result.push({
      activeEvents: group.activeEvents,
      groupID: group.groupID,
      topics: [],
      totalMissedMessages: group.totalMissedMessages,
      groupName: group.groupName,
      groupColor: group.groupColor,
      groupImageNumber: group.groupImageNumber,
      groupOwner: group.groupOwner,

    })
    setGroupToData(result);
    setGroupsWithMissedMessages(groupsWithMissedMessages - 1);
  };

  const goToChatScreen = async (group, topic) => {
    // Navigating on a message or on "See all messages"
    try {
      db.collection("users").doc(auth.currentUser.uid).get()
				.then((userDoc) => {
					const lastReadTime = userDoc.data().topicMap[topic.topicID]; //getting lastReadTime

					const topicMapString = "topicMap."+topic.topicID; //overwriting lastReadTime
					db.collection("users").doc(auth.currentUser.uid).update({
						[topicMapString]: firebase.firestore.FieldValue.serverTimestamp(),
					});

					//passing lastReadTime
          navigation.push('TabStack', {
              screen: 'Groups', params: {
                screen: 'Chat', params: {
                  topicId: topic.topicID,
                  topicName: topic.topicName,
                  groupId: group.groupID,
                  groupName: group.groupName,
                  groupOwner: group.groupOwner,
                  color: group.groupColor,
                  coverImageNumber: group.groupImageNumber,
                  lastReadTime: lastReadTime,
                },
                initial: false,
              }
          });

				})
    } catch (error) { console.log(error) }

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
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
          />

          {isContentLoading
            ?
            <View>
              <View style={{
                flexDirection: "row", width: '100%', justifyContent: 'space-between'
              }}>
                <SkeletonContent
                  containerStyle={{
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 1,
                    shadowOpacity: .25,
                    marginTop: 22,
                    marginBottom: 22,
                    justifyContent: 'space-between'
                  }}
                  animationDirection="horizontalRight"
                  layout={[{
                    width: 160,
                    height: 38,
                    alignItems: 'center',
                    backgroundColor: '#CFC5BA'
                  },]}
                  boneColor={'#DFD7CE'}
                  highlightColor={'#EFEAE2'}
                />

                <SkeletonContent
                  containerStyle={{
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 1,
                    shadowOpacity: .25,
                    marginTop: 22,
                    marginBottom: 22,
                    justifyContent: 'space-between'
                  }}
                  animationDirection="horizontalRight"
                  layout={[{
                    width: 160,
                    height: 38,
                    alignItems: 'center',
                    backgroundColor: '#CFC5BA'
                  },]}
                  boneColor={'#DFD7CE'}
                  highlightColor={'#EFEAE2'}
                />
              </View>

              <SkeletonContent
                containerStyle={{
                  shadowColor: 'black',
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 1,
                  shadowOpacity: .25,
                  marginTop: 17,
                  justifyContent: 'space-between'
                }}
                animationDirection="horizontalRight"
                layout={[{
                  // width: 160,
                  height: 40,
                  alignItems: 'center',

                  width: '100%',
                  height: 200,
                  height: 200,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#CFC5BA'
                },]}
                boneColor={'#DFD7CE'}
                highlightColor={'#EFEAE2'}
              />

              <View style={styles.callToActionFooterText}>
                <Text style={{
                  marginTop: 2,
                  width: 325,
                  alignSelf: 'center',
                  textAlign: 'center',
                  color: '#9D9D9D',
                  fontWeight: '700',
                  fontSize: 14,
                  // fontStyle: 'italic',
                }}
                >
                  One moment while we load your messages...
                </Text>
              </View>
            </View>

            : <View style={styles.interactFeaturesContainer}>
              {(numEvents <= 0)
                ? <View
                // hide={numEvents > 0}
                >
                    <View style={[styles.interactiveFeatureButtonDisabled, { marginRight: 7 }]}>
                      <View style={[styles.interactiveFeatureLeftHalfDisabled, { height: 40, }]}>
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
                </View>
                : <View
                // hide={numEvents <= 0}
                >
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => {
                      navigation.push("ActiveEvents", { groupToData, numEvents });
                    }}
                  >
                    <View style={{
                      minWidth: 100, backgroundColor: "#fff",
                      borderWidth: 2, borderColor: '#333', borderRadius: 5,
                      justifyContent: "flex-start", alignItems: 'center', flexDirection: "row",
                    }}>
                      <View style={{ flexDirection: "row", height: 40, }}>
                        <View style={{
                          backgroundColor: '#F8D353', paddingHorizontal: 10, paddingVertical: 5,
                          borderTopLeftRadius: 5, borderBottomLeftRadius: 5,
                          justifyContent: "flex-start", alignItems: 'center', flexDirection: "row",
                        }}>
                          <Icon
                            name='calendar'
                            type='entypo'
                            color='#000'
                            size={20}
                          />
                        </View>
                      </View>
                      <Text style={{
                        fontSize: 12,
                        fontWeight: '800',
                        textAlign: "left",
                        marginLeft: 10,
                        color: "#333",
                      }}>
                        Active Events
                      </Text>
                      <Entypo name="chevron-right" size={20} color="#333" style={{
                        paddingHorizontal: 7,
                      }} />
                    </View>
                  </TouchableOpacity>
                </View>
              }

              {/* Polls */}
              {(numPolls <= 0) ? (
                  <View style={[styles.interactiveFeatureButtonDisabled, { marginLeft: 7 }]}>
                    <View style={[styles.interactiveFeatureLeftHalfDisabled, { height: 40, }]}>
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
              ) : (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => {
                    navigation.push("ActivePolls", { groupToData, numPolls });
                  }}
                >
                  <View style={{
                    minWidth: 100, backgroundColor: "#fff",
                    borderWidth: 1, borderColor: '#333', borderRadius: 5,
                    justifyContent: "flex-start", alignItems: 'center', flexDirection: "row",
                  }}>
                    <View style={{ flexDirection: "row", height: 40, }}>
                      <View style={{
                        backgroundColor: '#ED984F', paddingHorizontal: 10, paddingVertical: 5,
                        borderTopLeftRadius: 5, borderBottomLeftRadius: 5,
                        justifyContent: "flex-start", alignItems: 'center', flexDirection: "row",
                      }}>
                        <Entypo name="bar-graph" size={20} color="#000" />
                      </View>
                    </View>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '800',
                      textAlign: "left",
                      marginLeft: 10,
                      color: "#333",
                    }}>
                      Open Polls
                    </Text>
                    <Entypo name="chevron-right" size={20} color="#333" style={{
                      paddingHorizontal: 7,
                    }} />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          }
          {((groupToData.length > 0) && (groupsWithMissedMessages > 0) && !isContentLoading)
            ? <View>
              {groupToData.map((group, index) => (
                <MyView hide={group.topics.length <= 0} key={group.groupID} style={[{
                  width: "100%", minHeight: 100, marginTop: 15, backgroundColor: "#fff",
                  flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
                  borderRadius: 25, borderWidth: 1, borderColor: "#777",
                  paddingBottom: 15, marginBottom: 25,
                },
                {
                  shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
                  shadowRadius: 3, shadowOpacity: 0.4,
                }]}>
                <View>
                  {/* Top Border */}
                  <View style={{
                    width: "100%", minHeight: 10, backgroundColor: "#CFC5BA",
                    flexDirection: "row", justifyContent: "flex-end", alignItems: "center",
                    borderTopLeftRadius: 25, borderTopRightRadius: 25,
                    paddingVertical: 7,
                  }}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { dismissButtonPressed(group) }} style={{
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
                          <Text style={{ fontWeight: '800' }}>{group.totalMissedMessages}</Text>
                          {" Missed Messages"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Missed Messages -Topics */}
                  {group.topics.map((topic, index) => (
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
                        <View style={{ borderWidth: 1, borderColor: "#777", borderRadius: 50, marginRight: 0, }}>
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
                          <TouchableOpacity key={index} activeOpacity={0.7} onPress={() => {
                            goToChatScreen(group, topic)
                          }}
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
                              }} />
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
                        ) : (<View key={index} style={{ widht: 0, height: 0, }}></View>)
                      ))}

                      {/* See all messages */}
                      <MyView hide={topic.missedMessages.length < 3} style={{
                        maxWidth: "100%", minHeight: 10, backgroundColor: "#E5E5E5",
                        flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                        borderWidth: 1, borderColor: "#777", borderRadius: 3,
                        marginHorizontal: 15, marginTop: -1,
                      }}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => {
                          goToChatScreen(group, topic)
                        }}
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
                </MyView>
              ))}
            </View>
            : <View>
              {(isContentLoading === false)
                ? <View
                  // hide={groupToData.length > 0 && groupsWithMissedMessages > 0}
                  style={{ marginTop: 15, }}
                >
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

                  {/* <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => {
                      navigation.navigate('TabStack', { screen: 'GroupsTab' });
                    }
                    }
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
                  </TouchableOpacity> */}
                </View>
                : <View style={{ width: 0, height: 0, }} />
              }
            </View>
          }

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
    marginBottom: 15
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