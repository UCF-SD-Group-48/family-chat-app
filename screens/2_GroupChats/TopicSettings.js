// *************************************************************
// Imports for: React, React Native, & React Native Elements
import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import {
    ActivityIndicator,
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
    Dimensions,
} from 'react-native';
import {
    Alert,
    Avatar,
    Button,
    Icon,
    Image,
    Input,
    Tooltip,
    Overlay,
} from 'react-native-elements';
import { HoldItem } from 'react-native-hold-menu';

// Imports for: Expo
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import ImagePicker from 'expo-image-picker';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AntDesign, Feather, Entypo, Ionicons, FontAwesome5, Fontisto } from "@expo/vector-icons";

// Imports for: Firebase
import {
    apps,
    auth,
    db,
    firebaseConfig
} from '../../firebase';
import firebase from 'firebase/compat/app';
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";

import { useIsFocused } from '@react-navigation/native';
import { G } from 'react-native-svg';

import { getHexValue, imageSelection } from '../5_Supplementary/GenerateProfileIcon';



// *************************************************************

const TopicSettings = ({ navigation, route }) => {

    const topicObjectForPassing = route.params.topicObjectForPassing;

    const goBackward = () => navigation.navigate("Chat",
        {
            color: topicObjectForPassing.color,
            groupId: topicObjectForPassing.groupId,
            groupName: topicObjectForPassing.groupName,
            groupOwner: topicObjectForPassing.groupOwner,
            topicId: topicObjectForPassing.topicId,
            topicName: topicObjectForPassing.topicName,
        }
    )


    const goForward = () => {
        console.log(topicObjectForPassing)
        navigation.push("GroupSettings", { topicObjectForPassing })
    }

    const [toggleWindowWidth, setToggleWindowWidth] = useState(() => {
        const windowWidth = Dimensions.get('window').width;
        return (windowWidth * .93);
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Settings',
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
            headerRight: () => (
                <View
                    style={{
                        flexDirection: "row",
                        marginRight: 12,
                    }}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Tooltip
                            width={toggleWindowWidth}
                            backgroundColor={'#DFD7CE'}
                            containerStyle={styles.toolTipBlock}
                            popover={
                                <View style={{ margin: 15 }}>
                                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Nunc quis orci quam. Donec sed posuere eros.
                                        Sed ut nulla quis elit egestas faucibus vel mollis justo.
                                        Donec eu varius mauris. Aliquam non felis risus.
                                        Ut auctor id felis vitae hendrerit. Aliquam erat.
                                    </Text>

                                    <View style={{ flexDirection: "row", marginTop: 10, alignItems: 'center' }}>
                                        <Icon
                                            name='arrow-right-alt'
                                            type='material'
                                            size={25}
                                            color='#9D9D9D'
                                        />
                                        <Text style={{ fontWeight: '600', marginLeft: 5, marginRight: 5, }}>Still have questions?</Text>
                                        <Text
                                            style={{ color: 'blue', fontWeight: '600' }}
                                            onPress={() => Linking.openURL('https://www.familychat.app/FAQ')}
                                        >
                                            Visit our FAQ.
                                        </Text>
                                    </View>
                                </View>

                            }>
                            <Icon
                                name='help'
                                type='material'
                                size={24}
                                color='#363732'
                            />
                        </Tooltip>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const [groupMembersList, setGroupMembersList] = useState([]);

    const getGroupMembers = async () => {
        let isOwner = false;

        try {
            const snapshot = await db
                .collection('groups')
                .doc(topicObjectForPassing.groupId)
                .get()

            const membersArray = snapshot.data().members;

            membersArray.forEach(async (memberUID) => {
                const memberQuery = await db
                    .collection('users')
                    .doc(memberUID)
                    .get()

                const snapshot = memberQuery.data();

                if (snapshot.uid === topicObjectForPassing.topicOwner) isOwner = true;
                else isOwner = false;

                const searchedMember = {
                    uid: memberUID,
                    name: `${snapshot.firstName} ${snapshot.lastName}`,
                    pfp: snapshot.pfp,
                    topicOwner: isOwner,
                }

                setGroupMembersList((previous) => [...previous, searchedMember])
            })
        } catch (error) { console.log(error) };
    }

    useEffect(() => {
        getGroupMembers();

        return () => {
            setGroupMembersList();
        }
    }, [navigation])

    const [isLoading, setIsLoading] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        setIsLoading(false);

        return () => {
            setIsLoading();
        };
    }, [isFocused]);

    // let isOwner = false;

    // const [topicOwnerUID, setTopicOwnerUID] = useState({});
    // const [topicOwner, setTopicOwner] = useState({});
    // const [topicData, setTopicData] = useState({});
    // const [topicMembers, setTopicMembers] = useState([]);
    // const [checked, setChecked] = useState([auth.currentUser.uid])

    // const getTopicData = async () => {
    //     if (topicName === "General") {
    //         const groupQuery = await db
    //             .collection('groups')
    //             .doc(groupId)
    //             .get()
    //             .then(async (groupQueryResult) => {
    //                 if (!groupQueryResult.empty) {
    //                     const groupData = groupQueryResult.data();
    //                     console.log('groupData:', groupData)
    //                     setTopicData(groupData)
    //                     console.log('MEMBER UID', topicOwner)

    //                     const groupMembers = groupData.members;

    //                     groupMembers.map((memberUID, index) => {
    //                         const query = db
    //                             .collection('users')
    //                             .doc(memberUID)
    //                             .get()
    //                             .then((userQueryResult) => {
    //                                 if (!userQueryResult.empty) {
    //                                     const snapshot = userQueryResult.data();

    //                                     console.log('TOPIC DATA', topicData)
    //                                     console.log('MEMBER UID', memberUID)
    //                                     console.log('MEMBER UID', topicOwner)

    //                                     if (memberUID === topicData.topicOwner) isOwner = true;
    //                                     else isOwner = false;

    //                                     const searchedMember = {
    //                                         uid: memberUID,
    //                                         name: `${snapshot.firstName} ${snapshot.lastName}`,
    //                                         pfp: snapshot.pfp,
    //                                         owner: isOwner,
    //                                     }

    //                                     if (isOwner) setTopicOwner(searchedUser)
    //                                     setTopicMembers((previous) => [...previous, searchedMember])
    //                                 }
    //                             })
    //                     })
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.log(error)
    //             })
    //     }
    //     else {
    //         const topicQuery = await db
    //             .collection('groups')
    //             .doc(groupId)
    //             .collection('topics')
    //             .doc(topicId)
    //             .get()
    //             .then((topicQueryResult) => {
    //                 if (!topicQueryResult.empty) {
    //                     const resultData = topicQueryResult.data();
    //                     console.log('topicData:', resultData)
    //                     setTopicData(resultData)

    //                     const topicMembers = resultData.members;
    //                     topicMembers.map((memberUID, index) => {
    //                         console.log (topicData)
    //                         const query = db
    //                             .collection('users')
    //                             .doc(memberUID)
    //                             .get()
    //                             .then((userQueryResult) => {
    //                                 if (!userQueryResult.empty) {
    //                                     const snapshot = userQueryResult.data();

    //                                     console.log('TOPIC DATA', topicData)
    //                                     console.log('MEMBER UID', memberUID)


    //                                     if (memberUID === topicData.topicOwner) isOwner = true;
    //                                     else isOwner = false;

    //                                     const searchedMember = {
    //                                         uid: memberUID,
    //                                         name: `${snapshot.firstName} ${snapshot.lastName}`,
    //                                         pfp: snapshot.pfp,
    //                                         owner: isOwner,
    //                                     }

    //                                     if (isOwner) setTopicOwner(searchedUser)
    //                                     setTopicMembers((previous) => [...previous, searchedMember])
    //                                 }
    //                             })
    //                     })
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.log(error)
    //             })
    //     }
    // }

    // useEffect(() => {
    //     getTopicData();
    //     // if (topicName === "General") getTopicOwner(groupOwner)
    //     // else {
    //     //     console.log('this?', topicData)
    //     //     getTopicOwner(topicData.topicOwner)
    //     // }

    //     return () => {
    //         setTopicOwner();
    //         setTopicData();
    //         setTopicMembers();
    //     };
    // }, []);

    const triggerMenuOptions = () => {
        console.log('triggerMenuOptions()')
    }

    const [isEditing, setIsEditing] = useState(false);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView
                width={'100%'}
                contentContainerStyle={{
                    justifyContent: "flex-start",
                    flexDirection: "column",
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => {
                        setIsLoading(true);
                        goForward();
                    }}
                    style={styles.groupListItemComponent}
                >
                    <View style={styles.groupSettingsContainer}>
                        <View style={styles.leftHalf}>
                            <Icon
                                name='cog-box'
                                type='material-community'
                                color='#363732'
                                size={40}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={styles.overviewText}>
                                View Group Settings
                            </Text>

                        </View>

                        {isLoading
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
                    <View style={[styles.settingsBar, { backgroundColor: getHexValue(topicObjectForPassing.color), }]}>
                        <View style={styles.topicSettingsBlock}>
                            <Text style={styles.topicSettingsText}>
                                Topic Settings:
                            </Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => triggerMenuOptions()}>
                            <Icon
                                name='dots-three-horizontal'
                                type='entypo'
                                color='black'
                                size={30}
                                style={{ marginRight: 10 }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.topicContext}>
                        <View style={styles.leftHalf}>
                            <Icon
                                name="chatbubble-ellipses-outline"
                                type="ionicon"
                                size={24}
                                color="#363732"
                            />
                            <Text style={styles.topicText}>
                                {topicObjectForPassing.topicName}
                            </Text>
                        </View>
                        {(topicObjectForPassing.topicOwner === auth.currentUser.uid)
                            ? <View style={styles.ownerBadge}>
                                <Icon
                                    name='crown'
                                    type='material-community'
                                    color='#363732'
                                    size={16}
                                // style={{ marginRight: 10 }}
                                />
                            </View>
                            : null
                        }
                    </View>

                    <View style={styles.topicUsersInvolved}>
                        <View style={styles.topicOwnerContainer}>
                            <View style={styles.topicOwnerHeader}>
                                <Icon
                                    name='crown'
                                    type='material-community'
                                    color='#363732'
                                    size={16}
                                // style={{ marginRight: 10 }}
                                />
                                <Text style={styles.topicOwnerTitle}>
                                    Topic Owner:
                                </Text>
                            </View>

                            <View style={styles.topicOwnerValueField}>
                                <Text style={styles.topicOwnerNameText}>
                                    {topicObjectForPassing.topicOwner}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.topicMembersContainer}>
                            <View style={styles.topicMembersHeader}>
                                <Icon
                                    name='groups'
                                    type='material'
                                    color='#363732'
                                    size={16}
                                // style={{ marginRight: 10 }}
                                />
                                <Text style={styles.topicMembersTitle}>
                                    Topic Members:
                                </Text>
                            </View>

                            {/* <View style={styles.topicMembersContainer}> */}
                            {/* <ScrollView contentContainerStyle={{ width: "100%", paddingLeft: 20, height: 200, backgroundColor: 'lightgrey' }}> */}
                            {groupMembersList == undefined
                                ? <View> <Text> UNDEFINED </Text> </View>
                                :
                                <View style={styles.topicMembersContainer}>

                                    {
                                        groupMembersList.filter((groupMember) => topicObjectForPassing.topicMembers.includes(groupMember.uid)).map((topicMember, index) => (
                                            <View style={styles.memberEditRow} key={index} id={index}>
                                                <View style={styles.member}>
                                                    <Image
                                                        source={imageSelection(topicMember.pfp)}
                                                        style={{ width: 30, height: 30, borderRadius: 5 }}
                                                    />
                                                    <Text style={styles.memberName}>
                                                        {topicMember.name}
                                                    </Text>
                                                </View>
                                                {topicMember.topicOwner
                                                    ? <View> <Text> YES </Text> </View>
                                                    // <View style={styles.ownerBadge}>
                                                    //     <Icon
                                                    //         name='crown'
                                                    //         type='material-community'
                                                    //         color='#363732'
                                                    //         size={16}
                                                    //     // style={{ marginRight: 10 }}
                                                    //     />
                                                    // </View>
                                                    : null
                                                }
                                            </View>
                                        ))
                                    }
                                </View>
                            }

                            {/* {topicMembers.map((individualMember, index) => {
                                        <View style={styles.memberEditRow} key={index} id={index}>
                                            <View style={styles.member}>
                                                <Image
                                                    source={imageSelection(individualMember.pfp)}
                                                    style={{ width: 30, height: 30, borderRadius: 5 }}
                                                />
                                                <Text style={styles.memberName}>
                                                    {individualMember}
                                                </Text>
                                            </View>
                                        </View>

                                    })} */}
                            {/* <View>

                                    {topicMembers.map((data, index) => {
                                        <Text>
                                            {data}
                                        </Text>
                                    })}
                                </View> */}

                            {/* </ScrollView> */}
                            {/* </View> */}

                            <View>
                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => {
                                        console.log('OWNER:', topicOwner)
                                        console.log('MEMBERS:', topicMembers)

                                    }}
                                >
                                    <Text style={{ fontSize: 30, color: 'red' }}>
                                        CHECK MEMBERS
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {isEditing
                                ? <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => setIsEditing(false)}
                                >
                                    <View style={styles.buttonSpacing}>
                                        <View style={[styles.buttonSave, { borderColor: '#363732', }]}>
                                            <Text style={styles.buttonSaveText}>
                                                SAVE
                                            </Text>
                                            <Icon
                                                name="check-bold"
                                                type="material-community"
                                                size={20}
                                                color="white"
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                : <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => setIsEditing(true)}
                                >
                                    <View style={styles.buttonSpacing}>
                                        <View style={[styles.buttonEdit, { borderColor: '#363732', }]}>
                                            <Text style={styles.buttonEditText}>
                                                EDIT
                                            </Text>
                                            <Icon
                                                name="edit"
                                                type="material"
                                                size={20}
                                                color="#363732"
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
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

    leftHalf: {
        marginLeft: 15,
        flexDirection: "row",
        alignItems: 'center',
    },

    overviewText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '700'
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
    }

})

export default TopicSettings;