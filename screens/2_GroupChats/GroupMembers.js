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
import { imageSelection } from '../5_Supplementary/GenerateProfileIcon';

// *************************************************************


const GroupMembers = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;

    const [memberIDs, setMemberIDs] = useState([])
    const [members, setMembers] = useState([])


    useLayoutEffect(() => {
        navigation.setOptions({
            title: "GroupMembers: "+groupName,
        });
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = db.collection("groups").doc(groupId).onSnapshot((snapshot) =>
            setMemberIDs(snapshot.data().members)
        );
        
        return unsubscribe;
    }, []);

    const fetchData = async() => {
        if(memberIDs.length > 0) {
            try {
                let membersRef = [];
                // const tempArray = ["Red", "Purple"];
                membersRef = await db.collection("users").where(firebase.firestore.FieldPath.documentId(), 'in', memberIDs).get();
                
                if (membersRef) {
                    setMembers(
                        membersRef.docs.map((doc) => ({
                            id: doc.id,
                            data: doc.data(),
                        }))
                    )
                    
                }

                return membersRef;
                  
            } catch(err) {
                console.error("Error fetching members from firebase");
                console.error(err);

                return null;
            }
        }
    };

    useLayoutEffect(() => {
        const value = fetchData();
        if(value != null) {
        }
        return () => {setMembers([])}
    }, [memberIDs]);



    return (
        <SafeAreaView style={styles.container}>
            <ScrollView width={"100%"} height={"200%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    // flex: 1, flexGrow: 1,
                }}>
                {/* Info Blurb to descripe/encourage making of a pin */}
                <View style={{
                    width: "100%", minHeight: 75,
                    justifyContent: "space-between", alignItems: "flex-start", flexDirection: "row",
                    paddingHorizontal: 20, paddingVertical: 10,
                    borderWidth: 0, borderRadius: 10,
                }}>
                    <Text style={{
						textAlign: "left",
						fontSize: 20,
						fontWeight: '500',
						color: 'black',
					}}>
						 {/* Use this top line for screen title/header later */}
                         {/* {groupName + ": "} {topicName+"\n\n"} */}
                        {"Current Members in\n"+groupName}
					</Text>
                    <Text style={{
						textAlign: "right",
						fontSize: 20,
						fontWeight: '500',
						color: 'black',
					}}>
						 {/* Use this top line for screen title/header later */}
                         {/* {groupName + ": "} {topicName+"\n\n"} */}
                        {members.length}
					</Text>
                </View>
                <ScrollView contentContainerStyle={{
                        minWidth: "100%", paddingTop: 5,
                        justifyContent: "flex-start", alignItems: "flex-end", flexDirection: "column",
                        borderWidth: 0,
                    }}>
                    {members.map(({ id, data }) => (
                        <View key={id}
                                style={[
                                {
                                    height: 75, width: "90%", marginTop: 15, marginBottom: 3,
                                    justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                                    borderWidth: 0, backgroundColor: "#fff",
                                    borderTopLeftRadius: 10, borderBottomLeftRadius: 10,
                                    elevation: 2,
                                },
                                {
                                    shadowColor: "#000", shadowOffset: {width: 3, height: 3},
                                    shadowRadius: 1.5, shadowOpacity: 0.1,
                                }
                            ]}>
                            <View style={{
                                    width: 50, height: 50, marginRight: 20, marginLeft: 15,
                                    justifyContent: "center", alignItems: "center",
                                    borderRadius: 10, borderWidth: 4, borderColor: "#8880",
                                }}>
                                <Image source={imageSelection(data.pfp)}
                                    style={{
                                        width: 46, height: 46,
                                        borderRadius: 9, borderWidth: 0, borderColor: "#eee",
                                    }}/>
                            </View>
                            <Text style={{
                                textAlign: "center",
                                fontSize: 22,
                                fontWeight: '500',
                                color: 'black',
                            }}>
                                {data.firstName+" "+data.lastName}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
                <LineDivider topSpacing={30}/>
                {/* 2 Buttons */}
                <View style={{
                    width: "100%", height: 60,
                    justifyContent: "space-evenly", alignItems: "center", flexDirection: "row",
                    paddingVertical: 45,
                    }}>
                    <TouchableOpacity activeOpacity={0.7}
                        style={{
                            width: 150, height: 50,
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
                            navigation.push("GroupInvite", { topicId, topicName, groupName, groupName });
                        }}
                        style={{
                            width: 150, height: 50,
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
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%", height: "100%",
        paddingVertical: 20,
        paddingHorizontal: 0,
        alignItems: 'center',
        backgroundColor: "#EFEAE2"
    },
})

export default GroupMembers;
