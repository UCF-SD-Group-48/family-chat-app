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


const AddPin = ({ navigation, route }) => {
    const [pinTitle, setPinTitle] = useState("");
    const [pinContent, setPinContent] = useState("");

    useEffect(() => {
        setPinContent(route.params.message || "");
    }, [route]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add Pin",
            headerStyle: { backgroundColor: "white" },
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerLeft: '',
            headerRight: () => (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: 80,
                        marginRight: 20,
                    }}
                >
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name="camerao" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate("AddGroup")}
                    >
                        <SimpleLineIcons name="pencil" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const addPin = () => {
        const contentWithReturns = pinContent.replaceAll("\n", "\\n");
        Keyboard.dismiss();

        db.collection('chats').doc(route.params.topicId).collection('pins').add({
            title: pinTitle,
            content: contentWithReturns,
            originalMessageUID: route.params.messageUID || "",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(), // adapts to server's timestamp and adapts to regions
            displayName: auth.currentUser.displayName,
            ownerPhoneNumber: auth.currentUser.phoneNumber,
        }); // id passed in when we entered the chatroom

        setPinTitle(""); // clears input
        setPinContent(""); // clears input

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
						{"Fill in the information you'd like to pin\nfor everyone to reference later!"}
					</Text>
                </View>

                {/* Input Fields -Title */}
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
                        {"Pin Title"}
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
                        <TextInput placeholder={"Title"} onChangeText={setPinTitle} value={pinTitle}
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
                {/* Input Fields -Content */}
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
                        {"Pin Content"}
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
                        <TextInput placeholder={"Content"} onChangeText={setPinContent} value={pinContent}
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
            </ScrollView>
            <View style={{
                width: "100%", minHeight: 100,
                flex: 1, flexGrow: 0, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", 
            }}>
                {/* Add Pin Button */}
                <TouchableOpacity onPress={addPin} activeOpacity={0.7}
                    style={{
                        width: 200, height: 75,
                        marginTop: 0,
                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#afc",
                        borderColor: "#000", borderWidth: 2, borderRadius: 10,
                    }}>
                    <Icon
						name='plus'
                        type='antdesign'
                        color='#000'
						style={{
							width: 50, height: 50, marginRight: 0, justifyContent: "center"
						}}
					/>
					<Text style={{
						textAlign: "center",
						fontSize: 18,
						fontWeight: '600',
						color: 'black', marginRight: 15
					}}>
						{"Add Pin"}
					</Text>
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

export default AddPin;
