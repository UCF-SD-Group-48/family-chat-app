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
import { AntDesign, SimpleLineIcons, MaterialCommunityIcons, Entypo, MaterialIcons } from "@expo/vector-icons";


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
import MyView from '../../components/MyView';

// *************************************************************


const ViewPin = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const pinId = route.params.pinId;
    const pinData = route.params.pinData;
    const message = route.params.message;

    const [pinOwner, setPinOwner] = useState([]);
    const [pinTitle, setPinTitle] = useState(pinData.title);
    const [editing, setEditing] = useState(false);

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
            title: (editing) ? "Edit Pin" : "View Pin",
        
            headerRight: () => (
                <View style={{
                        flexDirection: "row",
                        marginRight: 20,
                    }}>
                    <MyView hide={pinData.ownerUID != auth.currentUser.uid}>
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
                                        db.collection("chats").doc(topicId).collection("pins").doc(pinId).delete();
                                        navigation.goBack();
                                    }}/>
                            </MenuOptions>
                        </Menu>
                    </MyView>
                </View>
            ),
        });

        getPinOwner();

    }, [navigation]);

    const getPinOwner = async () => {
		const snapshot = await db.collection("users").doc(auth.currentUser.uid).get();
        if (!snapshot.empty) {
            setPinOwner(snapshot.data());
        }
	};

    const updatePinTitle = async () => {
        await db.collection("chats").doc(topicId).collection("pins").doc(pinId).update({title: pinTitle});
    };

    const finishEditing = () => {
        setEditing(false);
        updatePinTitle();
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: (editing) ? "Edit Pin" : "View Pin",
        });

    }, [editing]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView width={"100%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                }}>
                
                {/* Viewing Pin data (not editing) */}
                <MyView hide={editing} style={{width: "100%",
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",}}>
                    <View style={[
                        {
                            width: "90%",
                            justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#DFD7CE",
                            marginTop: 20,
                        },
                        {
                            shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                            shadowRadius: 3, shadowOpacity: 0.4,
                        }]}>
                        <View style={{
                            justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                        }}>
                            <Entypo name="pin" size={25} color="#333" style={{
                                paddingVertical: 15, paddingHorizontal: 15,
                            }}/>
                            <Text style={{
                                paddingLeft: 5,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '700',
                                color: "#222",
                                }}>
                                {"Pin Details:"}
                            </Text>
                        </View>
                        {(pinData.ownerUID === auth.currentUser.uid) ? (
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
                                width: "90%",
                                justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                                backgroundColor: "#fff", borderTopWidth: 0, borderColor: "#DFD7CE",
                                marginBottom: 50,
                            },
                            {
                                shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                                shadowRadius: 3, shadowOpacity: 0.4,
                            }
                        ]}>
                        
                        {/* Message Content */}
                            {/* -label */}
                        <View style={{
                                width: "90%", minHeight: 30,
                                marginHorizontal: 20, marginTop: 20,
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
                                marginTop: 0, marginHorizontal: 0, marginBottom: 0,
                                paddingTop: 10, paddingBottom: 12, paddingHorizontal: 15,
                                justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "row",
                                borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                            }}>
                                <AntDesign name="caretright" size={18} color="#333" style={{marginLeft: -5}}/>
                                <Text style={{
                                    marginLeft: 7,
                                    textAlign: 'left',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#222',
                                    }}>
                                    {pinTitle}
                                </Text>
                            </View>
                        </View>

                        <Divider width={2} style={{width: "100%", marginTop: 25,}}/>

                        {/* Announcer */}
                            {/* -label */}
                            <View style={{
                                width: "90%", minHeight: 30,
                                marginHorizontal: 20, marginTop: 20,
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
                                {"Message Overview:"}
                            </Text>
                        </View>
                            {/* -content */}
                        <View style={{
                            width: "90%", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", //maybe start?
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8", marginBottom: 0,
                        }}>
                            <View style={{
                                width: "100%", minHeight: 10, maxHeight: 250,
                                paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                                justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            }}>
                                <Image source={imageSelection(pinOwner.pfp)}
                                    style={{
                                        width: 25, height: 25,
                                        borderRadius: 4, borderWidth: 0, borderColor: "#333",
                                    }}/>
                                <Text style={{
                                    paddingLeft: 12,
                                    textAlign: 'left',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: "#222",
                                    }}>
                                    {pinOwner.firstName+" "+pinOwner.lastName}
                                </Text>
                            </View>

                            <Divider width={2} style={{width: "100%", marginTop: 0,}}/>

                            <View style={{
                                width: "100%", minHeight: 10, maxHeight: 250,
                                paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                                justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            }}>
                                <MaterialCommunityIcons name="calendar-clock" size={24} color="#222" />
                                <Text style={{
                                    paddingLeft: 12,
                                    textAlign: 'left',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: "#222",
                                    }}>
                                    {(message.timestamp != null) ? (message.timestamp.toDate().toLocaleDateString("en-US", {
                                        month: "short", day: "2-digit", year: "numeric", })
                                        +" @ "+message.timestamp.toDate().toLocaleTimeString("en-US", 
                                        {hour: "numeric", minute: "2-digit", timeZoneName: "short" })) : ("")}
                                </Text>
                            </View>

                            <Divider width={2} style={{width: "100%", marginTop: 0,}}/>

                            <View style={{
                                width: "100%", minHeight: 10, maxHeight: 250,
                                paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                                justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            }}>
                                <Text style={{
                                    paddingLeft: 5,
                                    textAlign: 'left',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: "#222",
                                    }}>
                                    {"\""+message.message+"\""}
                                </Text>
                            </View>
                        </View>

                        <View style={{
                            width: "100%",
                            justifyContent: "flex-end", alignItems: "center", flexDirection: "row",
                        }}>
                            {/* Edit */}
                            {(pinData.ownerUID === auth.currentUser.uid) ? (
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

                {/* Editing Pin Title View */}
                <MyView hide={!editing} style={{width: "100%",
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",}}>
                    <View style={[
                            {
                                width: "95%",
                                justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                                backgroundColor: "#fff", borderTopWidth: 18, borderColor: "#DFD7CE",
                            },
                            {
                                shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                                shadowRadius: 3, shadowOpacity: 0.4,
                            }
                        ]}>
                        {/* Prompt */}
                        <View style={{
                            width: "90%", paddingTop: 20,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row", }}>
                            <Text style={{
                                paddingLeft: 0,
                                textAlign: 'left',
                                fontSize: 26,
                                fontWeight: '700',
                                color: 'black',
                                }}>
                                {"Edit pin title:"}
                            </Text>
                        </View>

                        <Divider width={2} style={{width: "90%", marginTop: 10,}}/>
                        
                        {/* Message Content */}
                            {/* -label */}
                        <View style={{
                                width: "90%", minHeight: 30,
                                marginHorizontal: 20, marginTop: 20,
                                justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                                backgroundColor: "#6660",
                            }}>
                            <AntDesign name="caretright" size={18} color="black" style={{marginLeft: -5}}/>
                            <Text style={{
                                paddingLeft: 7,
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
                                marginTop: 0, marginHorizontal: 0, marginBottom: 0,
                                paddingTop: 10, paddingBottom: 12, paddingHorizontal: 15,
                                justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "row",
                                borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                            }}>
                                <TextInput placeholder={"Title"} onChangeText={setPinTitle} value={pinTitle}
                                    multiline={false} maxLength={50}
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

                        {/* Announcer */}
                            {/* -label */}
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
                                color: '#777',
                                }}>
                                {"Message Overview:"}
                            </Text>
                        </View>
                            {/* -content */}
                        <View style={{
                            width: "90%", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", //maybe start?
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8", marginBottom: 0,
                        }}>
                            <View style={{
                                width: "100%", minHeight: 10, maxHeight: 250,
                                paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                                justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            }}>
                                <Image source={imageSelection(pinOwner.pfp)}
                                    style={{
                                        width: 25, height: 25,
                                        borderRadius: 4, borderWidth: 0, borderColor: "#333",
                                    }}/>
                                <Text style={{
                                    paddingLeft: 12,
                                    textAlign: 'left',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: "#777",
                                    }}>
                                    {pinOwner.firstName+" "+pinOwner.lastName}
                                </Text>
                            </View>

                            <Divider width={2} style={{width: "100%", marginTop: 0,}}/>

                            <View style={{
                                width: "100%", minHeight: 10, maxHeight: 250,
                                paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                                justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            }}>
                                <MaterialCommunityIcons name="calendar-clock" size={24} color="#777" />
                                <Text style={{
                                    paddingLeft: 12,
                                    textAlign: 'left',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: "#777",
                                    }}>
                                    {(message.timestamp != null) ? (message.timestamp.toDate().toLocaleDateString("en-US", {
                                        month: "short", day: "2-digit", year: "numeric", })
                                        +" @ "+message.timestamp.toDate().toLocaleTimeString("en-US", 
                                        {hour: "numeric", minute: "2-digit", timeZoneName: "short" })) : ("")}
                                </Text>
                            </View>

                            <Divider width={2} style={{width: "100%", marginTop: 0,}}/>

                            <View style={{
                                width: "100%", minHeight: 10, maxHeight: 250,
                                paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                                justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            }}>
                                <Text style={{
                                    paddingLeft: 5,
                                    textAlign: 'left',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: "#777",
                                    }}>
                                    {"\""+message.message+"\""}
                                </Text>
                            </View>
                        </View>

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
                                    color: 'white', marginRight: 7
                                }}>
                                    {"Save"}
                                </Text>
                                <Entypo name="check" size={25} color="white" />
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </MyView>
            </ScrollView>
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

export default ViewPin;
