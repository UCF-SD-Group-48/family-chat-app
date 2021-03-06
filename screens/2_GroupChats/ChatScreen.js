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
    Linking,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    FlatList,
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
    Divider,
    Icon,
    Image,
    Input,
    Tooltip,
    Overlay,
} from 'react-native-elements';
import { useIsFocused } from "@react-navigation/native";
import { HoldItem } from 'react-native-hold-menu';

import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AntDesign, Feather, Entypo, Ionicons, FontAwesome5, Fontisto, MaterialIcons } from "@expo/vector-icons";

// Imports for: Firebase
import {
    apps,
    auth,
    db,
    firebaseConfig,
    storage,
} from '../../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import firebase from 'firebase/compat/app';
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";

// Imports for: Components
import MyView from '../../components/MyView';
import LineDivider from '../../components/LineDivider';
import { imageSelection } from '../5_Supplementary/GenerateProfileIcon';
import helpers from '../../helperFunctions/helpers';
import CreateChatObj from '../../helperFunctions/CreateChatObj';

import SkeletonContent from 'react-native-skeleton-content';
import uuid from 'react-native-uuid';

// *************************************************************

// Imports for: Expo
// import { Expo } from 'expo-server-sdk';
import { getFunctions, httpsCallable } from "firebase/functions";
// import { firebase } from '@react-native-firebase/functions';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const overlayOffset = -screenHeight + 350 + Constants.statusBarHeight * 2 + 44 * 2 + 55 * 2 - 2;

