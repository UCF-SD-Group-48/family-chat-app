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
import { arrayUnion, collection } from 'firebase/firestore';
import { set } from 'react-native-reanimated';

// *************************************************************


const GroupInvite = ({ navigation, route }) => {

    const [invite, setInvite] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "GroupInvite: " + route.params.groupName,
        });
    }, [navigation]);

    // useEffect(async () => {
    //     const pendingInvite = await db.collection('users').doc(auth.currentUser.uid).get()

    //     if (pendingInvite) {

    //         const arrayOfInvites = pendingInvite.data().pendingInvite
    //         setInvite(arrayOfInvites)
            
    //     } else {
    //         alert("Not a valid user")
    //     }

    // }, []);

    const inviteUser = async () => {

        let reformatNumber = invite.trim();
		const user = await db.collection('users').where('phoneNumber', '==', reformatNumber).get()

            if (!user.empty) {
                const snapshot = user.docs[0];
                const data = snapshot.data();
                console.log("snapshot " + snapshot)
                console.log("data " + data)
       
                db.collection("users").doc(snapshot.id).update({
                    pendingInvite: arrayUnion(route.params.groupId) // by pendingInvite

                })
                db.collection('groups').doc(route.params.groupId).update({
                    members: arrayUnion(snapshot.id)
                })
                
                } else {
                    alert("Not a valid user")
                }
	}

    // const addPin = () => {
    //     Keyboard.dismiss();

    //     db.collection('chats').doc(route.params.topicId).collection('pins').add({
    //         title: pinTitle,
    //         content: pinContent,
    //         originalMessageUID: route.params.messageUID || "",
    //         timestamp: firebase.firestore.FieldValue.serverTimestamp(), // adapts to server's timestamp and adapts to regions
    //         displayName: auth.currentUser.displayName,
    //         ownerPhoneNumber: auth.currentUser.phoneNumber,
    //     }); // id passed in when we entered the chatroom

    //     setPinTitle(""); // clears input
    //     setPinContent(""); // clears input

    //     navigation.goBack();
    // };

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
                        {"Send a group invite to a user by typing in their phone number (input field)\n"+
                            "Click a button to send the request\n"+
                            "Also button to copy an invite link, maybe just try to copy hard-coded text to the clipboard to start"}
					</Text>
                    <Input
                        placeholder="Invite User"
                        value={invite}
                        onSubmitEditing={inviteUser}
                        onChangeText={(invite) => setInvite(invite)}
                    />
                </View>
            </ScrollView>
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

export default GroupInvite;
