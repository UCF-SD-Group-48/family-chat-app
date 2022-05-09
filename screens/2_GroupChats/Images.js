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
    Avatar,
    Button,
    Divider,
    Icon,
    Image,
    Input,
    Tooltip,
} from 'react-native-elements';
import { useIsFocused } from "@react-navigation/native";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
  import FeatherIcon from 'react-native-vector-icons/Feather';
import { AntDesign, Feather, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";


// Imports for: Expo
import { StatusBar } from 'expo-status-bar';
import ImagePicker from 'expo-image-picker';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

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
import LineDivider from '../../components/LineDivider';
import MyView from '../../components/MyView';

// Imports for: Components

// *************************************************************
const screenWidth = Dimensions.get('screen').width;

const Images = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;
    const color = route.params.color;
    const coverImageNumber = route.params.coverImageNumber;
    const pinMap = route.params.pinMap;

    const [messages, setMessages] = useState([]);
    const [messageImages, setMessageImages] = useState({});
    const [colorBlack, setColorBlack] = useState("#000");

    const isFocused = useIsFocused();

    //past images
    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(topicId)
            .collection('messages')
            .where("imageUID", "!=", "")
            .onSnapshot((snapshot) =>
                setMessages(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                ));
        
        return unsubscribe;
    }, [route]);

    const reloadImages = async () => {
        for (const message of messages) {
            //download image
            const imagePathUrl = topicId+"/"+message.data.imageUID+".jpg";
            const imageRef = ref(storage, imagePathUrl);
            if(imageRef) {
                getDownloadURL(imageRef)
                .then((url) => {
                    const messageImagesTemp = messageImages;
                    messageImagesTemp[message.data.imageUID] = url;
                    setMessageImages(messageImagesTemp);
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        }
    }
    useEffect(() => {
        console.log("reload");
        setTimeout(() => {
            reloadImages();
        }, 2000)
        return () => {setMessageImages({})};
    }, [messages, isFocused]);

    const rerender = () => {
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
            console.log("rerendering");
          }, 3000)
        return () => {setColorBlack("#000")};
    }, [messageImages, isFocused]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Images",
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
    
    const addPoll = () => {
        navigation.push("AddPoll", { topicId, topicName, groupId, groupName, groupOwner, color, coverImageNumber });
    };

    const viewImage = (data, id) => {
        navigation.push("ViewImage", { topicId, topicName, groupId, groupName, imageUID: data.imageUID, messageId: id, messageData: data, pinMap });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView onScroll={() => {reloadImages(); rerender(); console.log("-~-~-~scroll-~-~-")}} scrollEventThrottle={1000}
                contentContainerStyle={{
                    width: "100%", minHeight: "105%",
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    flex: 0, flexGrow: 1, borderWidth: 0, paddingBottom: 75,
                }}>

                {/* History Text */}
                <View style={{
                    marginTop: 25,
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
                    color: colorBlack, marginHorizontal: 10
                }}>
                    {"History: Sent Photos"}
                    <Text style={{ fontWeight: '500', }}> {"("+messages.length+")"} </Text>
                </Text>
                <Divider width={2} color={"#777"}
                    style={{
                        minWidth: "10%",
                        flexGrow: 1, flex: 1,
                    }}/>
                </View>

                {/* Past Images */}
                <View style={{
                    marginTop: 30, marginBottom: 0, width: "100%",
                    flexDirection: "column", flexShrink: 1,
                    justifyContent: "flex-start", alignItems: "center",
                }}>
                    {/* Prompt for no Images at all (when pastPolls.length == 0 && activePolls == 0) */}
                    <MyView hide={messages.length != 0}
                        style={{
                            width: "100%", minHeight: 300, paddingTop: 10,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                        }}>
                        <Entypo name="images" size={65} color="#555" />
                        <Text style={{
                                    fontSize: 20,
                                    fontWeight: '800',
                                    textAlign: "center",
                                    marginTop: 15,
                                    color: "#555",
                            }}>
                                {"No images found."}
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
                                {"Looks like there haven't been any photos shared within this Topic."+
                                "\nNavigate back to the chat, and click the image button near the message input."}
                        </Text>
                        <MaterialCommunityIcons name="dots-horizontal" size={65} color="#999" />
                    </MyView>
                    <View style={{ paddingTop: 0, width: "100%", paddingHorizontal: 10,
                            flex: 1, alignContent: "flex-start", flexWrap: "wrap",
                            justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "row",  }}>
                        {messages.sort((a, b) => (a.data.timestamp.seconds < b.data.timestamp.seconds ? 1 : -1)).map(({ id, data }) => (
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {viewImage(data, id)}} key={data.timestamp.seconds}
                                style={[
                                    {
                                        backgroundColor: "#fff", borderWidth: 0,
                                        flex: 0, flexGrow: 0, flexDirection: "row",
                                        justifyContent: "center", alignItems: "center",
                                        borderRadius: 1,
                                        height: (screenWidth-20)/4, width: (screenWidth-20)/4,
                                    },
                                    {
                                        shadowColor: "#000", shadowOffset: {width: 0, height: 1},
                                        shadowRadius: 0, shadowOpacity: 0.5,
                                    }
                                ]} >
                                <Image source={{
                                    uri: messageImages[data.imageUID],
                                }} style={{
                                    height: (screenWidth-20)/4, width: (screenWidth-20)/4,
                                    borderRadius: 0, borderWidth: 1, borderColor: "#777",}}/>
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

export default Images;
