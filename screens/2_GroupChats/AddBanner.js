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
import { AntDesign, SimpleLineIcons, Entypo } from "@expo/vector-icons";


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
import GroupListItem from '../../components/GroupListItem'
import { collection } from 'firebase/firestore';
import { set } from 'react-native-reanimated';
import MyView from '../../components/MyView';

// *************************************************************


const AddBanner = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;
    const color = route.params.color;
    const coverImageNumber = route.params.coverImageNumber;

    const [content, setContent] = useState("");

    const [members, setMembers] = useState({})
    const [memberUIDs, setMemberUIDs] = useState({})

    useEffect(() => {
        setContent(route.params.message || "");
    }, [route]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "New Alert",
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

    const addBanner = () => {
        Keyboard.dismiss();

        const trimmedInput = content.trim();

        if(trimmedInput.length > 0) {
            db.collection('chats').doc(topicId).collection('banners').add({
                description: trimmedInput,
                ownerPhoneNumber: auth.currentUser.phoneNumber,
                ownerUID: auth.currentUser.uid,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(), // adapts to server's timestamp and adapts to regions
                type: "Banner",
                referenceUID: "",
                viewedBy: [],
            }); // id passed in when we entered the chatroom

            // Make the notification messages
            let messages = [];
            let users = [];
            for (let uid of memberUIDs) {
                if(uid != auth.currentUser.uid
                    && members[uid] != undefined && members[uid].expoPushToken != undefined && members[uid].expoPushToken != "") {
                    
                    messages.push({
                        to: members[uid].expoPushToken,
                        sound: "default",
                        title: members[auth.currentUser.uid].firstName+" created an alert in \""+topicName+"\"",
                        body: trimmedInput,
                        data: { url: "familychat://"+"chat/"
                        +topicId+"/"+topicName
                        +"/"+groupId+"/"+groupName+"/"
                        +groupOwner+"/"+color+"/"+coverImageNumber+"/"
                        +members[uid].topicMap[topicId].seconds, },
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

            setContent(""); // clears input

            navigation.navigate("Chat", { topicId, topicName, groupId, groupName, groupOwner, color, coverImageNumber });
        }
        else {
            Alert.alert(
                `Invalid Content`,
                `Please enter a message to send as an alert to your family.`,
                [{ text: "OK" }]
              );
        }
    };

    const populateMembers = async () => {

        //get all members -store in array
        const topic = await db.collection('groups').doc(groupId).collection("topics").doc(topicId).get();
        let memberList = topic.data().members;

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
        return () => {setMembers({})}
    }, []); //route?

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView width={"100%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    flex: 1, flexGrow: 1,
                }}>
                <View style={[
                        {
                            width: "95%",
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                            backgroundColor: "#fff", borderTopWidth: 18, borderColor: "#EC7169",
                        },
                        {
                            shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                            shadowRadius: 3, shadowOpacity: 0.4,
                        }
                    ]}>
                    {/* Info Blurb to descripe/encourage making of an alert */}
                    <View style={{
                        width: "90%",
                        justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                        marginTop: 25,
                        borderWidth: 0, borderRadius: 10,
                    }}>
                        <Text style={{
                            textAlign: "left",
                            fontSize: 22,
                            fontWeight: '700',
                            color: 'black',
                        }}>
                            {/* Use this top line for screen title/header later */}
                            {/* {route.params.groupName + ": "} {route.params.topicName+"\n\n"} */}
                            {"Enter details for new alert:"}
                        </Text>
                    </View>

                    <Divider color={"#333"} width={1} style={{width: "90%", marginTop: 15,}} />

                    {/* Input Fields -Content */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 30,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <Entypo name="megaphone" size={18} color="#333" />
                        <Text style={{
                            paddingLeft: 10,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Message:"}
                        </Text>
                    </View>
                    <View style={{
                        width: "90%", flexDirection: "row",
                    }}>
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 2, marginHorizontal: 0, paddingTop: 7, paddingBottom: 12, paddingHorizontal: 15,
                            justifyContent: "flex-start", alignItems: "center",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <TextInput placeholder={"Content"} onChangeText={setContent} value={content}
                                multiline={true} maxLength={70}
                                style={{
                                    minHeight: 20, width: "100%",
                                    backgroundColor: "#6660",
                                    textAlign: 'left',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#222',
                                }}
                            />
                        </View>
                    </View>
                    {/* How many Characters content.length >= 55*/}
                    <MyView hide={content.length < 50}
                        style={{
                            width: "100%",
                            paddingHorizontal: 20,
                            justifyContent: "flex-end", alignItems: "flex-start",
                            flexDirection: "row", direction: "ltr",
                            borderWidth: 2,
                            borderColor: "#0000",
                        }}>
                        <Text style={{
                            paddingLeft: 0,
                            textAlign: 'right',
                            fontSize: 14,
                            fontWeight: '500',
                            color: "#222",
                            }}>
                            {"Characters "+content.length+"/70"}
                        </Text>
                    </MyView>

                    <View style={{
                        width: "100%",
                        justifyContent: "flex-end", alignItems: "center", flexDirection: "row",
                    }}>
                        {/* Create Alert Button */}
                        <TouchableOpacity onPress={addBanner} activeOpacity={0.7}
                            style={{
                                width: 160, minHeight: 45,
                                marginTop: 35, marginBottom: 35, marginRight: 25, paddingLeft: 10,
                                justifyContent: "center", alignItems: "center", flexDirection: "row",
                                backgroundColor: "#3D8D04",
                                borderColor: "#000", borderWidth: 2, borderRadius: 30,
                            }}>
                            <Text style={{
                                textAlign: "center",
                                fontSize: 22,
                                fontWeight: '700',
                                color: 'white', marginRight: 5
                            }}>
                                {"Create"}
                            </Text>
                            <Entypo name="plus" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            {/* <View style={{
                width: "100%", minHeight: 100,
                flex: 1, flexGrow: 0, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", 
            }}>
                
                <TouchableOpacity onPress={addBanner} activeOpacity={0.7}
                    style={{
                        width: 250, height: 75,
                        marginTop: 0,
                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#fbd",
                        borderColor: "#000", borderWidth: 2, borderRadius: 10,
                    }}>
					<Text style={{
						textAlign: "center",
						fontSize: 18,
						fontWeight: '600',
						color: 'black', marginLeft: 0
					}}>
						{"Send Alert"}
					</Text>
                    <Icon
						name='plus'
                        type='antdesign'
                        color='#000'
						style={{
							width: 25, height: 25, marginLeft: 10, justifyContent: "center"
						}}
					/>
                </TouchableOpacity>
                
                
            */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%", height: "100%",
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        backgroundColor: "#EFEAE2",
    },
})

export default AddBanner;
