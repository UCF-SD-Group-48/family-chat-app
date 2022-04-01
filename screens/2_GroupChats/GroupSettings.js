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
import { arrayRemove, collection } from 'firebase/firestore';
import { set } from 'react-native-reanimated';

// *************************************************************


const GroupSettings = ({ navigation, route }) => {
    // const topicId = route.params.topicId;
    // const topicName = route.params.topicName;
    // const groupId = route.params.groupId;
    // const groupName = route.params.groupName;
    // const groupOwner = route.params.groupOwner;

    // const [name, setName] = useState(groupName || "");
    // const [emoji, setEmoji] = useState("Get emoji from database here");
    // const [color, setColor] = useState("Get color from database here");
    // const [owner, setOwner] = useState(groupOwner);

    // useEffect(() => {
    //     // setName(groupName || "");
    //     // setEmoji("Get emoji from database here");
    //     // setColor("Get color from database here");
    //     // updateGroupSettings();
    //     return () => {
    //         // db.collection('groups').doc(groupId).update({})
    //         setName({})
    //     }
    // }, [route]);

    const topicObjectForPassing = route.params.topicObjectForPassing;

    const goBackward = () => {
        navigation.navigate("TopicSettings", {
            topicObjectForPassing: {
                color: topicObjectForPassing.color,
                groupId: topicObjectForPassing.groupId,
                groupName: topicObjectForPassing.groupName,
                groupOwner: topicObjectForPassing.groupOwner,
                topicId: topicObjectForPassing.topicId,
                topicName: topicObjectForPassing.topicName,
                topicOwner: topicObjectForPassing.topicOwner,
                topicMembers: topicObjectForPassing.topicMembers,
            }
        })
    }
    
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Group Settings',
            headerStyle: '',
            headerTitleStyle: { color: 'black' },
            headerTintColor: 'black',
            headerLeft: () => (
                <View style={{ marginLeft: 12 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={goBackward}>
                        <Icon
                            name='arrow-back'
                            type='ionicon'
                            color='#363732'
                            size={28}
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: '',
        });
    }, [navigation]);

    const deleteGroup = async () => {
        if (auth.currentUser.uid === groupOwner) {

            try {
                let topicRef;
                // delete the topics in group first
                topicRef = await db.collection('groups').doc(groupId).collection('topics').get();


                if (topicRef) {
                    topicRef.docs.map((doc, index) => {
                        // db.collection('groups').d000oc(groupId).collection('topics').doc(doc.id).delete()
                        deleteTopic(doc.id)
                    })
                }

            } catch (error) {
                alert(error)
            } finally {
                // delete the group itself
                await db.collection('groups').doc(groupId).delete();
                await db.collection('users').doc(auth.currentUser.uid).update({
                    groups: arrayRemove(groupId)
                })
                navigation.replace("Groups");
            }
        } else {
            alert("Current User is not the Group Owner")
        }

    }

    const deleteTopic = async (topic) => {
        try {
            const chatRef = await db.collection('chats').doc(topic).collection('messages').get()

            if (chatRef) {
                console.log("entered?")
                chatRef.docs.map((topicMessage) => {
                    db.collection('chats').doc(topic).collection('messages').doc(topicMessage.id).delete()
                })
            } else {
                console.log("didn't enter")
            }

        } catch (error) {
            alert(error)
        } finally {
            try {
                await db.collection('chats').doc(topic).delete();
                await db.collection('groups').doc(groupId).collection('topics').doc(topic).delete();
            } catch (error) { console.log(error) };
        }
    }

    const leaveGroup = async () => {
        // Cannot leave group if group Owner
        if (auth.currentUser.uid !== groupOwner) {
            db.collection('groups').doc(groupId).update({
                members: arrayRemove(auth.currentUser.uid)
            })

            navigation.replace("Groups");
        } else {
            alert("Group Owner cannot leave group, must assign new group owner")
        }
    }

    const reassignOwner = async () => {
        if (auth.currentUser.uid === groupOwner) {

            let reformatNumber = owner.trim();
            const user = await db.collection('users').where('phoneNumber', '==', reformatNumber).get()
            if (!user.empty) {
                const snapshot = user.docs[0];

                db.collection('groups').doc(groupId).update({
                    groupOwner: snapshot.id
                })
                navigation.replace('Groups');
            } else {
                alert("Not a valid user")
            }

        }
    }

    // const updateGroupSettings = () => {
    //    db.collection('groups').doc(groupId).update({
    //         groupName: name
    //     })

    //     alert("Changes been made");
    // }
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

