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
import { AntDesign, SimpleLineIcons, Entypo, MaterialIcons, Feather, Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";


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
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const AddPoll = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;
    const color = route.params.color;
    const coverImageNumber = route.params.coverImageNumber;

    const [question, setQuestion] = useState("");
    const [choices, setChoices] = useState(2);
    const [choice1, setChoice1] = useState("");
    const [choice2, setChoice2] = useState("");
    const [choice3, setChoice3] = useState("");
    const [choice4, setChoice4] = useState("");


    const [endDate, setEndDate] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const [members, setMembers] = useState({})
    const [memberUIDs, setMemberUIDs] = useState({})

    //End Picker
    const updateEndDate = (event, date) => {
        setEndDate(date);
    }
    const updateEndTime = (event, date) => {
        setEndTime(date);
    }

    //combine
    const combineDateTime = (date, time) => {
        
        let finalDate = new Date();
        finalDate.setDate(date.getDate());
        finalDate.setMonth(date.getMonth());
        finalDate.setFullYear(date.getFullYear());

        finalDate.setMinutes(time.getMinutes());
        finalDate.setHours(time.getHours());

        return finalDate;
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Create Poll",
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

    const addPoll = async () => {
        Keyboard.dismiss();

        let votingOptions = {};
        votingOptions[choice1] = 0;
        votingOptions[choice2] = 0;
        if(choices == 3) {
            votingOptions[choice3] = 0;
        }
        else if(choices == 4) {
            votingOptions[choice3] = 0;
            votingOptions[choice4] = 0;
        }

        const finalEndTime = combineDateTime(endDate, endTime);

        const result = await db.collection('chats').doc(topicId).collection('polls').add({
            question: question,
            votingOptions: votingOptions,
            memberVotes: {},
            winningOption: "",
            ownerPhoneNumber: auth.currentUser.phoneNumber,
            ownerUID: auth.currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            endTime: firebase.firestore.Timestamp.fromDate(finalEndTime),
        });

        db.collection('chats').doc(topicId).collection('banners').add({
            description: "",
            ownerPhoneNumber: auth.currentUser.phoneNumber,
            ownerUID: auth.currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            type: "Poll",
            referenceUID: result.id,
            viewedBy: [],
        });

        // Make the notification messages
        let messages = [];
        let users = [];
        for (let uid of memberUIDs) {
            if(uid != auth.currentUser.uid
                && members[uid] != undefined && members[uid].expoPushToken != undefined && members[uid].expoPushToken != "") {
                
                messages.push({
                    to: members[uid].expoPushToken,
                    sound: "default",
                    title: members[auth.currentUser.uid].firstName+" created a poll in \""+topicName+"\"",
                    body: question,
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

        // clears input
        setQuestion("");
        setChoice1("");
        setChoice2("");
        setChoice3("");
        setChoice4("");

        navigation.navigate("Chat", { topicId, topicName, groupId, groupName, groupOwner, color, coverImageNumber });
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

    const addChoice = () => {
        if(choices < 4) {
            setChoices(choices + 1);
        }
    }

    const closeChoice3 = () => {
        setChoice3(choice4);
        setChoice4("");
        setChoices(choices - 1);
    }

    const closeChoice4 = () => {
        setChoice4("");
        setChoices(choices - 1);
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView width={"100%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                }}>
                <View style={[
                        {
                            width: "90%",
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                            backgroundColor: "#fff", borderTopWidth: 18, borderColor: "#F1A45C",
                            marginTop: 20, marginBottom: 50,
                        },
                        {
                            shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                            shadowRadius: 3, shadowOpacity: 0.4,
                        }
                    ]}>
                    {/* Info Blurb to descripe/encourage making of a poll */}
                    <View style={{
                        width: "90%",
                        justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                        marginTop: 20,
                        borderWidth: 0, borderRadius: 10,
                    }}>
                        <Text style={{
                            textAlign: "left",
                            fontSize: 22,
                            fontWeight: '700',
                            color: 'black',
                        }}>
                            {"Enter details for new poll:"}
                        </Text>
                    </View>

                    <Divider color={"#333"} width={1} style={{width: "90%", marginTop: 15,}} />

                    {/* Question */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 25,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <FontAwesome5 name="question-circle" size={18} color="#333" />
                        <Text style={{
                            paddingLeft: 10,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Question:"}
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
                            <TextInput placeholder={"Question"} onChangeText={setQuestion} value={question}
                                multiline={true} maxLength={100}
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
                    {/* How many Characters */}
                    <MyView hide={question.length < 75}
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
                            {"Characters "+question.length+"/100"}
                        </Text>
                    </MyView>

                    {/* Choices */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 25,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <Text style={{
                            paddingLeft: 0,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Choices:"}
                        </Text>
                    </View>

                    {/* Choice 1 */}
                    <View style={{
                        width: "90%", flexDirection: "row", alignItems: "center", justifyContent: "flex-start",
                    }}>
                        <MaterialCommunityIcons name="numeric-1-box" size={25} color="#333" />
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 2, marginLeft: 15, paddingTop: 7, paddingBottom: 7, paddingHorizontal: 15,
                            justifyContent: "flex-start", alignItems: "center",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <TextInput placeholder={"Choice 1"} onChangeText={setChoice1} value={choice1}
                                multiline={false} maxLength={25}
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
                    {/* How many Characters */}
                    <MyView hide={choice1.length < 20}
                        style={{
                            width: "100%",
                            paddingHorizontal: 20,
                            justifyContent: "flex-end", alignItems: "flex-start",
                            flexDirection: "row", direction: "ltr",
                            marginTop: 0,
                        }}>
                        <Text style={{
                            paddingLeft: 0,
                            textAlign: 'right',
                            fontSize: 14,
                            fontWeight: '500',
                            color: "#222",
                            }}>
                            {"Characters "+choice1.length+"/25"}
                        </Text>
                    </MyView>

                    {/* Choice 2 */}
                    <View style={{
                        width: "90%", flexDirection: "row", alignItems: "center", justifyContent: "flex-start",
                        marginTop: 10,
                    }}>
                        <MaterialCommunityIcons name="numeric-2-box" size={25} color="#333" />
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 2, marginLeft: 15, paddingTop: 7, paddingBottom: 7, paddingHorizontal: 15,
                            justifyContent: "flex-start", alignItems: "center",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <TextInput placeholder={"Choice 2"} onChangeText={setChoice2} value={choice2}
                                multiline={false} maxLength={25}
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
                    {/* How many Characters */}
                    <MyView hide={choice2.length < 20}
                        style={{
                            width: "100%",
                            paddingHorizontal: 20,
                            justifyContent: "flex-end", alignItems: "flex-start",
                            flexDirection: "row", direction: "ltr",
                            marginTop: 0,
                        }}>
                        <Text style={{
                            paddingLeft: 0,
                            textAlign: 'right',
                            fontSize: 14,
                            fontWeight: '500',
                            color: "#222",
                            }}>
                            {"Characters "+choice2.length+"/25"}
                        </Text>
                    </MyView>

                    {/* Choice 3 */}
                    <MyView hide={choices < 3} style={{
                        width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
                    }}>
                    <View style={{
                        width: "90%", flexDirection: "row", alignItems: "center", justifyContent: "flex-start",
                        marginTop: 10,
                    }}>
                        <MaterialCommunityIcons name="numeric-3-box" size={25} color="#333" />
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 2, marginLeft: 15, marginRight: 0, paddingTop: 7, paddingBottom: 7, paddingHorizontal: 15,
                            justifyContent: "flex-start", alignItems: "center",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <TextInput placeholder={"Choice 3"} onChangeText={setChoice3} value={choice3}
                                multiline={false} maxLength={25}
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
                        <TouchableOpacity activeOpacity={0.7} onPress={closeChoice3} style={{
                            width: 35, height: 35, borderWidth: 0,
                            justifyContent: "flex-end", alignItems: "center", flexDirection: "row",
                        }}>
                            <Ionicons name="close-circle-sharp" size={23} color="#777" />
                        </TouchableOpacity>
                    </View>
                    {/* How many Characters */}
                    <MyView hide={choice3.length < 20}
                        style={{
                            width: "100%",
                            paddingHorizontal: 20,
                            justifyContent: "flex-end", alignItems: "flex-start",
                            flexDirection: "row", direction: "ltr",
                            marginTop: 0,
                        }}>
                        <Text style={{
                            paddingLeft: 0,
                            textAlign: 'right',
                            fontSize: 14,
                            fontWeight: '500',
                            color: "#222",
                            }}>
                            {"Characters "+choice3.length+"/25"}
                        </Text>
                    </MyView>
                    </MyView>

                    {/* Choice 4 */}
                    <MyView hide={choices < 4} style={{
                        width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
                    }}>
                    <View style={{
                        width: "90%", flexDirection: "row", alignItems: "center", justifyContent: "flex-start",
                        marginTop: 10,
                    }}>
                        <MaterialCommunityIcons name="numeric-4-box" size={25} color="#333" />
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 2, marginLeft: 15, marginRight: 0, paddingTop: 7, paddingBottom: 7, paddingHorizontal: 15,
                            justifyContent: "flex-start", alignItems: "center",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <TextInput placeholder={"Choice 4"} onChangeText={setChoice4} value={choice4}
                                multiline={false} maxLength={25}
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
                        <TouchableOpacity activeOpacity={0.7} onPress={closeChoice4} style={{
                            width: 35, height: 35, borderWidth: 0,
                            justifyContent: "flex-end", alignItems: "center", flexDirection: "row",
                        }}>
                            <Ionicons name="close-circle-sharp" size={23} color="#777" />
                        </TouchableOpacity>
                    </View>
                    {/* How many Characters */}
                    <MyView hide={choice4.length < 20}
                        style={{
                            width: "100%",
                            paddingHorizontal: 20,
                            justifyContent: "flex-end", alignItems: "flex-start",
                            flexDirection: "row", direction: "ltr",
                            marginTop: 0,
                        }}>
                        <Text style={{
                            paddingLeft: 0,
                            textAlign: 'right',
                            fontSize: 14,
                            fontWeight: '500',
                            color: "#222",
                            }}>
                            {"Characters "+choice4.length+"/25"}
                        </Text>
                    </MyView>
                    </MyView>


                    <MyView hide={choices == 4} style={{
                        width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
                    }}>
                    <View style={{
                        width: "90%", flexDirection: "row", alignItems: "center", justifyContent: "center",
                        marginTop: 15,
                    }}>
                        <TouchableOpacity activeOpacity={0.7} onPress={addChoice}
                        style={{
                            width: "100%", minHeight: 10, maxHeight: 250, flexDirection: "row",
                            marginTop: 2, marginLeft: 15, marginRight: 10, paddingTop: 5, paddingBottom: 5, paddingHorizontal: 15,
                            justifyContent: "center", alignItems: "center",
                            borderWidth: 3, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <Text style={{
                                textAlign: 'center', fontSize: 16, fontWeight: '600',
                                color: "#000", marginRight: 5,
                                }}>
                                {"Add another choice"}
                            </Text>
                            <MaterialIcons name="add" size={25} color="#333" />
                        </TouchableOpacity>
                    </View>
                    </MyView>

                    {/* End -Date and Time */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 35,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        {/* Date */}
                        <View style={{
                            minHeight: 30, flex: 1, flexGrow: 1,
                            marginRight: 25, borderWidth: 0,
                            justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column",
                            backgroundColor: "#6660",
                        }}>
                            <Text style={{
                                paddingLeft: 0,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '700',
                                color: 'black',
                                }}>
                                {"Date:"}
                            </Text>
                            <View style={{
                                    width: "100%", minHeight: 30,
                                    paddingHorizontal: 0, paddingVertical: 0, marginTop: 5,
                                    borderWidth: 0, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F800",
                                    justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                                }}>
                                <DateTimePicker
                                    value={endDate}
                                    mode={"date"}
                                    accentColor={"blue"}
                                    themeVariant={"light"}
                                    display={"compact"}
                                    onChange={updateEndDate}
                                    style={{width: "100%", marginLeft: 0,}}
                                />
                            </View>
                        </View>
                        {/* Time */}
                        <View style={{
                            minHeight: 30, flex: 1, flexGrow: 1,
                            marginLeft: 0, borderWidth: 0,
                            justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column",
                            backgroundColor: "#6660",
                        }}>
                            <Text style={{
                                paddingLeft: 0,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '700',
                                color: 'black',
                                }}>
                                {"Time:"}
                            </Text>
                            <View style={{
                                    width: "100%", minHeight: 30,
                                    paddingHorizontal: 0, paddingVertical: 0, marginTop: 5,
                                    borderWidth: 0, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F800",
                                    justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                                }}>
                                <DateTimePicker
                                    value={endTime}
                                    mode={"time"}
                                    accentColor={"blue"}
                                    themeVariant={"light"}
                                    display={"compact"}
                                    onChange={updateEndTime}
                                    minuteInterval={5}
                                    style={{width: "100%", marginLeft: 0,}}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{
                        width: "90%", borderWidth: 0,
                        justifyContent: "flex-end", alignItems: "center", flexDirection: "row",
                    }}>
                        {/* Create Poll Button */}
                        <TouchableOpacity onPress={addPoll} activeOpacity={0.7}
                            style={{
                                width: 160, minHeight: 45,
                                marginTop: 35, marginBottom: 35, marginRight: 0, paddingLeft: 10,
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
            </KeyboardAwareScrollView>
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

export default AddPoll;
