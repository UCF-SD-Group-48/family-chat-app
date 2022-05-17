// *************************************************************
// Imports for: React, React Native, & React Native Elements
import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import {
    Alert,
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
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AntDesign, SimpleLineIcons, Entypo, Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";


// Imports for: Expo
import { StatusBar } from 'expo-status-bar';
import ImagePicker from 'expo-image-picker';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

// Imports for: Firebase
import {
    apps,
    auth,
    db,
    firebaseConfig,
    storage,
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
import GroupListItem from '../../components/GroupListItem'
import { collection } from 'firebase/firestore';
import { set } from 'react-native-reanimated';
import MyView from '../../components/MyView';

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// *************************************************************

const screenWidth = Dimensions.get('screen').width;

const ViewImage = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;
    const color = route.params.color;
    const coverImageNumber = route.params.coverImageNumber;
    const imageUID = route.params.imageUID;
    const messageId = route.params.messageId;
    const messageData = route.params.messageData;
    const pinMap = route.params.pinMap;

    const [content, setContent] = useState("");
    const [url, setUrl] = useState(undefined);
    const [imageOwner, setImageOwner] = useState([]);

    const IconOption = ({iconName, text, value, isLast, isSpacer, isDestructive, selectFunction}) => (
        <MenuOption value={value} onSelect={selectFunction}
        style={{
            borderBottomWidth: (isSpacer) ? 7 : ((!isLast) ? 1.5 : 0),
            borderColor: "#dedede",
            height: (isSpacer) ? 47 : 40,
            paddingLeft: 15, paddingVertical: 12,
        }}>
          <Text style={{ fontSize: 14, color: (isDestructive) ? "red" : "black" }}>
            <FeatherIcon name={iconName} color={(isDestructive) ? "red" : "black"} size={15}/>
            {"   "+text}
          </Text>
        </MenuOption>
    );
    const triggerStyles = {
        triggerTouchable: {underlayColor: "#0001"},
    }

    useEffect(() => {
        setContent(route.params.message || "");
        return () => {setContent("")}
    }, [route]);

    useEffect(() => {
        const imagePathUrl = topicId+"/"+imageUID+".jpg";
        const imageRef = ref(storage, imagePathUrl);
        if(imageRef) {
            getDownloadURL(imageRef)
            .then((url) => {
                setUrl(url);
            })
            .catch((error) => {
                console.error(error);
            });
        }
        return () => {setUrl(undefined)}
    }, [route]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "View Image",
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
            headerRight: () => (
                <View style={{ marginRight: 15 }}>
                    <Menu>
                        <MenuTrigger text='' triggerOnLongPress={false} customStyles={triggerStyles}>
                            <MaterialCommunityIcons name="dots-horizontal" size={30} color="black" />
                        </MenuTrigger>
                        <MenuOptions style={{
                            borderRadius: 12, backgroundColor: "#fff",
                        }}
                        customStyles={{
                            optionsContainer: {
                                borderRadius: 15, backgroundColor: "#666",
                            },
                        }}>
                            <IconOption value={2} isLast={true} isDestructive={true} hide={messageData.ownerUID == auth.currentUser.uid}
                                iconName='trash' text='Delete'
                                selectFunction={() => {
                                    deleteMessage(messageId, messageData);
                                    navigation.goBack();
                                }}/>
                        </MenuOptions>
                    </Menu>
                </View>
            ),
        });

        getImageOwner();

        return () => {setImageOwner([])}
    }, [navigation]);

    const getImageOwner = async () => {
		const snapshot = await db.collection("users").doc(messageData.ownerUID).get();
        if (!snapshot.empty) {
            setImageOwner(snapshot.data());
        }
        else { return [] };
	};

    const saveImage = async () => {

        await FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory+""+topicId);
        const dir = await FileSystem.getInfoAsync(FileSystem.cacheDirectory+""+topicId);
        if(dir.exists) {
            FileSystem.downloadAsync(
                url,
                FileSystem.cacheDirectory+""+topicId+"/"+imageUID+".jpg"
            )
            .then(({ uri }) => {
                MediaLibrary.saveToLibraryAsync(uri)
                .then(() => {
                    Alert.alert(
                        "Image Saved",
                        "Image Downloaded Successfully",
                    )
                })
                .catch(error => {
                    console.log("error 1");
                    console.error(error);
                    Alert.alert(
                        "Error",
                        "There was a problem downloading the image",
                    )
                })
            })
            .catch(error => {
                console.log("error 2");
                console.error(error);
                Alert.alert(
                    "Error",
                    "There was a problem downloading the image",
                )
            });
        }
        else {
            console.log("dir does not exist");
            console.log("dir = "+JSON.stringify(dir));
        }
        
    }

    const getPinData = (uid) => {
        //pinMap != undefined && pinMap[id.toString()] != undefined
        if (pinMap != undefined && uid != undefined && pinMap[uid.toString()] != undefined) {
            return (pinMap[uid.toString()]);
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView width={"100%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    flex: 0, flexGrow: 0, paddingBottom: 75, paddingTop: 20,
                }}>
                <View style={[
                        {
                            width: "95%",
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                            backgroundColor: "#fff", borderTopWidth: 0, borderColor: "#EC7169",
                        },
                        {
                            shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                            shadowRadius: 3, shadowOpacity: 0.4,
                        }
                    ]}>
                    
                    {/* Image */}
                    <Image source={{
                        uri: url,
                    }} style={{minWidth: "90%",
                    height: (messageData.imageDimensions.height/messageData.imageDimensions.width) * ((screenWidth*0.855)),
                        marginTop: 15,
                        borderRadius: 0, borderWidth: 1.5, borderColor: "#333",}}/>

                    {/* Sender */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 15,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <Ionicons name="person-circle" size={27} color="#333" />
                        <Text style={{
                            paddingLeft: 8,
                            textAlign: 'left',
                            fontSize: 15,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Sender:  "}
                            <Text style={{ fontWeight: '500', color: '#555', }}>
                                {imageOwner.firstName+" "+imageOwner.lastName}
                            </Text>
                        </Text>
                    </View>

                    {/* Time Sent */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 5,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <MaterialCommunityIcons name="calendar-clock" size={27} color="#333" />
                        <Text style={{
                            paddingLeft: 8,
                            textAlign: 'left',
                            fontSize: 15,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Date/Time:  "}
                            <Text style={{ fontWeight: '500', color: '#555', }}>
                                {(messageData.timestamp != null) ? (messageData.timestamp.toDate().toLocaleDateString("en-US", {
                                    month: "short", day: "2-digit", year: "numeric", })
                                    +" @ "+messageData.timestamp.toDate().toLocaleTimeString("en-US", 
                                    {hour: "numeric", minute: "2-digit" })) : ("")}
                            </Text>
                        </Text>
                    </View>

                    

                    <View style={{
                        width: "100%",
                        justifyContent: "flex-end", alignItems: "center", flexDirection: "row",
                    }}>
                        {/* Create Alert Button */}
                        <TouchableOpacity onPress={saveImage} activeOpacity={0.7}
                            style={{
                                width: 160, minHeight: 45,
                                marginTop: 10, marginBottom: 15, marginRight: 25, paddingLeft: 10,
                                justifyContent: "center", alignItems: "center", flexDirection: "row",
                                backgroundColor: "#1174EC",
                                borderColor: "#000", borderWidth: 2, borderRadius: 30,
                            }}>
                            <Text style={{
                                textAlign: "center",
                                fontSize: 22,
                                fontWeight: '700',
                                color: 'white', marginRight: 10
                            }}>
                                {"Save"}
                            </Text>
                            <Feather name="download" size={25} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%", height: "100%",
        paddingTop: 20, paddingBottom: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        backgroundColor: "#EFEAE2",
    },
})

export default ViewImage;