//     return (
//         <View></View>
//         // <SafeAreaView style={styles.container}>
//         //     <ScrollView width={"100%"} height={"200%"}
//         //         contentContainerStyle={{
//         //             justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
//         //             // flex: 1, flexGrow: 1,
//         //         }}>
//         //         {/* Info Blurb to descripe/encourage making of a pin */}
//         //         <View style={{
//         //             minWidth: 150, minHeight: 75,
//         //             justifyContent: "center", alignItems: "center",
//         //             paddingHorizontal: 10, paddingVertical: 10,
//         //             borderWidth: 2, borderRadius: 10,
//         //         }}>
//         //             <Text style={{
//         //                 textAlign: "center",
//         //                 fontSize: 20,
//         //                 fontWeight: '500',
//         //                 color: 'black',
//         //             }}>
//         //                 {/* Use this top line for screen title/header later */}
//         //                 {/* {route.params.groupName + ": "} {route.params.topicName+"\n\n"} */}
//         //                 {"Change Group Settings for\n" + groupName}
//         //             </Text>
//         //         </View>

//         //         <TouchableOpacity onPress={() => navigation.push('TopicSettings')}>
//         //             <View style={{ width: 100, height: 50, backgroundColor: 'blue' }}>
//         //                 <Text> New Settings Page </Text>
//         //             </View>
//         //         </TouchableOpacity>

