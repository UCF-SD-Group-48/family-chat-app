// *************************************************************
// Imports for: React, React Native, & React Native Elements
import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import {
    Alert,
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
    Touchable,
    Linking
} from 'react-native';
import {
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

    const [topicObjectForPassing, setTopicObjectForPassing] = useState(() => {
        return route.params.topicObjectForPassing;

    });

    const goBackward = () => {
        navigation.navigate("Chat", 
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
        })
    }

    const goForward = () => navigation.push("GroupSettings", { topicObjectForPassing })


    const [toggleWindowWidth, setToggleWindowWidth] = useState(() => {
        const windowWidth = Dimensions.get('window').width;
        return (windowWidth * .93);
    });

    const [toggleWindowHeight, setToggleWindowHeight] = useState(() => {
        const windowHeight = Dimensions.get('window').height;
        return (windowHeight * .75);
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
                                            onPress={() => Linking.openURL('https://www.familychat.app/#FAQ')}
                                        >
                                            Visit our FAQs.
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

    const [groupColor, setGroupColor] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const [topicMembers, setTopicMembers] = useState([]);
    const [isGeneral, setIsGeneral] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [topicData, setTopicData] = useState({});
    const [newTopicName, setNewTopicName] = useState('');

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

    useEffect(async () => {
        try {
            const groupSnapshot = await db
                .collection('groups')
                .doc(topicObjectForPassing.groupId)
                .get()

            const groupSnapshotData = groupSnapshot.data();
            setGroupColor(groupSnapshotData.color);
            topicObjectForPassing.color = groupSnapshotData.color;

            const topicSnapshot = await db
                .collection('groups')
                .doc(topicObjectForPassing.groupId)
                .collection('topics')
                .doc(topicObjectForPassing.topicId)
                .get()

            const topicSnapshotData = topicSnapshot.data();
            const topicSnapshotMembers = topicSnapshotData.members;

            if ((!topicSnapshotMembers.includes(auth.currentUser.uid)) && (leaveTopicFlag === false)) {

                Alert.alert(
                    `Removed from Topic`,
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

            setTopicMembers([])
            setTopicMembers(topicSnapshotMembers);

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

            setNewTopicName(topicSnapshotData.topicName);

            setNewTopicOwner(topicSnapshotData.topicOwner);
            setIsLoadingEditContent(false);

            setTopicObjectForPassing({
                color: groupSnapshotData.color,
                coverImageNumber: groupSnapshotData.coverImageNumber,
                groupId: route.params.topicObjectForPassing.groupId,
                groupName: groupSnapshotData.groupName,
                groupOwner: groupSnapshotData.groupOwner,
                topicId: route.params.topicObjectForPassing.topicId,
                topicName: topicSnapshotData.topicName,
                topicOwner: topicSnapshotData.topicOwner,
                topicMembers: topicSnapshotData.topicMembers,
            })


        } catch (error) { console.log(error) };

        return () => {
            setGroupColor('');
            setTopicMembers([]);
            setIsGeneral();
            setIsOwner();
            setTopicData({});
            setNewTopicName();
            setNewTopicOwner();
            setIsLoadingEditContent();
            setGroupMembers([])
        };
    }, [isFocused, toggleOverlay])

    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingGroupSettings, setIsLoadingGroupSettings] = useState(false);
    const [isLoadingEditContent, setIsLoadingEditContent] = useState(true);
    const [isLoadingEditButton, setIsLoadingEditButton] = useState(false);
    const [isLoadingSaveButton, setIsLoadingSaveButton] = useState(false);
    const [isLoadingTransferButton, setIsLoadingTransferButton] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        setIsLoadingGroupSettings(false);
        setIsLoadingEditContent(true);
        setIsLoadingEditButton(false);
        setIsLoadingSaveButton(false);
        setGroupColor(topicObjectForPassing.color)
        // console.log(route.params.topicObjectForPassing.color)

        setTimeout(() => setIsLoadingEditContent(false), 1500);

        return () => {
            setIsLoadingGroupSettings();
            setIsLoadingEditContent();
            setIsLoadingEditButton();
            setIsLoadingSaveButton();
        };
    }, [isFocused]);

    const [leaveTopicFlag, setLeaveTopicFlag] = useState(false);

    const leaveTopic = async () => {

        const groupID = topicObjectForPassing.groupId;
        const topicID = topicObjectForPassing.topicId;

        setLeaveTopicFlag(true);

        const groupSnapshot = await db
            .collection('groups')
            .doc(topicObjectForPassing.groupId)
            .get()

        const groupSnapshotData = groupSnapshot.data();

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
            .update({
                [`topicMap.${topicID}`]: firebase.firestore.FieldValue.delete()
            })
            .catch((error) => console.log(error));

        const generalTopicSnapshot = await db
            .collection("groups")
            .doc(groupID)
            .collection("topics")
            .where("topicName", '==', 'General')
            .get()
            .catch((error) => console.log(error));

        const generalTopicSnapshotData = generalTopicSnapshot.docs[0].data();

        Alert.alert(
            `Left the Topic`,
            `You have successfully left the topic.`,
            [{ text: "OK" }]
        );

        console.log('[User Leaves Topic] Alert sent + Navigating to General')

        navigation.navigate('Chat',
            {
                color: groupSnapshotData.color,
                coverImageNumber: groupSnapshotData.coverImageNumber,
                topicId: generalTopicSnapshot.docs[0].id,
                topicName: 'General',
                groupId: groupID,
                groupName: groupSnapshotData.groupName,
                groupOwner: groupSnapshotData.groupOwner,
            }
        );
    }

    const deleteTopic = async () => {

        const groupID = topicObjectForPassing.groupId;
        const topicID = topicObjectForPassing.topicId;

        const topicSnapshot = await db
            .collection('groups')
            .doc(groupID)
            .collection('topics')
            .doc(topicID)
            .get()
            .catch((error) => console.log(error));

        const databaseListOfTopicMembers = topicSnapshot.data().members;

        databaseListOfTopicMembers.map(async (memberUID, index) => {
            const removeTopicMapValueFromUser = await db
                .collection('users')
                .doc(memberUID)
                .update({
                    [`topicMap.${topicID}`]: firebase.firestore.FieldValue.delete()
                })
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
            console.log(error)
        } finally {
            try {
                const groupSnapshot = await db
                    .collection('groups')
                    .doc(topicObjectForPassing.groupId)
                    .get()
                    .catch((error) => console.log(error));

                const groupSnapshotData = groupSnapshot.data();

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

                Alert.alert(
                    `Topic Deleted`,
                    `You have successfully deleted the topic.`,
                    [{ text: "OK" }]
                );

                console.log('[Owner Deletes Topic] Alert sent + Navigating to General')

                navigation.navigate('Chat',
                    {
                        color: groupSnapshotData.color,
                        coverImageNumber: groupSnapshotData.coverImageNumber,
                        topicId: generalTopicSnapshot.docs[0].id,
                        topicName: generalTopicSnapshotData.topicName,
                        groupId: groupID,
                        groupName: groupSnapshotData.groupName,
                        groupOwner: groupSnapshotData.groupOwner,
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
                    })
                    .catch((error) => console.log(error));

                const updates = {}
                updates[`topicMap.${topicID}`] = firebase.firestore.FieldValue.delete();

                const removeTopicMapValue = await db
                    .collection('users')
                    .doc(memberUIDToRemove)
                    // .update(updates);
                    .update({
                        [`topicMap.${topicID}`]: firebase.firestore.FieldValue.delete()
                    })
                    .catch((error) => console.log(error));
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
                    })
                    .catch((error) => console.log(error));

                const addTopicMapValue = await db
                    .collection('users')
                    .doc(memberUIDToAdd)
                    .update({
                        [`topicMap.${topicID}`]: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .catch((error) => console.log(error));
            })
        }
        setIsEditing(false);
    }

    const [ownershipOverlayVisibility, setOwnershipOverlayVisibility] = useState(false);

    const toggleOverlay = () => {
        if (newTopicOwner != topicData.topicOwner) {
            console.log('Unsaved changes')
            Alert.alert(
                'Unsaved Changes',
                'Are you sure to leave before saving your changes? If discarded, there will not be a new Topic Owner.',
                [
                    { text: "Don't leave", style: 'cancel', onPress: () => { } },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => {
                            setOwnershipOverlayVisibility(!ownershipOverlayVisibility);
                            setNewTopicOwner(topicData.topicOwner);
                        },
                    },
                ]
            );
        } else setOwnershipOverlayVisibility(!ownershipOverlayVisibility);
    }

    const transferTopicOwnership = async () => {
        toggleOverlay();
    }

    const [newTopicOwner, setNewTopicOwner] = useState('');
    const [newOwnerSaveTrigger, setNewOwnerSaveTrigger] = useState(false)

    const addNewTopicOwner = async () => {
        try {
            const newTopicOwnerQuery = await db
                .collection('groups')
                .doc(topicObjectForPassing.groupId)
                .collection('topics')
                .doc(topicObjectForPassing.topicId)
                .update({
                    topicOwner: newTopicOwner
                })
                .catch((error) => console.log(error));

            const currentTopicOwnerQuery = await db
                .collection('groups')
                .doc(topicObjectForPassing.groupId)
                .collection('topics')
                .doc(topicObjectForPassing.topicId)
                .get()
                .catch((error) => console.log(error));
        } catch (error) {
            console.log(error)
        } finally {

            topicData.topicOwner = newTopicOwner;
            topicObjectForPassing.topicOwner = newTopicOwner;

            setIsEditing(false);
            setIsLoadingSaveButton(false);
            setIsLoadingEditButton(false);
            setIsOwner(false);
            setIsLoadingTransferButton(false);
            setOwnershipOverlayVisibility(!ownershipOverlayVisibility);
        }
    }

    const updateGroupMembers = async () => {

        const groupSnapshot = await db
            .collection('groups')
            .doc(topicObjectForPassing.groupId)
            .get()
            .catch((error) => console.log(error));

        const groupSnapshotData = groupSnapshot.data();

        setGroupMembers([])

        groupSnapshotData.members.map((memberUID, index) => {
            getGroupMemberData(memberUID);
        })
    }

    const addNewTopicName = async () => {
        try {
            const newTopicNameQuery = await db
                .collection('groups')
                .doc(topicObjectForPassing.groupId)
                .collection('topics')
                .doc(topicObjectForPassing.topicId)
                .update({
                    topicName: newTopicName
                })
                .catch((error) => console.log(error));

            const currentTopicOwnerQuery = await db
                .collection('groups')
                .doc(topicObjectForPassing.groupId)
                .collection('topics')
                .doc(topicObjectForPassing.topicId)
                .get()
                .catch((error) => console.log(error));

            (currentTopicOwnerQuery.data().topicName === newTopicName)
                ? console.log('SUCCESSFUL: Topic Name Change {', newTopicName, '}')
                : console.log('FAILED: Topic Name Change');
        } catch (error) {
            console.log(error)
        } finally {
            topicData.topicName = newTopicName;
            topicObjectForPassing.topicName = newTopicName;
        }
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
                <Overlay
                    isVisible={ownershipOverlayVisibility}
                    onBackdropPress={toggleOverlay}
                    // containerStyle={{ padding: 0, }}
                    overlayStyle={{
                        width: toggleWindowWidth - 15,
                        height: 460,
                        borderRadius: 10,
                        // justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                        // marginHorizontal: -10,
                        backgroundColor: 'white',
                        padding: 15,
                    }}>
                    <View style={[styles.titleHeader, { backgroundColor: '#DFD7CE', width: '100%', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10 }]}>
                        <Text style={[styles.overlayTitle, { fontSize: 16, fontWeight: '800' }]}>
                            Transfer Topic Ownership of:
                        </Text>
                        <View style={[styles.overlayTitleBox, { height: 30, borderRadius: 2, backgroundColor: 'white', opacity: .75, padding: 5, marginTop: 8, minWidth: 50, maxWidth: '100%', marginBottom: 5, }]}>
                            <Text style={[styles.overlayTitle, { fontSize: 16, fontWeight: '600', }]}>
                                {topicData.topicName}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.selectionTitle, { marginTop: 20, marginLeft: 3, flexDirection: 'row', alignItems: 'center' }]}>
                        <Icon
                            name="how-to-reg"
                            type="material"
                            color="#363732"
                            size={24}
                        />
                        <Text style={[styles.overlayTitle, { fontSize: 16, fontWeight: '800', marginLeft: 8, }]}>
                            Select Owner:
                        </Text>
                    </View>
                    <View style={[styles.memberBox, { marginTop: 10, borderColor: '#C4C4C4', borderWidth: 1, borderRadius: 5, backgroundColor: '#F8F8F8', paddingLeft: 20 }]}>
                        <ScrollView
                            width={'100%'}
                            height={215}
                            contentContainerStyle={{
                                justifyContent: "flex-start",
                                flexDirection: "column",
                            }}
                        >
                            <View style={[styles.memberBoxScrollView, {}]}>
                                {groupMembers
                                    .filter(memberObject => topicMembers.includes(memberObject.uid))
                                    .map((topicMember, index) => (
                                        <View style={[styles.memberRow, {}]} key={index} id={index}>
                                            <View style={[styles.member, {}]}>
                                                <View style={[styles.memberLeftPortion, {}]}>
                                                    <Image
                                                        source={imageSelection(topicMember.pfp)}
                                                        style={{ width: 26, height: 26, borderRadius: 5, }}
                                                    />
                                                    <Text style={[styles.memberName, {}]}>
                                                        {topicMember.name}
                                                    </Text>
                                                    {(topicMember.uid === topicData.topicOwner)
                                                        ? <Icon
                                                            name='crown'
                                                            type='material-community'
                                                            color='black'
                                                            size={16}
                                                            style={{ marginLeft: 10, }}
                                                        />
                                                        : null
                                                    }
                                                </View>
                                                <CheckBox
                                                    center
                                                    checkedIcon={
                                                        <Icon
                                                            name="radio-button-checked"
                                                            type="material"
                                                            color="#2352DF"
                                                            size={25}
                                                            iconStyle={{ margin: 'auto' }}
                                                        />
                                                    }
                                                    uncheckedIcon={
                                                        <Icon
                                                            name="radio-button-unchecked"
                                                            type="material"
                                                            color="grey"
                                                            size={25}
                                                            iconStyle={{ marginRight: 0 }}
                                                        />
                                                    }
                                                    checked={(topicMember.uid === newTopicOwner)}
                                                    onPress={() => setNewTopicOwner(topicMember.uid)}
                                                />
                                            </View>
                                        </View>
                                    ))}
                            </View>
                        </ScrollView>
                    </View>

                    {(newTopicOwner == topicData.topicOwner)
                        ? <View style={styles.buttonSpacing}>
                            <View style={[styles.buttonTransfer, { borderColor: '#9D9D9D', backgroundColor: 'white' }]}>
                                <Text style={[styles.buttonTransferText, { color: '#9D9D9D' }]}>
                                    TRANSFER
                                </Text>

                            </View>
                        </View>
                        : <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={() => {
                                setIsLoadingTransferButton(true);
                                setNewTopicName(topicObjectForPassing.topicName)
                                addNewTopicOwner();
                            }}
                        >
                            <View style={styles.buttonSpacing}>
                                <View style={[styles.buttonTransfer, { borderColor: '#363732', }]}>
                                    <Text style={styles.buttonTransferText}>
                                        TRANSFER
                                    </Text>

                                    {(isLoadingTransferButton)
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
                </Overlay>

                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => {
                        setIsLoadingGroupSettings(true);
                        goForward();
                        setIsEditing(false)
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
                    <View style={[styles.settingsBar, { backgroundColor: getHexValue(topicObjectForPassing.color), }]}>
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
                                                        color='black'
                                                        size={16}
                                                        style={{ marginLeft: 10, }}
                                                    />
                                                    <Text style={{
                                                        fontSize: 14, color: 'black', marginLeft: 10
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

                    {isEditing
                        ? <View style={{
                            width: "100%",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            flexDirection: "column",
                            borderWidth: 1,
                            borderBottomWidth: 1,
                            borderTopWidth: 0,
                            borderColor: '#363732',
                            paddingLeft: 12,
                            paddingRight: 12,
                            paddingTop: 15,
                            paddingBottom: 20,
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon
                                    name="chatbubble-ellipses-outline"
                                    type="ionicon"
                                    color="#363732"
                                    size={20}
                                    style={{ marginRight: 8 }}
                                // style={{ marginRight: 12, alignItems: 'center', alignSelf: 'center', }}
                                />
                                <Text style={{
                                    textAlign: 'left', fontSize: 16, fontWeight: '700',
                                    color: 'black', paddingLeft: 0,
                                }}>
                                    Topic Name:
                                </Text>
                            </View>
                            <View style={{
                                width: "100%", flexDirection: "row",
                            }}>
                                <View style={{
                                    marginTop: 10,
                                    width: 50,
                                    minHeight: 10,
                                    maxHeight: 250,
                                    flex: 1,
                                    flexGrow: 1,
                                    flexDirection: "column",
                                    marginHorizontal: 0, paddingTop: 7, paddingBottom: 7, paddingHorizontal: 15,
                                    justifyContent: "flex-start", alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: '#9D9D9D',
                                    borderRadius: 3, backgroundColor: "#F8F8F8"
                                }}>
                                    <TextInput
                                        placeholder={"First Name"}
                                        onChangeText={setNewTopicName}
                                        value={newTopicName}
                                        multiline={false}
                                        maxLength={17}
                                        style={{
                                            minHeight: 20, width: "100%",
                                            backgroundColor: "#6660",
                                            color: '#222',
                                            textAlign: 'left', fontSize: 16, fontWeight: '500',
                                        }}
                                    />
                                </View>
                            </View>

                            {/* How many Characters description.length >= 55*/}
                            {(newTopicName.length < 12)
                                ? null
                                : <View
                                    style={{
                                        width: "100%",
                                        paddingHorizontal: 0,
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
                                        {"Characters " + newTopicName.length + "/17"}
                                    </Text>
                                </View>
                            }

                        </View>
                        : <View style={[styles.topicContext, { borderTopWidth: 0 }]}>
                            <View style={styles.topicContextLeftHalf}>
                                <Icon
                                    name="chatbubble-ellipses-outline"
                                    type="ionicon"
                                    color="#363732"
                                    size={30}
                                    style={{ marginRight: 12, alignItems: 'center', alignSelf: 'center', }}
                                />
                                <Text style={styles.topicText}>
                                    {newTopicName}
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
                    }

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
                                            addNewTopicName();
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
                                            setIsLoadingSaveButton(false);
                                            setIsLoadingEditButton(true);
                                            updateGroupMembers();
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

    memberBox: {
        width: '100%',

    },

    memberBoxScrollView: {
        width: '100%',
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
        // paddingTop: 13,
        // paddingBottom: 13,
    },

    memberEditRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'center',
        marginLeft: 6,
        // marginBottom: 10,
        // marginTop: 10,
    },

    member: {
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        // borderRadius: 5,
        // borderWidth: 2,
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


    buttonTransfer: {
        marginTop: 22,
        width: 150,
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

    buttonTransferText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '800',
        marginRight: 5,
    },

})

export default TopicSettings;