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
import NewNotificationsBlock from '../../components/NewNotificationsBlock';
import DismissButton from '../../components/DismissButton';
import MyView from '../../components/MyView';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import { Timestamp } from 'firebase/firestore';

// *************************************************************

// First tab of the application: HOME.
const HomeTab = ({ navigation, route }) => {

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

  // const [groupBlock, setGroupBlock] = useState({})

  const isFocused = useIsFocused();

  const getMissedMessages = async () => {

    console.log('Entered the getMissedMessages')

    // Hey... When the user goes to this page... Get their current uid
    const currentUserUID = auth.currentUser.uid;
    console.log('Currently logged in as:', currentUserUID)

    try {
      console.log('Enter the TRY, and attempt the get userDocument');

      // Now that you know who is logged in, get the user document.
      const userQuery = await db
        .collection('users')
        .doc(currentUserUID)
        .get()
        .catch((error) => console.log(error));

      const userQueryData = userQuery.data();
      console.log(userQueryData)

      // now sort through the data, and only grab the fields that you need
      // get the groups field (ARRAY)
      // DATA for groups field looks like this: [asdfasdfasd, 2fasjfasd0fsf, asl2jjjj22j]
      const userGroupArray = userQueryData.groups;

      // get the topicMap field (MAP)
      const userTopicMap = userQueryData.topicMap;

      // set the array for easy comparison with includes
      let userTopicArray = [];
      for (let topicID in userTopicMap) {
        userTopicArray.push(topicID);
      }

      console.log('*********************')

      userGroupArray.map(async (groupID, index) => {

        const groupQuery = await db
          .collection('groups')
          .doc(groupID)
          .get()

        // okay you have the group document, now save the data, to have the relevant group information for the block
        // Data looks like this: { color: yellow, groupName: Cheese, }
        const groupQueryData = groupQuery.data();

        // now list out all of the topics
        const groupTopicsQuery = await db
          .collection('groups')
          .doc(groupID)
          .collection('topics')
          .get()


        // you have the query of all of the topics
        // sort through all of the topic documents
        // print out the data for each topic (in relation to it's group)
        groupTopicsQuery.docs.map(async (topicObject, index) => {

          // console.log('--------------------')
          // console.log('groupID', groupID)
          // console.log('groupName', groupQueryData.groupName)
          // console.log('topicID', topicObject.id)
          // console.log('topicName', topicObject.data().topicName)
          // console.log('--------------------')
          // console.log(' ')

          if (userTopicArray.includes(topicObject.id) === true) {

            const topicID = topicObject.id;

            // console.log('groupID', groupID)
            // console.log('groupName', groupQueryData.groupName)

            // console.log('PING --- YES', topicID)
            // IN HERE is where you do extra logic, if the user is a part of the topic

            // yes, we have a topic, that the user is a part of
            // now we want to get the chats shit with that specific topic

            // first console the pair value from the topicID key
            // console.log('key -> value pair result:', userTopicMap[topicID]);

            // getting the missed messages according the group + topic
            const chatsQuery = await db
              .collection('chats')
              .doc(topicID)
              .collection('messages')
              .where('timestamp', ">", userTopicMap[topicID])
              .get()
              .catch((error) => console.log(error));

            chatsQuery.docs.map(async (message, index) => {

              const messageData = message.data();

              // just getting the message sender information
              const messageSenderQuery = await db
                .collection('users')
                .doc(messageData.ownerUID)
                .get()

              const messageSenderQueryData = messageSenderQuery.data();


              console.log('groupID:', groupID)
              console.log('groupName:', groupQueryData.groupName)
              console.log('')
              console.log('____')
              console.log('topicID:', topicID)
              console.log('topicName:', topicObject.data().topicName)

              const messageSenderPFP = messageSenderQueryData.pfp;
              console.log(`[sender pfp number]`, messageSenderPFP)

              const messageSenderFullName = `${messageSenderQueryData.firstName} ${messageSenderQueryData.lastName}`
              console.log(`[sender full name]`, messageSenderFullName)

              const messageText = messageData.message;
              console.log(`[the actual message text]`, messageText)

              const messageTimeSent = messageData.timestamp.toDate().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
              console.log(`[time that the message was sent]`, messageTimeSent);
              console.log('____')
              console.log('*********************')

              //TONIGHT:
              // - clean up the comments
              // - have Pedro relay the structure, and logic back to Evan
              // - find example of array of objects building
              // - plan of attack for later

              //LATER:
              // - get with Tu
              // - relay logic to Tu
              // - try to optimize logic
              // - fiddle with isFocused logic, so homeTab doesn't run twice (try to fix, or use better solution than isFocused)
              // - store data into package for front-end component displaying/mapping (array of objects, each object is group)
              // - data to be stored, as array of objects
              // [
              //   {
              //     groupID:
              //     groupName:
              //     groupColor:
              //     groupImageNumber:
              //     groupMissedMessagesCount: (sum of all of the: topicMissedMessagesCount's)
              //     topics: [
              //       {
              //         topicID:
              //         topicName:
              //         topicMissedMessagesCount: missedMessages.length
              //         missedMessages: [
              //           {
              //             senderPFP:
              //             senderFullName:
              //             messageText:
              //             messageTime:
              //           },
              //           {
              //             senderPFP:
              //             senderFullName:
              //             messageText:
              //             messageTime:
              //           },    
              //         ]
              //       }
              //     ]
              //   },
              //   {
              //     groupID:
              //     groupName:
              //     groupColor:
              //     groupImageNumber:
              //     groupMissedMessagesCount: (sum of all of the: topicMissedMessagesCount's)
              //     topics: [
              //       {
              //         topicID:
              //         topicName:
              //         topicMissedMessagesCount: missedMessages.length
              //         missedMessages: [
              //           {
              //             senderPFP:
              //             senderFullName:
              //             messageText:
              //             messageTime:
              //           },   
              //           {
              //             senderPFP:
              //             senderFullName:
              //             messageText:
              //             messageTime:
              //           },   
              //         ]
              //       }
              //     ]
              //   },
              // ]
              
            })

            // const userQueryData = userQuery.data();
            // console.log(userQueryData)
          }

          // console.log('____')

        })

        // console.log('*********************')

      })



      // console.log('print once, what is the flat array of topicIDs', userTopicArray);


      // console.log(userTopicMap);
      // console.log(userTopicMap.map((topicID, index) => {

      // }))
    } catch (error) { console.log(error) };

  }

  useEffect(() => {

    getMissedMessages();
    console.log('RUN THIS');


  }, [isFocused]);


  const [valueChangeAsExample, setValueChangeAsExample] = useState(false);

  useEffect(()=> {
    console.log('----------------------------------------------------------  Button Clicked')

  }, [valueChangeAsExample]);


  // const [groups, setGroups] = useState([{}]);
  // const [topics, setTopics] = useState([]);

  // const groupMissed = async () => {
  //   const thisUser = db.collection('users')
  //     .doc(currentUserUID)
  //     .get();
  //   const groupArray = thisUser.data().groups;

  //   // Get the group, save the group info.
  //   for (let group of groupArray) {
  //     let groupUsers = db
  //       .collection('groups')
  //       .doc(group)
  //       .get()
  //       .data()


  //     const updategroups = [
  //       ...groups,

  //       {
  //         groupId: group,
  //         groupName: groupUsers.groupName,
  //         groupColor: groupUsers.color,
  //         groupImage: groupUsers.coverImageNumber
  //       }
  //     ];

  //     setGroups(updateGroups);

  //     let currentUser = await db.collection('users').doc(auth.currentUser.uid).get()
  //     const topicMap = currentUser.data().topicMap
  //     console.log("topicArray: ", (JSON.stringify(topicMap)));

  //     let topicMapArray = []
  //     for (let key in topicMap) {
  //       topicMapArray.push(key)
  //     }

  //     let topic = db
  //       .collection('groups')
  //       .doc(group)
  //       .collection(topic)
  //       .where(firebase.firestore.FieldPath.documentId(), 'in', topicMapArray)
  //       .get().then()


  //     // if topics of group exists as a key of topicMap
  //     // group == groupID






  //     // Get the messages, save the message info.

  //     db.collection('books')
  //       .where(firebase.firestore.FieldPath.documentId(), '==', 'fK3ddutEpD2qQqRMXNW5').get()



  //   }
  // }



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

          <View style={styles.interactFeaturesContainer}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={()=>setValueChangeAsExample(!valueChangeAsExample)}
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