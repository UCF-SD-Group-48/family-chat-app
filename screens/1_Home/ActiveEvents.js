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
    Avatar,
    Button,
    Divider,
    Icon,
    Image,
    Input,
    Tooltip,
} from 'react-native-elements';
import { AntDesign, Feather, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";


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
import LineDivider from '../../components/LineDivider';
import MyView from '../../components/MyView';

// Imports for: Components

// *************************************************************


const ActiveEvents = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;

    const groupToActiveEvents = route.params.groupToActiveEvents;

    const [pastEvents, setPastEvents] = useState([]);
    const [activeEvents, setActiveEvents] = useState([]);

    //past events
    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(topicId)
            .collection('events')
            .where("endTime", "<", new Date())
            .orderBy('endTime', 'desc')
            .onSnapshot((snapshot) =>
                setPastEvents(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                ));
        
        return unsubscribe;
    }, [route]);

    //Active Events
    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(topicId)
            .collection('events')
            .where("endTime", ">", new Date())
            .orderBy('endTime', 'desc')
            .onSnapshot((snapshot) =>
                setActiveEvents(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                ));
        
        return unsubscribe;
    }, [route]);

    // const getPhoneNumbers = () => {
	// 	setPhoneNumbers(
    //         Array.from(banners, ({ data: { ownerPhoneNumber } }) => {
    //             return ownerPhoneNumber.substring(2)
    //         })
    //     );
	// };

    // useEffect(() => {
    //     getPhoneNumbers();
    //     return () => {
    //         setPhoneNumbers([]);
    //     }
    // }, [banners]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Active Events",
            headerRight: () => (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginRight: 20,
					}}>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={addEvent}
					>
						<Feather name="plus" size={30} color="black" />
					</TouchableOpacity>
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
    }, [navigation]);

    // useEffect(() => {
    //     getBannerOwners();
    //     return () => {
    //         setBannerOwners({});
    //     }
    // }, [phoneNumbers]);

    // const getBannerOwners = async () => {
    //     if(phoneNumbers.length > 0) {
    //         let bannerMap = {};

    //         const snapshot = await db.collection("users").where('phoneNumber', 'in', phoneNumbers).get();
    //         snapshot.docs.map((doc) => {
    //             bannerMap[doc.id] = doc.data();
    //             console.log("doc.id = "+doc.id);
    //         });

    //         setBannerOwners(bannerMap);
    //     }
	// };
    
    const addEvent = () => {
        navigation.push("AddEvent", { topicId, topicName, groupId, groupName, groupOwner });
    };

    const viewEvent = (eventId, eventData) => {
        navigation.push("ViewEvent", { topicId, topicName, groupId, groupName, groupOwner, eventId, eventData });
    };

    // const getString = (uid) => {
    //     if(bannerOwners != undefined && uid != undefined && bannerOwners[uid.toString()] != undefined) {
    //         return (bannerOwners[uid.toString()].firstName+" "+bannerOwners[uid.toString()].lastName);
    //     }
    //     else return "";
    // }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{
                    width: "100%",
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    flex: 0, flexGrow: 1, borderWidth: 0, paddingBottom: 75,
                }}>

                {/* Active Events */}
                <View style={{
                    marginTop: 30, marginBottom: 0, width: "100%",
                    flexDirection: "column", flexShrink: 0,
                    justifyContent: "flex-start", alignItems: "center",
                }}>
                    <View style={{ paddingTop: 0, width: "90%", }}>
                        {activeEvents.map(({ id, data }) => (
                        <View key={id} style={{
                                width: "100%",
                                backgroundColor: "#fff0", borderWidth: 0,
                                flex: 0, flexGrow: 0,
                                flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
                                borderRadius: 1,
                            }}>

                            {/* Top Container */}
                            <View
                                style={[
                                    {
                                        width: "100%", marginTop: 1,
                                        backgroundColor: "#F8D353", borderWidth: 0,
                                        flex: 0, flexGrow: 0, flexDirection: "row",
                                        justifyContent: "flex-start", alignItems: "center",
                                        borderRadius: 1,
                                    },
                                    {
                                        shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                                        shadowRadius: 3, shadowOpacity: 0.4,
                                    }
                                ]} >
                                {/* Active Event */}
                                <View style={{
                                    // minWidth: "10%",
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                    flex: 1, flexGrow: 1, flexDirection: "row",
                                    justifyContent: "flex-start", alignItems: "center",
                                }}>
                                    <View style={{
                                        width: "100%", height: 60,
                                        paddingHorizontal: 15, paddingVertical: 10,
                                        backgroundColor: "#F8D353", borderRadius: 0, borderWidth: 0,
                                        flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                    }}>
                                        <View style={{
                                            width: 190, height: 35, paddingHorizontal: 15, borderRadius: 7,
                                            borderColor: "#000", borderWidth: 0, backgroundColor: "#FDF4D4",
                                            flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                        }}>
                                            <Entypo name="calendar" size={20} color="#333" />
                                            <Text style={{
                                                        fontSize: 18,
                                                        fontWeight: '800',
                                                        textAlign: "left",
                                                        marginLeft: 15, marginRight: 10,
                                                        color: "#333",
                                                        flex: 1,
                                                }}>
                                                    {"Active Event"}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Moderator */}
                                {(data.ownerUID === auth.currentUser.uid) ? (
                                    <View style={{
                                        minWidth: 26, minHeight: 26,
                                        borderColor: "#000", borderWidth: 0, backgroundColor: "#afc0",
                                        paddingVertical: 0, paddingHorizontal: 0, marginRight: 15, borderRadius: 15, borderWidth: 2,
                                        flex: 1, flexGrow: 0, justifyContent: "center", alignItems: "center",
                                    }}>
                                        <MaterialCommunityIcons name="crown" size={16} color="#333" style={{paddingLeft: 1}} />
                                    </View>
                                ) : (
                                    <View style={{
                                        minWidth: 26, minHeight: 26,
                                        borderColor: "#000", borderWidth: 0, backgroundColor: "#afc0",
                                        paddingVertical: 0, paddingHorizontal: 0, marginRight: 15, borderRadius: 15, borderWidth: 2,
                                        flex: 1, flexGrow: 0, justifyContent: "center", alignItems: "center",
                                    }}>
                                        {/* <MaterialCommunityIcons name="crown" size={16} color="#333" style={{paddingLeft: 1}} /> */}
                                    </View>
                                )}
                            </View>

                            {/* Middle Container */}
                            <View style={[
                                    {
                                        width: "100%", marginTop: 0, marginBottom: 30,
                                        backgroundColor: "#fff", borderWidth: 0,
                                        flex: 0, flexGrow: 0, flexDirection: "row",
                                        justifyContent: "flex-start", alignItems: "center",
                                        borderRadius: 1,
                                    },
                                    {
                                        shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                                        shadowRadius: 3, shadowOpacity: 0.4,
                                    }
                                ]} >
                                {/* Left Content */}
                                <View style={{
                                    minWidth: "10%",
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                    flex: 1, flexGrow: 1, flexDirection: "row",
                                    justifyContent: "flex-start", alignItems: "center",
                                }}>
                                    <View style={{
                                        width: "100%", //height: 90,
                                        paddingHorizontal: 15, paddingVertical: 10,
                                        backgroundColor: "#0000", borderRadius: 7, borderWidth: 0,
                                        flexDirection: "column", justifyContent: "space-between", alignItems: "center",
                                    }}>
                                        <View style={{
                                            width: "90%", marginTop: 10, marginBottom: 2,
                                            borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                            flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                        }}>
                                            <MaterialIcons name="stars" size={20} color="#333" />
                                            <Text numberOfLines={1}
                                                    style={{
                                                        fontSize: 18,
                                                        fontWeight: '800',
                                                        textAlign: "left",
                                                        marginLeft: 15, marginRight: 10,
                                                        color: "#333",
                                                        flex: 1,
                                                }}>
                                                    {data.title}
                                            </Text>
                                        </View>
                                        <View style={{
                                            width: "90%",marginBottom: 2,
                                            borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                            flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                        }}>
                                            <Ionicons name="flag-outline" size={20} color="#333" />
                                            <Text numberOfLines={1}
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: '400',
                                                    textAlign: "left",
                                                    marginLeft: 15, marginRight: 10,
                                                    color: "#333",
                                                    flex: 1,
                                            }}>
                                                {(data.startTime != null) ? (data.startTime.toDate().toLocaleDateString("en-US", {
                                                month: "short", day: "2-digit", year: "numeric", })
                                                +" @ "+data.startTime.toDate().toLocaleTimeString("en-US", 
                                                {hour: "numeric", minute: "2-digit", timeZoneName: "short" })) : ("")}
                                            </Text>
                                        </View>
                                        <View style={{
                                            width: "90%",
                                            borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                            flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                        }}>
                                            <Feather name="file-text" size={18} color="#333" />
                                            <Text numberOfLines={1}
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: '400',
                                                    textAlign: "left",
                                                    marginLeft: 15, marginRight: 10,
                                                    color: "#333",
                                                    flex: 1,
                                            }}>
                                                {data.description}
                                            </Text>
                                        </View>
                                        <View style={{
                                            width: "90%", height: 50, marginTop: 20, marginBottom: 15,
                                            borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                            flexDirection: "row", justifyContent: "center", alignItems: "center",
                                        }}>
                                            <TouchableOpacity activeOpacity={0.7} onPress={() => { viewEvent(id, data) }}
                                            style={{
                                                minWidth: 200, height: 45, paddingHorizontal: 20,
                                                borderColor: "#777", borderWidth: 4, borderRadius: 25,
                                                backgroundColor: "#fac0",
                                                flexDirection: "row", justifyContent: "center", alignItems: "center",
                                            }}>
                                                <Text style={{
                                                    fontSize: 18,
                                                    fontWeight: '800',
                                                    textAlign: "left",
                                                    marginLeft: 15, marginRight: 0,
                                                    color: "#333",
                                                    flex: 1,
                                                }}>
                                                    {"View Event"}
                                                </Text>
                                                <Entypo name="chevron-right" size={24} color="#333" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            
                        </View>
                        ))}
                    </View>
                </View>

                {/* Add Event Button */}
                <TouchableOpacity onPress={addEvent} activeOpacity={0.7}
                    style={[
                        {
                            minWidth: 200, minHeight: 60,
                            marginTop: 5, paddingHorizontal: 40,
                            justifyContent: "center", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#3D8D04",
                            borderColor: "#000", borderWidth: 2, borderRadius: 30,
                        },
                        {
                            shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                            shadowRadius: 3, shadowOpacity: 0.4,
                        }
                    ]}>
					<Text style={{
						textAlign: "center",
						fontSize: 22,
						fontWeight: '700',
						color: 'white', marginRight: 20
					}}>
						{"Create New Event"}
					</Text>
                    <Entypo name="plus" size={30} color="white" />
                </TouchableOpacity>

                {/* History Text */}
                <View style={{
                    marginTop: 50,
                    flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                }}>
                <Divider width={2} color={"#777"}
                    style={{
                        minWidth: "10%",
                        flexGrow: 1, flex: 1,
                    }}/>
                <Text style={{
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: '700',
                    color: 'black', marginHorizontal: 10
                }}>
                    {"History: Past Events ("+pastEvents.length+")"}
                </Text>
                <Divider width={2} color={"#777"}
                    style={{
                        minWidth: "10%",
                        flexGrow: 1, flex: 1,
                    }}/>
                </View>

                {/* Past Events */}
                <View style={{
                    marginTop: 30, marginBottom: 0, width: "100%",
                    flexDirection: "column", flexShrink: 1,
                    justifyContent: "flex-start", alignItems: "center",
                }}>
                    {/* Prompt for no Events at all (when pastEvents.length == 0 && activeEvents == 0) */}
                    <MyView hide={pastEvents.length != 0 || activeEvents.length != 0}
                        style={{
                            width: "100%", minHeight: 300, paddingTop: 10,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                        }}>
                        <Entypo name="calendar" size={65} color="#555" />
                        <Text style={{
                                    fontSize: 20,
                                    fontWeight: '800',
                                    textAlign: "center",
                                    marginTop: 15,
                                    color: "#555",
                            }}>
                                {"No events found."}
                        </Text>
                        <Text style={{
                                    fontSize: 20,
                                    fontWeight: '400',
                                    textAlign: "center",
                                    maxWidth: 350,
                                    lineHeight: 24,
                                    marginTop: 15,
                                    color: "#555",
                            }}>
                                {"Looks like there haven't been any announced events within this Topic."+
                                    "\nClick the button above to create one."}
                        </Text>
                        <MaterialCommunityIcons name="dots-horizontal" size={65} color="#999" />
                    </MyView>
                    <View style={{ paddingTop: 0, width: "100%", paddingLeft: 20, }}>
                        {pastEvents.map(({ id, data }) => (
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {viewEvent(id, data)}} key={id}
                                style={[
                                    {
                                        width: "100%", marginTop: 1,
                                        backgroundColor: "#fff", borderWidth: 0,
                                        flex: 0, flexGrow: 0, flexDirection: "row",
                                        justifyContent: "flex-start", alignItems: "center",
                                        borderRadius: 1,
                                    },
                                    {
                                        shadowColor: "#000", shadowOffset: {width: 0, height: 1},
                                        shadowRadius: 0, shadowOpacity: 0.5,
                                    }
                                ]} >
                                {/* Left Content */}
                                <View style={{
                                    minWidth: "10%",
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                    flex: 1, flexGrow: 1, flexDirection: "row",
                                    justifyContent: "flex-start", alignItems: "center",
                                }}>
                                    <View style={{
                                        width: "100%", height: 65,
                                        paddingHorizontal: 15, paddingVertical: 10,
                                        backgroundColor: "#0000", borderRadius: 7, borderWidth: 0,
                                        flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start",
                                    }}>
                                        <View style={{
                                            width: "100%",
                                            borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                            flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                        }}>
                                            <MaterialIcons name="stars" size={18} color="#777" />
                                            <Text numberOfLines={1}
                                                    style={{
                                                        fontSize: 18,
                                                        fontWeight: '600',
                                                        textAlign: "left",
                                                        marginLeft: 15, marginRight: 10,
                                                        color: "#777",
                                                        flex: 1,
                                                }}>
                                                <Text style={{fontWeight: '600'}}>"</Text>
                                                    {data.title}
                                                <Text style={{fontWeight: '600'}}>"</Text>
                                            </Text>
                                        </View>
                                        <View style={{
                                            width: "100%",
                                            borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                            flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                        }}>
                                            <Ionicons name="flag-outline" size={18} color="#777" />
                                            <Text numberOfLines={1}
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: '400',
                                                    textAlign: "left",
                                                    marginLeft: 15, marginRight: 10,
                                                    color: "#777",
                                                    flex: 1,
                                            }}>
                                                {(data.startTime != null) ? (data.startTime.toDate().toLocaleDateString("en-US", {
                                                month: "short", day: "2-digit", year: "numeric", })
                                                +" @ "+data.startTime.toDate().toLocaleTimeString("en-US", 
                                                {hour: "numeric", minute: "2-digit", timeZoneName: "short" })) : ("")}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Right Chevron */}
                                <View style={{
                                    minWidth: 60,
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#afc0",
                                    paddingVertical: 0, paddingHorizontal: 15,
                                    flex: 1, flexGrow: 0, justifyContent: "center", alignItems: "center",
                                }}>
                                    <Entypo name="chevron-right" size={34} color="#333" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%", height: "100%",
        paddingTop: 20,
        paddingHorizontal: 0,
        alignItems: 'center',
        backgroundColor: "#EFEAE2",
    },
    message: {
        flex: 1,
        width: "100%",
        alignItems: 'flex-start',
        flexDirection: "row",
        paddingTop: 20,
        paddingHorizontal: 10,
        backgroundColor: "#6660",
    },
    userContainer: {
        width: 50,
        height: 50,

        backgroundColor: '#0cc',
        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: '#0cc0',
    },
    userName: {
        marginLeft: 5,
        height: 20,
        textAlign: 'left',
        fontSize: 12,
        fontWeight: '600',
        color: 'black',
    },
    textOutline: {
        flex: 1,
        flexGrow: 1,
        marginLeft: 5,
        minHeight: 30,
        justifyContent: "center",
        backgroundColor: '#cff0',
        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 5,
    },
    text: {
        marginLeft: 10,
        paddingVertical: 5,
        textAlign: 'left',
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
    },
    titleText: {
        marginLeft: 10,
        paddingVertical: 0,
        textAlign: 'left',
        fontSize: 20,
        fontWeight: '600',
        color: 'black',
    },
})

export default ActiveEvents;
