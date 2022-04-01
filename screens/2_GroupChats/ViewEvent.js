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


const ViewEvent = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;
    const eventId = route.params.eventId;
    const eventData = route.params.eventData;
    
    const [eventOwner, setEventOwner] = useState([]);

    const IconOption = ({iconName, text, value, isLast, isSpacer, isDestructive, selectFunction}) => (
        <MenuOption value={value} onSelect={selectFunction}
        style={{
            borderBottomWidth: (isSpacer) ? 7 : ((!isLast) ? 1.5 : 0),
            borderColor: "#dedede",
            height: (isSpacer) ? 47 : 40,
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
            <ScrollView width={"100%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    flex: 1, flexGrow: 1,
                }}>
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
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 0, marginHorizontal: 0,
                            paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <Ionicons name="location-sharp" size={24} color="#333" />
                            <Text style={{
                                paddingLeft: 12,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '500',
                                color: "#222",
                                }}>
                                {eventData.location || ""}
                            </Text>
                        </View>
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
                            marginTop: 0, marginHorizontal: 0, marginBottom: 35,
                            paddingTop: 10, paddingBottom: 12, paddingHorizontal: 15,
                            justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "row",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <Feather name="file-text" size={20} color="#333" />
                            <Text style={{
                                paddingLeft: 12,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '500',
                                color: "#222",
                                }}>
                                {eventData.description}
                            </Text>
                        </View>
                    </View>

                    
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
        backgroundColor: "#EFEAE2",
    },
})

export default ViewEvent;