//         //         {/* Input Fields -Name */}
//         //         <View style={{
//         //             width: "100%", minHeight: 30,
//         //             marginHorizontal: 20, marginTop: 50,
//         //             justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
//         //             backgroundColor: "#6660",
//         //         }}>
//         //             <Text style={{
//         //                 paddingLeft: 20,
//         //                 textAlign: 'left',
//         //                 fontSize: 24,
//         //                 fontWeight: '600',
//         //                 color: 'black',
//         //             }}>
//         //                 {"Group Name"}
//         //             </Text>
//         //         </View>
//         //         <View style={{
//         //             width: "100%", flexDirection: "row",
//         //         }}>
//         //             <View style={{
//         //                 width: 50, height: 50, flex: 1, flexGrow: 1,
//         //                 marginTop: 5, marginHorizontal: 20, paddingVertical: 0, paddingHorizontal: 10,
//         //                 justifyContent: 'center',
//         //                 borderWidth: 2, borderColor: 'black', borderRadius: 5,
//         //             }}>
//         //                 <TextInput placeholder={"Group Name"} onChangeText={(text) => setName(text)} value={name}
//         //                     onSubmitEditing={() => { Keyboard.dismiss() }}
//         //                     style={{
//         //                         height: 35,
//         //                         textAlign: 'left',
//         //                         fontSize: 18,
//         //                         fontWeight: '600',
//         //                         color: '#444',
//         //                     }}
//         //                 />
//         //             </View>
//         //         </View>
//         //         {/* Input Fields -Emoji */}
//         //         <View style={{
//         //             width: "100%", minHeight: 30,
//         //             marginHorizontal: 20, marginTop: 15,
//         //             justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
//         //             backgroundColor: "#6660",
//         //         }}>
//         //             <Text style={{
//         //                 paddingLeft: 20,
//         //                 textAlign: 'left',
//         //                 fontSize: 24,
//         //                 fontWeight: '600',
//         //                 color: 'black',
//         //             }}>
//         //                 {"Group Emoji"}
//         //             </Text>
//         //         </View>
//         //         <View style={{
//         //             width: "100%", flexDirection: "row",
//         //         }}>
//         //             <View style={{
//         //                 width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
//         //                 marginTop: 5, marginHorizontal: 20, paddingTop: 7, paddingBottom: 12, paddingHorizontal: 15,
//         //                 justifyContent: "flex-start", alignItems: "center",
//         //                 borderWidth: 2, borderColor: 'black', borderRadius: 5,
//         //             }}>
//         //                 <TextInput placeholder={"Smile"} onChangeText={(text) => setEmoji(text)} value={emoji}
//         //                     multiline={true}
//         //                     style={{
//         //                         minHeight: 20, width: "100%",
//         //                         backgroundColor: "#6660",
//         //                         textAlign: 'left',
//         //                         fontSize: 18,
//         //                         fontWeight: '600',
//         //                         color: '#444',
//         //                     }}
//         //                 />
//         //             </View>
//         //         </View>
//         //         {/* Input Fields -Color */}
//         //         <View style={{
//         //             width: "100%", minHeight: 30,
//         //             marginHorizontal: 20, marginTop: 15,
//         //             justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
//         //             backgroundColor: "#6660",
//         //         }}>
//         //             <Text style={{
//         //                 paddingLeft: 20,
//         //                 textAlign: 'left',
//         //                 fontSize: 24,
//         //                 fontWeight: '600',
//         //                 color: 'black',
//         //             }}>
//         //                 {"Group Color"}
//         //             </Text>
//         //         </View>
//         //         <View style={{
//         //             width: "100%", flexDirection: "row",
//         //         }}>
//         //             <View style={{
//         //                 width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
//         //                 marginTop: 5, marginHorizontal: 20, paddingTop: 7, paddingBottom: 12, paddingHorizontal: 15,
//         //                 justifyContent: "flex-start", alignItems: "center",
//         //                 borderWidth: 2, borderColor: 'black', borderRadius: 5,
//         //             }}>
//         //                 <TextInput placeholder={"Red"} onChangeText={(text) => setColor(text)} value={color}
//         //                     multiline={true}
//         //                     style={{
//         //                         minHeight: 20, width: "100%",
//         //                         backgroundColor: "#6660",
//         //                         textAlign: 'left',
//         //                         fontSize: 18,
//         //                         fontWeight: '600',
//         //                         color: '#444',
//         //                     }}
//         //                 />
//         //             </View>
//         //         </View>
//         //         {/* Save Group Data */}
//         //         {/* <TouchableOpacity onPress={updateGroupSettings} activeOpacity={0.7} */}
//         //         <TouchableOpacity activeOpacity={0.7}
//         //             style={{
//         //                 width: 200, height: 50,
//         //                 marginTop: 20,
//         //                 justifyContent: "center", alignItems: "center", flexDirection: "row",
//         //                 backgroundColor: "#afc",
//         //                 borderColor: "#000", borderWidth: 2, borderRadius: 10,
//         //             }}>
//         //             <Text style={{
//         //                 textAlign: "center",
//         //                 fontSize: 18,
//         //                 fontWeight: '600',
//         //                 color: 'black', marginRight: 0
//         //             }}>
//         //                 {"Save Group Data Changes"}
//         //             </Text>
//         //         </TouchableOpacity>
//         //         {/* Delete Group */}
//         //         <TouchableOpacity onPress={deleteGroup} activeOpacity={0.7}
//         //             style={{
//         //                 width: 200, height: 50,
//         //                 marginTop: 20,
//         //                 justifyContent: "center", alignItems: "center", flexDirection: "row",
//         //                 backgroundColor: "#fac",
//         //                 borderColor: "#000", borderWidth: 2, borderRadius: 10,
//         //             }}>
//         //             <Text style={{
//         //                 textAlign: "center",
//         //                 fontSize: 18,
//         //                 fontWeight: '600',
//         //                 color: 'black', marginRight: 0
//         //             }}>
//         //                 {"Delete Group"}
//         //             </Text>
//         //         </TouchableOpacity>
//         //         {/* Leave Group */}
//         //         <TouchableOpacity onPress={leaveGroup} activeOpacity={0.7}
//         //             style={{
//         //                 width: 200, height: 50,
//         //                 marginTop: 20,
//         //                 justifyContent: "center", alignItems: "center", flexDirection: "row",
//         //                 backgroundColor: "#ccc",
//         //                 borderColor: "#000", borderWidth: 2, borderRadius: 10,
//         //             }}>
//         //             <Text style={{
//         //                 textAlign: "center",
//         //                 fontSize: 18,
//         //                 fontWeight: '600',
//         //                 color: 'black', marginRight: 0
//         //             }}>
//         //                 {"Leave Group"}
//         //             </Text>
//         //         </TouchableOpacity>
//         //         {/* Add Owner by phone number */}
//         //         <View style={{
//         //             width: "100%", minHeight: 30,
//         //             marginHorizontal: 20, marginTop: 15,
//         //             justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
//         //             backgroundColor: "#6660",
//         //         }}>
//         //             <Text style={{
//         //                 paddingLeft: 20,
//         //                 textAlign: 'left',
//         //                 fontSize: 24,
//         //                 fontWeight: '600',
//         //                 color: 'black',
//         //             }}>
//         //                 {"Add/remove Owner by phone number"}
//         //             </Text>
//         //         </View>
//         //         <View style={{
//         //             width: "100%", flexDirection: "row",
//         //         }}>
//         //             <View style={{
//         //                 width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
//         //                 marginTop: 5, marginHorizontal: 20, paddingTop: 7, paddingBottom: 12, paddingHorizontal: 15,
//         //                 justifyContent: "flex-start", alignItems: "center",
//         //                 borderWidth: 2, borderColor: 'black', borderRadius: 5,
//         //             }}>
//         //                 <TextInput placeholder={"6505551234..."} onChangeText={(text) => { setOwner(text) }} value={owner}
//         //                     multiline={true}
//         //                     style={{
//         //                         minHeight: 20, width: "100%",
//         //                         backgroundColor: "#6660",
//         //                         textAlign: 'left',
//         //                         fontSize: 18,
//         //                         fontWeight: '600',
//         //                         color: '#444',
//         //                     }}
//         //                 />
//         //             </View>
//         //         </View>
//         //         {/* owner button */}
//         //         <TouchableOpacity onPress={reassignOwner} activeOpacity={0.7}
//         //             style={{
//         //                 width: 200, height: 50,
//         //                 marginTop: 20,
//         //                 justifyContent: "center", alignItems: "center", flexDirection: "row",
//         //                 backgroundColor: "#ccc",
//         //                 borderColor: "#000", borderWidth: 2, borderRadius: 10,
//         //             }}>
//         //             <Text style={{
//         //                 textAlign: "center",
//         //                 fontSize: 18,
//         //                 fontWeight: '600',
//         //                 color: 'black', marginRight: 0
//         //             }}>
//         //                 {"owner button"}
//         //             </Text>
//         //         </TouchableOpacity>
//         //     </ScrollView>
//         //     {/* <View style={{
//         //         width: "100%", minHeight: 100,
//         //         flex: 1, flexGrow: 0, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", 
//         //     }}>