// Show the information (messages, users, etc.) for the group chat.
const ChatScreen = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;
    const color = route.params.color;
    const coverImageNumber = route.params.coverImageNumber;
    const isDM = route.params.isDM;
    const otherUserFullName = route.params.otherUserFullName;
    const lastReadTime = route.params.lastReadTime;
    const [lastReadTimeState, setLastReadTimeState] = useState(lastReadTime);
    const [generalId, setgeneralId] = useState('');

    const [inputHeight, setInputHeight] = useState(-1);
    const [initialInputHeight, setInitialInputHeight] = useState(0);
    const insets = useSafeAreaInsets();

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([])
    const [topicSelectionEnabled, setTopicSelection] = useState(true);
    const [topics, setTopics] = useState([]);
    const [members, setMembers] = useState({})
    const [memberUIDs, setMemberUIDs] = useState({})
    const [messageImages, setMessageImages] = useState({})
    const [imageFinishedUploading, setImageFinishedUploading] = useState(true)
    const [overlayIsVisible, setOverlay] = useState(false);
    const [alertExists, setAlertExists] = useState(false);
    const [alert, setAlert] = useState({
        data: {
            description: "",
            ownerPhoneNumber: "",
            ownerUID: "",
            referenceUID: "",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            type: "",
            viewedBy: [],
        },
        id: "",
    });
    const [alertEvent, setAlertEvent] = useState({
        data: {
            ownerPhoneNumber: "",
            ownerUID: "",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            startTime: firebase.firestore.Timestamp.fromDate(new Date()),
            endTime: firebase.firestore.Timestamp.fromDate(new Date()),
            description: "",
            location: "",
            title: "",
        },
        id: "",
    });
    const [alertPoll, setAlertPoll] = useState({
        data: {
            ownerPhoneNumber: "",
            ownerUID: "",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            endTime: firebase.firestore.Timestamp.fromDate(new Date()),
            question: "",
            winningOption: "",
            memberVotes: {},
            votingOptions: {},
        },
        id: "",
    });
    const [pinMap, setPinMap] = useState({});
    const [topicMap, setTopicMap] = useState({});

    const isFocused = useIsFocused();
    const flatList = useRef();
    const [isRefreshingMessages, setIsRefreshingMessages] = useState(false);

    const [selectingImage, setSelectingImage] = useState(false);
    const [imageData, setImageData] = useState(null);

    const [colorBlack, setColorBlack] = useState("#000");

    const toggleOverlay = () => {
        setOverlay(!overlayIsVisible);
        setCopiedText(false)
    };

    const deleteDMsConversation = async () => {
        try {
            const DMQuery = await db
                .collection('chats')
                .doc(topicId)
                .collection('messages')
                .get()

            DMQuery.docs.map(async (messageDocument, index) => {

                const messagesDeleteQuery = await db
                    .collection('chats')
                    .doc(topicId)
                    .collection('messages')
                    .doc(messageDocument.id)
                    .delete()
            })

            const chatDocumentDeleteQuery = await db
                .collection('chats')
                .doc(topicId)
                .delete()

            navigation.navigate('DMsTab');

        } catch (error) { console.log(error) };
    }

    const IconOption = ({ iconName, text, value, isLast, isSpacer, isDestructive, hide, selectFunction }) => (
        (!hide) ? (
            <MenuOption value={value} onSelect={selectFunction}
                style={{
                    borderBottomWidth: (isSpacer) ? 7 : ((!isLast) ? 1.5 : 0),
                    borderColor: "#dedede",
                    height: (isSpacer) ? 47 : 40,
                    paddingLeft: 15, paddingVertical: 10,
                }}>
                <Text style={{ fontSize: 14, color: (isDestructive) ? "red" : "black" }}>
                    <FeatherIcon name={iconName} color={(isDestructive) ? "red" : "black"} size={15} />
                    {"   " + text}
                </Text>
            </MenuOption>
        ) : (<View />)
    );
    const triggerStyles = {
        triggerTouchable: { underlayColor: "#0000" },
    }


    //if groupName has "%20", change it to space char
    useLayoutEffect(() => {
        if(RegExp("%20").test(groupName) && isDM != true) {
            let newGroupName = groupName.replace("%20", " ");
            navigation.setParams({
                groupName: newGroupName,
            })
            navigation.setOptions({
                title: newGroupName,
            })
        }
        return () => {}
    }, []);


    const pinMapFunction = async () => {
        let pins = {};
        const snapshot = await db.collection('chats').doc(topicId).collection('pins').get();
        if (!snapshot.empty) {
            snapshot.forEach(doc => {
                pins[`${doc.data().originalMessageUID}`] = {
                    id: doc.id,
                    data: doc.data(),
                };
            })
        }
        setPinMap(pins);
    }

    //isFocused -only updates on false, can also do if true if need be later
    useEffect(() => {
        if(isFocused == false) {
            onLeave();
        }
        return () => {}
    }, [isFocused]);

    const onLeave = async () => {
        const topicMapString = "topicMap." + topicId;

        await db.collection("users").doc(auth.currentUser.uid).update({
            [topicMapString]: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }

    useEffect(() => {

        pinMapFunction();
        return () => {
            // setPinMap();
        }
    }, [messages, isFocused]);

    const populateMembers = async () => {

        //get all members -store in array
        let memberList = [];
        if(isDM) {
            const chat = await db.collection('chats').doc(topicId).get();
            memberList = chat.data().members;
        }
        else {
            const topic = await db.collection('groups').doc(groupId).collection("topics").doc(topicId).get();
            memberList = topic.data().members;
        }

        //get all member's data -store in map
        let membersMap = {};
        for (const uid of memberList) {
            await db.collection('users').doc(uid).get()
            .then((result) => {

                membersMap[uid] = result.data();

            });
        }

        //setMembers to created map
        setMembers(membersMap);
        setMemberUIDs(memberList);
    }
    useEffect(() => {
        populateMembers();
        return () => {setMembers({}); setMemberUIDs({})}
    }, [topicId]);
    
    useEffect(() => {
        reloadImages();
        return () => {
            // setMessageImages({})
        }
    }, [messages]);

    const reloadImages = async () => {
        let imageMessages = [];
        messages.map((message) => {
            (message.data.imageUID != undefined)
                ? (imageMessages.push(message.data.imageUID))
                : ({})
        });

        for (const uid of imageMessages) {
            //download image
            const imagePathUrl = topicId+"/"+uid+".jpg";
            try {
                const imageRef = ref(storage, imagePathUrl);
                if(imageRef) {
                    getDownloadURL(imageRef)
                    .then((url) => {
                        const messageImagesTemp = messageImages;
                        messageImagesTemp[uid] = url;
                        setMessageImages(messageImagesTemp);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                }
            }
            catch(error){
                console.log(error);
            }
        }
    }
    useEffect(() => {
        if(imageFinishedUploading == true) {
            reloadImages();
        }
        return () => {setMessageImages({})}
    }, [imageFinishedUploading]);

    setImageFinishedUploading

    useEffect(() => {
        setOverlay(false);
        return () => {setOverlay(false)}
    }, [route]);

    useEffect(() => {
        //{topics.map(({ id, data: { topicName } }) => (
        topics.forEach(({ id, data: { topicName } }) => {
            if (topicName == "General") {
                setgeneralId(id);
            }
        });

        resetTopicMap();

        return () => {setTopicMap({})}
    }, [topics, isFocused]);

    const resetTopicMap = () => {
        let values = {};
        for (const topic of topics) {
            if (topic.data.originalMessageUID != undefined) {
                values[topic.data.originalMessageUID] = {
                    id: topic.id,
                    data: topic.data,
                }
            }
        }
        setTopicMap(values);
    }

    useEffect(() => {
        const unsubscribe = db
            .collection("groups")
            .doc(groupId)
            .collection("topics")
            .where('members', 'array-contains', auth.currentUser.uid)
            .onSnapshot((snapshot) =>
                setTopics(snapshot.docs.map((doc) =>
                ({
                    id: doc.id,
                    data: doc.data(),
                })))
            );

        return unsubscribe;
    }, []);

    const goBackward = async () => {

        // const topicMapString = "topicMap." + topicId;

        // await db.collection("users").doc(auth.currentUser.uid).update({
        //     [topicMapString]: firebase.firestore.FieldValue.serverTimestamp(),
        // });

        navigation.navigate('GroupsTab')
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: groupName || `DMs: ${otherUserFullName}`,
            headerStyle: '',
            headerTitleStyle: { color: 'black' },
            headerTitleContainerStyle: { alignItems: 'center', width: 250 },
            headerTintColor: 'black',
            headerLeft: () => (
                <View style={{ marginLeft: 12 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => { (isDM) ? (navigation.goBack()) : goBackward() }}>
                        <Icon
                            name='arrow-back'
                            type='ionicon'
                            color='#363732'
                            size={28}
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                (isDM)
                    ? (
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
                                        onSelect={() => deleteDMsConversation()}
                                        style={{ marginBottom: 10, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon
                                            name='trash'
                                            type='feather'
                                            color='red'
                                            size={16}
                                            style={{ marginLeft: 10, }}
                                        />
                                        <Text style={{ fontSize: 14, color: 'red', marginLeft: 11 }}>
                                            Delete Messages
                                        </Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>
                    )
                    : (
                        <View
                            style={{
                                flexDirection: "row",
                                marginRight: 12,
                            }}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={toggleOverlay}
                            >
                                <Entypo name="dots-three-horizontal" size={30} color="black" />
                            </TouchableOpacity>
                        </View>
                    )
            ),
        });

    }, [navigation, messages]);

    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats').doc(topicId).collection('banners')
            .orderBy('timestamp', 'desc').limit(1)
            .onSnapshot((snapshot) => {

                if (!snapshot.empty) {
                    let doc = snapshot.docs[0];
                    let data = doc.data();
                    let viewedBy = `${data.viewedBy}`;
                    if (!viewedBy.includes(auth.currentUser.uid)) {
                        setAlert({
                            id: doc.id,
                            data: doc.data(),
                        });
                        setAlertExists(true);

                        // get the event the alert is referencing to if event
                        if (`${data.type}` == "Event") {
                            db.collection('chats').doc(topicId).collection('events').doc(`${data.referenceUID}`).get()
                                .then((result) => {
                                    setAlertEvent({
                                        id: result.id,
                                        data: result.data(),
                                    });
                                });
                        }
                        else if (`${data.type}` == "Poll") {
                            db.collection('chats').doc(topicId).collection('polls').doc(`${data.referenceUID}`).get()
                                .then((result) => {
                                    setAlertPoll({
                                        id: result.id,
                                        data: result.data(),
                                    });
                                });
                        }
                    }
                }
                else {
                    setAlert({
                        data: {
                            description: "",
                            ownerPhoneNumber: "",
                            ownerUID: "",
                            referenceUID: "",
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            type: "",
                            viewedBy: [],
                        },
                        id: "",
                    })
                }

            });
        return unsubscribe;
    }, [route]);

    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(topicId)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(25)
            .onSnapshot((snapshot) =>
                setMessages(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                ));
        return unsubscribe;
    }, [route, topicId]);


    const sendMessage = () => {
        Keyboard.dismiss();

        // let chatPayload = CreateChatObj( trimmedInput, auth.currentUser.uid, auth.currentUser.phoneNumber)
        const trimmedInput = input.trim();
        // if (trimmedInput.length > 0) {
        //     db.collection('chats').doc(topicId).collection('messages').add(chatPayload); // id passed in when we entered the chatroom
        // }

        if (trimmedInput.length > 0) {
            db.collection('chats').doc(topicId).collection('messages').add({
                editedTime: null,
                membersWhoReacted: [],
                message: trimmedInput,
                ownerUID: auth.currentUser.uid,
                phoneNumber: auth.currentUser.phoneNumber,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(), // adapts to server's timestamp and adapts to regions
            }); // id passed in when we entered the chatroom

            // Make the messages
            let messages = [];
            let users = [];
            for (let uid of memberUIDs) {
                console.log("uid = "+uid);
                if(uid != auth.currentUser.uid
                    && members[uid] != undefined && members[uid].expoPushToken != undefined && members[uid].expoPushToken != "") {
                    
                    messages.push({
                        to: members[uid].expoPushToken,
                        sound: "default",
                        title: members[auth.currentUser.uid].firstName+" "+members[auth.currentUser.uid].lastName+" sent a message in \""+topicName+"\"",
                        body: trimmedInput,
                        data: (isDM)
                            ? ({ url: "familychat://"+"dms" })
                            : ({ url: "familychat://"+"chat/"
                                +topicId+"/"+topicName
                                +"/"+groupId+"/"+groupName+"/"
                                +groupOwner+"/"+color+"/"+coverImageNumber+"/"
                                +members[uid].topicMap[topicId].seconds }),
                    })

                    users.push({
                        [members[uid].expoPushToken]: uid,
                    })
                }
            }
            // console.log("(within CS.js) messages = "+JSON.stringify(messages));
            // console.log("(within CS.js) users = "+JSON.stringify(users));

            //sending the messages through the cloud function
            // https://us-central1-family-chat-app-48.cloudfunctions.net/sendPushNotification
            const requestUrl = "https://us-central1-family-chat-app-48.cloudfunctions.net/sendPushNotification?messages="
                +JSON.stringify(messages)+"&users="+JSON.stringify(users)

            // calling cloud function
            fetch(requestUrl, {
                method: 'POST',
            })
            .then((response) => {
                console.log("Success, response = "+JSON.stringify(response));
            })
            .catch((error) => {
                console.log("error");
                console.error(error);
            });
        }

        if(lastReadTimeState != null && lastReadTimeState != undefined) {
            setLastReadTimeState(undefined);
        }

        setInput(''); // clears messaging box
    };

    const refreshMessages = async () => {
        
        setIsRefreshingMessages(true);

        const lastMessageTime = messages[messages.length-1].data.timestamp;
        let newMessageArray = [];
        try{
            const newMessages = await db.collection('chats').doc(topicId).collection('messages')
            .where('timestamp', '<', lastMessageTime).orderBy('timestamp', 'desc').limit(25).get();
            newMessages.docs.map((doc) => {
                newMessageArray.push({
                    id: doc.id,
                    data: doc.data(),
                })
            });
        }
        catch(error) {
            console.log(error);
        }

        setMessages([...messages, ...newMessageArray]);
        setIsRefreshingMessages(false);
    }

    const toggleTopicSelection = () => {
        setTopicSelection(!topicSelectionEnabled);
    };

    const rerender = () => {
        // console.log("here");
        if(colorBlack == "#000") {
            setColorBlack("#111");
        }
        else {
            setColorBlack("#000");
        }
    }

    useLayoutEffect(() => {
        setTimeout(() => {
            rerender();
          }, 1750)
        return () => {setColorBlack("#000")};
    }, [route, messages]);

    //TODO push or not push (currently not push and refresh params)
    const enterTopic = async (id, name) => {

        onLeave();

        let userDoc = await db.collection("users").doc(auth.currentUser.uid).get();
        if(!userDoc.empty) {
            const lastReadTime = userDoc.data().topicMap[id]; //getting lastReadTime

            const topicMapString = "topicMap."+id; //overwriting lastReadTime
            await db.collection("users").doc(auth.currentUser.uid).update({
                [topicMapString]: firebase.firestore.FieldValue.serverTimestamp(),
            });

            //passing lastReadTime
            // navigation.navigate("Chat", { topicId: id, topicName: name, groupId, groupName, groupOwner, color, coverImageNumber, lastReadTime });
            setMessages([]);
            navigation.setParams({
                topicId: id,
                topicName: name,
                lastReadTime: lastReadTime,
            });
            setLastReadTimeState(lastReadTime);
        }
        
        toggleTopicSelection();
    };

    const enterTopicFromMessage = async (id) => {
        
        onLeave();

        const topic = getTopicData(id);
        if (topic != null) {
            let userDoc = await db.collection("users").doc(auth.currentUser.uid).get();
            if(!userDoc.empty) {
                const lastReadTime = userDoc.data().topicMap[topic.id]; //getting lastReadTime

                const topicMapString = "topicMap."+topic.id; //overwriting lastReadTime
                db.collection("users").doc(auth.currentUser.uid).update({
                    [topicMapString]: firebase.firestore.FieldValue.serverTimestamp(),
                });

                //passing lastReadTime
                //navigation.navigate("Chat", { topicId: topic.id, topicName: topic.data.topicName, groupId, groupName, groupOwner, color, coverImageNumber, lastReadTime });
                setMessages([]);
                navigation.setParams({
                    topicId: topic.id,
                    topicName: topic.data.topicName,
                    lastReadTime: lastReadTime,
                });
                setLastReadTimeState(lastReadTime);
            }
        }
    };

    const navigateTo = (place) => {
        if (place == "Settings" || place == "Members" || place == "Invite") {
            if (topicName == "General") {
                navigation.push("Group" + place, { topicId, topicName, groupId, groupName, groupOwner, color, coverImageNumber });
            }
            else {
                navigation.push("Topic" + place, { topicId, topicName, groupId, groupName, groupOwner, color, coverImageNumber });
            }
        }
        else {
            navigation.push(place, { topicId, topicName, groupId, groupName, groupOwner, color, coverImageNumber, pinMap });
        }
        setOverlay(false);
        setCopiedText(false)
    };

    const viewBanner = (bannerId, bannerData) => {
        if (bannerData.type == "Banner") {
            // console.log("Banner");
            navigation.push("ViewBanner", { topicId, topicName, groupId, groupName, groupOwner, color, coverImageNumber, bannerId, bannerData });
        }
        else if (bannerData.type == "Event") {
            // console.log("Event");
            navigation.push("ViewEvent", { topicId, topicName, groupId, groupName, groupOwner, color, coverImageNumber, eventId: alertEvent.id, eventData: alertEvent.data });
        }
        else if (bannerData.type == "Poll") {
            // console.log("Poll");
            navigateTo("Polls");
        }
    };

    const dismissBanner = () => {
        db.collection('chats').doc(topicId).collection('banners').doc(alert.id).update({
            viewedBy: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid),
        })
            .then(() => {
                setAlertExists(false);
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    };

    const getString = (uid) => {
        if (members != undefined && uid != undefined && members[uid.toString()] != undefined) {
            return (members[uid.toString()].firstName + " " + members[uid.toString()].lastName);
        }
        else return "";
    }
    const getPfp = (uid) => {
        if (members != undefined && uid != undefined && members[uid.toString()] != undefined) {
            return (members[uid.toString()].pfp);
        }
        else return "";
    }

    const addPinFromMessage = (message, messageId) => {
        navigation.push("AddPin", { topicId, topicName, groupId, groupName, message, messageId });
    }

    const viewPin = (id, data) => {
        const pin = getPinData(id);
        if (pin != null) {
            navigation.push("ViewPin", { topicId, topicName, groupId, groupName, pinId: pin.id, pinData: pin.data, message: data });
        }
    };

    const getPinData = (uid) => {
        //pinMap != undefined && pinMap[id.toString()] != undefined
        if (pinMap != undefined && uid != undefined && pinMap[uid.toString()] != undefined) {
            return (pinMap[uid.toString()]);
        }
        else return null;
    };

    const getTopicData = (uid) => {
        if (topicMap != undefined && uid != undefined && topicMap[uid.toString()] != undefined) {
            return (topicMap[uid.toString()]);
        }
        else return null;
    };

    const deleteMessage = (id, data) => {
        //delete pin(if applicable), then message
        const pinData = getPinData(id);
        if (pinData != null) { //then delete pin before deleting message
            db.collection("chats").doc(topicId).collection("pins").doc(pinData.id).delete();
        }

        //delete image here
        if(data.imageUID != undefined && data.imageUID != "") {
            const topicFolder = topicId+"/"+data.imageUID+".jpg";
            const imageRef = ref(storage, topicFolder);
            deleteObject(imageRef).then(() => {
                console.log("File deleted successfully");
            }).catch((error) => {
                console.log("Uh-oh, an error occurred!");
            });
        }

        db.collection("chats").doc(topicId).collection("messages").doc(id).delete();
    };

    const likeMessage = (id, membersWhoReacted) => {
        if ((membersWhoReacted.some(u => (u == auth.currentUser.uid)))) {
            removeUserLike(id);
        }
        else {
            addUserLike(id);
        }
    };
    const addUserLike = async (id) => {
        db.collection('chats').doc(topicId).collection('messages').doc(id).update({
            membersWhoReacted: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid),
        });
    };
    const removeUserLike = async (id) => {
        db.collection('chats').doc(topicId).collection('messages').doc(id).update({
            membersWhoReacted: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.uid),
        });
    };

    const openTextMessage = () => {
        const phoneNumberText = ` , `
        const textMessageText = `Hey, have you ever head of the FamilyChat app? Join in on the conversation by clicking this download link: https://www.familychat.app/`
        Linking.openURL(`sms://${phoneNumberText}&body=${textMessageText}`)
    }

    const [copiedText, setCopiedText] = useState(false)

    const hideProfilePicture = (data, index) => {

        //messages[index+1] is the previous message
        //messages the array is indexed from the most recent (at 0) to the farthest ago sent (at messages.length-1)

        return index >= 0 && index < messages.length - 1 //index is in range
            && messages[index+1] != undefined && messages[index+1].data != undefined //the previous message exists
            && data.phoneNumber == messages[index+1].data.phoneNumber //they are from the same sender
            && data.timestamp != null && messages[index+1].data.timestamp != null //the messages were sent near each other (time)
            && (data.timestamp.seconds - messages[index+1].data.timestamp.seconds) < 300 //300 seconds = 5 minutes
            && (lastReadTimeState == null ||
                (lastReadTimeState.seconds < messages[index+1].data.timestamp.seconds
                || lastReadTimeState.seconds > data.timestamp.seconds)) //separate for "New Messages"
    };

    const pickImage = async () => {
        
        setSelectingImage(true);
        
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          // aspect: [4, 3],
          quality: 0,
          allowsMultipleSelection: true,
        });
        
        setSelectingImage(false);
    
        if (!result.cancelled) {
          setImageData({
            uri: result.uri,
            width: result.width,
            height: result.height,
          });
        }
        
    };

    const uploadImageAsync = async (uri) => {
        
        setImageFinishedUploading(false);

        //create blob
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });

        //upload blob
        const imageUID = uuid.v4();
        const topicFolder = topicId+"/"+imageUID+".jpg";
        const imageRef = ref(storage, topicFolder);
        uploadBytes(imageRef, blob).then((snapshot) => {
            console.log('Uploaded a blob or file!');

            //send message
            db.collection('chats').doc(topicId).collection('messages').add({
                editedTime: null,
                membersWhoReacted: [],
                message: "",
                ownerUID: auth.currentUser.uid,
                phoneNumber: auth.currentUser.phoneNumber,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                imageUID: imageUID,
                imageDimensions: {
                    width: imageData.width,
                    height: imageData.height,
                },
            });
            setImageData(null);
            setImageFinishedUploading(true);

            // Make the messages
            let messages = [];
            let users = [];
            for (let uid of memberUIDs) {
                console.log("uid = "+uid);
                if(uid != auth.currentUser.uid
                    && members[uid] != undefined && members[uid].expoPushToken != undefined && members[uid].expoPushToken != "") {
                    
                    messages.push({
                        to: members[uid].expoPushToken,
                        sound: "default",
                        title: members[auth.currentUser.uid].firstName+" "+members[auth.currentUser.uid].lastName+" sent an image in \""+topicName+"\"",
                        body: "",
                        data: (isDM)
                            ? ({ url: "familychat://"+"dms" })
                            : ({ url: "familychat://"+"chat/"
                                +topicId+"/"+topicName
                                +"/"+groupId+"/"+groupName+"/"
                                +groupOwner+"/"+color+"/"+coverImageNumber+"/"
                                +members[uid].topicMap[topicId].seconds }),
                    })

                    users.push({
                        [members[uid].expoPushToken]: uid,
                    })
                }
            }

            //sending the messages through the cloud function
            // https://us-central1-family-chat-app-48.cloudfunctions.net/sendPushNotification
            const requestUrl = "https://us-central1-family-chat-app-48.cloudfunctions.net/sendPushNotification?messages="
                +JSON.stringify(messages)+"&users="+JSON.stringify(users)

            // calling cloud function
            fetch(requestUrl, {
                method: 'POST',
            })
            .then((response) => {
                console.log("Success, response = "+JSON.stringify(response));
            })
            .catch((error) => {
                console.log("error");
                console.error(error);
            });

            if(lastReadTimeState != null && lastReadTimeState != undefined) {
                setLastReadTimeState(undefined);
            }
        });

        blob.close();
     }
     const viewImage = (id, data) => {
        if (data.imageUID != undefined && data.imageUID != "") {
            navigation.push("ViewImage", { topicId, topicName, groupId, groupName, imageUID: data.imageUID, messageId: id, messageData: data, pinMap });
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={(inputHeight + 14) + (initialInputHeight - inputHeight) + insets.bottom - 4}
            contentContainerStyle={{flex: 1}}
            style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style='dark' />
            {/* <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                // keyboardVerticalOffset={90}
            > */}
                {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
                    <>
                        {/* Overlay */}
                        <Overlay isVisible={overlayIsVisible} onBackdropPress={toggleOverlay}
                            containerStyle={{ padding: 0, }}
                            overlayStyle={{
                                width: screenWidth - 25,
                                borderRadius: 20,
                                justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                                marginHorizontal: -10,
                            }}>
                            {/* Top section of overlay */}
                            <View style={{
                                width: "100%", marginTop: 0,
                                backgroundColor: "#0fc0",
                                justifyContent: "space-between", alignItems: "flex-start", flexDirection: "row",
                            }}>
                                {/* Flex Left section of Top section */}
                                <View style={{
                                    height: "100%", minWidth: 200,
                                    flex: 1, flexGrow: 1, flexDirection: "row",
                                    backgroundColor: "#cf00",
                                }}>
                                    {/* Group Icon -top left, height change Top section's height */}
                                    <Image
                                        source={helpers.getGroupCoverImage(color, coverImageNumber)}
                                        style={{
                                            width: 85, height: 85,
                                            marginLeft: 10, marginTop: 10,
                                            borderRadius: 5,
                                        }}
                                    />
                                    {/* Left section aligned next to Group Icon */}
                                    <View style={{
                                        minWidth: 100,
                                        marginLeft: 20,
                                        flex: 1, flexGrow: 1, borderRadius: 30,
                                        justifyContent: "flex-end", alignItems: "flex-start", flexDirection: "column",
                                        backgroundColor: "#0cc0",
                                    }}>
                                        {/* Group Name */}
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: '700',
                                            color: 'black',
                                            textAlign: "left",
                                            paddingHorizontal: 0, marginBottom: 5,
                                        }}>
                                            {groupName}
                                        </Text>
                                        {/* Topic text view */}
                                        <View style={{
                                            paddingVertical: 3, paddingLeft: 10, paddingRight: 20,
                                            alignItems: "center", flexDirection: "row",
                                            borderWidth: 1.5, borderColor: "#1174EC", borderRadius: 3,
                                        }}>
                                            <Ionicons name="ios-chatbubble-ellipses-outline" size={20} color="black" />
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: '700',
                                                color: 'black',
                                                textAlign: "left",
                                                marginLeft: 10,
                                            }}>
                                                {(topicName == "General")
                                                    ? "General"
                                                    : topicName}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Top Left X -close button */}
                                <TouchableOpacity activeOpacity={0.7} onPress={toggleOverlay}
                                    style={{
                                        width: 45, height: 45,
                                        borderWidth: 0, borderColor: "#000", borderRadius: 5,
                                        justifyContent: "center", alignItems: "center",
                                        backgroundColor: "#ddd0",
                                    }}>
                                    <Ionicons name="md-close" size={30} color="black" />
                                </TouchableOpacity>
                            </View>
                            {/* Group Details outer view */}
                            <View style={{
                                width: screenWidth - 25,
                                marginTop: 15, paddingVertical: 15, paddingHorizontal: 20,
                                backgroundColor: "#EFEAE2", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#777",
                                justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                            }}>
                                {/* Settings */}
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPressOut={() => setOverlay(false)}
                                    onPress={() => {
                                        const topicObjectResult = topics
                                            .filter((topicObject) => topicObject.data.topicName === topicName)
                                            .map((currentTopic) => {
                                                const data = currentTopic.data;

                                                const topicObjectForPassing = {
                                                    color: color,
                                                    coverImageNumber: coverImageNumber,
                                                    groupId: groupId,
                                                    groupName: groupName,
                                                    groupOwner: groupOwner,
                                                    topicId: currentTopic.id,
                                                    topicName: data.topicName,
                                                    topicOwner: data.topicOwner,
                                                    topicMembers: data.members,
                                                }

                                                navigation.push("TopicSettings", { topicObjectForPassing })
                                            });
                                    }}
                                    style={{
                                        flex: 1, flexGrow: .75,
                                        paddingVertical: 5, marginRight: 0,
                                        backgroundColor: "#fff", borderWidth: 1, borderColor: "#333", borderRadius: 3,
                                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                                    }}>
                                    <MaterialIcons name="settings" size={20} color="black" style={{ marginRight: 10 }} />
                                    <Text style={styles.groupDetailsText}>
                                        {"Settings"}
                                    </Text>

                                </TouchableOpacity>
                                {/* Invite! */}
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    // onPress={() => { navigateTo("Invite") }}
                                    onPress={() => openTextMessage()}
                                    style={copiedText
                                        ? {
                                            flex: 1, flexGrow: 1.25,
                                            paddingVertical: 5, marginLeft: 10, borderColor: '#3D8D04',
                                            backgroundColor: "#fff", borderWidth: 1, borderRadius: 3,
                                            justifyContent: "center", alignItems: "center", flexDirection: "row",
                                        }
                                        : {
                                            flex: 1, flexGrow: 1.25,
                                            paddingVertical: 5, marginLeft: 10, borderColor: 'black',
                                            backgroundColor: "#fff", borderWidth: 1, borderRadius: 3,
                                            justifyContent: "center", alignItems: "center", flexDirection: "row",
                                        }
                                    }>
                                    {copiedText
                                        ? <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", }}>
                                            <MaterialIcons name="thumb-up-alt" size={20} color="#3D8D04" style={{ marginRight: 10 }} />
                                            <Text style={[styles.groupDetailsText, { color: '#3D8D04' }]}>
                                                {"Copied to Clipboard"}
                                            </Text>
                                        </View>
                                        : <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                            <MaterialIcons name="mail-outline" size={20} color="black" style={{ marginRight: 10 }} />
                                            <Text style={styles.groupDetailsText}>
                                                {"Invite to Group"}
                                            </Text>
                                        </View>
                                    }
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                width: screenWidth - 25, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                                marginBottom: -10, paddingHorizontal: 20, paddingVertical: 20,
                                backgroundColor: "#DFD7CE",
                                justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                            }}>
                                {/* Feature Icons 1 */}
                                <View style={{
                                    width: "100%", marginBottom: 20,
                                    backgroundColor: "#DFD7CE0",
                                    justifyContent: "space-evenly", alignItems: "center", flexDirection: "row",
                                }}>
                                    {/* Pins */}
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => { navigateTo("Pins") }}
                                        style={[styles.featuresOuterView,
                                        {
                                            shadowColor: "#000", shadowOffset: { width: 0, height: 5 },
                                            shadowRadius: 3, shadowOpacity: 0.25, marginRight: 0,
                                        }]}>
                                        <Entypo name="pin" size={30} color="#333" />
                                        <Text style={styles.featuresText}>
                                            Pins
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Banners */}
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigateTo("Banners")}
                                        style={[styles.featuresOuterView,
                                        {
                                            shadowColor: "#000", shadowOffset: { width: 0, height: 5 },
                                            shadowRadius: 3, shadowOpacity: 0.25, marginRight: 0,
                                        }]}>
                                        <Entypo name="megaphone" size={30} color="#333" />
                                        <Text style={styles.featuresText}>
                                            Alerts
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Images */}
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigateTo("Images")}
                                        style={[styles.featuresOuterView,
                                    {
                                        shadowColor: "#000", shadowOffset: {width: 0, height: 5},
                                        shadowRadius: 3, shadowOpacity: 0.25,
                                    }]}>
                                        <Entypo name="images" size={30} color="#333" />
                                        <Text style={styles.featuresText}>
                                            Images
                                        </Text>
                                    </TouchableOpacity>

                                </View>

                                {/* <Divider width={1} color={"#777"} style={{ width: screenWidth - 25, marginTop: 10, }} /> */}
                                {/* <View style={{
                                    width: "100%", marginBottom: 10, marginTop: 10,
                                    justifyContent: "felx-start", alignItems: "center", flexDirection: "row",
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '700',
                                        color: '#777',
                                        textAlign: "left",
                                        marginTop: 6,
                                    }}>
                                        In Progress Features
                                    </Text>
                                </View> */}

                                {/* Feature Icons 2 */}
                                <View style={{
                                    width: "100%", backgroundColor: "#0cf0",
                                    justifyContent: "space-evenly", alignItems: "center", flexDirection: "row",
                                }}>
                                    {/* Events */}
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigateTo("Events")}
                                        style={[styles.featuresOuterView,
                                        {
                                            shadowColor: "#000", shadowOffset: { width: 0, height: 5 },
                                            shadowRadius: 3, shadowOpacity: 0.25, marginRight: 0,
                                        }]}>
                                        <Entypo name="calendar" size={30} color="#333" />
                                        <Text style={styles.featuresText}>
                                            Events
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Polls */}
                                    {/* <View style={[styles.featuresOuterViewDisabled,
                                    {
                                        // shadowColor: "#000", shadowOffset: {width: 0, height: 5},
                                        // shadowRadius: 3, shadowOpacity: 0.25,
                                    }]}> */}
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigateTo("Polls")}
                                        style={[styles.featuresOuterView,
                                        {
                                            shadowColor: "#000", shadowOffset: { width: 0, height: 5 },
                                            shadowRadius: 3, shadowOpacity: 0.25,
                                        }]}>
                                        <Entypo name="bar-graph" size={30} color="#333" />
                                        <Text style={styles.featuresText}>
                                            Polls
                                        </Text>
                                    </TouchableOpacity>
                                    {/* </View> */}
                                    
                                    <View style={[styles.featuresOuterView, {backgroundColor: "#0000", borderColor: "#0000"}]}>
                                    <Entypo name="bar-graph" size={30} color="#3330" />
                                        <Text style={[styles.featuresText, {color: "#0000"}]}>
                                            text
                                        </Text>
                                    </View>

                                    {/* Lists */}
                                    {/* <View style={[styles.featuresOuterViewDisabled,
                                    {
                                        // shadowColor: "#000", shadowOffset: {width: 0, height: 5},
                                        // shadowRadius: 3, shadowOpacity: 0.25,
                                    }]}>
                                        <Ionicons name="list" size={30} color="#777" />
                                        <Text style={styles.featuresTextDisabled}>
                                            Lists
                                        </Text>
                                    </View> */}
                                </View>
                            </View>
                        </Overlay>

                        {/* Topic Navigator */}
                        <MyView hide={isDM} //topicName != "General"
                            style={{
                                backgroundColor: "#EFEAE2",
                                justifyContent: "flex-start", alignItems: 'center', flexDirection: 'row',
                                borderColor: "#777",
                                borderBottomWidth: 0.5, borderTopWidth: 1,
                                paddingVertical: 6,
                            }}>
                            <View style={{
                                marginHorizontal: 15, paddingLeft: 15,
                                flex: 1, flexGrow: 1,
                                justifyContent: "flex-start", alignItems: 'center', flexDirection: 'row',
                                backgroundColor: "#fff", borderRadius: 3, borderWidth: 1, borderColor: "#777",
                            }}>
                                <Fontisto name="play" size={15} color="black" />
                                <Text numberOfLines={1} style={{
                                    fontSize: 16,
                                    fontWeight: '700',
                                    color: colorBlack,
                                    textAlign: "left",
                                    paddingLeft: 15, paddingRight: 15,
                                    marginVertical: 7,
                                    flex: 1,
                                }}>
                                    {topicName}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={toggleTopicSelection} activeOpacity={0.2}
                                style={{
                                    paddingVertical: 3, paddingHorizontal: 15, marginRight: 5,
                                    justifyContent: "center", alignItems: 'center', flexDirection: 'row',
                                    backgroundColor: "#333", borderRadius: 50, borderWidth: 2, borderColor: "#1174EC",
                                }}>
                                <Text style={{
                                    fontSize: 15,
                                    fontWeight: '800',
                                    color: 'white',
                                    textAlign: "center",
                                    paddingRight: 10,
                                }}>
                                    {"TOPICS"}
                                </Text>
                                {(topicSelectionEnabled) ? (
                                    <Entypo name="chevron-down" size={25} color="white" />
                                ) : (
                                    <Entypo name="chevron-up" size={25} color="white" />
                                )}
                            </TouchableOpacity>
                        </MyView>

                        {/* Topic selection dropdown */}
                        <MyView hide={topicSelectionEnabled}
                            style={{
                                width: "100%",
                                marginTop: -2,
                                borderColor: "#000", backgroundColor: "#333",
                                borderBottomWidth: 1,
                                flex: 0, alignItems: "center",
                            }} >
                            <ScrollView persistentScrollbar={true}
                                style={{
                                    width: "100%", maxHeight: 225,
                                }}
                                contentContainerStyle={{
                                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                                }}>
                                <TouchableOpacity onPress={() => { navigation.push("CreateTopic", { topicId, topicName, groupId, groupName, groupOwner, color, coverImageNumber }) }} activeOpacity={0.2} //toggleTopicSelection
                                    style={{
                                        height: 40, maxWidth: 220, backgroundColor: "#3D8D04",
                                        borderWidth: 2, borderColor: "#000", borderRadius: 20,
                                        paddingHorizontal: 20, marginVertical: 15,
                                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                                    }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '800',
                                        color: 'white',
                                        textAlign: "center",
                                        paddingRight: 10,
                                    }}>
                                        Create New Topic
                                    </Text>
                                    <Ionicons name="chatbubble-ellipses-outline" size={20} color="white" />
                                </TouchableOpacity>

                                <Divider width={1} style={{ width: "90%", }} />

                                <View style={{
                                    justifyContent: "flex-start", alignItems: "center", flex: 0,
                                    marginBottom: 0, marginTop: 15, backgroundColor: "#ccf0", width: "100%",
                                }}>
                                    {(topicName != "General") ? (
                                        <TouchableOpacity onPress={() => { enterTopic(generalId, "General") }} activeOpacity={0.7}
                                            style={{
                                                width: 250, height: 45, backgroundColor: "#E5E5E5",
                                                borderWidth: 1, borderColor: "#777", borderRadius: 5, paddingRight: 5, marginBottom: 15,
                                                justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                                            }}>
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight: '600',
                                                color: '#333',
                                                textAlign: "center",
                                                paddingLeft: 12,
                                            }}>
                                                General
                                            </Text>
                                            <Entypo name="chevron-right" size={25} color="black" />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity onPress={() => { }} activeOpacity={1}
                                            style={{
                                                width: 300, height: 45, backgroundColor: "#fff",
                                                borderWidth: 2, borderColor: "#3D8D04", borderRadius: 5, paddingRight: 5, marginBottom: 15,
                                                justifyContent: "justify-start", alignItems: "center", flexDirection: "row",
                                                borderLeftWidth: 50, marginLeft: -50,
                                            }}>
                                            <Fontisto name="play" size={15} color="white" style={{ marginLeft: -30, }} />
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight: '800',
                                                color: 'black',
                                                textAlign: "center",
                                                paddingLeft: 28,
                                            }}>
                                                General
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    {/* <View style={{ height: 30, width: 10, backgroundColor: "#6660" }} /> */}
                                    <MyView hide={topics.length <= 1}
                                        style={{
                                            width: "100%", height: `${topics.length - 1}` * 60,
                                            backgroundColor: "#aee0",
                                            borderWidth: 0, borderColor: "#fff",
                                            padding: 0, alignItems: "center", justifyContent: "flex-start", flexDirection: "column",
                                        }}>
                                        {/* The topics as a map */}
                                        <View style={{
                                            maxHeight: `${topics.length - 1}` * 45, width: "100%",
                                        }}>
                                            {topics.filter((topic) => topic.data.topicName != "General").map(({ id, data }) => (
                                                <MyView hide={data.topicName == "General"} key={id}
                                                    style={{
                                                        height: 45, width: "100%", marginBottom: 15,
                                                        alignItems: "center", justifyContent: "flex-start", flexDirection: "column",
                                                    }}>
                                                    {/* <TouchableOpacity onPress={() => enterTopic(id, topicName)} activeOpacity={0.2}
                                                        style={{
                                                            width: "100%", height: "100%",
                                                            justifyContent: "center", alignItems: "center", backgroundColor: "#aef0",
                                                            borderColor: "#000", borderBottomWidth: 1, borderTopWidth: 1
                                                        }}>
                                                        <Text style={styles.topicText}>
                                                            {topicName}
                                                        </Text>
                                                    </TouchableOpacity> */}

                                                    {(topicName != data.topicName) ? (
                                                        <TouchableOpacity onPress={() => enterTopic(id, data.topicName)} activeOpacity={0.7}
                                                            style={{
                                                                width: 250, height: 45, backgroundColor: "#E5E5E5",
                                                                borderWidth: 1, borderColor: "#777", borderRadius: 5, paddingRight: 5, marginBottom: 15,
                                                                justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                                                            }}>
                                                            <Text numberOfLines={1} style={{
                                                                fontSize: 16,
                                                                fontWeight: '600',
                                                                color: '#333',
                                                                textAlign: "left",
                                                                paddingLeft: 12,
                                                                flex: 1,
                                                            }}>
                                                                {data.topicName}
                                                            </Text>
                                                            <Entypo name="chevron-right" size={25} color="black" />
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity onPress={() => { }} activeOpacity={1}
                                                            style={{
                                                                width: 300, height: 45, backgroundColor: "#fff",
                                                                borderWidth: 2, borderColor: "#3D8D04", borderRadius: 5, paddingRight: 5, marginBottom: 15,
                                                                justifyContent: "justify-start", alignItems: "center", flexDirection: "row",
                                                                borderLeftWidth: 50, marginLeft: -50,
                                                            }}>
                                                            <Fontisto name="play" size={15} color="white" style={{ marginLeft: -30, }} />
                                                            <Text numberOfLines={1} style={{
                                                                fontSize: 16,
                                                                fontWeight: '800',
                                                                color: 'black',
                                                                textAlign: "left",
                                                                paddingLeft: 28,
                                                                flex: 1,
                                                            }}>
                                                                {data.topicName}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </MyView>
                                            ))}
                                        </View>
                                    </MyView>
                                </View>
                            </ScrollView>
                        </MyView>
                        {/* Banner (if applicable) */}
                        {/* Calendar for later <FontAwesome5 name="calendar-alt" size={24} color="black" /> */}
                        <MyView hide={!alertExists}
                            style={{
                                width: "100%",
                                flex: 0, flexGrow: 0, flexDirection: "column",
                                justifyContent: "flex-start", alignItems: "center",
                            }}>
                                
                            <MyView hide={(alert.data.type || "") != "Event" || alertEvent.data == undefined}
                                style={[
                                    {
                                        width: "100%",
                                        backgroundColor: "#F8D353", borderWidth: 0,
                                        flex: 0, flexGrow: 0, flexDirection: "column",
                                        justifyContent: "flex-start", alignItems: "center",
                                        borderBottomLeftRadius: 5, borderBottomRightRadius: 5,
                                    },
                                    {
                                        shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
                                        shadowRadius: 2, shadowOpacity: 0.5,
                                    }
                                ]} >
                                {/* Title */}
                                <View style={{
                                    width: "100%",
                                    paddingHorizontal: 10, paddingVertical: 10,
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                    flex: 0, flexGrow: 0, flexDirection: "row",
                                    justifyContent: "space-between", alignItems: "center",
                                }}>
                                    <View style={{
                                        paddingHorizontal: 15, paddingVertical: 5,
                                        backgroundColor: "#fffb", borderRadius: 7, borderWidth: 0,
                                        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                                    }}>
                                        <Entypo name="calendar" size={22} color="black" />
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: '800',
                                            textAlign: "center",
                                            marginLeft: 15, marginRight: 5,
                                        }}>
                                            Event
                                        </Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.7} onPress={dismissBanner}
                                        style={{
                                            paddingHorizontal: 5, paddingVertical: 5,
                                            backgroundColor: "#eec0", borderRadius: 10, borderWidth: 0,
                                            flexDirection: "row", justifyContent: "center", alignItems: "center",
                                        }}>
                                        <Fontisto name="close-a" size={18} color="black" />
                                    </TouchableOpacity>
                                </View>
                                {/* Content */}
                                <View style={{
                                    width: "100%",
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#afc0",
                                    paddingVertical: 5, paddingHorizontal: 15, marginBottom: 5,
                                    flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                }}>
                                    <View activeOpacity={0.7} onPress={() => { }}
                                        style={[
                                            {
                                                width: "100%", marginTop: 0,
                                                backgroundColor: "#fff0", borderWidth: 0,
                                                flex: 0, flexGrow: 0, flexDirection: "row",
                                                justifyContent: "flex-start", alignItems: "center",
                                                borderRadius: 1,
                                            },
                                        ]} >
                                        {/* Left Content */}
                                        <View style={{
                                            minWidth: "10%",
                                            borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                            flex: 1, flexGrow: 1, flexDirection: "row",
                                            justifyContent: "flex-start", alignItems: "center",
                                        }}>
                                            <View style={{
                                                width: "100%", height: 68,
                                                paddingHorizontal: 15, paddingVertical: 0,
                                                backgroundColor: "#0000", borderRadius: 7, borderWidth: 0,
                                                flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start",
                                            }}>
                                                <View style={{
                                                    width: "100%",
                                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                                    flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                                }}>
                                                    <MaterialIcons name="stars" size={18} color="black" />
                                                    <Text numberOfLines={1}
                                                        style={{
                                                            fontSize: 18,
                                                            fontWeight: '800',
                                                            textAlign: "left",
                                                            marginLeft: 15, marginRight: 10,
                                                            color: "black",
                                                            flex: 1,
                                                        }}>
                                                        {alertEvent.data.title}
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    width: "100%",
                                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                                    flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                                }}>
                                                    <Ionicons name="flag-outline" size={18} color="black" />
                                                    <Text numberOfLines={1}
                                                        style={{
                                                            fontSize: 16,
                                                            fontWeight: '400',
                                                            textAlign: "left",
                                                            marginLeft: 15, marginRight: 10,
                                                            color: "black",
                                                            flex: 1,
                                                        }}>
                                                        {(alertEvent.data.startTime != null) ? (alertEvent.data.startTime.toDate().toLocaleDateString("en-US", {
                                                            month: "short", day: "2-digit", year: "numeric",
                                                        })
                                                            + " @ " + alertEvent.data.startTime.toDate().toLocaleTimeString("en-US",
                                                                { hour: "numeric", minute: "2-digit", timeZoneName: "short" })) : ("")}
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    width: "100%",
                                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                                    flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                                }}>
                                                    <Feather name="file-text" size={18} color="black" />
                                                    <Text numberOfLines={1}
                                                        style={{
                                                            fontSize: 18,
                                                            fontWeight: '400',
                                                            textAlign: "left",
                                                            marginLeft: 15, marginRight: 10,
                                                            color: "black",
                                                            flex: 1,
                                                        }}>
                                                        {alertEvent.data.description}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {/* Action */}
                                <View style={{
                                    minHeight: 0, width: "100%",
                                    marginTop: 5, marginBottom: 15,
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#cfa0",
                                    flex: 0, flexGrow: 0,
                                    flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
                                }}>
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => { viewBanner(alert.id, alert.data) }}
                                        style={{
                                            height: 40, paddingHorizontal: 10,
                                            flexDirection: "row", justifyContent: "center", alignItems: "center",
                                            backgroundColor: "#fffb",
                                            borderColor: "#7C6A29", borderWidth: 4, borderRadius: 20,
                                        }}>
                                        <Text style={{
                                            fontSize: 15,
                                            fontWeight: '700',
                                            textAlign: "center",
                                            marginHorizontal: 15,
                                            color: "black",
                                        }}>
                                            {"View Event"}
                                        </Text>
                                        <Entypo name="chevron-right" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </MyView>

                            <MyView hide={(alert.data.type || "") != "Banner"}
                                style={[
                                    {
                                        width: "100%",
                                        backgroundColor: "#EC7169", borderWidth: 0,
                                        flex: 0, flexGrow: 0, flexDirection: "column",
                                        justifyContent: "flex-start", alignItems: "center",
                                        borderBottomLeftRadius: 5, borderBottomRightRadius: 5,
                                    },
                                    {
                                        shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
                                        shadowRadius: 2, shadowOpacity: 0.5,
                                    }
                                ]} >
                                {/* Title */}
                                <View style={{
                                    width: "100%",
                                    paddingHorizontal: 10, paddingVertical: 10,
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                    flex: 0, flexGrow: 0, flexDirection: "row",
                                    justifyContent: "space-between", alignItems: "center",
                                }}>
                                    <View style={{
                                        paddingHorizontal: 15, paddingVertical: 5,
                                        backgroundColor: "#fffb", borderRadius: 7, borderWidth: 0,
                                        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                                    }}>
                                        <Entypo name="megaphone" size={22} color="black" />
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: '800',
                                            textAlign: "center",
                                            marginLeft: 15, marginRight: 5,
                                        }}>
                                            Alert
                                        </Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.7} onPress={dismissBanner}
                                        style={{
                                            paddingHorizontal: 5, paddingVertical: 5,
                                            backgroundColor: "#eec0", borderRadius: 10, borderWidth: 0,
                                            flexDirection: "row", justifyContent: "center", alignItems: "center",
                                        }}>
                                        <Fontisto name="close-a" size={18} color="black" />
                                    </TouchableOpacity>
                                </View>
                                {/* Content */}
                                <View style={{
                                    width: "100%",
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#afc0",
                                    paddingVertical: 5, paddingHorizontal: 15,
                                    flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '700',
                                        textAlign: "left",
                                        marginHorizontal: 15,
                                        color: "black",
                                    }}>
                                        <Text style={{ fontWeight: '600' }}>"</Text>
                                        {(alert.data.description) || ("")}
                                        <Text style={{ fontWeight: '600' }}>"</Text>
                                    </Text>
                                </View>
                                {/* Action */}
                                <View style={{
                                    minHeight: 0, width: "100%",
                                    marginTop: 5, marginBottom: 15,
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#cfa0",
                                    flex: 0, flexGrow: 0,
                                    flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
                                }}>
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => { viewBanner(alert.id, alert.data) }}
                                        style={{
                                            height: 40, paddingHorizontal: 10,
                                            flexDirection: "row", justifyContent: "center", alignItems: "center",
                                            backgroundColor: "#fffb",
                                            borderColor: "#9E4C46", borderWidth: 4, borderRadius: 20,
                                        }}>
                                        <Text style={{
                                            fontSize: 15,
                                            fontWeight: '700',
                                            textAlign: "center",
                                            marginHorizontal: 15,
                                            color: "black",
                                        }}>
                                            {"View Alert"}
                                        </Text>
                                        <Entypo name="chevron-right" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </MyView>
                            <MyView hide={(alert.data.type || "") != "Poll" || alertPoll.data == undefined}
                                style={[
                                    {
                                        width: "100%",
                                        backgroundColor: "#F1A45C", borderWidth: 0,
                                        flex: 0, flexGrow: 0, flexDirection: "column",
                                        justifyContent: "flex-start", alignItems: "center",
                                        borderBottomLeftRadius: 5, borderBottomRightRadius: 5,
                                    },
                                    {
                                        shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
                                        shadowRadius: 2, shadowOpacity: 0.5,
                                    }
                                ]} >
                                {/* Title */}
                                <View style={{
                                    width: "100%",
                                    paddingHorizontal: 10, paddingVertical: 10,
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                    flex: 0, flexGrow: 0, flexDirection: "row",
                                    justifyContent: "space-between", alignItems: "center",
                                }}>
                                    <View style={{
                                        paddingHorizontal: 15, paddingVertical: 5,
                                        backgroundColor: "#fffb", borderRadius: 7, borderWidth: 0,
                                        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                                    }}>
                                        <Entypo name="bar-graph" size={22} color="black" />
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: '800',
                                            textAlign: "center",
                                            marginLeft: 15, marginRight: 5,
                                        }}>
                                            Poll
                                        </Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.7} onPress={dismissBanner}
                                        style={{
                                            paddingHorizontal: 5, paddingVertical: 5,
                                            backgroundColor: "#eec0", borderRadius: 10, borderWidth: 0,
                                            flexDirection: "row", justifyContent: "center", alignItems: "center",
                                        }}>
                                        <Fontisto name="close-a" size={18} color="black" />
                                    </TouchableOpacity>
                                </View>
                                {/* Content */}
                                <View style={{
                                    width: "100%",
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#afc0",
                                    paddingVertical: 5, paddingHorizontal: 15,
                                    flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start",
                                }}>
                                    <FontAwesome5 name="question-circle" size={20} color="#333" />
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        textAlign: "left",
                                        marginHorizontal: 15,
                                        color: "black",
                                    }}>
                                        {(alertPoll.data.question) || ("")}
                                    </Text>
                                </View>
                                {/* Action */}
                                <View style={{
                                    minHeight: 0, width: "100%",
                                    marginTop: 10, marginBottom: 15,
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#cfa0",
                                    flex: 0, flexGrow: 0,
                                    flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
                                }}>
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => { viewBanner(alert.id, alert.data) }}
                                        style={{
                                            height: 40, paddingHorizontal: 10,
                                            flexDirection: "row", justifyContent: "center", alignItems: "center",
                                            backgroundColor: "#fffb",
                                            borderColor: "#79522E", borderWidth: 4, borderRadius: 20,
                                        }}>
                                        <Text style={{
                                            fontSize: 15,
                                            fontWeight: '700',
                                            textAlign: "center",
                                            marginHorizontal: 15,
                                            color: "black",
                                        }}>
                                            {"View Polls"}
                                        </Text>
                                        <Entypo name="chevron-right" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </MyView>
                        </MyView>

                        {/* Messages */}
                        <FlatList ref={flatList}
                            data={messages} keyExtractor={(item) => item.id}
                            initialNumToRender={20}
                            inverted={true}
                            refreshing={isRefreshingMessages}
                            // onContentSizeChange= {()=> {}} flatList.current.scrollToEnd()
                            onEndReachedThreshold={0.5} onEndReached={refreshMessages}
                            ListHeaderComponent={<View style={{height: 40,}}/>}
                            renderItem={({ item: { id, data }, index }) => {
                                return (

                                    ( hideProfilePicture(data, index) )
                                    ? (
                                        //message without profile picture
                                        <View key={id} style={{
                                            width: "100%",
                                            justifyContent: "flex-start", alignItems: 'center', flexDirection: "column",
                                            paddingTop: 7,
                                            paddingHorizontal: 10,
                                            backgroundColor: "#6660",
                                        }}>
                                            <View style={{
                                                flex: 1,
                                                width: "100%",
                                                alignItems: 'flex-start',
                                                flexDirection: "row",
                                                // paddingTop: 7,
                                                // paddingHorizontal: 10,
                                                backgroundColor: "#6660",
                                            }}>
                                                <View style={{
                                                    width: 50,

                                                    backgroundColor: '#0cc0',
                                                    borderWidth: 2,
                                                    borderColor: '#5550',
                                                    borderRadius: 10,
                                                }} />
                                                <View style={styles.textContainer}>

                                                <Menu style={{ flex: 1, }}>
                                                    <MenuTrigger text='' triggerOnLongPress={true} customStyles={triggerStyles}>
                                                        <View activeOpacity={0.7} //onPress={rerender}
                                                        style={{
                                                            minHeight: 30, marginLeft: 5,
                                                            flex: 1, flexGrow: 1, justifyContent: "center",
                                                            alignItems: ((data.imageUID != undefined && data.imageUID != "")) ? ("center") : ("justify-start"),
                                                            backgroundColor: ((data.ownerUID == auth.currentUser.uid) ? '#EFEAE2' : '#F8F8F8'),
                                                            borderWidth: 1.3, borderColor: '#9D9D9D', borderRadius: 5,
                                                        }}>
                                                            {/* {messageImages != undefined && messageImages[data.imageUID] != undefined && */}
                                                            {(data.imageUID != undefined && data.imageUID != "") &&
                                                                <TouchableOpacity activeOpacity={0.7} onPress={() => {console.log("Pressed image"); rerender(); viewImage(id, data)}}
                                                                style={{
                                                                    width: (data.imageDimensions.width < data.imageDimensions.height)
                                                                        ? ((data.imageDimensions.width/data.imageDimensions.height) * 150)
                                                                        : ("70%"), maxWidth: "70%",
                                                                    height: (data.imageDimensions.width > data.imageDimensions.height)
                                                                        ? ((data.imageDimensions.height/data.imageDimensions.width) * ((screenWidth*.9 - 50)*.70))
                                                                        : (150),
                                                                    marginHorizontal: 5, marginVertical: 5,
                                                                }}>
                                                                    <Image source={{
                                                                        uri: messageImages[data.imageUID],
                                                                    }} style={{width: "100%", height: "100%",
                                                                        borderRadius: 5, borderWidth: 2, borderColor: "#777",}}/>
                                                                </TouchableOpacity>
                                                            }
                                                            {(messageImages == undefined || messageImages[data.imageUID] == undefined) &&
                                                                <Text style={styles.text}>
                                                                    {data.message}
                                                                </Text>}
                                                        </View>
                                                    </MenuTrigger>
                                                    <MenuOptions style={{
                                                        borderRadius: 12, backgroundColor: "#fff",
                                                    }}
                                                        customStyles={{
                                                            optionsContainer: {
                                                                borderRadius: 15, backgroundColor: "#666",
                                                            },
                                                        }}>
                                                        <IconOption value={1} iconName='heart' text={(data.membersWhoReacted.some(u => (u == auth.currentUser.uid))) ? 'Unlike' : "Like"}
                                                            isSpacer={data.ownerUID == auth.currentUser.uid} isLast={data.ownerUID != auth.currentUser.uid}
                                                            selectFunction={() => { likeMessage(id, data.membersWhoReacted) }} />
                                                        <IconOption value={2} iconName='bookmark' text='Pin Message' hide={data.ownerUID != auth.currentUser.uid || isDM
                                                                || (getPinData(id) != null) || (data.imageUID != undefined && data.imageUID != "")}
                                                            selectFunction={() => { addPinFromMessage(data, id) }} />
                                                        <IconOption value={3} isSpacer={true} iconName='message-circle' text='Make into Topic' //arrow-right
                                                            hide={data.ownerUID != auth.currentUser.uid || topicName != "General"
                                                                || (getTopicData(id) != null) || (data.imageUID != undefined && data.imageUID != "")}
                                                            selectFunction={() => { navigation.push("CreateTopic", { topicId, topicName, groupId, groupName, groupOwner, color, coverImageNumber, originalMessageUID: id }) }} />
                                                        <IconOption value={4} isSpacer={true} iconName='alert-triangle' text='Make into Alert' hide={true} />
                                                        <IconOption value={5} iconName='edit' text='Edit' hide={true} />
                                                        <IconOption value={6} isLast={true} isDestructive={true} iconName='trash' text='Delete' hide={data.ownerUID != auth.currentUser.uid}
                                                            selectFunction={() => { deleteMessage(id, data) }} />
                                                    </MenuOptions>
                                                </Menu>
                                                </View>

                                                {/* PIN */}
                                                {(getPinData(id) != null) ? (
                                                    <TouchableOpacity activeOpacity={0.7} onPress={() => { viewPin(id, data) }}
                                                        style={{
                                                            padding: 5, marginLeft: 5,
                                                            backgroundColor: ((data.ownerUID == auth.currentUser.uid) ? '#EFEAE2' : '#F8F8F8'),
                                                            borderWidth: 1.3, borderColor: '#9D9D9D', borderRadius: 5,
                                                        }}>
                                                        <Entypo name="pin" size={25} color="#555" />
                                                    </TouchableOpacity>
                                                ) : (<View style={{ width: 0, height: 0, }} />)}

                                                {/* TOPIC */}
                                                {(getTopicData(id) != null
                                                    && getTopicData(id).data.members.some(u => (u == auth.currentUser.uid))) ? (
                                                    <TouchableOpacity activeOpacity={0.7} onPress={() => { enterTopicFromMessage(id) }}
                                                        style={{
                                                            padding: 5, marginLeft: 5,
                                                            backgroundColor: ((data.ownerUID == auth.currentUser.uid) ? '#EFEAE2' : '#F8F8F8'),
                                                            borderWidth: 1.3, borderColor: '#9D9D9D', borderRadius: 5,
                                                        }}>
                                                        <Ionicons name="chatbubble-ellipses-outline" size={25} color="#555" />
                                                    </TouchableOpacity>
                                                ) : (<View style={{ width: 0, height: 0, }} />)}

                                            </View>
                                            <MyView hide={data.membersWhoReacted.length == 0} style={{
                                                width: "100%",
                                                justifyContent: "flex-end", alignItems: 'flex-start', flexDirection: "row",
                                                paddingTop: 3, backgroundColor: "#abc0",
                                            }}>
                                                <TouchableOpacity activeOpacity={0.7} onPress={() => { likeMessage(id, data.membersWhoReacted) }}
                                                    style={{
                                                        paddingLeft: 5, paddingRight: 7, paddingVertical: 2.5,
                                                        justifyContent: "center", alignItems: 'center', flexDirection: "row",
                                                        backgroundColor: ((data.ownerUID == auth.currentUser.uid) ? '#EFEAE2' : '#F8F8F8'),
                                                        borderWidth: (data.membersWhoReacted.some(u => (u == auth.currentUser.uid))) ? 2.3 : 1.3,
                                                        borderColor: (data.membersWhoReacted.some(u => (u == auth.currentUser.uid))) ? '#226EDA' : '#9D9D9D',
                                                        borderRadius: 5,
                                                    }}>
                                                    <Entypo name="heart" size={20} color="#f66" />
                                                    <Text style={{
                                                        fontSize: 14,
                                                        fontWeight: '600',
                                                        textAlign: "left",
                                                        marginLeft: 5,
                                                        color: "black",
                                                    }}>
                                                        {data.membersWhoReacted.length}
                                                    </Text>
                                                </TouchableOpacity>
                                            </MyView>
                                        </View>
                                    ) : (
                                        //Message with profile picture and display name
                                        <View key={id} style={{
                                            width: "100%",
                                            justifyContent: "flex-start", alignItems: 'center', flexDirection: "column",
                                            paddingTop: 20,
                                            paddingHorizontal: 10,
                                            backgroundColor: "#6660",
                                        }}>
                                            {/* date separator */}
                                            <MyView hide={
                                                index > messages.length - 1
                                                || data.timestamp == null
                                                || (data.timestamp != null
                                                    && index < messages.length - 1
                                                    && messages[index+1] != undefined && messages[index+1].data != undefined
                                                    && (messages[index+1].data.timestamp.seconds - data.timestamp.seconds < 24 * 60 * 60)
                                                    && (messages[index+1].data.timestamp.toDate().getDay()
                                                        == data.timestamp.toDate().getDay()))
                                            }
                                            //show if difference is greater than a day
                                            //  or if the seconds converted to dates and then the day is different
                                            //hide if the difference is less than a day
                                            //  and the day is the same //TODO change something to day
                                                style={{
                                                    height: 50, width: "100%", backgroundColor: "#aef0", marginBottom: 15,
                                                    justifyContent: "flex-start", alignItems: 'center', flexDirection: "row",
                                                }}>
                                                <Divider width={1} color={"#555"}
                                                    style={{
                                                        minWidth: "10%",
                                                        flexGrow: 1, flex: 1,
                                                    }} />
                                                <Text style={{
                                                    textAlign: "center",
                                                    fontSize: 18,
                                                    fontWeight: '500',
                                                    color: '#555', marginHorizontal: 10
                                                }}>
                                                    {/* {"April 20th"} */}
                                                    {data.timestamp && data.timestamp.toDate().toLocaleDateString("en-US", {
                                                        month: "short", day: "numeric",})}
                                                </Text>
                                                <Divider width={1} color={"#555"}
                                                    style={{
                                                        minWidth: "10%",
                                                        flexGrow: 1, flex: 1,
                                                    }} />
                                            </MyView>

                                            {/* 

                                            hide if lastReadTime == undefined or null
                                            
                                            hide if the message is the very last message (oldest)
                                            && (the lastReadTime is after the message was sent)
                                            
                                            hide if the message is a valid message && time stuff is false
                                            
                                            */}
                                            <MyView hide={
                                                index > messages.length - 1 || lastReadTimeState == undefined || lastReadTimeState == null
                                                || data.timestamp == null
                                                || (index == messages.length-1 //last message
                                                    && lastReadTimeState.seconds > data.timestamp.seconds)
                                                || (index < messages.length - 1
                                                    && messages[index+1] != undefined && messages[index+1].data != undefined
                                                    && (lastReadTimeState.seconds < messages[index+1].data.timestamp.seconds
                                                        || lastReadTimeState.seconds > data.timestamp.seconds))
                                            }
                                                style={{
                                                    height: 50, width: "100%", backgroundColor: "#aef0", marginBottom: 15,
                                                    justifyContent: "flex-start", alignItems: 'center', flexDirection: "row",
                                                }}>
                                                <Divider width={2} color={"#E2290B"}
                                                    style={{
                                                        minWidth: "10%",
                                                        flexGrow: 1, flex: 1,
                                                    }} />
                                                <Text style={{
                                                    textAlign: "center",
                                                    fontSize: 20,
                                                    fontWeight: '700',
                                                    color: '#E2290B', marginHorizontal: 10
                                                }}>
                                                    {"New Messages"}
                                                </Text>
                                                <Divider width={2} color={"#E2290B"}
                                                    style={{
                                                        minWidth: "10%",
                                                        flexGrow: 1, flex: 1,
                                                    }} />
                                            </MyView>
                                            <View style={styles.message}>
                                                <View style={styles.userContainer}>
                                                    <Image source={imageSelection(getPfp(data.ownerUID))}
                                                        style={{
                                                            width: "100%", height: "100%",
                                                            // borderRadius: 7, borderWidth: 1, borderColor: "#777",
                                                        }} />
                                                </View>
                                                <View style={styles.textContainer}>
                                                    <View style={{
                                                        flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
                                                        flex: 1, flexGrow: 1, backgroundColor: "#3330",
                                                    }}>
                                                        <Text style={styles.userName}>
                                                            {getString(data.ownerUID) || "Display Name"}
                                                        </Text>
                                                        <Text style={{
                                                            fontSize: 14,
                                                            fontWeight: '500',
                                                            textAlign: "center",
                                                            marginHorizontal: 0,
                                                            color: "#555",
                                                        }}>
                                                            {(data.timestamp != null) ? (data.timestamp.toDate().toLocaleTimeString("en-US", {
                                                                hour: "numeric", minute: "2-digit"
                                                            })) : ("")}
                                                        </Text>
                                                    </View>

                                                    <View style={{
                                                        flexDirection: "row", alignItems: "flex-start",
                                                        flex: 1, flexGrow: 1, backgroundColor: "#3330",
                                                    }}>
                                                        <Menu style={{ flex: 1, }}>
                                                            <MenuTrigger text='' triggerOnLongPress={true} customStyles={triggerStyles}>
                                                                <View activeOpacity={0.7} //onPress={rerender}
                                                                style={{
                                                                    minHeight: 30, marginLeft: 5,
                                                                    flex: 1, flexGrow: 1, justifyContent: "center",
                                                                    alignItems: ((data.imageUID != undefined && data.imageUID != "")) ? ("center") : ("justify-start"),
                                                                    backgroundColor: ((data.ownerUID == auth.currentUser.uid) ? '#EFEAE2' : '#F8F8F8'),
                                                                    borderWidth: 1.3, borderColor: '#9D9D9D', borderRadius: 5,
                                                                }}>
                                                                    {/* {messageImages != undefined && messageImages[data.imageUID] != undefined && */}
                                                                    {(data.imageUID != undefined && data.imageUID != "") &&
                                                                        <TouchableOpacity activeOpacity={0.7} onPress={() => {console.log("Pressed image"); rerender(); viewImage(id, data)}}
                                                                        style={{
                                                                            width: (data.imageDimensions.width < data.imageDimensions.height)
                                                                                ? ((data.imageDimensions.width/data.imageDimensions.height) * 150)
                                                                                : ("70%"), maxWidth: "70%",
                                                                            height: (data.imageDimensions.width > data.imageDimensions.height)
                                                                                ? ((data.imageDimensions.height/data.imageDimensions.width) * ((screenWidth*.9 - 50)*.70))
                                                                                : (150),
                                                                            marginHorizontal: 5, marginVertical: 5,
                                                                        }}>
                                                                            <Image source={{
                                                                                uri: messageImages[data.imageUID],
                                                                            }} style={{width: "100%", height: "100%",
                                                                                borderRadius: 5, borderWidth: 2, borderColor: "#777",}}/>
                                                                        </TouchableOpacity>
                                                                    }
                                                                    {(messageImages == undefined || messageImages[data.imageUID] == undefined) &&
                                                                        <Text style={styles.text}>
                                                                            {data.message}
                                                                        </Text>}
                                                                </View>
                                                            </MenuTrigger>
                                                            <MenuOptions style={{
                                                                borderRadius: 12, backgroundColor: "#fff",
                                                            }}
                                                                customStyles={{
                                                                    optionsContainer: {
                                                                        borderRadius: 15, backgroundColor: "#666",
                                                                    },
                                                                }}>
                                                                <IconOption value={1} iconName='heart' text={(data.membersWhoReacted.some(u => (u == auth.currentUser.uid))) ? 'Unlike' : "Like"}
                                                                    isSpacer={data.ownerUID == auth.currentUser.uid} isLast={data.ownerUID != auth.currentUser.uid}
                                                                    selectFunction={() => { likeMessage(id, data.membersWhoReacted) }} />
                                                                <IconOption value={2} iconName='bookmark' text='Pin Message' hide={data.ownerUID != auth.currentUser.uid || isDM
                                                                        || (getPinData(id) != null) || (data.imageUID != undefined && data.imageUID != "")}
                                                                    selectFunction={() => { addPinFromMessage(data, id) }} />
                                                                <IconOption value={3} isSpacer={true} iconName='message-circle' text='Make into Topic' //arrow-right
                                                                    hide={data.ownerUID != auth.currentUser.uid || topicName != "General"
                                                                        || (getTopicData(id) != null) || (data.imageUID != undefined && data.imageUID != "")}
                                                                    selectFunction={() => { navigation.push("CreateTopic", { topicId, topicName, groupId, groupName, groupOwner, color, coverImageNumber, originalMessageUID: id }) }} />
                                                                <IconOption value={4} isSpacer={true} iconName='alert-triangle' text='Make into Alert' hide={true} />
                                                                <IconOption value={5} iconName='edit' text='Edit' hide={true} />
                                                                <IconOption value={6} isLast={true} isDestructive={true} iconName='trash' text='Delete' hide={data.ownerUID != auth.currentUser.uid}
                                                                    selectFunction={() => { deleteMessage(id, data) }} />
                                                            </MenuOptions>
                                                        </Menu>

                                                        {/* PIN */}
                                                        {(getPinData(id) != null) ? (
                                                            <TouchableOpacity activeOpacity={0.7} onPress={() => { viewPin(id, data) }}
                                                                style={{
                                                                    padding: 5, marginLeft: 5,
                                                                    backgroundColor: ((data.ownerUID == auth.currentUser.uid) ? '#EFEAE2' : '#F8F8F8'),
                                                                    borderWidth: 1.3, borderColor: '#9D9D9D', borderRadius: 5,
                                                                }}>
                                                                <Entypo name="pin" size={25} color="#555" />
                                                            </TouchableOpacity>
                                                        ) : (<View style={{ width: 0, height: 0, }} />)}

                                                        {/* TOPIC */}
                                                        {(getTopicData(id) != null
                                                            && getTopicData(id).data.members.some(u => (u == auth.currentUser.uid))) ? (
                                                            <TouchableOpacity activeOpacity={0.7} onPress={() => { enterTopicFromMessage(id) }}
                                                                style={{
                                                                    padding: 5, marginLeft: 5,
                                                                    backgroundColor: ((data.ownerUID == auth.currentUser.uid) ? '#EFEAE2' : '#F8F8F8'),
                                                                    borderWidth: 1.3, borderColor: '#9D9D9D', borderRadius: 5,
                                                                }}>
                                                                <Ionicons name="chatbubble-ellipses-outline" size={25} color="#555" />
                                                            </TouchableOpacity>
                                                        ) : (<View style={{ width: 0, height: 0, }} />)}

                                                    </View>
                                                </View>
                                            </View>
                                            <MyView hide={data.membersWhoReacted.length == 0} style={{
                                                width: "100%",
                                                justifyContent: "flex-end", alignItems: 'flex-start', flexDirection: "row",
                                                paddingTop: 3, backgroundColor: "#abc0",
                                            }}>
                                                <TouchableOpacity activeOpacity={0.7} onPress={() => { likeMessage(id, data.membersWhoReacted) }}
                                                    style={{
                                                        paddingLeft: 5, paddingRight: 7, paddingVertical: 2.5,
                                                        justifyContent: "center", alignItems: 'center', flexDirection: "row",
                                                        backgroundColor: ((data.ownerUID == auth.currentUser.uid) ? '#EFEAE2' : '#F8F8F8'),
                                                        borderWidth: (data.membersWhoReacted.some(u => (u == auth.currentUser.uid))) ? 2.3 : 1.3,
                                                        borderColor: (data.membersWhoReacted.some(u => (u == auth.currentUser.uid))) ? '#226EDA' : '#9D9D9D',
                                                        borderRadius: 5,
                                                    }}>
                                                    <Entypo name="heart" size={20} color="#f66" />
                                                    <Text style={{
                                                        fontSize: 14,
                                                        fontWeight: '600',
                                                        textAlign: "left",
                                                        marginLeft: 5,
                                                        color: "black",
                                                    }}>
                                                        {data.membersWhoReacted.length}
                                                    </Text>
                                                </TouchableOpacity>
                                            </MyView>
                                        </View>
                                    )

                                )
                            }} />

                        {/* Footer */}
                        {(imageData || selectingImage) ? (
                            <View style={styles.footer}>
                                <View style={{
                                    minWidth: 125, maxWidth: "100%", height: 115, flexDirection: "column",
                                    flex: 1, flexGrow: 1,
                                    marginLeft: 2, paddingLeft: 10,
                                    justifyContent: "center", alignItems: "flex-start",
                                    borderWidth: 2, borderColor: "#777", borderRadius: 5, backgroundColor: "#fff",
                                }}>
                                    <View style={{
                                        flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                        borderWidth: 0,
                                    }}>
                                        {/* <Entypo name="images" size={90} color="#777" /> */}
                                        {imageData && <Image source={{ uri: imageData.uri }} style={{
                                            width: 97, height: 97, borderRadius: 5, borderWidth: 2, borderColor: "#777",
                                        }} />}
                                    </View>
                                </View>
                                <View style={{
                                        borderWidth: 0, marginLeft: 15, marginRight: 8,
                                        flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
                                    }}>
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                        uploadImageAsync(imageData.uri)
                                    }}
                                        style={{
                                            flex: 1, flexGrow: 1,
                                            paddingHorizontal: 30,
                                            backgroundColor: "#1174EC",
                                            borderRadius: 15,
                                            justifyContent: "center", alignItems: "center",
                                        }}>
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: '700',
                                            textAlign: "center",
                                            color: "white",
                                        }}>
                                            {"Send Image"}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => {setImageData(null)}}
                                        style={{
                                            width: "100%",
                                            marginTop: 7,
                                            borderColor: "#333", borderRadius: 21, borderWidth: 3,
                                            justifyContent: "center", alignItems: "center",
                                        }}>
                                        <Text style={{
                                            paddingVertical: 5,
                                            fontSize: 18,
                                            fontWeight: '700',
                                            textAlign: "center",
                                            color: "#333",
                                        }}>
                                            {"Cancel"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.footer}>
                                {!isDM && <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                    pickImage();
                                }}
                                style={{
                                    width: 40, height: 40,
                                    marginLeft: 5, marginRight: 10,
                                    backgroundColor: "#fff",
                                    borderRadius: 10, borderWidth: 2.5, borderColor: "#777",
                                    justifyContent: "center", alignItems: "center",
                                }}>
                                    <Entypo name="images" size={25} color="#777" />
                                </TouchableOpacity>}
                                <View 
                                onLayout={(event)=> {
                                    const {x, y, height, width} = event.nativeEvent.layout;
                                    if(inputHeight == -1) {
                                        setInitialInputHeight(height);
                                    }
                                    setInputHeight(height);
                                }}
                                style={{
                                    width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                                    paddingLeft: 15,
                                    justifyContent: "flex-start", alignItems: "flex-end",
                                    borderWidth: 2, borderColor: "#777", borderRadius: 5, backgroundColor: "#fff",
                                    borderBottomRightRadius: 21, borderTopRightRadius: 21,
                                }}>
                                    <View style={{
                                        width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end",
                                    }}>
                                        <TextInput placeholder={"Type a message..."} onChangeText={(text) => setInput(text)} value={input}
                                            multiline={true} maxLength={200} //onSubmitEditing={sendMessage}
                                            style={{
                                                minHeight: 20, width: "70%",
                                                marginBottom: 12, marginTop: 5,
                                                backgroundColor: "#fff",
                                                textAlign: 'left',
                                                fontSize: 16,
                                                fontWeight: '500',
                                                color: '#222',
                                            }}
                                        />
                                        <TouchableOpacity activeOpacity={0.7} onPress={sendMessage}
                                            style={{
                                                height: 44, width: "25%",
                                                backgroundColor: (input.length > 0) ? ("#1174EC") : ("#98B0D4"),
                                                borderRadius: 18,
                                                justifyContent: "center", alignItems: "center",
                                            }}>
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight: '700',
                                                textAlign: "center",
                                                color: "white",
                                            }}>
                                                {"SEND"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        )}
                    </>
                {/* </TouchableWithoutFeedback> */}
            {/* </KeyboardAvoidingView> */}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    featuresOuterView: {
        width: 90,
        paddingHorizontal: 5, paddingVertical: 15,
        borderRadius: 10, borderWidth: 1, borderColor: "#777",
        backgroundColor: "#fff",
        justifyContent: "center", alignItems: "center", flexDirection: "column",
    },
    featuresOuterViewDisabled: {
        width: 90,
        paddingHorizontal: 5, paddingVertical: 15,
        borderRadius: 10, borderWidth: 1, borderColor: "#777",
        backgroundColor: "#CFC5BA00",
        justifyContent: "center", alignItems: "center", flexDirection: "column",
    },
    featuresIconView: {
        width: 50, height: 50,
        borderRadius: 0, borderWidth: 0,
        backgroundColor: "#cff0",
        justifyContent: "center", alignItems: "center",
    },
    featuresText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'black',
        textAlign: "center",
        marginTop: 5,
    },
    featuresTextDisabled: {
        fontSize: 16,
        fontWeight: '700',
        color: '#777',
        textAlign: "center",
        marginTop: 5,
    },
    groupDetailsIconBubble: {
        width: 32, height: 32,
        borderRadius: 10, borderWidth: 2,
        backgroundColor: "#cff",
        justifyContent: "center", alignItems: "center",
    },
    groupDetailsTextBubble: {
        minWidth: 30, height: 30,
        paddingHorizontal: 10,
        borderRadius: 15, borderWidth: 2,
        backgroundColor: "#cff",
        justifyContent: "center", alignItems: "center",
    },
    groupDetailsText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'black',
        textAlign: "left",
        paddingHorizontal: 0,
    },
    topicNavigator: {

    },
    topicSpacer: {
        flex: 1,
        width: 200,
        height: 30,
        flexGrow: 1,
        backgroundColor: "#eae0",
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "row",
    },
    topicButton: {
        minWidth: 100,
        height: 30,
        marginVertical: 10,
        justifyContent: "center",
        backgroundColor: "#aee",

        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 5,
    },
    topicLabel: {
        marginRight: 5,
        marginVertical: 5,
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
    },
    topicText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
        textAlign: "center",
        paddingHorizontal: 10,
    },

    message: {
        flex: 1,
        width: "100%",
        alignItems: 'flex-start',
        flexDirection: "row",
        // paddingTop: 20,
        // paddingHorizontal: 10,
        backgroundColor: "#6660",
    },
    userContainer: {
        width: 50,
        height: 50,

        backgroundColor: '#0cc0',
        borderWidth: 2,
        borderColor: '#5550',
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: '#0cc0',
    },
    userName: {
        marginLeft: 5, marginBottom: 2,
        height: 20,
        textAlign: 'left',
        fontSize: 16,
        fontWeight: '800',
        color: 'black',
    },
    textOutline: {
        flex: 1,
        flexGrow: 1,
        marginLeft: 5,
        minHeight: 30,
        justifyContent: "center",
        backgroundColor: '#cff0',
        borderWidth: 1.3,
        borderColor: '#555',
        borderRadius: 5,
    },
    text: {
        marginLeft: 8,
        paddingVertical: 3,
        textAlign: 'left',
        fontSize: 18,
        fontWeight: '500',
        color: 'black',
    },
    receiver: {
        maxWidth: '80%',
        position: 'relative',
        alignSelf: 'flex-end',
        marginBottom: 20,
        marginRight: 15,
        padding: 15,
        backgroundColor: '#ECECEC',
        borderRadius: 20,
    },
    sender: {
        maxWidth: '80%',
        position: 'relative',
        alignSelf: 'flex-start',
        marginBottom: 20,
        marginRight: 15,
        padding: 15,
        backgroundColor: '#2B68E6',
        borderRadius: 20,
    },
    senderText: {
        marginBottom: 15,
        marginLeft: 10,
        fontWeight: '500',
        color: 'white',
    },
    recieverText: {
        marginLeft: 10,
        fontWeight: '500',
        color: 'black',
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: 'white',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 5, paddingVertical: 8, marginTop: 3,
        backgroundColor: "#bbb",
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        padding: 10,
        backgroundColor: '#fff',
        color: 'grey',
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 30,
    },
});

export default ChatScreen;