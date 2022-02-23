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

// Imports for: Components
import MyView from '../../components/MyView';

// *************************************************************

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const overlayOffset = -screenHeight + 350 + Constants.statusBarHeight*2 + 44*2 + 55*2 - 2;

// Show the information (messages, users, etc.) for the group chat.
const ChatScreen = ({ navigation, route }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([])
    const [topicSelectionEnabled, setTopicSelection] = useState(true);
    const [topics, setTopics] = useState([]);
    const groupId = route.params.groupId;


    useEffect(() => {
		const unsubscribe = db.collection("groups").doc(String(route.params.groupId)).collection("topics").onSnapshot((snapshot) =>
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
            .orderBy('timestamp', 'desc')
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
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
        }); // id passed in when we entered the chatroom

        setInput(''); // clears messaging box
    };

    const toggleTopicSelection = () => {
        setTopicSelection(!topicSelectionEnabled);
    };

    const enterTopic = (id, topicName) => {
        navigation.navigate("Chat", { id, topicName, groupId });
        toggleTopicSelection();
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

                            </View>
                        </View>

                        <MyView hide={topicSelectionEnabled}
                            style={{width: "100%", height: 225,
                                marginTop: -2,
                                borderColor: "#000",
                                borderBottomWidth: 2,
                                flex: 0, alignItems: "center",}} >
                            <View style={{width: "100%", height: 50,
                                    flex: 0, justifyContent: "space-between", alignItems: "center", flexDirection: "row"}}>
                                <Text style={{fontSize: 16,
                                        fontWeight: '500',
                                        color: 'black',
                                        textAlign: "center",
                                        paddingHorizontal: 10,}}>
                                    Navigate to Topic
                                </Text>
                                <TouchableOpacity onPress={toggleTopicSelection} activeOpacity={0.2}
                                    style={{width: 35, height: 35, backgroundColor: "#ddd",
                                        borderWidth: 2, borderColor: "#000", borderRadius: 5,
                                        marginRight: 5,
                                        justifyContent: "center"}}>
                                    <Icon
                                        style={ styles.icon}
                                        name='close'
                                        type='antdesign'
                                        color='#c00'
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{justifyContent: "flex-start", alignItems: "center", flex: 0,
                                    marginBottom: 10, backgroundColor: "#ccf0", width: 200}}>
                                <TouchableOpacity onPress={toggleTopicSelection} activeOpacity={0.2}
                                    style={{minWidth: 100, height: 35, backgroundColor: "#aee",
                                        borderWidth: 2, borderColor: "#000", borderRadius: 5,
                                        justifyContent: "center",}}>
                                    <Text style={styles.topicText}>
                                        General
                                    </Text>
                                </TouchableOpacity>
                                <View style={{height: 30, width: 10, backgroundColor: "#6660"}} />
                                <ScrollView persistentScrollbar={true}
                                    style={{minWidth: 100, maxHeight: 100, backgroundColor: "#aee",
                                        borderWidth: 2, borderColor: "#000", borderRadius: 5,
                                        padding: 0,}}>
                                    {topics.map(({ id, data: { topicName } }) => (
                                        <TouchableOpacity onPress={() => enterTopic(id, topicName)} activeOpacity={0.2}
                                            style={{height: 35, width: "100%", marginVertical: -0.5,
                                                justifyContent: "center", alignItems: "center", backgroundColor: "#aef0",
                                                borderColor: "#000", borderBottomWidth: 1, borderTopWidth: 1}}>
                                            <Text style={styles.topicText}>
                                                {topicName}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </MyView>

                        <ScrollView contentContainerStyle={{ paddingTop: 0 }}>
                            {messages.map(({ id, data, array }) => (
                                // data.email === auth.currentUser.email ? (
                            <View key={id} style={styles.message}>
                                <View style={styles.userContainer}/>
                                <View style={styles.textContainer}>
                                    <Text style={styles.userName}>
                                        {data.displayName || "Display Name"}
                                    </Text>
                                    <View style={styles.textOutline}>
                                        <Text style={styles.text}>
                                            {data.message}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                                // ) : (
                                //     <View
                                //         key={id}
                                //         style={styles.sender}
                                //     >
                                //         <Avatar
                                //             position='absolute'
                                //             rounded

                                //             // WEB
                                //             containerStyle={{
                                //                 position: 'absolute',
                                //                 bottom: -15,
                                //                 right: -5,
                                //             }}
                                //             bottom={-15}
                                //             right={-5}
                                //             size={30}
                                //             source={{ uri: data.photoURL }}
                                //         />
                                //         <Text style={styles.senderText}>
                                //             {data.message}
                                //         </Text>
                                //         <Text style={styles.senderName}>
                                //             {data.displayName}
                                //         </Text>
                                //     </View>
                                // )
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
        alignItems: "flex-end",
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