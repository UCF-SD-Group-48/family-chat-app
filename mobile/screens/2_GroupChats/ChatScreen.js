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

// Imports for: Expo
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
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
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";


// Imports for: Components
import MyView from '../../components/MyView';
import LineDivider from '../../components/LineDivider';

// *************************************************************

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const overlayOffset = -screenHeight + 350 + Constants.statusBarHeight * 2 + 44 * 2 + 55 * 2 - 2;

// Show the information (messages, users, etc.) for the group chat.
const ChatScreen = ({ navigation, route }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([])
    const [topicSelectionEnabled, setTopicSelection] = useState(true);
    const [topics, setTopics] = useState([]);
    const groupId = route.params.groupId;
    const [generalId, setgeneralId] = useState('');
    const [messageMap, setMessageMap] = useState({});
    const [invite, setInvite] = useState();
    const [overlayIsVisible, setOverlay] = useState(false);

    const toggleOverlay = () => {
        setOverlay(!overlayIsVisible);
    };

    const messageMapFunction = () => {
        if (messages.length > 1) {
            messages.map((message, i, array) => {
                if (i > 0) {
                    setMessageMap(state => ({
                        ...state,
                        [message.id]: ({
                            currentId: message.id,
                            currentPhoneNumber: message.data.phoneNumber,
                            currentMessage: message.data.message,
                            previousId: array[i - 1].id,
                            previousPhoneNumber: array[i - 1].data.phoneNumber,
                            previousMessage: array[i - 1].data.message,
                        })
                    })
                    );
                }
            });
        }
    }
    useEffect(() => {
        messageMapFunction();
        return () => {
            setMessageMap({});
        }
    }, [messages]);

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
        const unsubscribe = db.collection("groups").doc(route.params.groupId).collection("topics").onSnapshot((snapshot) =>
            setTopics(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        );
        return unsubscribe;
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chat',
            headerBackTitleVisible: false,
            headerTitleAlign: 'left',
            headerTitle: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Avatar
                        rounded
                        source={{
                            uri: messages[0]?.data?.photoURL || 'http://www.cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png',
                        }}
                    />
                    <Text style={{ color: 'white', marginLeft: 10, fontWeight: '700' }}>
                        {route.params.chatName}
                    </Text>

                    <Button title="Invite user" />

                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={navigation.goBack}
                >
                    <Icon
                        name='arrowleft'
                        type='antdesign'
                        color='white'
                    />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 80,
                        marginRight: 20,
                    }}
                >
                    {/* <TouchableOpacity>
                        <Icon
                            name='video-camera'
                            type='font-awesome'
                            color='white'
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon
                            name='call'
                            type='ionicon'
                            color='white'
                        />
                    </TouchableOpacity> */}
                </View>
            ),
        });
    }, [navigation, messages]);

    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(route.params.id)
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

        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(), // adapts to server's timestamp and adapts to regions
            message: input,
            displayName: auth.currentUser.displayName,
            phoneNumber: auth.currentUser.phoneNumber,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
        }); // id passed in when we entered the chatroom

        setInput(''); // clears messaging box
    };

    const toggleTopicSelection = () => {
        setTopicSelection(!topicSelectionEnabled);
    };

    const enterTopic = (id, topicName) => {
        navigation.navigate("Chat", { id, topicName, groupId, groupName: route.params.groupName });
        toggleTopicSelection();
    };

    const inviteUser = async () => {
		const check = await db.collection('users').where('phoneNumber', '==', invite).get()

            if (!check.empty) {
                const snapshot = check.docs[0];
                const data = snapshot.data();
       
                db.collection("users").doc(snapshot.id).update({
                    // groups: arrayUnion(groupId) // adds the uid's only
                    // groups: arrayUnion(db.collection("groups").doc(groupId)) // by reference
                    pendingInvite: arrayUnion(groupId) // by pendingInvite

                })
                
                } else {
                    alert("Not a valid user")
                }
       

		// if no: alert message
		// else yes: 
		// retrieve userID
		// add the user's ID that corresponds to inputted number to groups.members array
		// & add group reference to the users.groups for the user that is invited
		// Redirect to Groups Page?

		// Accept or Reject for invitee



	}

    const gotoPins = () => {
        navigation.navigate("Pins", { id: route.params.id, topicName: route.params.topicName, groupId, groupName: route.params.groupName });
        setOverlay(false);
        setTopicSelection(false);
    };

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
                        <View style={styles.topicNavigator}>
                        {/* <Input
                                    placeholder="InviteUser"
                                    value={invite}
                                    onSubmitEditing={inviteUser}
                                    onChangeText={(invite) => setInvite(invite)}
                                /> */}
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
                                    {route.params.topicName}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.topicSpacer}>
                                <TouchableOpacity activeOpacity={0.2}
                                    onPress={() => navigation.navigate("AddTopic", { groupId })}
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
                                <TouchableOpacity activeOpacity={0.2}
                                    onPress={toggleOverlay}
                                    style={{
                                        width: 45, height: 35, backgroundColor: "#ddd0",
                                        borderWidth: 2, borderColor: "#000", borderRadius: 5,
                                        marginRight: 5, marginLeft: 5,
                                        justifyContent: "center"
                                    }}>
                                    <Icon
                                        style={styles.icon}
                                        name='dots-three-horizontal'
                                        type='entypo'
                                        color='#333'
                                    />
                                </TouchableOpacity>
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
                                                    {route.params.groupName}
                                                </Text>
                                                {/* sub text */}
                                                <Text style={{
                                                    fontSize: 16,
                                                    fontWeight: '500',
                                                    color: 'black',
                                                    textAlign: "left",
                                                    paddingHorizontal: 0,
                                                }}>
                                                    {"Topic ",route.params.topicName}
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
                                        <View style={{
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
                                        </View>
                                        {/* Members */}
                                        <View style={{
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
                                        </View>
                                        {/* Invite! */}
                                        <View style={{
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
                                        </View>
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
                                        <TouchableOpacity activeOpacity={0.7} onPress={gotoPins}
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
                                                <Icon
                                                    style={styles.icon}
                                                    name='nav-icon-list-a'
                                                    type='fontisto'
                                                    color='#000'
                                                />
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
                                        <View style={styles.featuresOuterView}>
                                            <View style={styles.featuresIconView}>
                                                <Icon
                                                    style={styles.icon}
                                                    name='flag'
                                                    type='ionicons'
                                                    color='#000'
                                                />
                                            </View>
                                            <Text style={styles.featuresText}>
                                                Banners (5)
                                            </Text>
                                        </View>

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
                            </View>
                        </View>

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
                                            maxHeight: `${topics.length - 1}`*35, minWidth: 100,
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

                        <ScrollView contentContainerStyle={{ paddingTop: 0 }}>
                            {messages.map(({ id, data }) => (

                                messageMap[id] !== undefined
                                    && data.phoneNumber == messageMap[id].previousPhoneNumber ? (
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
                                            <View style={styles.textOutline}>
                                                <Text style={styles.text}>
                                                    {data.message}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.message}>
                                        <View
                                            style={styles.userContainer} />
                                        <View style={styles.textContainer}>
                                            <Text style={styles.userName}>
                                                {data.phoneNumber || "Display Name"}
                                            </Text>
                                            <View style={styles.textOutline}>
                                                <Text style={styles.text}>
                                                    {data.message}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            ))}
                        </ScrollView>
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

        backgroundColor: '#0cc',
        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: '#0cc0',
    },
    userName: {
        marginLeft: 5,
        height: 20,
        textAlign: 'left',
        fontSize: 12,
        fontWeight: '600',
        color: 'black',
    },
    textOutline: {
        flex: 1,
        flexGrow: 1,
        marginLeft: 5,
        minHeight: 30,
        justifyContent: "center",
        backgroundColor: '#cff0',
        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 5,
    },
    text: {
        marginLeft: 10,
        paddingVertical: 5,
        textAlign: 'left',
        fontSize: 16,
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