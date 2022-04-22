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
    Linking,
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
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AntDesign, SimpleLineIcons, Entypo, MaterialCommunityIcons, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";


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
import { imageSelection } from '../5_Supplementary/GenerateProfileIcon';

// *************************************************************
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const ViewEvent = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;
    const color = route.params.color;
    const coverImageNumber = route.params.coverImageNumber;
    const eventId = route.params.eventId;
    const eventData = route.params.eventData;
    
    const [eventOwner, setEventOwner] = useState([]);

    //editing event
    const [editing, setEditing] = useState(false);

    //editing params
    const [title, setTitle] = useState(eventData.title);
    const [location, setLocation] = useState(eventData.location);
    const [description, setDescription] = useState(eventData.description);


    const [isStart, setIsStart] = useState(true);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const [startDate, setStartDate] = useState(eventData.startTime.toDate());
    const [startTime, setStartTime] = useState(eventData.startTime.toDate());

    const [endDate, setEndDate] = useState(eventData.endTime.toDate());
    const [endTime, setEndTime] = useState(eventData.endTime.toDate());

    // Date Picker
    const showDatePicker = (isItStart) => {
        setIsStart(isItStart);
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleConfirmDate = (date) => {
        if(isStart) {
            setStartDate(date);
        }
        else {
            setEndDate(date);
        }

        hideDatePicker();
    };

    //Time Picker
    const showTimePicker = (isItStart) => {
        setIsStart(isItStart);
        setTimePickerVisibility(true);
    };
    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };
    const handleConfirmTime = (date) => {
        if(isStart) {
            setStartTime(date);
        }
        else {
            setEndTime(date);
        }

        hideTimePicker();
    };


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

    const updateEvent = async () => {
        
        const finalStartTime = combineDateTime(startDate, startTime);
        const finalEndTime = combineDateTime(endDate, endTime);

        await db.collection("chats").doc(topicId).collection("events").doc(eventId).update({
            title: title,
            location: location,
            description: description,
            startTime: firebase.firestore.Timestamp.fromDate(finalStartTime),
            endTime: firebase.firestore.Timestamp.fromDate(finalEndTime),
        });

        navigation.setParams({
            eventData: {
                ["title"]: title,
                ["description"]: description,
                ["location"]: location,
                ["startTime"]: firebase.firestore.Timestamp.fromDate(finalStartTime),
                ["endTime"]: firebase.firestore.Timestamp.fromDate(finalEndTime),
                ["timestamp"]: eventData.timestamp,
                ["ownerUID"]: eventData.ownerUID,
                ["ownerPhoneNumber"]: eventData.ownerPhoneNumber,
            },
        });

    };

    const finishEditing = () => {
        setEditing(false);
        updateEvent();
    };

    const IconOption = ({iconName, text, value, isLast, isSpacer, isDestructive, selectFunction}) => (
        <MenuOption value={value} onSelect={selectFunction}
        style={{
            borderBottomWidth: (isSpacer) ? 7 : ((!isLast) ? 1.5 : 0),
            borderColor: "#dedede",
            height: (isSpacer) ? 47 : 43,
            paddingLeft: 15, paddingVertical: 12,
        }}>
          <Text style={{ fontSize: 14, color: (isDestructive) ? "red" : "black" }}>
            <FeatherIcon name={iconName} color={(isDestructive) ? "red" : "black"} size={15}/>
            {"   "+text}
          </Text>
        </MenuOption>
    );
    const triggerStyles = {
        triggerTouchable: {underlayColor: "#0001"},
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "View Event",
            headerRight: () => (
				<View style={{
						flexDirection: "row",
						marginRight: 20,
					}}>
                    <MyView hide={eventData.ownerUID != auth.currentUser.uid}>
                        <Menu>
                            <MenuTrigger text='' triggerOnLongPress={false} customStyles={triggerStyles}>
                                <MaterialCommunityIcons name="dots-horizontal" size={30} color="black" />
                            </MenuTrigger>
                            <MenuOptions style={{
                                borderRadius: 12, backgroundColor: "#fff",
                            }}
                            customStyles={{
                                optionsContainer: {
                                    borderRadius: 15, backgroundColor: "#666",
                                },
                            }}>
                                <IconOption value={1} isLast={true} isDestructive={true} iconName='trash' text='Delete'
                                    selectFunction={() => {
                                        db.collection("chats").doc(topicId).collection("events").doc(eventId).delete();
                                        db.collection("chats").doc(topicId).collection("banners")
                                            .where("referenceUID", '==', eventId).get().then((snapshot) => {
                                                for(const doc of snapshot.docs) {
                                                    db.collection("chats").doc(topicId).collection("banners").doc(doc.id).delete();
                                                }
                                            })
                                        navigation.goBack();
                                    }}/>
                            </MenuOptions>
                        </Menu>
                    </MyView>
				</View>
			),
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

        getEventOwner();
        

    }, [navigation]);

    const getEventOwner = async () => {
		let phoneNumber = eventData.ownerPhoneNumber.substring(2); //takes off the + from the phone number
        const snapshot = await db.collection("users").where('phoneNumber', '==', phoneNumber).limit(1).get();
        if (!snapshot.empty) {
            setEventOwner(snapshot.docs[0].data());
        }
        else { return [] };
	};

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView width={"100%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    flex: 0, flexGrow: 1, paddingBottom: 75, paddingTop: 20,
                }}>
                <MyView hide={editing} style={{width: "100%",
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",}}>
                <View style={[
                    {
                        width: "95%",
                        justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#F8D353"
                    },
                    {
                        shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                        shadowRadius: 3, shadowOpacity: 0.4,
                    }]}>
                    <View style={{
                        justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                    }}>
                        <Entypo name="calendar" size={25} color="#333" style={{
                            paddingVertical: 15, paddingHorizontal: 15,
                        }}/>
                        <Text style={{
                            paddingLeft: 5,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: "#222",
                            }}>
                            {"Event Details:"}
                        </Text>
                    </View>
                    {(eventData.ownerUID === auth.currentUser.uid) ? (
                        <View style={{
                            width: 26, height: 26,
                            marginRight: 15,
                            justifyContent: "center", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#F8D353", borderWidth: 2, borderColor: "black", borderRadius: 15,
                        }}>
                            <MaterialCommunityIcons name="crown" size={16} color="#333" style={{paddingLeft: 1}} />
                        </View>
                    ) : (
                        <View style={{
                            width: 26, height: 26,
                            marginRight: 15,
                            justifyContent: "center", alignItems: "center", flexDirection: "row",
                        }}></View>
                    )}
                </View>
                <View style={[
                        {
                            width: "95%",
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                            backgroundColor: "#fff",
                        },
                        {
                            shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                            shadowRadius: 3, shadowOpacity: 0.4,
                        }
                    ]}>
                    
                    

                    {/* Title */}
                        {/* -label */}
                        <View style={{
                        width: "90%", minHeight: 30,
                        marginHorizontal: 20, marginTop: 15,
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
                            {"Title:"}
                        </Text>
                    </View>
                        {/* -content */}
                    <View style={{
                        width: "90%", flexDirection: "row",
                    }}>
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 0, marginHorizontal: 0,
                            paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <MaterialIcons name="stars" size={24} color="#333" />
                            <Text style={{
                                paddingLeft: 12,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '500',
                                color: "#222",
                                }}>
                                {eventData.title || ""}
                            </Text>
                        </View>
                    </View>

                    {/* Start Date */}
                        {/* -label */}
                    <View style={{
                        width: "90%", minHeight: 30,
                        marginHorizontal: 20, marginTop: 15,
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
                            {"Start:"}
                        </Text>
                    </View>
                        {/* -content */}
                    <View style={{
                        width: "90%", flexDirection: "row",
                    }}>
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 0, marginHorizontal: 0,
                            paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <Ionicons name="flag-outline" size={24} color="#333" />
                            <Text style={{
                                paddingLeft: 12,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '500',
                                color: "#222",
                                }}>
                                {(eventData.startTime != null) ? (eventData.startTime.toDate().toLocaleDateString("en-US", {
                                    month: "short", day: "2-digit", year: "numeric", })
                                    +" @ "+eventData.startTime.toDate().toLocaleTimeString("en-US", 
                                    {hour: "numeric", minute: "2-digit", timeZoneName: "short" })) : ("")}
                            </Text>
                        </View>
                    </View>


                    {/* End Date */}
                        {/* -label */}
                        <View style={{
                        width: "90%", minHeight: 30,
                        marginHorizontal: 20, marginTop: 15,
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
                            {"End:"}
                        </Text>
                    </View>
                        {/* -content */}
                    <View style={{
                        width: "90%", flexDirection: "row",
                    }}>
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 0, marginHorizontal: 0,
                            paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <Ionicons name="flag-sharp" size={24} color="#333" />
                            <Text style={{
                                paddingLeft: 12,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '500',
                                color: "#222",
                                }}>
                                {(eventData.endTime != null) ? (eventData.endTime.toDate().toLocaleDateString("en-US", {
                                    month: "short", day: "2-digit", year: "numeric", })
                                    +" @ "+eventData.endTime.toDate().toLocaleTimeString("en-US", 
                                    {hour: "numeric", minute: "2-digit", timeZoneName: "short" })) : ("")}
                            </Text>
                        </View>
                    </View>


                    {/* Location */}
                        {/* -label */}
                        <View style={{
                        width: "90%", minHeight: 30,
                        marginHorizontal: 20, marginTop: 15,
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
                            {"Location:"}
                        </Text>
                    </View>
                        {/* -content */}
                    <View style={{
                        width: "90%", flexDirection: "row",
                    }}>
                        
                        <Menu style={{flex: 1, flexGrow: 1, borderWidth: 0, maxWidth: "100%",
                            minWidth: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                            }}>
                            <MenuTrigger text='' triggerOnLongPress={false} customStyles={[triggerStyles, {}]}>
                                
                        <View style={{
                            width: "100%", minHeight: 10, maxHeight: 250, 
                            marginTop: 0, marginHorizontal: 0,
                            paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            
                        }}>
                            <Ionicons name="location-sharp" size={24} color="#333" />
                            <Text style={{
                                paddingLeft: 12,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '500',
                                color: "#222", width: "100%", marginRight: -50,
                                }}>
                                {eventData.location || ""}
                            </Text>
                        </View>

                        </MenuTrigger>
                            <MenuOptions style={{
                                borderRadius: 12, backgroundColor: "#fff",
                            }}
                            customStyles={{
                                optionsContainer: {
                                    borderRadius: 15, backgroundColor: "#666",
                                },
                            }}>
                                <IconOption value={1} isLast={false} isDestructive={false} iconName='map' text='Open in Google Maps'
                                    selectFunction={() => {
                                        let searchText = location.replace(" ", "+");
                                        Linking.openURL('https://www.google.com/maps/search/?api=1&query='+searchText);
                                    }}/>
                                <IconOption value={2} isLast={true} isDestructive={false} iconName='map' text='Open in Apple Maps'
                                    selectFunction={() => {
                                        let searchText = location.replace(" ", "+");
                                        Linking.openURL('http://maps.apple.com/?q='+searchText);
                                    }}/>
                            </MenuOptions>
                        </Menu>


                    </View>


                    {/* Description */}
                        {/* -label */}
                    <View style={{
                        width: "90%", minHeight: 30,
                        marginHorizontal: 20, marginTop: 15,
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
                            {"Description:"}
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
                            <Feather name="file-text" size={20} color="#333" />
                            <Text style={{
                                paddingHorizontal: 12,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '500',
                                color: "#222",
                                }}>
                                {eventData.description}
                            </Text>
                        </View>
                    </View>

                    <View style={{
                        width: "100%",
                        justifyContent: "flex-end", alignItems: "center", flexDirection: "row",
                    }}>
                        {/* Edit */}
                        {(eventData.ownerUID === auth.currentUser.uid) ? (
                            <TouchableOpacity onPress={() => {setEditing(true)}} activeOpacity={0.7}
                                style={{
                                    width: 120, minHeight: 45,
                                    marginTop: 35, marginBottom: 35, marginRight: 25, paddingLeft: 10,
                                    justifyContent: "center", alignItems: "center", flexDirection: "row",
                                    backgroundColor: "#0000",
                                    borderColor: "#000", borderWidth: 2, borderRadius: 30,
                                }}>
                                <Text style={{
                                    textAlign: "center",
                                    fontSize: 22,
                                    fontWeight: '700',
                                    color: 'black', marginRight: 7
                                }}>
                                    {"Edit"}
                                </Text>
                                <MaterialIcons name="edit" size={24} color="black" />
                            </TouchableOpacity>
                        ) : (
                            <View style={{
                                width: 0, height: 0, marginBottom: 35,
                            }}></View>
                        )}
                        
                    </View>

                </View>
                </MyView>

                <MyView hide={!editing} style={{width: "100%",
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",}}>

                    <View style={[
                        {
                            width: "95%",
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                            backgroundColor: "#fff", borderTopWidth: 18, borderColor: "#F8D353",
                            marginTop: 0, marginBottom: 0,
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
                            {"Event details:"}
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
                            marginTop: 2, marginHorizontal: 0, paddingTop: 7, paddingBottom: 12, paddingHorizontal: 15,
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
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {showDatePicker(true)}}
                                style={{
                                    width: "100%", minHeight: 30,
                                    paddingHorizontal: 10, paddingVertical: 10, marginTop: 5,
                                    borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8",
                                    justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                                }}>
                                <Text style={{
                                    paddingLeft: 0,
                                    textAlign: 'left',
                                    fontSize: 15,
                                    fontWeight: '500',
                                    color: '#222',
                                    }}>
                                    {(startDate != undefined) ? (
                                        startDate.toLocaleDateString("en-US", {month: "short", day: "2-digit", year: "numeric"})
                                    ) : ""}
                                </Text>
                                <Entypo name="calendar" size={18} color="#333" />
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                isDarkModeEnabled={false}
                                mode="date" display="inline"
                                onConfirm={handleConfirmDate}
                                onCancel={hideDatePicker}
                            />
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
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {showTimePicker(true)}}
                                style={{
                                    width: "100%", minHeight: 30,
                                    paddingHorizontal: 10, paddingVertical: 10, marginTop: 5,
                                    borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8",
                                    justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                                }}>
                                <Text style={{
                                    paddingLeft: 0,
                                    textAlign: 'left',
                                    fontSize: 15,
                                    fontWeight: '500',
                                    color: '#222',
                                    }}>
                                    {(startTime != undefined) ?
                                    (startTime.toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit" })
                                    ) : ("")}
                                </Text>
                                <Feather name="clock" size={18} color="#333" />
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isTimePickerVisible}
                                isDarkModeEnabled={false}
                                mode="time"
                                onConfirm={handleConfirmTime}
                                onCancel={hideTimePicker}
                            />
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
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {showDatePicker(false)}}
                                style={{
                                    width: "100%", minHeight: 30,
                                    paddingHorizontal: 10, paddingVertical: 10, marginTop: 5,
                                    borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8",
                                    justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                                }}>
                                <Text style={{
                                    paddingLeft: 0,
                                    textAlign: 'left',
                                    fontSize: 15,
                                    fontWeight: '500',
                                    color: '#222',
                                    }}>
                                    {(endDate != undefined) ? (
                                        endDate.toLocaleDateString("en-US", {month: "short", day: "2-digit", year: "numeric"})
                                    ) : ""}
                                </Text>
                                <Entypo name="calendar" size={18} color="#333" />
                            </TouchableOpacity>
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
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {showTimePicker(false)}}
                                style={{
                                    width: "100%", minHeight: 30,
                                    paddingHorizontal: 10, paddingVertical: 10, marginTop: 5,
                                    borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8",
                                    justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                                }}>
                                <Text style={{
                                    paddingLeft: 0,
                                    textAlign: 'left',
                                    fontSize: 15,
                                    fontWeight: '500',
                                    color: '#222',
                                    }}>
                                    {(endTime != undefined) ?
                                    (endTime.toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit" })
                                    ) : ("")}
                                </Text>
                                <Feather name="clock" size={18} color="#333" />
                            </TouchableOpacity>
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
                        {/* Save */}
                        <TouchableOpacity onPress={finishEditing} activeOpacity={0.7}
                            style={{
                                width: 130, minHeight: 45,
                                marginTop: 35, marginBottom: 35, marginRight: 25, paddingLeft: 10,
                                justifyContent: "center", alignItems: "center", flexDirection: "row",
                                backgroundColor: "#1174EC",
                                borderColor: "#000", borderWidth: 2, borderRadius: 30,
                            }}>
                            <Text style={{
                                textAlign: "center",
                                fontSize: 22,
                                fontWeight: '700',
                                color: 'white', marginRight: 5
                            }}>
                                {"Save"}
                            </Text>
                            <Entypo name="check" size={25} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                </MyView>

            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%", height: "100%",
        // paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        backgroundColor: "#EFEAE2",
    },
})

export default ViewEvent;
