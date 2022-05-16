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
} from 'react-native';
import {
    Avatar,
    Button,
    Divider,
    Icon,
    Image,
    Input,
    Tooltip,
} from 'react-native-elements';
import { AntDesign, Feather, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";


// Imports for: Expo
import { StatusBar } from 'expo-status-bar';
import ImagePicker from 'expo-image-picker';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import MyView from '../../components/MyView';

// Imports for: Firebase
import {
    apps,
    auth,
    db,
    firebaseConfig
} from '../../firebase';
import firebase from 'firebase/compat/app';

// Imports for: Components

// *************************************************************


const Pins = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;
    const color = route.params.color;
    const coverImageNumber = route.params.coverImageNumber;

    const [pins, setPins] = useState([])

    const [messages, setMessages] = useState({});

    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(topicId)
            .collection('pins')
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) =>
                setPins(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                ));
        return unsubscribe;
    }, [route]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Pins",
            // headerRight: () => (
			// 	<View
			// 		style={{
			// 			flexDirection: "row",
			// 			justifyContent: "space-between",
			// 			marginRight: 10,
			// 		}}>
			// 		<TouchableOpacity
			// 			activeOpacity={0.5}
			// 			onPress={() => {console.log("info blurb here")}}
			// 		>
			// 			<Ionicons name="information-circle" size={28} color="black" />
			// 		</TouchableOpacity>
			// 	</View>
			// ),
            headerLeft: () => (
                <View style={{ marginLeft: 12 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {navigation.goBack();}}>
                        <Icon
                            name='arrow-back'
                            type='ionicon'
                            color='#363732'
                            size={28}
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    
    useEffect(() => {
        getMessages();
    }, [pins]);

    const getMessages = async () => {
        let mess = {};
        for (const pin of pins) {
            await db.collection("chats").doc(topicId).collection("messages").doc(pin.data.originalMessageUID).get()
                .then((result) => {
                    mess[pin.data.originalMessageUID] = result.data();
                });
        }
        setMessages(mess);
	};

    const getMessageString = (uid) => {
        if(messages != undefined && uid != undefined && messages[uid.toString()] != undefined) {
            return (messages[uid.toString()].message);
        }
        else return "";
    };

    const getMessage = (uid) => {
        if(messages != undefined && uid != undefined && messages[uid.toString()] != undefined) {
            return (messages[uid.toString()]);
        }
        else return null;
    };

    const viewPin = (pinId, pinData, message) => {
        navigation.push("ViewPin", { topicId, topicName, groupId, groupName, groupOwner, color, coverImageNumber, pinId, pinData, message });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{
                    width: "100%",
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    flex: 0, flexGrow: 1, borderWidth: 0, paddingBottom: 75,
                }}>

                {/* History Text */}
                <View style={{
                    marginTop: 30, width: "100%",
                    flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                }}>
                    <Divider width={2} color={"#777"}
                        style={{
                            minWidth: "10%",
                            flexGrow: 1, flex: 1,
                        }}/>
                    <Text style={{
                        textAlign: "center",
                        fontSize: 22,
                        fontWeight: '700',
                        color: 'black', marginHorizontal: 10
                    }}>
                        {"History: Pinned Messages ("+pins.length+")"}
                    </Text>
                    <Divider width={2} color={"#777"}
                        style={{
                            minWidth: "10%",
                            flexGrow: 1, flex: 1,
                        }}/>
                </View>

                {/* All Pins */}
                <View style={{
                    marginTop: 30, marginBottom: 0, width: "100%",
                    flexDirection: "column", flexShrink: 1,
                    justifyContent: "flex-start", alignItems: "center",
                }}>
                    {/* Prompt for no Alerts (when Pin.length == 0) */}
                    <MyView hide={pins.length != 0}
                        style={{
                            width: "100%", minHeight: 300, paddingTop: 10,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                        }}>
                        <Entypo name="pin" size={65} color="#555" />
                        <Text style={{
                                    fontSize: 20,
                                    fontWeight: '800',
                                    textAlign: "center",
                                    marginTop: 15,
                                    color: "#555",
                            }}>
                                {"No pins found."}
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
                                {"Looks like there haven't been any pinned messages within this Topic."+
                                    "\nNavigate back to the chat, and LongPress a worthy message to create the first pin."}
                        </Text>
                        <MaterialCommunityIcons name="dots-horizontal" size={65} color="#999" />
                    </MyView>
                    <View style={{ paddingTop: 0, width: "100%", paddingLeft: 20, }}>
                        {pins.map(({ id, data }) => (
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {viewPin(id, data, getMessage(data.originalMessageUID))}} key={id}
                                style={[
                                    {
                                        width: "100%", marginTop: 1,
                                        backgroundColor: "#fff", borderWidth: 0,
                                        flex: 0, flexGrow: 0, flexDirection: "row",
                                        justifyContent: "flex-start", alignItems: "center",
                                        borderRadius: 1,
                                    },
                                    {
                                        shadowColor: "#000", shadowOffset: {width: 0, height: 1},
                                        shadowRadius: 0, shadowOpacity: 0.5,
                                    }
                                ]} >
                                {/* Left Content */}
                                <View style={{
                                    minWidth: "10%",
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                    flex: 1, flexGrow: 1, flexDirection: "row",
                                    justifyContent: "flex-start", alignItems: "center",
                                }}>
                                    <View style={{
                                        width: "100%", height: 65,
                                        paddingHorizontal: 15, paddingVertical: 10,
                                        backgroundColor: "#0000", borderRadius: 7, borderWidth: 0,
                                        flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start",
                                    }}>
                                        <View style={{
                                            width: "100%",
                                            borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                            flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                        }}>
                                            <Entypo name="pin" size={18} color="#777" />
                                            <Text numberOfLines={1}
                                                    style={{
                                                        fontSize: 18,
                                                        fontWeight: '600',
                                                        textAlign: "left",
                                                        marginLeft: 15, marginRight: 10,
                                                        color: "#777",
                                                        flex: 1,
                                                }}>
                                                    {data.title}
                                            </Text>
                                        </View>
                                        <View style={{
                                            width: "100%",
                                            borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                            flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                        }}>
                                            <MaterialIcons name="text-snippet" size={18} color="#777" />
                                            <Text numberOfLines={1}
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: '400',
                                                    textAlign: "left",
                                                    marginLeft: 15, marginRight: 10,
                                                    color: "#777",
                                                    flex: 1,
                                            }}>
                                                <Text style={{fontWeight: '600'}}>"</Text>
                                                { getMessageString(data.originalMessageUID) || ""}
                                                <Text style={{fontWeight: '600'}}>"</Text>
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Right Chevron */}
                                <View style={{
                                    minWidth: 60,
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#afc0",
                                    paddingVertical: 0, paddingHorizontal: 15,
                                    flex: 1, flexGrow: 0, justifyContent: "center", alignItems: "center",
                                }}>
                                    <Entypo name="chevron-right" size={34} color="#333" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%", height: "100%",
        paddingTop: 20,
        paddingHorizontal: 0,
        alignItems: 'center',
        backgroundColor: "#EFEAE2",
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
    titleText: {
        marginLeft: 10,
        paddingVertical: 0,
        textAlign: 'left',
        fontSize: 20,
        fontWeight: '600',
        color: 'black',
    },
})

export default Pins;
