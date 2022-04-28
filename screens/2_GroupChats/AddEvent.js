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
import { AntDesign, SimpleLineIcons, Entypo, MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";


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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const AddEvent = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;
    const color = route.params.color;
    const coverImageNumber = route.params.coverImageNumber;

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());

    const [endDate, setEndDate] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    // Start
    const updateStartDate = (event, date) => {
        setStartDate(date);
    }
    const updateStartTime = (event, date) => {
        setStartTime(date);
    }

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
            title: "Create Event",
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

    const addEvent = async () => {
        Keyboard.dismiss();

        const finalStartTime = combineDateTime(startDate, startTime);
        const finalEndTime = combineDateTime(endDate, endTime);

        const result = await db.collection('chats').doc(topicId).collection('events').add({
            title: title,
            location: location,
            description: description,
            ownerPhoneNumber: auth.currentUser.phoneNumber,
            ownerUID: auth.currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            startTime: firebase.firestore.Timestamp.fromDate(finalStartTime),
            endTime: firebase.firestore.Timestamp.fromDate(finalEndTime),
        });

        db.collection('chats').doc(topicId).collection('banners').add({
            description: "",
            ownerPhoneNumber: auth.currentUser.phoneNumber,
            ownerUID: auth.currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            type: "Event",
            referenceUID: result.id,
            viewedBy: [],
        });

        // clears input
        setTitle("");
        setLocation("");
        setDescription("");

        navigation.navigate("Chat", { topicId, topicName, groupId, groupName, groupOwner, color, coverImageNumber });
    };

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
                            backgroundColor: "#fff", borderTopWidth: 18, borderColor: "#F8D353",
                            marginTop: 20, marginBottom: 50,
                        },
                        {
                            shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                            shadowRadius: 3, shadowOpacity: 0.4,
                        }
                    ]}>
                    {/* Info Blurb to descripe/encourage making of an event */}
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
                            {"Enter details for new event:"}
                        </Text>
                    </View>

                    <Divider color={"#333"} width={1} style={{width: "90%", marginTop: 15,}} />

                    {/* Title */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 30,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <MaterialIcons name="stars" size={18} color="#333" />
                        <Text style={{
                            paddingLeft: 10,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Title:"}
                        </Text>
                    </View>
                    <View style={{
                        width: "90%", flexDirection: "row",
                    }}>
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 2, marginHorizontal: 0, paddingTop: 7, paddingBottom: 7, paddingHorizontal: 15,
                            justifyContent: "flex-start", alignItems: "center",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <TextInput placeholder={"Title"} onChangeText={setTitle} value={title}
                                multiline={false} maxLength={30}
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
                    {/* How many Characters description.length >= 55*/}
                    <MyView hide={title.length < 25}
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
                            {"Characters "+title.length+"/30"}
                        </Text>
                    </MyView>

                    {/* Start */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 30,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <Ionicons name="flag-outline" size={18} color="#333" />
                        <Text style={{
                            paddingLeft: 10,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Start:"}
                        </Text>
                    </View>

                    {/* Start -Date and Time */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 5,
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
                                    justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                                }}>
                                <DateTimePicker
                                    value={startDate}
                                    mode={"date"}
                                    accentColor={"blue"}
                                    themeVariant={"light"}
                                    display={"compact"}
                                    onChange={updateStartDate}
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
                                    value={startTime}
                                    mode={"time"}
                                    accentColor={"blue"}
                                    themeVariant={"light"}
                                    display={"compact"}
                                    onChange={updateStartTime}
                                    minuteInterval={5}
                                    style={{width: "100%", marginLeft: 0,}}
                                />
                            </View>
                        </View>
                    </View>

                    {/* End */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 30,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <Ionicons name="flag-sharp" size={18} color="#333" />
                        <Text style={{
                            paddingLeft: 10,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"End:"}
                        </Text>
                    </View>

                    {/* End -Date and Time */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 5,
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

                    

                    {/* Location */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 30,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <Ionicons name="location-sharp" size={18} color="#333" />
                        <Text style={{
                            paddingLeft: 10,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Location:"}
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
                            <TextInput placeholder={"Location text"} onChangeText={setLocation} value={location}
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
                    {/* How many Characters description.length >= 55*/}
                    <MyView hide={location.length < 90}
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
                            {"Characters "+location.length+"/100"}
                        </Text>
                    </MyView>

                    {/* Description */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 30,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <Feather name="file-text" size={18} color="#333" />
                        <Text style={{
                            paddingLeft: 10,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Description:"}
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
                            <TextInput placeholder={"Description"} onChangeText={setDescription} value={description}
                                multiline={true} maxLength={200}
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
                    {/* How many Characters description.length >= 55*/}
                    <MyView hide={description.length < 150}
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
                            {"Characters "+description.length+"/200"}
                        </Text>
                    </MyView>

                    <View style={{
                        width: "100%",
                        justifyContent: "flex-end", alignItems: "center", flexDirection: "row",
                    }}>
                        {/* Create Alert Button */}
                        <TouchableOpacity onPress={addEvent} activeOpacity={0.7}
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

export default AddEvent;
