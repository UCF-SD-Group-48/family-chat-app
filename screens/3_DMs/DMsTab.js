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
} from 'react-native';
import {
  Alert,
  Avatar,
  Button,
  Divider,
  Icon,
  Image,
  Input,
  Tooltip,
} from 'react-native-elements';
import { useIsFocused } from "@react-navigation/native";
import { Ionicons, Entypo, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

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
import MyView from '../../components/MyView';
import { imageSelection } from '../5_Supplementary/GenerateProfileIcon';

import SkeletonContent from 'react-native-skeleton-content';
// *************************************************************

// Third tab of the application: DIRECT MESSAGES.
const DirectMessagesTab = ({ navigation }) => {
  const [chats, setChats] = useState([])
  const [shownPhoneText, setShownPhoneText] = useState('');
  const [searchResults, setSearchResults] = useState('incomplete');
  const [searchedUser, setSearchedUser] = useState({})
  const [searchedUserPhoneNumber, setSearchedUserPhoneNumber] = useState('');

  const [messageSenders, setMessageSenders] = useState({})
  const [messageContents, setMessageContents] = useState({})

  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = db.collection("chats")
      .where('members', 'array-contains', auth.currentUser.uid)
      .onSnapshot((snapshot) =>
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, []);

  const messageSendersHelper = async () => {
    let senders = {};
    let messages = {};
    let currentTime = new Date();
    for (const chat of chats) {
      for (const user of chat.data.members) {
        if (user != auth.currentUser.uid) {
          await db.collection('users').doc(user).get()
            .then((result) => {
              senders[chat.id] = {
                id: result.id,
                data: result.data(),
              }
            });
        }
      }

      await db.collection('chats').doc(chat.id).collection("messages")
        .where("timestamp", "<", currentTime).orderBy('timestamp', 'desc').limit(1).get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            let doc = snapshot.docs[0];
            messages[chat.id] = {
              id: doc.id,
              data: doc.data(),
            }
          }
        });
    }
    setMessageSenders(senders);
    setMessageContents(messages);
  };

  useEffect(() => {
    messageSendersHelper();
  }, [chats, isFocused]);

  const getSenderName = (id) => {
    if (messageSenders != undefined && id != undefined && messageSenders[id.toString()] != undefined) {
      return (messageSenders[id.toString()].data.firstName + " " + messageSenders[id.toString()].data.lastName);
    }
    else return "";
  }

  const getSenderPFP = (id) => {
    if (messageSenders != undefined && id != undefined && messageSenders[id.toString()] != undefined) {
      return (messageSenders[id.toString()].data.pfp);
    }
    else return 0;
  }

  const getMessage = (id) => {
    if (messageContents != undefined && id != undefined && messageContents[id.toString()] != undefined) {
      return (messageContents[id.toString()].data.message);
    }
    else return "";
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Direct Messages (DMs)",
      headerLeft: '',
    });
  }, [navigation]);

  useEffect(() => {
    if (searchedUserPhoneNumber.length === 10) {
      if (searchResults != ('exists' || 'nonexistent')) {
        searchForUser();
      }
    }
  }, [searchedUserPhoneNumber]);

  const searchForUser = async () => {
    const query = await db
      .collection('users')
      .where('phoneNumber', '==', searchedUserPhoneNumber)
      .get();

    if (!query.empty) {
      setSearchResults('exists')
      const snapshot = query.docs[0];
      const data = snapshot.data();
      const searchedUserFullName = `${data.firstName} ${data.lastName}`;
      setSearchedUser({ uid: snapshot.id, name: `${searchedUserFullName}`, pfp: data.pfp, owner: false })
      return;
    } else { setSearchResults('nonexistent') }
  };

  function formatPhoneInput(value) {
    if (!value) {
      if (searchedUserPhoneNumber.length === 1) setSearchedUserPhoneNumber('');
      return value;
    };
    const phoneEntry = value.replace(/[^\d]/g, '');
    setSearchedUserPhoneNumber(phoneEntry);
    const phoneEntryLength = phoneEntry.length;
    if (phoneEntryLength < 4) return phoneEntry;
    if (phoneEntryLength < 7) return `(${phoneEntry.slice(0, 3)}) ${phoneEntry.slice(3)}`;
    return `(${phoneEntry.slice(0, 3)}) ${phoneEntry.slice(3, 6)}-${phoneEntry.slice(6, 10)}`;
  }

  const handlePhoneInput = (textChange) => {
    const phoneInputFormatted = formatPhoneInput(textChange);
    setShownPhoneText(phoneInputFormatted);
    if (searchedUserPhoneNumber.length != 10) {
      setSearchResults('incomplete')
    }
  };

  const createDM = async () => {

    // const currentUserID = auth.currentUser.uid;

    // await db.collection('groups').doc(groupId)
    //   .collection("topics")
    //   .add({
    //     topicOwner: auth.currentUser.uid,
    //     topicName: newTopicName,
    //     members: checked,
    //     originalMessageUID: originalMessageUID || "",
    //   })
    //   .then((newlyCreatedDM) => {
    //     let chatsID = newlyCreatedDM.id

    //     newlyCreatedDM.data().members.map(async (memberUID, index) => {

    //       console.log(index, memberUID)

    //       const addChatsValueToTopicMap = await db
    //         .collection('users')
    //         .doc(memberUID)
    //         .update({
    //           [`topicMap.${chatsID}`]: firebase.firestore.FieldValue.serverTimestamp()
    //         })
    //         .catch((error) => console.log(error));
    //     })

    //     navigation.push("Chat",
    //       {
    //         topicId: newChat.id,
    //         topicName: "DM",
    //         isDM: true,
    //         otherUserFullName: searchedUser.name
    //       }
    //     );
    //   })
    //   .catch((error) => console.log(error));

    setShownPhoneText("");

    //if dm already exists, route to dm
    const snapshot = await db.collection("chats")
      .where('members', 'array-contains', searchedUser.uid).get();
    if (!snapshot.empty) {
      for (const doc of snapshot.docs) {
        if (doc.data().members.some(u => (u == auth.currentUser.uid))) {
          navigation.push("Chat", { topicId: doc.id, topicName: "DM", isDM: true, otherUserFullName: searchedUser.name });
          return;
        }
      }
    }

    // Doesn't exist, CREATE A NEW ONE
    const createNewDMConversation = await db
      .collection('chats')
      .add(
        {
          members: [searchedUser.uid, auth.currentUser.uid],
        }
      )
      .catch((error) => console.log(error));

    // Get the newly created chats document
    const newlyCreatedDM = await db
      .collection("chats")
      .where('members', 'array-contains', searchedUser.uid)
      .get()
      .catch((error) => console.log(error));

    // Enter if a new chat was created
    if (!newlyCreatedDM.empty) {

      // ID of chats (DMs) document
      let chatsID = newlyCreatedDM.docs[0].id

      // Add the DM conversation value to both member's topicMap
      newlyCreatedDM.docs[0].data().members.map(async (memberUID, index) => {
        const addChatsValueToTopicMap = await db
          .collection('users')
          .doc(memberUID)
          .update({
            [`topicMap.${chatsID}`]: firebase.firestore.FieldValue.serverTimestamp()
          })
          .catch((error) => console.log(error));
      })

      navigation.push("Chat",
        {
          topicId: chatsID,
          topicName: "DMs",
          isDM: true,
          otherUserFullName: searchedUser.name
        }
      )
    }
  }


  const [isLoadingDMs, setIsLoadingDMs] = useState(false);

  useEffect(async () => {
    setIsLoadingDMs(false);

    return () => {
      setIsLoadingDMs();
    };
  }, [isFocused]);

  return (
    <SafeAreaView style={{ backgroundColor: "#EFEAE2" }}>
    <StatusBar style='dark' />
      <View style={{
        width: "100%", backgroundColor: "#CFC5BA", // BFBFBF
        borderBottomWidth: 1, borderColor: "#777",
        justifyContent: "center", alignItems: 'center', flexDirection: "column",
      }}>
        <View style={{
          width: 250,
          paddingLeft: 10, paddingRight: 5, paddingVertical: 2, marginVertical: 10,
          borderWidth: 1.5, borderColor: '#9D9D9D', borderRadius: 5,
          backgroundColor: '#F8F8F8',
          justifyContent: 'space-between', alignItems: 'center', flexDirection: "row",
        }}>
          <TextInput
            placeholder='Search for a user.'
            value={shownPhoneText}
            keyboardType={'phone-pad'}
            maxLength={14}
            onChangeText={(textChange) => handlePhoneInput(textChange)}
            style={{
              fontSize: 16,
              textAlign: 'left',
              width: "80%", borderWidth: 0, height: "100%",
            }}
          />
          {(shownPhoneText.length == 0) ? (
            <View style={{
              justifyContent: "center", alignItems: 'center', flexDirection: "row",
              paddingHorizontal: 5, paddingVertical: 5,
              borderWidth: 0, borderColor: '#9D9D9D', borderRadius: 3,
            }}>
              <Ionicons name="search" size={24} color="#363732" />
            </View>
          ) : (
            <TouchableOpacity activeOpacity={0.7} onPress={() => { setShownPhoneText("") }}
              style={{
                justifyContent: "center", alignItems: 'center', flexDirection: "row",
                paddingHorizontal: 5, paddingVertical: 5,
                borderWidth: 0, borderColor: '#9D9D9D', borderRadius: 3,
              }}>
              <Ionicons name="close-circle" size={24} color="#363732" />
            </TouchableOpacity>
          )
          }
        </View>
        <MyView hide={shownPhoneText.length == 0} style={{
          width: "100%",
          paddingHorizontal: 10, paddingVertical: 10, marginVertical: 0,
          // borderWidth: 1, borderColor: '#9D9D9D', borderRadius: 3,
          backgroundColor: '#9D9D9D', //here
          justifyContent: 'center', alignItems: 'center', flexDirection: "row",
        }}>
          <View style={{
            width: "90%", height: 50,
            paddingHorizontal: 15, backgroundColor: "#F8F8F8",
            justifyContent: 'center', alignItems: 'center', flexDirection: "row",
            borderRadius: 5, borderWidth: 1.5, borderColor: "#777",
          }}>
            {(searchResults == 'incomplete') ?

              <Text style={{
                fontSize: 18,
                fontWeight: '500',
                color: 'black',
                textAlign: "center",
              }}>
                {"No results"}
              </Text>
              : ((searchResults == 'exists') ? (
                <View style={{
                  width: "100%", backgroundColor: "#F8F8F800",
                  justifyContent: 'space-between', alignItems: 'center', flexDirection: "row",
                }}>
                  <View style={{
                    backgroundColor: "#F8F8F800",
                    justifyContent: 'center', alignItems: 'center', flexDirection: "row",
                  }}>
                    <Image source={imageSelection(searchedUser.pfp)}
                      style={{
                        width: 30, height: 30,
                        borderRadius: 4, borderWidth: 0, borderColor: "#333",
                      }} />
                    <Text style={{
                      paddingLeft: 12,
                      textAlign: 'left',
                      fontSize: 18,
                      fontWeight: '600',
                      color: "#222",
                    }}>
                      {searchedUser.name}
                    </Text>
                  </View>
                  {(searchedUser.uid == auth.currentUser.uid) ? (
                    <Text style={{
                      paddingRight: 5,
                      textAlign: 'center',
                      fontSize: 15,
                      fontWeight: '700',
                      color: "#1174EC",
                    }}>
                      {"YOU"}
                    </Text>
                  ) : (
                    <TouchableOpacity activeOpacity={0.7} onPress={createDM}
                      style={{
                        backgroundColor: "#F8F8F800", paddingLeft: 12, paddingRight: 7, paddingVertical: 3,
                        justifyContent: 'center', alignItems: 'center', flexDirection: "row",
                        borderRadius: 50, borderWidth: 2, borderColor: "#3D8D04",
                      }}>
                      <Text style={{
                        paddingRight: 5,
                        textAlign: 'left',
                        fontSize: 15,
                        fontWeight: '700',
                        color: "#3D8D04",
                      }}>
                        {"CHAT"}
                      </Text>
                      <Ionicons name="chatbubble-ellipses-outline" size={20} color="#3D8D04" />
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <Text style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: 'black',
                  textAlign: "center",
                }}>
                  Phone number not found
                </Text>
              )
              )
            }
          </View>
        </MyView>
      </View>
      <ScrollView contentContainerStyle={{
        width: "100%", height: "100%",
        backgroundColor: "#EFEAE200",
        paddingVertical: 0, paddingHorizontal: 0, marginTop: 15,
        justifyContent: "flex-start", alignItems: 'center', flexDirection: "column",
      }}>
        <MyView hide={chats.length > 0} style={{
          width: "100%", minHeight: 300, paddingTop: 30,
          justifyContent: "flex-start", alignItems: "center", flexDirection: "column", backgroundColor: "#abc0"
        }}>
          <FontAwesome name="paper-plane" size={50} color="#555" />
          <Text style={{
            fontSize: 20,
            fontWeight: '800',
            textAlign: "center",
            marginTop: 15,
            color: "#555",
          }}>
            {"No DMs found."}
          </Text>
          <Text style={{
            fontSize: 20,
            fontWeight: '400',
            textAlign: "center",
            maxWidth: 350,
            lineHeight: 24,
            marginTop: 15,
            color: "#555",
          }}>
            {" Looks like there aren't any direct messages yet." +
              "\nSearch for a user above to start a conversation."}
          </Text>
          <MaterialCommunityIcons name="dots-horizontal" size={65} color="#999" />
        </MyView>
        {chats.map(({ id, data }) => (
          <TouchableOpacity key={id} activeOpacity={0.7} onPress={() => {
            setIsLoadingDMs(true);
            const otherUserFullName = getSenderName(id)
            setTimeout(() => navigation.push("Chat", { topicId: id, topicName: "DM", isDM: true, otherUserFullName }));
          }}
            style={[{
              width: "95%", height: 70,
              marginLeft: "5%", paddingLeft: 20, paddingRight: 0, marginBottom: 20,
              backgroundColor: "#fff",
              justifyContent: "flex-start", alignItems: 'center', flexDirection: "row",
              borderWidth: 0, borderTopLeftRadius: 5, borderBottomLeftRadius: 5,
            },
            {
              shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
              shadowRadius: 1, shadowOpacity: 0.3,
            }]}>
            <View style={{
              width: "100%", borderWidth: 0,
              justifyContent: "space-between", alignItems: 'center', flexDirection: "row",
            }}>
              <View style={{
                borderWidth: 0,
                justifyContent: "center", alignItems: 'center', flexDirection: "row",
              }}>
                <Image source={imageSelection(getSenderPFP(id))}
                  style={{
                    width: 40, height: 40,
                    borderRadius: 4, borderWidth: 0, borderColor: "#333",
                  }} />
                <View style={{
                  height: 44, marginLeft: 20, borderWidth: 0,
                  justifyContent: "flex-start", alignItems: 'flex-start', flexDirection: "column",
                }}>
                  <Text style={{
                    marginBottom: 3,
                    fontSize: 18,
                    fontWeight: '700',
                    color: 'black',
                    textAlign: "left",
                  }}>
                    {getSenderName(id)}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#777',
                    textAlign: "left",
                  }}>
                    {getMessage(id)}
                  </Text>
                </View>
              </View>
              <View style={{
                width: 50, height: 50, borderWidth: 0,
                justifyContent: "center", alignItems: 'center', flexDirection: "row",
              }}>
                {isLoadingDMs
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
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
  },
})

export default DirectMessagesTab;