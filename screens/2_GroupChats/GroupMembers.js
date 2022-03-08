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


const GroupMembers = ({ navigation, route }) => {
    const [memberIDs, setMemberIDs] = useState([])
    const [members, setMembers] = useState([])


    useLayoutEffect(() => {
        navigation.setOptions({
            title: "GroupMembers: "+route.params.groupName,
        });
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = db.collection("groups").doc(route.params.groupId).onSnapshot((snapshot) =>
            setMemberIDs(snapshot.data().members)
        );
        
        return unsubscribe;
    }, []);

    // const memberMapFunction = () => {
    //     memberIDs.map((member) => {
    //         async () => {
    //             const doc = await db.collection("users").doc(member).then((doc) => {
    //                 setMembers({
    //                     id: doc.id,
    //                     data: doc.data(),
    //                 });
    //                 // console.log("\n..members is:");
    //                 // console.log(doc.id);
    //                 // console.log(doc.data());
    //             });
    //         }
    //     });
    //     console.log(members), console.log("\n..members are.");
    // }
    // useEffect(() => {
    //     memberMapFunction();
    //     return () => {
    //         // setMembers({});
    //     }
    // }, [memberIDs]);

    const printMembers = () => {
        console.log(members);
        console.log("..\n");
    };

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
                        {"Show a list of members\n"+
                            "Options to add members, or leave group"}
					</Text>
                </View>
                {/* 2 Buttons */}
                <View style={{
                    width: "100%", height: 60,
                    justifyContent: "space-evenly", alignItems: "center", flexDirection: "row",
                    paddingVertical: 15,
                    }}>
                    <TouchableOpacity onPress={printMembers} activeOpacity={0.7}
                        style={{
                            width: 100, height: 50,
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
                            {"Leave Group"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7}
                        onPress={()=>{
                            navigation.navigate("GroupInvite", { topicId: route.params.topicId, topicName: route.params.topicName, groupName: route.params.groupName, groupName: route.params.groupName });
                        }}
                        style={{
                            width: 100, height: 50,
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
                            {"Invite"}
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{ paddingTop: 0 }}>
                    {members.map(({ id, data }) => (

                        // data.phoneNumber == "6505551234" ? (
                            <View style={{
                                height: 100, width: 100,
                                justifyContent: "center", alignItems: "center", flexDirection: "row",
                            }}>
                                <Text style={{
                                    textAlign: "center",
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: 'black',
                                }}>
                                    {/* {"Dev: "+data.firstName+" "+data.lastName} */}
                                    ""
                                </Text>
                            </View>
                        // ) : (
                        //     <View style={{
                        //         height: 100, width: 100,
                        //         justifyContent: "center", alignItems: "center", flexDirection: "row",
                        //     }}>
                        //         <Text style={{
                        //             textAlign: "center",
                        //             fontSize: 18,
                        //             fontWeight: '600',
                        //             color: 'black',
                        //         }}>
                        //             {data.firstName+" "+data.lastName}
                        //         </Text>
                        //     </View>
                        // )
                    ))}
                </ScrollView>
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

export default GroupMembers;
