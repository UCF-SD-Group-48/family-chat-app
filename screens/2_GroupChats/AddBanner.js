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
import MyView from '../../components/MyView';

// *************************************************************


const AddBanner = ({ navigation, route }) => {
    const [content, setContent] = useState("");

    useEffect(() => {
        setContent(route.params.message || "");
    }, [route]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add Banner",
        });
    }, [navigation]);

    const addBanner = () => {
        Keyboard.dismiss();

        db.collection('chats').doc(route.params.topicId).collection('banners').add({
            description: content,
            ownerPhoneNumber: auth.currentUser.phoneNumber,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(), // adapts to server's timestamp and adapts to regions
            type: "Banner",
            referenceUID: "",
            viewedBy: [],
        }); // id passed in when we entered the chatroom

        setContent(""); // clears input

        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView width={"100%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    flex: 1, flexGrow: 1,
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
                        {"Fill out what you'd like to display to everyone!"}
					</Text>
                </View>

                {/* Input Fields -Content */}
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
                        {"Banner Content"}
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
                        <TextInput placeholder={"Content"} onChangeText={setContent} value={content}
                            multiline={true} maxLength={70}
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
                {/* How many Characters content.length >= 55*/}
                <MyView hide={content.length < 50}
                    style={{
                        width: "100%", height: 35,
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
                        color: 'black',
                        }}>
                        {"Characters "+content.length+"/70"}
                    </Text>
                </MyView>
            </ScrollView>
            <View style={{
                width: "100%", minHeight: 100,
                flex: 1, flexGrow: 0, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", 
            }}>
                {/* Add Banner Button */}
                <TouchableOpacity onPress={addBanner} activeOpacity={0.7}
                    style={{
                        width: 250, height: 75,
                        marginTop: 0,
                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#afc",
                        borderColor: "#000", borderWidth: 2, borderRadius: 10,
                    }}>
					<Text style={{
						textAlign: "center",
						fontSize: 18,
						fontWeight: '600',
						color: 'black', marginLeft: 0
					}}>
						{"Create Banner"}
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
            </View>
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

export default AddBanner;