//         //     </View> */}
//         // </SafeAreaView>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         width: "100%", height: "100%",
//         paddingVertical: 20,
//         paddingHorizontal: 10,
//         alignItems: 'center',
//     },
// })

return (
    <SafeAreaView style={styles.mainContainer}>
        {/* <ScrollView
            width={'100%'}
            contentContainerStyle={{
                justifyContent: "flex-start",
                flexDirection: "column",
            }}
        >
            <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                    setIsLoadingGroupSettings(true);
                    goForward();
                }}
                style={styles.groupListItemComponent}
            >
                <View style={styles.groupSettingsContainer}>
                    <View style={styles.groupSettingsLeftHalf}>
                        <Icon
                            name='folder-shared'
                            type='material'
                            color='#363732'
                            size={35}
                            style={{ marginRight: 6 }}
                        />
                        <Text style={styles.overviewText}>
                            View Group Settings
                        </Text>

                    </View>

                    {(isLoadingGroupSettings)
                        ? <ActivityIndicator
                            size="small"
                            color="#363732"
                            style={{ marginRight: 10 }}
                        />
                        : <Icon
                            name='chevron-right'
                            type='entypo'
                            color='#363732'
                            size={30}
                            style={{ marginRight: 10 }}
                        />
                    }
                </View>
            </TouchableOpacity>

            <View style={styles.innerContainer}>
                <View style={[styles.settingsBar, { backgroundColor: getHexValue(groupColor), }]}>
                    <View style={styles.topicSettingsBlock}>
                        <Text style={styles.topicSettingsText}>
                            Topic Settings:
                        </Text>
                    </View>
                    {isGeneral
                        ? null
                        : <View>
                            <Menu>
                                <MenuTrigger>
                                    <Icon
                                        name='dots-three-horizontal'
                                        type='entypo'
                                        color='black'
                                        size={30}
                                    />
                                </MenuTrigger>
                                {(topicObjectForPassing.topicOwner === auth.currentUser.uid)
                                    ? <MenuOptions
                                        style={{
                                            borderRadius: 12, backgroundColor: "#fff",
                                        }}
                                        customStyles={{
                                            optionsContainer: {
                                                borderRadius: 15, backgroundColor: "#666",
                                            },
                                        }}>
                                        <View style={{
                                            borderBottomWidth: 7,
                                            borderColor: "#dedede",
                                        }}>
                                            <MenuOption
                                                onSelect={() => transferTopicOwnership()}
                                                style={{
                                                    margin: 10,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    alignSelf: 'center',
                                                }}>
                                                <Icon
                                                    name='crown'
                                                    type='material-community'
                                                    color='#363732'
                                                    size={16}
                                                    style={{ marginLeft: 10, }}
                                                />
                                                <Text style={{
                                                    fontSize: 14, color: 'black', marginLeft: 10,
                                                }}>
                                                    Transfer Ownership
                                                </Text>
                                            </MenuOption>
                                        </View>
                                        <MenuOption
                                            onSelect={() => deleteTopic()}
                                            style={{ marginBottom: 10, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon
                                                name='trash'
                                                type='feather'
                                                color='red'
                                                size={16}
                                                style={{ marginLeft: 10, }}
                                            />
                                            <Text style={{ fontSize: 14, color: 'red', marginLeft: 11 }}>
                                                Delete Topic
                                            </Text>
                                        </MenuOption>
                                    </MenuOptions>
                                    : <MenuOptions
                                        style={{
                                            borderRadius: 12, backgroundColor: "#fff",
                                        }}
                                        customStyles={{
                                            optionsContainer: {
                                                borderRadius: 15, backgroundColor: "#666",
                                            },
                                        }}>
                                        <MenuOption
                                            onSelect={() => leaveTopic()}
                                            style={{ margin: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon
                                                name='user-x'
                                                type='feather'
                                                color='red'
                                                size={16}
                                            />
                                            <Text style={{ fontSize: 14, color: 'red', marginLeft: 10 }}>
                                                Leave Topic
                                            </Text>
                                        </MenuOption>
                                    </MenuOptions>
                                }
                            </Menu>
                        </View>
                    }
                </View>

                <View style={styles.topicContext}>
                    <View style={styles.topicContextLeftHalf}>
                        <Icon
                            name="chatbubble-ellipses-outline"
                            type="ionicon"
                            color="#363732"
                            size={30}
                            style={{ marginRight: 12, alignItems: 'center', alignSelf: 'center', }}
                        />
                        <Text style={styles.topicText}>
                            {topicObjectForPassing.topicName}
                        </Text>
                    </View>
                    {isOwner
                        ? <View style={styles.ownerBadge}>
                            <Icon
                                name='crown'
                                type='material-community'
                                color='#363732'
                                size={16}
                            />
                        </View>
                        : null
                    }
                </View>

                {isEditing
                    ? <View style={styles.topicUsersInvolved}>
                        <View style={styles.topicMembersContainer}>
                            <View style={styles.topicMembersHeader}>
                                <Icon
                                    name='groups'
                                    type='material'
                                    color='#363732'
                                    size={24}
                                />
                                <Text style={styles.topicMembersTitle}>
                                    Topic Members:
                                </Text>
                            </View>

                            <View style={styles.memberEditContainer}>
                                <ScrollView containerStyle={{ paddingTop: 10 }}>
                                    {groupMembers.map((topicMember, index) => (
                                        <View style={styles.memberEditRow} key={index} id={index}>
                                            <View style={styles.member}>
                                                <View style={styles.memberLeftPortion}>
                                                    <Image
                                                        source={imageSelection(topicMember.pfp)}
                                                        style={{ width: 26, height: 26, borderRadius: 5, }}
                                                    />
                                                    <Text style={styles.memberName}>
                                                        {topicMember.name}
                                                    </Text>
                                                </View>
                                                <View style={styles.memberRightPortion}>
                                                    {(topicMember.uid === topicData.topicOwner)
                                                        ? <View style={{ marginRight: 25 }}>
                                                            <Icon
                                                                name='crown'
                                                                type='material-community'
                                                                color='#363732'
                                                                size={20}
                                                            />
                                                        </View>
                                                        : <View style={{ height: 55 }}>
                                                            <CheckBox
                                                                center
                                                                checked={topicMembers.includes(topicMember.uid)}
                                                                onPress={() => {
                                                                    if (topicMembers.includes(topicMember.uid)) {
                                                                        setTopicMembers((previous) => {
                                                                            return previous.filter((memberToKeep) => { return memberToKeep != topicMember.uid })
                                                                        })
                                                                    } else setTopicMembers((previous) => { return [...previous, topicMember.uid] });
                                                                }}
                                                            />
                                                        </View>


                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                    }
                                </ScrollView>
                            </View>
                            {isGeneral
                                ? null
                                : <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => {
                                        setIsLoadingSaveButton(true);
                                        setIsLoadingEditButton(false);
                                        addNewTopicMembersToDatabase();
                                    }}
                                >
                                    <View style={styles.buttonSpacing}>
                                        <View style={[styles.buttonSave, { borderColor: '#363732', }]}>
                                            <Text style={styles.buttonSaveText}>
                                                SAVE
                                            </Text>

                                            {(isLoadingSaveButton)
                                                ? <ActivityIndicator
                                                    size="small"
                                                    color="white"
                                                />
                                                : <Icon
                                                    name="check-bold"
                                                    type="material-community"
                                                    size={20}
                                                    color="white"
                                                />
                                            }
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    : <View style={styles.topicUsersInvolved}>
                        <View style={styles.topicOwnerContainer}>
                            <View style={styles.topicOwnerHeader}>
                                <Icon
                                    name='crown'
                                    type='material-community'
                                    color='#363732'
                                    size={20}
                                />
                                <Text style={styles.topicOwnerTitle}>
                                    Topic Owner:
                                </Text>
                            </View>

                            <View style={styles.topicOwnerValueField}>
                                {isLoadingEditContent
                                    ? <View>
                                        <SkeletonContent
                                            containerStyle={{ flex: 1, width: '100%', }}
                                            animationDirection="horizontalRight"
                                            layout={[{ width: '50%', height: 16, marginTop: 2 },]}
                                        />
                                    </View>
                                    : <View>
                                        {groupMembers
                                            .filter(memberObject => (memberObject.uid === topicData.topicOwner))
                                            .map((topicOwnerData, index) => (
                                                <Text style={styles.topicOwnerNameText} key={index} id={index}>
                                                    {topicOwnerData.name}
                                                </Text>
                                            ))}
                                    </View>
                                }
                            </View>
                        </View>


                        <View style={styles.topicMembersContainer}>
                            <View style={styles.topicMembersHeader}>
                                <Icon
                                    name='groups'
                                    type='material'
                                    color='#363732'
                                    size={24}
                                />
                                <Text style={styles.topicMembersTitle}>
                                    Topic Members:
                                </Text>
                            </View>

                            <View style={styles.memberEditContainer}>
                                <ScrollView containerStyle={{ paddingTop: 10 }}>
                                    {isLoadingEditContent
                                        ? <View style={{ display: 'flex', width: '100%', paddingRight: 25, }}>
                                            <SkeletonContent
                                                containerStyle={{ flex: 1, width: '100%', justifyContent: 'row' }}
                                                animationDirection="horizontalRight"
                                                layout={[
                                                    { width: '100%', height: 26, marginTop: 15, marginLeft: 6, display: 'flex', }
                                                ]}
                                            />
                                            <SkeletonContent
                                                containerStyle={{ flex: 1, width: '100%', justifyContent: 'row' }}
                                                animationDirection="horizontalRight"
                                                layout={[
                                                    { width: '100%', height: 26, marginTop: 35, marginLeft: 6, display: 'flex', }
                                                ]}
                                            />
                                            <SkeletonContent
                                                containerStyle={{ flex: 1, width: '100%', justifyContent: 'row' }}
                                                animationDirection="horizontalRight"
                                                layout={[
                                                    { width: '100%', height: 26, marginTop: 35, marginLeft: 6, display: 'flex', }
                                                ]}
                                            />
                                            <SkeletonContent
                                                containerStyle={{ flex: 1, width: '100%', justifyContent: 'row' }}
                                                animationDirection="horizontalRight"
                                                layout={[
                                                    { width: '100%', height: 26, marginTop: 35, marginLeft: 6, display: 'flex', }
                                                ]}
                                            />
                                        </View>
                                        : <View>
                                            {groupMembers
                                                .filter(memberObject => topicMembers.includes(memberObject.uid))
                                                .map((topicMember, index) => (
                                                    <View style={styles.memberEditRow} key={index} id={index}>
                                                        <View style={styles.member}>
                                                            <View style={styles.memberLeftPortion}>
                                                                <Image
                                                                    source={imageSelection(topicMember.pfp)}
                                                                    style={{ width: 26, height: 26, borderRadius: 5, }}

                                                                />
                                                                <Text style={styles.memberName}>
                                                                    {topicMember.name}
                                                                </Text>
                                                            </View>

                                                            <View style={styles.memberRightPortion}>
                                                                {(topicMember.uid === topicData.topicOwner)
                                                                    ? <View style={{ marginRight: 25 }}>
                                                                        <Icon
                                                                            name='crown'
                                                                            type='material-community'
                                                                            color='#363732'
                                                                            size={20}
                                                                        />
                                                                    </View>
                                                                    : null
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))}
                                        </View>
                                    }
                                </ScrollView>
                            </View>
                            {isGeneral
                                ? null
                                : <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => {
                                        console.log(topicData)
                                        console.log(checkBoom)
                                        setIsLoadingSaveButton(false);
                                        setIsLoadingEditButton(true);
                                        setIsEditing(true);
                                    }}
                                >
                                    <View style={styles.buttonSpacing}>
                                        <View style={[styles.buttonEdit, { borderColor: '#363732', }]}>
                                            <Text style={styles.buttonEditText}>
                                                EDIT
                                            </Text>
                                            {(isLoadingEditButton)
                                                ? <ActivityIndicator
                                                    size="small"
                                                    color="#363732"
                                                />
                                                : <Icon
                                                    name="edit"
                                                    type="material"
                                                    size={20}
                                                    color="#363732"
                                                />
                                            }
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                }
            </View>
        </ScrollView> */}
    </SafeAreaView>
)
}

