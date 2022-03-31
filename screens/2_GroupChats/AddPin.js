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
    Alert,
    Avatar,
    Button,
    Divider,
    Icon,
    Image,
    Input,
    Tooltip,
} from 'react-native-elements';
import { AntDesign, SimpleLineIcons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";


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
import { imageSelection } from '../5_Supplementary/GenerateProfileIcon';

// *************************************************************


const AddPin = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const message = route.params.message;
    const messageId = route.params.messageId;

    const [pinOwner, setPinOwner] = useState([]);

    const [pinTitle, setPinTitle] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add Pin",
        });

        getPinOwner();

    }, [navigation]);

    const getPinOwner = async () => {
		const snapshot = await db.collection("users").doc(auth.currentUser.uid).get();
        if (!snapshot.empty) {
            setPinOwner(snapshot.data());
        }
	};

    const addPin = () => {
        Keyboard.dismiss();

        db.collection('chats').doc(topicId).collection('pins').add({
            title: pinTitle,
            originalMessageUID: messageId || "",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            ownerUID: auth.currentUser.uid,
        });

        setPinTitle(""); // clears input

        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView width={"100%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                }}>
                <View style={[
                        {
                            width: "90%",
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                            backgroundColor: "#fff", borderTopWidth: 18, borderColor: "#DFD7CE",
                            marginTop: 20, marginBottom: 50,
                        },
                        {
                            shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                            shadowRadius: 3, shadowOpacity: 0.4,
                        }
                    ]}>
                    {/* Prompt */}
                    <View style={{
                        width: "90%", paddingTop: 20,
                        justifyContent: "flex-start", alignItems: "center", flexDirection: "row", }}>
                        <Text style={{
                            paddingLeft: 0,
                            textAlign: 'left',
                            fontSize: 26,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Enter title for pin:"}
                        </Text>
                    </View>

                    <Divider width={2} style={{width: "90%", marginTop: 10,}}/>
                    
                    {/* Message Content */}
                        {/* -label */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 25,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <AntDesign name="caretright" size={18} color="black" style={{marginLeft: -5}}/>
                        <Text style={{
                            paddingLeft: 7,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Title:"}
                        </Text>
                    </View>
                        {/* -content */}
                    <View style={{
                        width: "90%", flexDirection: "row",
                    }}>
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 0, marginHorizontal: 0, marginBottom: 0,
                            paddingTop: 10, paddingBottom: 12, paddingHorizontal: 15,
                            justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "row",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <TextInput placeholder={"Title"} onChangeText={setPinTitle} value={pinTitle}
                                multiline={false} maxLength={50}
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

                    {/* Announcer */}
                        {/* -label */}
                        <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 35,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <Text style={{
                            paddingLeft: 0,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: '#777',
                            }}>
                            {"Message Overview:"}
                        </Text>
                    </View>
                        {/* -content */}
                    <View style={{
                        width: "90%", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", //maybe start?
                        borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8", marginBottom: 0,
                    }}>
                        <View style={{
                            width: "100%", minHeight: 10, maxHeight: 250,
                            paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                        }}>
                            <Image source={imageSelection(pinOwner.pfp)}
                                style={{
                                    width: 25, height: 25,
                                    borderRadius: 4, borderWidth: 0, borderColor: "#333",
                                }}/>
                            <Text style={{
                                paddingLeft: 12,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '500',
                                color: "#777",
                                }}>
                                {pinOwner.firstName+" "+pinOwner.lastName}
                            </Text>
                        </View>

                        <Divider width={2} style={{width: "100%", marginTop: 0,}}/>

                        <View style={{
                            width: "100%", minHeight: 10, maxHeight: 250,
                            paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                        }}>
                            <MaterialCommunityIcons name="calendar-clock" size={24} color="#777" />
                            <Text style={{
                                paddingLeft: 12,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '500',
                                color: "#777",
                                }}>
                                {(message.timestamp != null) ? (message.timestamp.toDate().toLocaleDateString("en-US", {
                                    month: "short", day: "2-digit", year: "numeric", })
                                    +" @ "+message.timestamp.toDate().toLocaleTimeString("en-US", 
                                    {hour: "numeric", minute: "2-digit", timeZoneName: "short" })) : ("")}
                            </Text>
                        </View>

                        <Divider width={2} style={{width: "100%", marginTop: 0,}}/>

                        <View style={{
                            width: "100%", minHeight: 10, maxHeight: 250,
                            paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                        }}>
                            <Text style={{
                                paddingLeft: 5,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '500',
                                color: "#777",
                                }}>
                                {"\""+message.message+"\""}
                            </Text>
                        </View>
                    </View>

                    <View style={{
                        width: "100%",
                        justifyContent: "flex-end", alignItems: "center", flexDirection: "row",
                    }}>
                        {/* Create Alert Button */}
                        <TouchableOpacity onPress={addPin} activeOpacity={0.7}
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        alignItems: 'center',
        backgroundColor: "#EFEAE2"
    },
})

export default AddPin;
