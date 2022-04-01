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
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue, collection } from "firebase/firestore";

import { useIsFocused } from '@react-navigation/native';
import { G } from 'react-native-svg';

import { getHexValue, imageSelection } from '../5_Supplementary/GenerateProfileIcon';

import SkeletonContent from 'react-native-skeleton-content';

// Imports for: Components
import CustomListItem from '../../components/CustomListItem';
import LargeButton from '../../components/LargeButton';
import LargeTitle from '../../components/LargeTitle';
import LineDivider from '../../components/LineDivider';
import LoginInput from '../../components/LoginInput';
import LoginText from '../../components/LoginText';
import UserPrompt from '../../components/UserPrompt';
import GroupListItem from '../../components/GroupListItem'
import { set } from 'react-native-reanimated';

import helpers from '../../helperFunctions/helpers';


// *************************************************************


const GroupSettings = ({ navigation, route }) => {

    const topicObjectForPassing = route.params.topicObjectForPassing;

    const goBackward = () => navigation.navigate("TopicSettings", { topicObjectForPassing })

    const [toggleWindowWidth, setToggleWindowWidth] = useState(() => {
        const windowWidth = Dimensions.get('window').width;
        return (windowWidth * .93);
    });

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

    const [useEffectGroupSnapshotData, setUseEffectGroupSnapshotData] = useState({});
    const [groupMembers, setGroupMembers] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [groupOwnerName, setGroupOwnerName] = useState('')
    const [topicCount, setTopicCount] = useState(0)
    const [groupMembersCount, setGroupMembersCount] = useState(0)

    const getGroupMemberData = async (memberUID, topicOwnerUID) => {

        const userSnapshot = await db
            .collection('users')
            .doc(memberUID)
            .get()
            .catch((error) => console.log(error));

        const userSnapshotData = userSnapshot.data();

        if (topicOwnerUID === memberUID) setGroupOwnerName(`${userSnapshotData.firstName} ${userSnapshotData.lastName}`)

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

                if (!groupSnapshotData.members.includes(auth.currentUser.uid)) {
                    alert(
                        `Woops! It seems that you're no longer a member of this group, so we've sent you back to the "Groups" tab.`,
                        "My Alert Msg",
                        [{ text: "OK" }]
                    );
                    navigation.navigate('GroupsTab');
                }

                setIsOwner(groupSnapshotData.groupOwner === auth.currentUser.uid)

                console.log('GROUP', groupSnapshotData)
                setUseEffectGroupSnapshotData({ ...groupSnapshotData, groupId: groupSnapshot.id })
                setGroupMembersCount(groupSnapshotData.members.length)

                try {

                    const topicSnapshot = await db
                        .collection('groups')
                        .doc(groupSnapshot.id)
                        .collection('topics')
                        .get()
                        .catch((error) => console.log(error));

                    await topicSnapshot.docs.map(doc => console.log(doc.id));

                    console.log('COUNT', topicSnapshot.docs.length)

                    setTopicCount(topicSnapshot.docs.length)

                    groupSnapshotData.members.map((memberUID, index) => {
                        getGroupMemberData(memberUID, groupSnapshotData.groupOwner);
                    })

                    console.log('??????????', groupOwnerName)

                    setIsLoadingEditContent(false)

                } catch (error) { console.log(error) };
            });

        return () => {
            setGroupMembers([]);
            setGroupOwnerName();
            unsubscribe;
        }
    }, []);

    const [isEditing, setIsEditing] = useState(false);

    const [isLoadingEditContent, setIsLoadingEditContent] = useState(true);
    const [isLoadingEditButton, setIsLoadingEditButton] = useState(false);
    const [isLoadingSaveButton, setIsLoadingSaveButton] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        setIsLoadingEditContent(true);
        setIsLoadingEditButton(false);
        setIsLoadingSaveButton(false);

        setTimeout(() => setIsLoadingEditContent(false), 3000);

        return () => {
            setIsLoadingEditContent();
            setIsLoadingEditButton();
            setIsLoadingSaveButton();
        };
    }, [isFocused]);


    const leaveGroup = async () => {

        const groupID = useEffectGroupSnapshotData.groupId;
        const topicID = topicObjectForPassing.topicId;

        // go to user
        // remove group from groupMap
        // get all group topics
        // 

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
            `You successfully left the group.`,
            "Alert Message",
            [{ text: "OK" }]
        );

        console.log('[User Leaves Group] Alert sent + Navigating to General')

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

    const transferGroupOwnership = async () => {

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

    const deleteGroup = async () => {

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

    const addNewTopicMembersToGroup = async () => {

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
                <View style={styles.innerContainer}>
                    <View style={[styles.settingsBar, { backgroundColor: getHexValue(useEffectGroupSnapshotData.color), }]}>
                        <View style={styles.groupSettingsBlock}>
                            <Text style={styles.groupSettingsText}>
                                Group Settings:
                            </Text>
                        </View>

                        {/* <View>
                            <Menu>
                                <MenuTrigger>
                                    <Icon
                                        name='dots-three-horizontal'
                                        type='entypo'
                                        color='black'
                                        size={30}
                                    />
                                </MenuTrigger>
                                {isOwner
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
                                            onSelect={() => deleteGroup()}
                                            style={{ marginBottom: 10, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon
                                                name='trash'
                                                type='feather'
                                                color='red'
                                                size={16}
                                                style={{ marginLeft: 10, }}
                                            />
                                            <Text style={{ fontSize: 14, color: 'red', marginLeft: 11 }}>
                                                Delete Group
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
                                            onSelect={() => leaveGroup()}
                                            style={{ margin: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon
                                                name='user-x'
                                                type='feather'
                                                color='red'
                                                size={16}
                                            />
                                            <Text style={{ fontSize: 14, color: 'red', marginLeft: 10 }}>
                                                Leave Group
                                            </Text>
                                        </MenuOption>
                                    </MenuOptions>
                                }
                            </Menu>
                        </View> */}
                    </View>

                    <View style={styles.groupContext}>
                        <View style={styles.groupContextLeftHalf}>
                            <Image
                                source={helpers.getGroupCoverImage(useEffectGroupSnapshotData.color, useEffectGroupSnapshotData.coverImageNumber)}
                                style={{
                                    width: 50, height: 50, borderRadius: 5, marginRight: 13
                                }}
                            />
                            <View style={styles.groupContextLeftHalfText}>
                                <Text style={styles.groupText}>
                                    {useEffectGroupSnapshotData.groupName}
                                </Text>
                                <View style={styles.groupContextLeftHalfMembers}>
                                    <Icon
                                        name='groups'
                                        type='material'
                                        color='#9D9D9D'
                                        size={25}
                                    />
                                    <Text style={styles.membersText}>
                                        {(groupMembersCount < 999) ? groupMembersCount : '999+'} Member{(groupMembersCount > 1) ? 's' : null}
                                    </Text>

                                </View>

                            </View>

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
                        ? <View style={styles.groupUsersInvolved}>
                            <View style={styles.groupMembersContainer}>
                                <View style={styles.groupMembersHeader}>
                                    <Icon
                                        name='groups'
                                        type='material'
                                        color='#363732'
                                        size={24}
                                    />
                                    <Text style={styles.groupMembersTitle}>
                                        Group Members:
                                    </Text>
                                </View>

{/* 
                                <View style={styles.searchResultsContainer}>
                                    {(searchResults === 'incomplete')
                                        ? <View style={styles.incompleteSearchResult}>
                                            <Text style={styles.incompleteSearchResultText}>
                                                No results
                                            </Text>
                                        </View>
                                        : (searchResults === 'exists')
                                            ? <View style={styles.userExistsSearchResult}>
                                                <View style={styles.userResult}>
                                                    <Image
                                                        source={imageSelection(searchedUser.pfp)}
                                                        style={{ width: 30, height: 30, borderRadius: 5 }}
                                                    />
                                                    <Text style={styles.completedSearchResultText}>
                                                        {searchedUser.name}
                                                    </Text>
                                                </View>
                                                {(groupMembers.some(memberObject => memberObject.name === searchedUser.name))
                                                    ? <View style={styles.memberExists}>
                                                        <Icon
                                                            name="check-bold"
                                                            type="material-community"
                                                            size={24}
                                                            color="white"
                                                        />
                                                    </View>
                                                    : <TouchableOpacity
                                                        activeOpacity={0.75}
                                                        onPress={() => { setMembersList([...membersList, searchedUser]) }}
                                                    >
                                                        <View style={[styles.searchResultsButtonAdd, { orderColor: '#2352DF', }]}>
                                                            <Text style={styles.searchResultsButtonAddText}>
                                                                ADD
                                                            </Text>
                                                            <Icon
                                                                name="person-add"
                                                                type="material"
                                                                size={18}
                                                                color="#2352DF"
                                                            />
                                                        </View>
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                            : <View style={styles.userNonexistentSearchResult}>
                                                <Text style={styles.completedSearchResultText}>
                                                    No user found.
                                                </Text>
                                                <TouchableOpacity
                                                    activeOpacity={0.75}
                                                    onPress={() => openTextMessage()}
                                                >
                                                    <View style={[styles.searchResultsButtonInvite, { orderColor: '#363732', }]}>
                                                        <Text style={styles.searchResultsButtonInviteText}>
                                                            App Invite
                                                        </Text>
                                                        <Icon
                                                            name="email-outline"
                                                            type="material-community"
                                                            size={18}
                                                            color="#363732"
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                    }
                                </View> */}



                                <View style={styles.memberEditContainer}>
                                    <ScrollView containerStyle={{ paddingTop: 10 }}>
                                        {groupMembers.map((groupMember, index) => (
                                            <View style={styles.memberEditRow} key={index} id={index}>
                                                <View style={styles.member}>
                                                    <View style={styles.memberLeftPortion}>
                                                        <Image
                                                            source={imageSelection(groupMember.pfp)}
                                                            style={{ width: 26, height: 26, borderRadius: 5, }}
                                                        />
                                                        <Text style={styles.memberName}>
                                                            {groupMember.name}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.memberRightPortion}>
                                                        {(groupMember.uid === useEffectGroupSnapshotData.groupOwner)
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
                                                                    checked={groupMembers.includes(groupMember.uid)}
                                                                    onPress={() => {
                                                                        if (groupMembers.includes(groupMember.uid)) {
                                                                            setGroupMembers((previous) => {
                                                                                return previous.filter((memberToKeep) => { return memberToKeep != groupMember.uid })
                                                                            })
                                                                        } else setGroupMembers((previous) => { return [...previous, groupMember.uid] });
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
                                {/* {isOwner
                                    ? <TouchableOpacity
                                        activeOpacity={0.75}
                                        onPress={() => {
                                            setIsLoadingSaveButton(true);
                                            setIsLoadingEditButton(false);
                                            addNewGroupMembersToDatabase();
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
                                } */}
                            </View>
                        </View>
                        : <View style={styles.groupUsersInvolved}>
                            <View style={styles.groupOwnerContainer}>
                                <View style={styles.groupOwnerHeader}>
                                    <Icon
                                        name='crown'
                                        type='material-community'
                                        color='#363732'
                                        size={20}
                                    />
                                    <Text style={styles.groupOwnerTitle}>
                                        Group Owner:
                                    </Text>
                                </View>

                                <View style={styles.groupOwnerValueField}>
                                    {isLoadingEditContent
                                        ? <View>
                                            <SkeletonContent
                                                containerStyle={{ flex: 1, width: '100%', }}
                                                animationDirection="horizontalRight"
                                                layout={[{ width: '50%', height: 16, marginTop: 2 },]}
                                            />
                                        </View>
                                        : <View>
                                            <Text style={styles.groupOwnerNameText}>
                                                {groupOwnerName}
                                            </Text>
                                        </View>
                                    }
                                </View>
                            </View>


                            <View style={styles.groupMembersContainer}>
                                <View style={styles.groupMembersHeader}>
                                    <Icon
                                        name='groups'
                                        type='material'
                                        color='#363732'
                                        size={24}
                                    />
                                    <Text style={styles.groupMembersTitle}>
                                        Group Members:
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
                                                    .map((groupMember, index) => (
                                                        <View style={styles.memberEditRow} key={index} id={index}>
                                                            <View style={styles.member}>
                                                                <View style={styles.memberLeftPortion}>
                                                                    <Image
                                                                        source={imageSelection(groupMember.pfp)}
                                                                        style={{ width: 26, height: 26, borderRadius: 5, }}

                                                                    />
                                                                    <Text style={styles.memberName}>
                                                                        {groupMember.name}
                                                                    </Text>
                                                                </View>

                                                                <View style={styles.memberRightPortion}>
                                                                    {(groupMember.uid === useEffectGroupSnapshotData.groupOwner)
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
                                <View style={styles.topicCountContainer}>
                                    <Icon
                                        name="chatbubble-ellipses-outline"
                                        type="ionicon"
                                        color="#363732"
                                        size={20}
                                        style={{ marginRight: 8 }}
                                    // style={{ marginRight: 12, alignItems: 'center', alignSelf: 'center', }}
                                    />
                                    <Text style={{ fontWeight: '800', marginRight: 5 }}>
                                        This group has:
                                    </Text>
                                    <Text>
                                        {(topicCount < 999) ? topicCount : '999+'} Topic{(topicCount > 1) ? 's' : null}
                                    </Text>
                                </View>
                                {/* {isOwner
                                    ? <TouchableOpacity
                                        activeOpacity={0.75}
                                        onPress={() => {
                                            // console.log(topicData)
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
                                } */}
                            </View>
                        </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView >
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

    groupContextLeftHalfMembers: {
        marginTop: 2,
        flexDirection: "row",
        alignItems: 'center',

    },

    membersText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#777777'
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

    groupSettingsBlock: {
        backgroundColor: 'white',
        opacity: .85,
        borderRadius: 5,
        marginLeft: 15,
    },

    groupSettingsText: {
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 10,
        paddingRight: 10,
        color: 'black',
        fontSize: 16,
        fontWeight: '700',
    },

    groupContext: {
        width: '100%',
        height: 80,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#363732',
        alignSelf: 'center',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
    },

    groupContextLeftHalf: {
        alignSelf: 'center',
        flexDirection: "row",
        alignItems: 'center',
        marginLeft: 15,
    },

    groupText: {
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

    groupUsersInvolved: {
        width: '100%',
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#363732',
        alignSelf: 'center',
        padding: 15,
    },

    groupOwnerContainer: {
        marginTop: 5,
        justifyContent: "center",
        marginBottom: 22,
    },

    groupOwnerHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    groupOwnerTitle: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },

    groupOwnerValueField: {
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

    groupOwnerNameText: {
        fontSize: 16,
        color: '#363732',
    },

    groupMembersContainer: {
        justifyContent: "center",
    },

    groupMembersHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    groupMembersTitle: {
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

    topicCountContainer: {
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 20,
    },

    topicCountContainerText: {
        fontSize: 14,
        marginLeft: 10,
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