const styles = StyleSheet.create({
mainContainer: {
    backgroundColor: '#EFEAE2',
    height: '100%',
},

toolTipBlock: {
    height: 185,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2,
    shadowOpacity: .25,
},

groupSettingsContainer: {
    width: '95%',
    height: 60,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    shadowOpacity: .25,
    alignSelf: 'flex-end',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
},

groupSettingsLeftHalf: {
    marginLeft: 15,
    flexDirection: "row",
    alignItems: 'center',
},

overviewText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700'
},

innerContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 25,
    marginBottom: 30,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 5,
    shadowOpacity: .2,
},

settingsBar: {
    width: '100%',
    height: 58,
    alignSelf: 'center',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: '#363732',
    paddingRight: 15,
},

topicSettingsBlock: {
    backgroundColor: 'white',
    opacity: .85,
    borderRadius: 5,
    marginLeft: 15,
},

topicSettingsText: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    color: 'black',
    fontSize: 16,
    fontWeight: '700',
},

topicContext: {
    width: '100%',
    height: 58,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#363732',
    alignSelf: 'center',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
},

topicContextLeftHalf: {
    alignSelf: 'center',
    flexDirection: "row",
    alignItems: 'center',
    marginLeft: 15,
},

topicText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '800',
},

ownerBadge: {
    width: 26,
    height: 26,
    marginRight: 15,
    backgroundColor: "#F8D353",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
},

