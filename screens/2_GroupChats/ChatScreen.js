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
    Dimensions,
} from 'react-native';
import {
    Alert,
    Avatar,
    Button,
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


// Imports for: Components
import MyView from '../../components/MyView';
import LineDivider from '../../components/LineDivider';
import { imageSelection } from '../5_Supplementary/GenerateProfileIcon';

// *************************************************************

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
    const [generalId, setgeneralId] = useState('');

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([])
    const [topicSelectionEnabled, setTopicSelection] = useState(true);
    const [topics, setTopics] = useState([]);
    const [messageMap, setMessageMap] = useState({});
    const [messageSenderUIDs, setMessageSenderUIDs] = useState([])
    const [messageSenders, setMessageSenders] = useState({})
    const [overlayIsVisible, setOverlay] = useState(false);
    const [alertExists, setAlertExists] = useState(false);
    const [alert, setAlert] = useState({});

    const toggleOverlay = () => {
        setOverlay(!overlayIsVisible);
    };

    const IconOption = ({ iconName, text, value, isLast, isSpacer, isDestructive, hide, selectFunction }) => (
        (!hide) ? (
            <MenuOption value={value} onSelect={selectFunction}
                style={{
                    borderBottomWidth: (isSpacer) ? 7 : ((!isLast) ? 1.5 : 0),
                    borderColor: "#dedede",
                    height: (isSpacer) ? 47 : 40,
                    paddingLeft: 15, paddingVertical: 12,
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

    const messageMapFunction = () => {
        let messageSenders = [];
        if (messages.length > 1) {
            messages.map((message, i, array) => {
                if (i > 0) {
                    setMessageMap(state => ({
                        ...state,
                        [message.id]: ({
                            currentMessage: {
                                id: message.id,
                                data: message.data,
                            },
                            previousMessage: {
                                id: array[i - 1].id,
                                data: array[i - 1].data,
                            },
                        })
                    })
                    );
                }
                if (messageSenders.indexOf(message.data.ownerUID) === -1) {
                    messageSenders.push(message.data.ownerUID);
                }
            });
        }
        else if (messages.length == 1) { messageSenders.push(messages[0].data.ownerUID) }
        setMessageSenderUIDs([...messageSenders]);
        // console.log("messageSenderUIDs = "+JSON.stringify(messageSenderUIDs));
    }
    useEffect(() => {
        messageMapFunction();
        return () => {
            setMessageMap({});
        }
    }, [messages]);

    const messageSendersHelper = async () => {
        let senders = {};
        for (const uid of messageSenderUIDs) {
            await db.collection('users').doc(uid).get()
                .then((result) => {

                    senders[uid] = result.data();

                    // messageSendersHelper(i+1);
                    // return (result.data());
                });
        }
        setMessageSenders(senders);

        // if(i > messageSenderUIDs.length) {
        //     return;
        // }
        // else {
        //     const ref = db.collection('users').doc(messageSenderUIDs[i]);
        //     const doc = await ref.get()
        //     .then((result) => {
        //         const updated = {...messageSenders};
        //         updated[messageSenderUIDs[i]] = result.data();
        //         setMessageSenders({...updated});

        //         messageSendersHelper(i+1);
        //         // return (result.data());
        //     });
        // }

        // db.collection("users").doc(messageID).get()
        //     .then(snapshot => {
        //         snapshot.forEach(doc => {
        //             return doc.data();
        //         });
        //     })
        //     .catch(err => {
        //         console.log('Error getting documents', err);
        //     });

        // const snapshot = await db.collection("users").doc(messageID).get();
        // if (!snapshot.empty) {
        //     // console.log(snapshot.data());
        //     // setMessageSenders([...messageSenders, snapshot.data()]);
        //     return (snapshot.data());
        // }
        // else {
        //     return {};
        // }
    };
    // const resetMessageSenders = () => {
    //     let senders = {};
    //     let returnVal = null;
    //     messageSenderUIDs.forEach((senderUID) => {
    //         returnVal = messageSendersHelper(senderUID);
    //         if(returnVal != null){
    //             senders[senderUID] = returnVal;
    //         }
    //         // senders.push(messageSendersHelper(senderUID));
    //         // console.log(senderUID);
    //     })
    //     // setMessageSenders(senders);
    // };
    useEffect(() => {
        //resetMessageSenders();
        messageSendersHelper();
        // return () => {
        //     setMessageSenders([]);
        // }
    }, [messageSenderUIDs]);

    useEffect(() => {
        setOverlay(false);
    }, [route]);

    useEffect(() => {
        //{topics.map(({ id, data: { topicName } }) => (
        topics.forEach(({ id, data: { topicName } }) => {
            if (topicName == "General") {
                setgeneralId(id);
            }
        });
    }, [route]);

    useEffect(() => {
        const unsubscribe = db
            .collection("groups")
            .doc(groupId)
            .collection("topics")
            .onSnapshot((snapshot) =>
                setTopics(snapshot.docs.map((doc) =>
                ({
                    id: doc.id,
                    data: doc.data(),
                })))
            );

        return unsubscribe;
    }, []);

    const goBackward = () => navigation.navigate('GroupsTab');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: (topicName == "General") ? groupName : groupName + "   ➤   " + topicName,
            // title: groupName,
            headerStyle: '',
            headerTitleStyle: { color: 'black' },
            headerTintColor: 'black',
            headerLeft: () => (
                <View style={{ marginLeft: 12 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={goBackward}>
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
            ),
        });

        resetAlert();

    }, [navigation, messages]);

    const resetAlert = async () => {
        const snapshot = await db.collection('chats').doc(topicId).collection('banners')
            .orderBy('timestamp', 'desc').limit(1).get();
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
            }
        }
    };

    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(topicId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) =>
                setMessages(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                ));
        return unsubscribe;
    }, [route]);

    const sendMessage = () => {
        Keyboard.dismiss();

        db.collection('chats').doc(topicId).collection('messages').add({
            editedTime: null,
            membersWhoReacted: [],
            message: input,
            ownerUID: auth.currentUser.uid,
            phoneNumber: auth.currentUser.phoneNumber,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(), // adapts to server's timestamp and adapts to regions
        }); // id passed in when we entered the chatroom

        setInput(''); // clears messaging box
    };

    const toggleTopicSelection = () => {
        setTopicSelection(!topicSelectionEnabled);
    };

    const enterTopic = (id, name) => {
        if (name != "General") {
            navigation.push("Chat", { topicId: id, topicName: name, groupId, groupName, groupOwner, color });
        }
        toggleTopicSelection();
    };

    const navigateTo = (place) => {
        if (place == "Settings" || place == "Members" || place == "Invite") {
            if (topicName == "General") {
                navigation.push("Group" + place, { topicId, topicName, groupId, groupName, groupOwner, color });
            }
            else {
                navigation.push("Topic" + place, { topicId, topicName, groupId, groupName, groupOwner, color });
            }
        }
        else {
            navigation.push(place, { topicId, topicName, groupId, groupName, groupOwner, color });
        }
        setOverlay(false);
    };

    const viewBanner = (bannerId, bannerData) => {
        navigation.push("ViewBanner", { topicId, topicName, groupId, groupName, groupOwner, bannerId, bannerData, color });
    };

    const dismissBanner = () => {
        console.log("dismiss");
        db.collection('chats').doc(topicId).collection('banners').doc(alert.id).update({
            viewedBy: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid),
        })
            .then(() => {
                console.log("Document successfully updated!");
                setAlertExists(false);
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    };

    const getString = (uid) => {
        if (messageSenders != undefined && uid != undefined && messageSenders[uid.toString()] != undefined) {
            return (messageSenders[uid.toString()].firstName + " " + messageSenders[uid.toString()].lastName);
        }
        else return "";
    }
    const getPfp = (uid) => {
        if (messageSenders != undefined && uid != undefined && messageSenders[uid.toString()] != undefined) {
            return (messageSenders[uid.toString()].pfp);
        }
        else return "";
    }

    const addPinFromMessage = (message, messageId) => {
        navigation.push("AddPin", { topicId, topicName, groupId, groupName, message, messageId, color });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style='dark' />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        {/* Overlay */}
                        <Overlay isVisible={overlayIsVisible} onBackdropPress={toggleOverlay}
                            overlayStyle={{
                                width: screenWidth - 25,
                                borderRadius: 7,
                                justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                            }}>
                            {/* Top section of overlay */}
                            <View style={{
                                width: "100%", marginTop: 5,
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
                                    <View style={{
                                        width: 75, height: 75,
                                        justifyContent: "center", alignItems: "center",
                                        borderRadius: 10, borderWidth: 2,
                                        backgroundColor: "#cff",
                                    }}>
                                        <Text style={{
                                            fontSize: 30,
                                            fontWeight: '500',
                                            color: 'black',
                                            textAlign: "center",
                                            paddingHorizontal: 0,
                                        }}>
                                            😎
                                        </Text>
                                    </View>
                                    {/* Left section aligned next to Group Icon */}
                                    <View style={{
                                        minWidth: 100,
                                        marginLeft: 10,
                                        flex: 1, flexGrow: 1, borderRadius: 30,
                                        justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "col",
                                        backgroundColor: "#0cc0",
                                    }}>
                                        {/* Group Name */}
                                        <Text style={{
                                            fontSize: 24,
                                            fontWeight: '700',
                                            color: 'black',
                                            textAlign: "left",
                                            paddingHorizontal: 0,
                                        }}>
                                            {groupName}
                                        </Text>
                                        {/* sub text */}
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: '500',
                                            color: 'black',
                                            textAlign: "left",
                                            paddingHorizontal: 0,
                                        }}>
                                            {(topicName == "General")
                                                ? "Group"
                                                : "Topic: " + topicName}
                                        </Text>
                                    </View>
                                </View>
                                {/* Top Left X -close button */}
                                <TouchableOpacity activeOpacity={0.7} onPress={toggleOverlay}
                                    style={{
                                        width: 45, height: 45,
                                        borderWidth: 2, borderColor: "#000", borderRadius: 5,
                                        justifyContent: "center",
                                        backgroundColor: "#ddd",
                                    }}>
                                    <Icon
                                        style={styles.icon}
                                        name='close'
                                        type='antdesign'
                                        color='#c00'
                                    />
                                </TouchableOpacity>
                            </View>
                            {/* Group Details outer view */}
                            <View style={{
                                width: "100%", height: 50,
                                marginTop: 15,
                                backgroundColor: "#0cf0",
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
                                                    groupId: groupId,
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
                                        minWidth: 100,
                                        backgroundColor: "#ccc0",
                                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                                    }}>
                                    <View style={styles.groupDetailsIconBubble}>
                                        <Icon
                                            style={styles.icon}
                                            name='settings'
                                            type='materialicons'
                                            color='#000'
                                        />
                                    </View>
                                    <View style={styles.groupDetailsTextBubble}>
                                        <Text style={styles.groupDetailsText}>
                                            {"Settings"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {/* Members */}
                                <TouchableOpacity activeOpacity={0.7} onPress={() => { navigateTo("Members") }}
                                    style={{
                                        minWidth: 100,
                                        backgroundColor: "#ccc0",
                                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                                    }}>
                                    <View style={styles.groupDetailsIconBubble}>
                                        <Icon
                                            style={styles.icon}
                                            name='people-alt'
                                            type='materialicons'
                                            color='#000'
                                        />
                                    </View>
                                    <View style={styles.groupDetailsTextBubble}>
                                        <Text style={styles.groupDetailsText}>
                                            {"99 Members"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {/* Invite! */}
                                <TouchableOpacity activeOpacity={0.7} onPress={() => { navigateTo("Invite") }}
                                    style={{
                                        minWidth: 100,
                                        backgroundColor: "#ccc0",
                                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                                    }}>
                                    <View style={styles.groupDetailsIconBubble}>
                                        <Icon
                                            style={styles.icon}
                                            name='mail'
                                            type='materialicons'
                                            color='#000'
                                        />
                                    </View>
                                    <View style={styles.groupDetailsTextBubble}>
                                        <Text style={styles.groupDetailsText}>
                                            {"Invite!"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <LineDivider />
                            {/* Chat Features Text View (for positioning) */}
                            <View style={{
                                width: "100%",
                                marginTop: 20,
                                backgroundColor: "#c0f0",
                                justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            }}>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: '600',
                                    color: 'black',
                                    textAlign: "left",
                                    paddingHorizontal: 0,
                                }}>
                                    {"Chat Features"}
                                </Text>
                            </View>
                            {/* Feature Icons 1 */}
                            <View style={{
                                width: 350,
                                marginTop: 10,
                                backgroundColor: "#0cf0",
                                justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                            }}>
                                {/* Pins */}
                                <TouchableOpacity activeOpacity={0.7} onPress={() => { navigateTo("Pins") }}
                                    style={styles.featuresOuterView}>
                                    <View style={styles.featuresIconView}>
                                        <Icon
                                            style={styles.icon}
                                            name='pin'
                                            type='entypo'
                                            color='#000'
                                        />
                                    </View>
                                    <Text style={styles.featuresText}>
                                        Pins (5)
                                    </Text>
                                </TouchableOpacity>

                                {/* Polls */}
                                <View style={styles.featuresOuterView}>
                                    <View style={styles.featuresIconView}>
                                        <Icon
                                            style={styles.icon}
                                            name='bar-graph'
                                            type='entypo'
                                            color='#000'
                                        />
                                    </View>
                                    <Text style={styles.featuresText}>
                                        Polls (5)
                                    </Text>
                                </View>

                                {/* Lists */}
                                <View style={styles.featuresOuterView}>
                                    <View style={styles.featuresIconView}>
                                        <Ionicons name="list" size={30} color="black" />
                                    </View>
                                    <Text style={styles.featuresText}>
                                        Lists (13)
                                    </Text>
                                </View>
                            </View>
                            {/* Feature Icons 2 */}
                            <View style={{
                                width: 350,
                                marginTop: 10, marginBottom: 5,
                                backgroundColor: "#0cf0",
                                justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                            }}>
                                {/* Events */}
                                <View style={styles.featuresOuterView}>
                                    <View style={styles.featuresIconView}>
                                        <Icon
                                            style={styles.icon}
                                            name='calendar'
                                            type='entypo'
                                            color='#000'
                                        />
                                    </View>
                                    <Text style={styles.featuresText}>
                                        Events (0)
                                    </Text>
                                </View>

                                {/* Banners */}
                                <TouchableOpacity activeOpacity={0.7} onPress={() => navigateTo("Banners")}
                                    style={styles.featuresOuterView}>
                                    <View style={styles.featuresIconView}>
                                        <Entypo name="megaphone" size={30} color="black" />
                                    </View>
                                    <Text style={styles.featuresText}>
                                        Alerts (5)
                                    </Text>
                                </TouchableOpacity>

                                {/* Images */}
                                <View style={styles.featuresOuterView}>
                                    <View style={styles.featuresIconView}>
                                        <Icon
                                            style={styles.icon}
                                            name='image'
                                            type='entypo'
                                            color='#000'
                                        />
                                    </View>
                                    <Text style={styles.featuresText}>
                                        Images (71)
                                    </Text>
                                </View>
                            </View>
                        </Overlay>

                        {/* Topic Navigator */}
                        <MyView hide={topicName != "General"}
                            style={styles.topicNavigator}>
                            <View style={styles.topicSpacer}>
                                <Text style={styles.topicLabel}>
                                    {"Topic"}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={toggleTopicSelection}
                                style={styles.topicButton}
                                activeOpacity={0.2}>
                                <Text style={styles.topicText}>
                                    {topicName}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.topicSpacer}>
                                <TouchableOpacity activeOpacity={0.2}
                                    // onPress={() => {console.log("messageMap = "+JSON.stringify(messageSenders))}}//navigation.push("AddTopic", { groupId })}
                                    onPress={() => {
                                        console.log(topicId, topicName, groupId, groupName, groupOwner);
                                        console.log(topics)
                                        navigation.push("CreateTopic", { topicId, topicName, groupId, groupName, groupOwner })
                                    }}
                                    style={{
                                        width: 35, height: 35, backgroundColor: "#ddd0",
                                        borderWidth: 2, borderColor: "#000", borderRadius: 5,
                                        marginRight: 5,
                                        justifyContent: "center"
                                    }}>
                                    <Icon
                                        style={styles.icon}
                                        name='plus'
                                        type='antdesign'
                                        color='#080'
                                    />
                                </TouchableOpacity>
                            </View>
                        </MyView>

                        {/* Topic selection dropdown */}
                        <MyView hide={topicSelectionEnabled}
                            style={{
                                width: "100%",
                                marginTop: -2,
                                borderColor: "#000",
                                borderBottomWidth: 2,
                                flex: 0, alignItems: "center",
                            }} >
                            <View style={{
                                width: "100%", height: 50,
                                flex: 0, justifyContent: "space-between", alignItems: "center", flexDirection: "row"
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: 'black',
                                    textAlign: "center",
                                    paddingHorizontal: 10,
                                }}>
                                    Navigate to Topic
                                </Text>
                                <TouchableOpacity onPress={toggleTopicSelection} activeOpacity={0.2}
                                    style={{
                                        width: 35, height: 35, backgroundColor: "#ddd",
                                        borderWidth: 2, borderColor: "#000", borderRadius: 5,
                                        marginRight: 5,
                                        justifyContent: "center"
                                    }}>
                                    <Icon
                                        style={styles.icon}
                                        name='close'
                                        type='antdesign'
                                        color='#c00'
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                justifyContent: "flex-start", alignItems: "center", flex: 0,
                                marginBottom: 10, backgroundColor: "#ccf0", width: 200
                            }}>
                                <TouchableOpacity onPress={() => enterTopic(generalId, "General")} activeOpacity={0.2}
                                    style={{
                                        minWidth: 100, height: 35, backgroundColor: "#aee",
                                        borderWidth: 2, borderColor: "#000", borderRadius: 5,
                                        justifyContent: "center",
                                    }}>
                                    <Text style={styles.topicText}>
                                        General
                                    </Text>
                                </TouchableOpacity>
                                <View style={{ height: 30, width: 10, backgroundColor: "#6660" }} />
                                <MyView hide={topics.length <= 1}
                                    style={{
                                        minWidth: 100, maxHeight: 100,
                                        backgroundColor: "#aee",
                                        borderWidth: 2, borderColor: "#000", borderRadius: 5,
                                        padding: 0, alignItems: "center", justifyContent: "flex-start", flexDirection: "column",
                                    }}>
                                    <ScrollView persistentScrollbar={true}
                                        style={{
                                            maxHeight: `${topics.length - 1}` * 35, minWidth: 100,
                                        }}>
                                        {topics.map(({ id, data: { topicName } }) => (
                                            <MyView hide={topicName == "General"} key={id}
                                                style={{
                                                    height: 37, width: "100%", marginVertical: -0.5,
                                                }}>
                                                <TouchableOpacity onPress={() => enterTopic(id, topicName)} activeOpacity={0.2}
                                                    style={{
                                                        width: "100%", height: "100%",
                                                        justifyContent: "center", alignItems: "center", backgroundColor: "#aef0",
                                                        borderColor: "#000", borderBottomWidth: 1, borderTopWidth: 1
                                                    }}>
                                                    <Text style={styles.topicText}>
                                                        {topicName}
                                                    </Text>
                                                </TouchableOpacity>
                                            </MyView>
                                        ))}
                                    </ScrollView>
                                </MyView>
                            </View>
                        </MyView>
                        {/* Banner (if applicable) */}
                        {/* Calendar for later <FontAwesome5 name="calendar-alt" size={24} color="black" /> */}
                        <MyView hide={!alertExists}
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
                                    <Fontisto name="close-a" size={20} color="black" />
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
                                    {(alert != null && alert.data != undefined) ? (alert.data.description) : ("")}
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

                        {/* Messages */}
                        <ScrollView contentContainerStyle={{ paddingTop: 0 }}>
                            {messages.map(({ id, data }) => (

                                messageMap[id] != undefined && messageMap[id].previousMessage != undefined
                                    && messageMap[id].previousMessage.data != undefined
                                    && data.phoneNumber == messageMap[id].previousMessage.data.phoneNumber ? (
                                    //message without profile picture
                                    <View key={id} style={{
                                        flex: 1,
                                        width: "100%",
                                        alignItems: 'flex-start',
                                        flexDirection: "row",
                                        paddingTop: 7,
                                        paddingHorizontal: 10,
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

                                            <Menu>
                                                <MenuTrigger text='' triggerOnLongPress={true} customStyles={triggerStyles}>
                                                    <View style={{
                                                        minHeight: 30, marginLeft: 5,
                                                        flex: 1, flexGrow: 1, justifyContent: "center",
                                                        backgroundColor: ((data.ownerUID == auth.currentUser.uid) ? '#EFEAE2' : '#F8F8F8'),
                                                        borderWidth: 1.3, borderColor: '#9D9D9D', borderRadius: 5,
                                                    }}>
                                                        <Text style={styles.text}>
                                                            {data.message}
                                                        </Text>
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
                                                    <IconOption value={1} iconName='heart' text='Like' isSpacer={data.ownerUID == auth.currentUser.uid} isLast={data.ownerUID != auth.currentUser.uid} />
                                                    <IconOption value={2} iconName='bookmark' text='Pin Message' hide={data.ownerUID != auth.currentUser.uid}
                                                        selectFunction={() => { addPinFromMessage(data, id) }} />
                                                    <IconOption value={3} iconName='arrow-right' text='Make into Topic' hide={data.ownerUID != auth.currentUser.uid} />
                                                    <IconOption value={4} isSpacer={true} iconName='alert-triangle' text='Make into Alert' hide={data.ownerUID != auth.currentUser.uid} />
                                                    <IconOption value={5} iconName='edit' text='Edit' hide={data.ownerUID != auth.currentUser.uid} />
                                                    <IconOption value={6} isLast={true} isDestructive={true} iconName='trash' text='Delete' hide={data.ownerUID != auth.currentUser.uid} />
                                                </MenuOptions>
                                            </Menu>

                                        </View>
                                    </View>
                                ) : (
                                    //Message with profile picture and display name
                                    <View key={id} style={styles.message}>
                                        <View style={styles.userContainer}>
                                            <Image source={imageSelection(getPfp(data.ownerUID))}
                                                style={{
                                                    width: "100%", height: "100%",
                                                    borderRadius: 7, borderWidth: 1, borderColor: "#777",
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
                                                    color: "black",
                                                }}>
                                                    {(data.timestamp != null) ? (data.timestamp.toDate().toLocaleTimeString("en-US", {
                                                        hour: "numeric", minute: "2-digit"
                                                    })) : ("")}
                                                </Text>
                                            </View>


                                            <Menu>
                                                <MenuTrigger text='' triggerOnLongPress={true} customStyles={triggerStyles}>
                                                    <View style={{
                                                        minHeight: 30, marginLeft: 5,
                                                        flex: 1, flexGrow: 1, justifyContent: "center",
                                                        backgroundColor: ((data.ownerUID == auth.currentUser.uid) ? '#EFEAE2' : '#F8F8F8'),
                                                        borderWidth: 1.3, borderColor: '#9D9D9D', borderRadius: 5,
                                                    }}>
                                                        <Text style={styles.text}>
                                                            {data.message}
                                                        </Text>
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
                                                    <IconOption value={1} iconName='heart' text='Like' isSpacer={data.ownerUID == auth.currentUser.uid} isLast={data.ownerUID != auth.currentUser.uid} />
                                                    <IconOption value={2} iconName='bookmark' text='Pin Message' hide={data.ownerUID != auth.currentUser.uid}
                                                        selectFunction={() => { addPinFromMessage(data, id) }} />
                                                    <IconOption value={3} iconName='arrow-right' text='Make into Topic' hide={data.ownerUID != auth.currentUser.uid} />
                                                    <IconOption value={4} isSpacer={true} iconName='alert-triangle' text='Make into Alert' hide={data.ownerUID != auth.currentUser.uid} />
                                                    <IconOption value={5} iconName='edit' text='Edit' hide={data.ownerUID != auth.currentUser.uid} />
                                                    <IconOption value={6} isLast={true} isDestructive={true} iconName='trash' text='Delete' hide={data.ownerUID != auth.currentUser.uid} />
                                                </MenuOptions>
                                            </Menu>


                                        </View>
                                    </View>
                                )
                            ))}
                        </ScrollView>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <TextInput
                                value={input}
                                onChangeText={(text) => setInput(text)}
                                onSubmitEditing={sendMessage}
                                placeholder='Send a message'
                                style={styles.textInput}
                            />
                            <TouchableOpacity
                                onPress={sendMessage}
                                activeOpacity={0.5}
                            >
                                <Icon
                                    name='send'
                                    type='ionicon'
                                    color='#2B68E6'
                                />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    featuresOuterView: {
        minWidth: 100,
        paddingHorizontal: 8, paddingVertical: 7,
        borderRadius: 10, borderWidth: 2,
        backgroundColor: "#ffc",
        justifyContent: "center", alignItems: "center", flexDirection: "column",
    },
    featuresIconView: {
        width: 55, height: 55,
        borderRadius: 10, borderWidth: 2,
        backgroundColor: "#cff",
        justifyContent: "center", alignItems: "center",
    },
    featuresText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
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
        height: 55,
        backgroundColor: "#6660",
        flexDirection: 'row',
        alignItems: 'center',

        borderBottomColor: "#000",
        borderBottomWidth: 2,
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
        paddingTop: 20,
        paddingHorizontal: 10,
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
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        padding: 10,
        backgroundColor: '#ECECEC',
        color: 'grey',
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 30,
    },
});

export default ChatScreen;