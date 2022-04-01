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
    CheckBox,
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
    MenuContext,
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

import SkeletonContent from 'react-native-skeleton-content';

// *************************************************************

const TopicSettings = ({ navigation, route }) => {

    const topicObjectForPassing = route.params.topicObjectForPassing;

    // const topicObjectForPassing = {
    //     color: color,
    //     coverImageNumber: coverImageNumber,
    //     groupId: groupId,
    //     groupName: groupName,
    //     groupOwner: groupOwner,
    //     topicId: currentTopic.id,
    //     topicName: data.topicName,
    //     topicOwner: data.topicOwner,
    //     topicMembers: data.members,
    // }

    const goBackward = () => navigation.navigate("Chat",
        {
            color: topicObjectForPassing.color,
            coverImageNumber: topicObjectForPassing.coverImageNumber,
            groupId: topicObjectForPassing.groupId,
            groupName: topicObjectForPassing.groupName,
            groupOwner: topicObjectForPassing.groupOwner,
            topicId: topicObjectForPassing.topicId,
            topicName: topicObjectForPassing.topicName,
            topicOwner: topicObjectForPassing.topicOwner,
            topicMembers: topicObjectForPassing.topicMembers,
        }
    )

    const goForward = () => {
        console.log('------- TOPIC', topicObjectForPassing)
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
                                    {/* <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Nunc quis orci quam. Donec sed posuere eros.
                                        Sed ut nulla quis elit egestas faucibus vel mollis justo.
                                        Donec eu varius mauris. Aliquam non felis risus.
                                        Ut auctor id felis vitae hendrerit. Aliquam erat.
                                    </Text> */}

                                    <Text style={{ fontSize: 18 }}>
                                        This screen allows you to see both the Topic Settings & Group Settings.
                                        Within each Topic or Group, you can view the members and the owner.
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
                                            onPress={() => Linking.openURL('https://www.familychat.app/')}
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

    const [useEffectGroupSnapshotData, setUseEffectGroupSnapshotData] = useState({});
    const [groupColor, setGroupColor] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const [topicMembers, setTopicMembers] = useState([]);
    const [isGeneral, setIsGeneral] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [topicData, setTopicData] = useState({})

    const getGroupMemberData = async (memberUID) => {

        const userSnapshot = await db
            .collection('users')
            .doc(memberUID)
            .get()
            .catch((error) => console.log(error));

        const userSnapshotData = userSnapshot.data();

        setGroupMembers((previous) => [...previous, {
            name: `${userSnapshotData.firstName} ${userSnapshotData.lastName}`,
            pfp: userSnapshotData.pfp,
            uid: memberUID,
        }]);
    }

    useEffect(() => {
        const unsubscribe = db
            .collection("groups")
            .doc(topicObjectForPassing.groupId)
            .onSnapshot(async (groupSnapshot) => {
                const groupSnapshotData = groupSnapshot.data();

                setUseEffectGroupSnapshotData({ ...groupSnapshotData, groupId: groupSnapshot.id })

                if (!groupSnapshotData.members.includes(auth.currentUser.uid)) {
                    alert(
                        `Woops! It seems that you're no longer a member of this group, so we've sent you back to the "Groups" tab.`,
                        "My Alert Msg",
                        [{ text: "OK" }]
                    );
                    navigation.navigate('GroupsTab');
                }

                setGroupColor(groupSnapshotData.color);

                try {
                    const topicSnapshot = await db
                        .collection('groups')
                        .doc(groupSnapshot.id)
                        .collection('topics')
                        .doc(topicObjectForPassing.topicId)
                        .get()
                        .catch((error) => console.log(error));

                    const topicSnapshotData = topicSnapshot.data();
                    const topicSnapshotMembers = topicSnapshotData.members;

                    if (!topicSnapshotMembers.includes(auth.currentUser.uid)) {
                        alert(
                            `Woops! It seems that you're no longer a member of this topic, so we've sent you back to the "General" topic.`,
                            "My Alert Msg",
                            [{ text: "OK" }]
                        );

                        const generalTopicSnapshot = await db
                            .collection("groups")
                            .doc(groupSnapshot.id)
                            .collection("topics")
                            .where("topicName", '==', 'General')
                            .get()
                            .catch((error) => console.log(error));

                        const generalTopicSnapshotData = generalTopicSnapshot.docs[0].data();

                        navigation.navigate('Chat',
                            {
                                color: groupSnapshotData.color,
                                coverImageNumber: groupSnapshotData.coverImageNumber,
                                topicId: generalTopicSnapshot.docs[0].id,
                                topicName: 'General',
                                groupId: groupSnapshot.id,
                                groupName: groupSnapshotData.groupName,
                                groupOwner: groupSnapshotData.groupOwner,
                            }
                        );
                    }

                    setTopicMembers(topicSnapshotMembers)

                    groupSnapshotData.members.map((memberUID, index) => {
                        getGroupMemberData(memberUID);
                    })

                    if (topicSnapshotData.topicName === 'General') setIsGeneral(true);
                    if (topicSnapshotData.topicOwner === auth.currentUser.uid) setIsOwner(true);

                    await setTopicData({
                        topicId: topicSnapshot.id,
                        topicName: topicSnapshotData.topicName,
                        topicOwner: topicSnapshotData.topicOwner,
                    })

                    setIsLoadingEditContent(false)

                } catch (error) { console.log(error) };
            });

        return () => {
            setGroupColor();
            setGroupMembers([]);
            setTopicMembers([]);
            setTopicData({});
            unsubscribe;
        }
    }, []);

    const [isEditing, setIsEditing] = useState(false);

    const [isLoadingGroupSettings, setIsLoadingGroupSettings] = useState(false);
    const [isLoadingEditContent, setIsLoadingEditContent] = useState(true);
    const [isLoadingEditButton, setIsLoadingEditButton] = useState(false);
    const [isLoadingSaveButton, setIsLoadingSaveButton] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        setIsLoadingGroupSettings(false);
        setIsLoadingEditContent(true);
        setIsLoadingEditButton(false);
        setIsLoadingSaveButton(false);

        setTimeout(() => setIsLoadingEditContent(false), 1500);

        return () => {
            setIsLoadingGroupSettings();
            setIsLoadingEditContent();
            setIsLoadingEditButton();
            setIsLoadingSaveButton();
        };
    }, [isFocused]);

    const leaveTopic = async () => {

        const groupID = useEffectGroupSnapshotData.groupId;
        const topicID = topicObjectForPassing.topicId;

        const removeUserFromTopicMembers = await db
            .collection('groups')
            .doc(groupID)
            .collection('topics')
            .doc(topicID)
            .update({
                members: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.uid)
            })
            .catch((error) => console.log(error));

        const removeTopicMapValueFromUser = await db
            .collection('users')
            .doc(auth.currentUser.uid)
            .set(
                {
                    topicMap: {
                        [topicID]: firebase.firestore.FieldValue.delete(),
                    },
                },
                { merge: true }
            )
            .catch((error) => console.log(error));

        const generalTopicSnapshot = await db
            .collection("groups")
            .doc(groupID)
            .collection("topics")
            .where("topicName", '==', 'General')
            .get()
            .catch((error) => console.log(error));

        const generalTopicSnapshotData = generalTopicSnapshot.docs[0].data();

        alert(
            `You successfully left the topic.`,
            "Alert Message",
            [{ text: "OK" }]
        );

        console.log('[User Leaves Topic] Alert sent + Navigating to General')

        navigation.navigate('Chat',
            {
                color: useEffectGroupSnapshotData.color,
                coverImageNumber: useEffectGroupSnapshotData.coverImageNumber,
                topicId: topicID,
                topicName: 'General',
                groupId: groupID,
                groupName: useEffectGroupSnapshotData.groupName,
                groupOwner: useEffectGroupSnapshotData.groupOwner,
            }
        );
    }

    const transferTopicOwnership = async () => {

        // Trigger an Overlay, for the user to choose new Owner

        const groupID = useEffectGroupSnapshotData.groupId;
        const topicID = topicObjectForPassing.topicId;

        const newOwner = auth.currentUser.uid;

        await db
            .collection('groups')
            .doc(groupID)
            .collection('topics')
            .doc(topicID)
            .update({
                topicOwner: newOwner
            });

    }

    const deleteTopic = async () => {

        const groupID = useEffectGroupSnapshotData.groupId;
        const topicID = topicObjectForPassing.topicId;

        const topicSnapshot = await db
            .collection('groups')
            .doc(groupID)
            .collection('topics')
            .doc(topicID)
            .get();

        const databaseListOfTopicMembers = topicSnapshot.data().members;

        databaseListOfTopicMembers.map(async (memberUID, index) => {
            const removeTopicMapValueFromUser = await db
                .collection('users')
                .doc(memberUID)
                .set(
                    {
                        topicMap: {
                            [topicID]: firebase.firestore.FieldValue.delete(),
                        },
                    },
                    { merge: true }
                )
                .catch((error) => console.log(error));
        })

        try {
            const chatRef = await db.collection('chats').doc(topicID).collection('messages').get()

            if (chatRef) {
                chatRef.docs.map((topicMessage) => {
                    db.collection('chats').doc(topicID).collection('messages').doc(topicMessage.id).delete()
                })
            }


        } catch (error) {
            alert(error)
        } finally {
            try {
                await db.collection('chats').doc(topicID).delete();
                await db.collection('groups').doc(groupID).collection('topics').doc(topicID).delete();

                // Have GeneralID passed over from ChatScreen

                const generalTopicSnapshot = await db
                    .collection("groups")
                    .doc(groupID)
                    .collection("topics")
                    .where("topicName", '==', 'General')
                    .get()
                    .catch((error) => console.log(error));

                const generalTopicSnapshotData = generalTopicSnapshot.docs[0].data();

                alert(
                    `You successfully deleted the topic.`,
                    "Alert Message",
                    [{ text: "OK" }]
                );

                console.log('[Owner Deletes Topic] Alert sent + Navigating to General')

                navigation.navigate('Chat',
                    {
                        color: useEffectGroupSnapshotData.color,
                        coverImageNumber: useEffectGroupSnapshotData.coverImageNumber,
                        topicId: topicID,
                        topicName: 'General',
                        groupId: groupID,
                        groupName: useEffectGroupSnapshotData.groupName,
                        groupOwner: useEffectGroupSnapshotData.groupOwner,
                    }
                );

            } catch (error) { console.log(error) };
        }
    }

    const addNewTopicMembersToDatabase = async () => {

        const topicID = topicData.topicId;

        const topicSnapshot = await db
            .collection('groups')
            .doc(topicObjectForPassing.groupId)
            .collection('topics')
            .doc(topicID)
            .get();

        const databaseListOfTopicMembers = topicSnapshot.data().members;

        let membersToRemoveArray = [];
        const checkForMembersToRemove = await databaseListOfTopicMembers.map((memberUID, index) => {
            if (!topicMembers.includes(memberUID)) membersToRemoveArray.push(memberUID);
        })

        let membersToAddArray = [];
        const checkForMembersToAdd = await topicMembers.map((memberUID, index) => {
            if (!databaseListOfTopicMembers.includes(memberUID)) membersToAddArray.push(memberUID);
        })

        if (membersToRemoveArray.length > 0) {
            membersToRemoveArray.map(async (memberUIDToRemove, index) => {
                await db
                    .collection('groups')
                    .doc(topicObjectForPassing.groupId)
                    .collection('topics')
                    .doc(topicID)
                    .update({
                        members: firebase.firestore.FieldValue.arrayRemove(memberUIDToRemove)
                    });

                const removeTopicMapValue = await db
                    .collection('users')
                    .doc(memberUIDToRemove)
                    .set(
                        {
                            topicMap: {
                                [topicID]: firebase.firestore.FieldValue.delete(),
                            },
                        },
                        { merge: true }
                    );
            })
        }

        if (membersToAddArray.length > 0) {
            membersToAddArray.map(async (memberUIDToAdd, index) => {
                await db
                    .collection('groups')
                    .doc(topicObjectForPassing.groupId)
                    .collection('topics')
                    .doc(topicData.topicId)
                    .update({
                        members: firebase.firestore.FieldValue.arrayUnion(memberUIDToAdd)
                    });

                const addTopicMapValue = await db
                    .collection('users')
                    .doc(memberUIDToAdd)
                    .update(
                        {
                            topicMap: {
                                [topicID]: firebase.firestore.FieldValue.serverTimestamp()
                            },
                        },
                        { merge: true }
                    );
            })
        }

        setIsEditing(false);
    }

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
                                                    // onSelect={() => transferTopicOwnership()}
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
                                                        color='#9D9D9D'
                                                        size={16}
                                                        style={{ marginLeft: 10, }}
                                                    />
                                                    <Text style={{
                                                        fontSize: 14, color: '#9D9D9D', marginLeft: 10, textDecorationLine: 'line-through'
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
                                {(!isGeneral && isOwner)
                                    ? <TouchableOpacity
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
                                    : null
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
                                {(!isGeneral && isOwner)
                                    ? <TouchableOpacity
                                        activeOpacity={0.75}
                                        onPress={() => {
                                            console.log(topicData)
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
                                    : null
                                }
                            </View>
                        </View>
                    }
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

export default TopicSettings;