topicUsersInvolved: {
    width: '100%',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#363732',
    alignSelf: 'center',
    padding: 15,
},

topicOwnerContainer: {
    marginTop: 5,
    justifyContent: "center",
    marginBottom: 22,
},

topicOwnerHeader: {
    flexDirection: "row",
    alignItems: "center",
},

topicOwnerTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
},

topicOwnerValueField: {
    height: 40,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#9D9D9D',
    borderRadius: 3,
    fontSize: 16,
    textAlign: 'left',
    padding: 10,
    backgroundColor: '#F8F8F8',
    marginTop: 8,
},

topicOwnerNameText: {
    fontSize: 16,
    color: '#363732',
},

topicMembersContainer: {
    justifyContent: "center",
},

topicMembersHeader: {
    flexDirection: "row",
    alignItems: "center",
},

topicMembersTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
},

memberEditContainer: {
    marginTop: 8,
    width: '100%',
    height: 240,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#9D9D9D',
    borderRadius: 3,
    fontSize: 16,
    textAlign: 'left',
    backgroundColor: '#F8F8F8',
    marginBottom: 23,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingTop: 13,
    paddingBottom: 13,
},

memberEditRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 6,
    marginBottom: 10,
    marginTop: 10,
},

member: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
},

memberName: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 10
},

memberLeftPortion: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: 'center',
},

memberRightPortion: {
    alignSelf: 'center',
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
},

buttonSpacing: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
},

buttonEdit: {
    width: 125,
    height: 45,
    borderWidth: 3,
    borderStyle: 'solid',
    borderRadius: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
},

buttonSave: {
    width: 125,
    height: 45,
    backgroundColor: '#1174EC',
    borderWidth: 3,
    borderStyle: 'solid',
    borderRadius: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
},

buttonEditText: {
    color: '#363732',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 5,
},

buttonSaveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 5,
},

})


export default GroupSettings;