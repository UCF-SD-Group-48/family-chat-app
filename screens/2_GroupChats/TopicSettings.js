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
    Icon,
    Image,
    Input,
    Tooltip,
} from 'react-native-elements';
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";


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

// *************************************************************


const TopicSettings = ({ navigation, route }) => {
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("");
    const [color, setColor] = useState("");

    useEffect(() => {
        setName(route.params.groupName || "");
        setEmoji("Get emoji from database here");
        setColor("Get color from database here");
    }, [route]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Topic Settings:  "+ route.params.topicName,
        });
    }, [navigation]);

    const addPin = () => {
        Keyboard.dismiss();

        db.collection('chats').doc(route.params.topicId).collection('pins').add({
            title: pinTitle,
            content: pinContent,
            originalMessageUID: route.params.messageUID || "",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(), // adapts to server's timestamp and adapts to regions
            displayName: auth.currentUser.displayName,
            ownerPhoneNumber: auth.currentUser.phoneNumber,
        }); // id passed in when we entered the chatroom

        setPinTitle(""); // clears input
        setPinContent(""); // clears input

        navigation.goBack();
    };

    const deleteTopic = async () => {
        try {
             await db.collection('groups').doc(route.params.groupId).collection('topics').doc(route.params.topicId).delete();
             console.log("deleted the topic")
        } catch (error) {
            alert(error)
        }
        // const query = collectionRef.orderBy('__name__').limit(batchSize)
          
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView width={"100%"} height={"200%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    // flex: 1, flexGrow: 1,
                }}>
                {/* Info Blurb to descripe/encourage making of a pin */}
                <View style={{
                    minWidth: 150, minHeight: 75,
                    justifyContent: "center", alignItems: "center",
                    paddingHorizontal: 10, paddingVertical: 10,
                    borderWidth: 2, borderRadius: 10,
                }}>
                    <Text style={{
						textAlign: "center",
						fontSize: 20,
						fontWeight: '500',
						color: 'black',
					}}>
						 {/* Use this top line for screen title/header later */}
                         {/* {route.params.groupName + ": "} {route.params.topicName+"\n\n"} */}
                        {"Change Topic Settings for\n"+route.params.topicName}
					</Text>
                </View>

                {/* Input Fields -Name */}
                <View style={{
                        width: "100%", minHeight: 30,
                        marginHorizontal: 20, marginTop: 50,
                        justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#6660",
                    }}>
                    <Text style={{
                        paddingLeft: 20,
                        textAlign: 'left',
                        fontSize: 24,
                        fontWeight: '600',
                        color: 'black',
                        }}>
                        {"Topic Name"}
                    </Text>
                </View>
                <View style={{
                    width: "100%", flexDirection: "row",
                }}>
                    <View style={{
                        width: 50, height: 50, flex: 1, flexGrow: 1,
                        marginTop: 5, marginHorizontal: 20, paddingVertical: 0, paddingHorizontal: 10,
                        justifyContent: 'center',
                        borderWidth: 2, borderColor: 'black', borderRadius: 5,
                    }}>
                        <TextInput placeholder={"Group Name"} onChangeText={setName} value={name}
                            onSubmitEditing={() => {Keyboard.dismiss()}}
                            style={{
                                height: 35,
                                textAlign: 'left',
                                fontSize: 18,
                                fontWeight: '600',
                                color: '#444',
                            }}
                        />
                    </View>
                </View>
                {/* Input Fields -Emoji */}
                <View style={{
                        width: "100%", minHeight: 30,
                        marginHorizontal: 20, marginTop: 15,
                        justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#6660",
                    }}>
                    <Text style={{
                        paddingLeft: 20,
                        textAlign: 'left',
                        fontSize: 24,
                        fontWeight: '600',
                        color: 'black',
                        }}>
                        {"Topic Emoji"}
                    </Text>
                </View>
                <View style={{
                    width: "100%", flexDirection: "row",
                }}>
                    <View style={{
                        width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                        marginTop: 5, marginHorizontal: 20, paddingTop: 7, paddingBottom: 12, paddingHorizontal: 15,
                        justifyContent: "flex-start", alignItems: "center",
                        borderWidth: 2, borderColor: 'black', borderRadius: 5,
                    }}>
                        <TextInput placeholder={"Smile"} onChangeText={setEmoji} value={emoji}
                            multiline={true}
                            style={{
                                minHeight: 20, width: "100%",
                                backgroundColor: "#6660",
                                textAlign: 'left',
                                fontSize: 18,
                                fontWeight: '600',
                                color: '#444',
                            }}
                        />
                    </View>
                </View>
                {/* Input Fields -Color */}
                <View style={{
                        width: "100%", minHeight: 30,
                        marginHorizontal: 20, marginTop: 15,
                        justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#6660",
                    }}>
                    <Text style={{
                        paddingLeft: 20,
                        textAlign: 'left',
                        fontSize: 24,
                        fontWeight: '600',
                        color: 'black',
                        }}>
                        {"Topic Color"}
                    </Text>
                </View>
                <View style={{
                    width: "100%", flexDirection: "row",
                }}>
                    <View style={{
                        width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                        marginTop: 5, marginHorizontal: 20, paddingTop: 7, paddingBottom: 12, paddingHorizontal: 15,
                        justifyContent: "flex-start", alignItems: "center",
                        borderWidth: 2, borderColor: 'black', borderRadius: 5,
                    }}>
                        <TextInput placeholder={"Red"} onChangeText={setColor} value={color}
                            multiline={true}
                            style={{
                                minHeight: 20, width: "100%",
                                backgroundColor: "#6660",
                                textAlign: 'left',
                                fontSize: 18,
                                fontWeight: '600',
                                color: '#444',
                            }}
                        />
                    </View>
                </View>
                {/* Save Topic Data */}
                <TouchableOpacity onPress={()=>{}} activeOpacity={0.7}
                    style={{
                        width: 200, height: 50,
                        marginTop: 20,
                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#afc",
                        borderColor: "#000", borderWidth: 2, borderRadius: 10,
                    }}>
					<Text style={{
						textAlign: "center",
						fontSize: 18,
						fontWeight: '600',
						color: 'black', marginRight: 0
					}}>
						{"Save Topic Data Changes"}
					</Text>
                </TouchableOpacity>
                {/* Delete Topic */}
                <TouchableOpacity 
                    onPress={deleteTopic}
                    activeOpacity={0.7}
                    style={{
                        width: 200, height: 50,
                        marginTop: 20,
                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#fac",
                        borderColor: "#000", borderWidth: 2, borderRadius: 10,
                    }}>
					<Text style={{
						textAlign: "center",
						fontSize: 18,
						fontWeight: '600',
						color: 'black', marginRight: 0
					}}>
						{"Delete Topic"}
					</Text>
                </TouchableOpacity>
                {/* Leave Topic */}
                <TouchableOpacity onPress={()=>{}} activeOpacity={0.7}
                    style={{
                        width: 200, height: 50,
                        marginTop: 20,
                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#ccc",
                        borderColor: "#000", borderWidth: 2, borderRadius: 10,
                    }}>
					<Text style={{
						textAlign: "center",
						fontSize: 18,
						fontWeight: '600',
						color: 'black', marginRight: 0
					}}>
						{"Leave Topic"}
					</Text>
                </TouchableOpacity>
                {/* Add Owner by phone number */}
                <View style={{
                        width: "100%", minHeight: 30,
                        marginHorizontal: 20, marginTop: 15,
                        justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#6660",
                    }}>
                    <Text style={{
                        paddingLeft: 20,
                        textAlign: 'left',
                        fontSize: 24,
                        fontWeight: '600',
                        color: 'black',
                        }}>
                        {"Add/remove Owner by phone number"}
                    </Text>
                </View>
                <View style={{
                    width: "100%", flexDirection: "row",
                }}>
                    <View style={{
                        width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                        marginTop: 5, marginHorizontal: 20, paddingTop: 7, paddingBottom: 12, paddingHorizontal: 15,
                        justifyContent: "flex-start", alignItems: "center",
                        borderWidth: 2, borderColor: 'black', borderRadius: 5,
                    }}>
                        <TextInput placeholder={"6505551234..."} onChangeText={()=>{}} value={null}
                            multiline={true}
                            style={{
                                minHeight: 20, width: "100%",
                                backgroundColor: "#6660",
                                textAlign: 'left',
                                fontSize: 18,
                                fontWeight: '600',
                                color: '#444',
                            }}
                        />
                    </View>
                </View>
                {/* owner button */}
                <TouchableOpacity onPress={()=>{}} activeOpacity={0.7}
                    style={{
                        width: 200, height: 50,
                        marginTop: 20,
                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#ccc",
                        borderColor: "#000", borderWidth: 2, borderRadius: 10,
                    }}>
					<Text style={{
						textAlign: "center",
						fontSize: 18,
						fontWeight: '600',
						color: 'black', marginRight: 0
					}}>
						{"owner button"}
					</Text>
                </TouchableOpacity>
            </ScrollView>
            {/* <View style={{
                width: "100%", minHeight: 100,
                flex: 1, flexGrow: 0, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", 
            }}>
                
            </View> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%", height: "100%",
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
})

export default TopicSettings;
