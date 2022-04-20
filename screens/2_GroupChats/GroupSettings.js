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


    // const goBackward = () => navigation.navigate("Chat",
    //     {
    //         color: topicObjectForPassing.color,
    //         coverImageNumber: topicObjectForPassing.coverImageNumber,
    //         groupId: topicObjectForPassing.groupId,
    //         groupName: topicObjectForPassing.groupName,
    //         groupOwner: topicObjectForPassing.groupOwner,
    //         topicId: topicObjectForPassing.topicId,
    //         topicName: topicObjectForPassing.topicName,
    //         topicOwner: topicObjectForPassing.topicOwner,
    //         topicMembers: topicObjectForPassing.topicMembers,
    //     }
    // )

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

    const unsubscribe = async () => {
        try {
            console.log('Entered Try')

            const groupSnapshot = await db
                .collection('groups')
                .doc(topicObjectForPassing.groupId)
                .get()

            const groupSnapshotData = groupSnapshot.data();

            if (!groupSnapshotData.members.includes(auth.currentUser.uid) && (leaveGroupFlag === false)) {
                console.log('Entered REMOVE GROUP Alert')

                Alert.alert(
                    `Removed from Group`,
                    `Woops! It seems that you're no longer a member of this group, so we've sent you back to the "Groups" tab.`,
                    [{ text: "OK" }]
                );
                navigation.navigate('GroupsTab');
            }

            // setGroupColor(groupSnapshotData.color);

            // const generalTopicSnapshot = await db
            //     .collection("groups")
            //     .doc(groupSnapshot.id)
            //     .collection("topics")
            //     .where("topicName", '==', 'General')
            //     .get()
            //     .catch((error) => console.log(error));

            // const generalTopicSnapshotData = generalTopicSnapshot.docs[0].data();

            // navigation.navigate('Chat',
            //     {
            //         color: groupSnapshotData.color,
            //         coverImageNumber: groupSnapshotData.coverImageNumber,
            //         topicId: generalTopicSnapshot.docs[0].id,
            //         topicName: 'General',
            //         groupId: groupSnapshot.id,
            //         groupName: groupSnapshotData.groupName,
            //         groupOwner: groupSnapshotData.groupOwner,
            //     }
            // );

            console.log('Setting values')


            setIsOwner(groupSnapshotData.groupOwner === auth.currentUser.uid)

            // console.log('GROUP', groupSnapshotData)
            setUseEffectGroupSnapshotData({ ...groupSnapshotData, groupId: groupSnapshot.id })
            setGroupMembersCount(groupSnapshotData.members.length)

            console.log('Topics')

            const topicSnapshot = await db
                .collection('groups')
                .doc(groupSnapshot.id)
                .collection('topics')
                .get()
                .catch((error) => console.log(error));

            // await topicSnapshot.docs.map(doc => console.log(doc.id));

            console.log('COUNT', topicSnapshot.docs.length)

            setTopicCount(topicSnapshot.docs.length)

            groupSnapshotData.members.map((memberUID, index) => {
                getGroupMemberData(memberUID, groupSnapshotData.groupOwner);
            })

            console.log('??????????', groupOwnerName)

            setNewGroupOwner(groupSnapshotData.groupOwner);
            setIsLoadingEditContent(false)


        } catch (error) { console.log(error) };
    }

    useEffect(() => {
        console.log('TRIED')

        unsubscribe();

        return () => {
            // setGroupColor('');
            // setTopicMembers([]);
            // setIsGeneral();
            setIsOwner();
            // setNewTopicOwner();
            setIsLoadingEditContent();
            setUseEffectGroupSnapshotData({});
            setGroupMembersCount(0);
            setTopicCount(0);
            unsubscribe;
            setGroupOwnerName('');
            setGroupMembers([]);
            setNewGroupOwner('');
            setSearchResults('')
            setSearchedUser({})
        };
    }, [toggleOverlay, newGroupOwner])

    useEffect(() => {
        if (searchedUserPhoneNumber.length === 10) {
            if (searchResults != ('exists' || 'nonexistent')) {
                searchForUser();
            }
        }
    }, searchedUserPhoneNumber);

    const [searchedUserPhoneNumber, setSearchedUserPhoneNumber] = useState('');

    const openTextMessage = () => {
        const textMessageText = `I just created a group within the FamilyChat app. Join in on the conversation by clicking this download link: https://www.familychat.app/`
        Linking.openURL(`sms://+1${searchedUserPhoneNumber}&body=${textMessageText}`)
    }

    let [searchResults, setSearchResults] = useState('incomplete');
    let [shownPhoneText, setShownPhoneText] = useState('');
    let [searchedUser, setSearchedUser] = useState({})

    const searchForUser = async () => {
        const query = await db
            .collection('users')
            .where('phoneNumber', '==', searchedUserPhoneNumber)
            .get();

        if (!query.empty) {
            setSearchResults('exists')
            const snapshot = query.docs[0];
            const data = snapshot.data();
            const searchedUserFullName = `${data.firstName} ${data.lastName}`;
            setSearchedUser({ uid: snapshot.id, name: `${searchedUserFullName}`, pfp: data.pfp, owner: false })
        } else { setSearchResults('nonexistent') }
    };

    function formatPhoneInput(value) {
        if (!value) {
            if (searchedUserPhoneNumber.length === 1) setSearchedUserPhoneNumber('');
            return value;
        };
        const phoneEntry = value.replace(/[^\d]/g, '');
        setSearchedUserPhoneNumber(phoneEntry);
        const phoneEntryLength = phoneEntry.length;
        if (phoneEntryLength < 4) return phoneEntry;
        if (phoneEntryLength < 7) return `(${phoneEntry.slice(0, 3)}) ${phoneEntry.slice(3)}`;
        return `(${phoneEntry.slice(0, 3)}) ${phoneEntry.slice(3, 6)}-${phoneEntry.slice(6, 10)}`;
    }

    const handlePhoneInput = (textChange) => {
        const phoneInputFormatted = formatPhoneInput(textChange);
        setShownPhoneText(phoneInputFormatted);
        if (searchedUserPhoneNumber.length != 10) {
            setSearchResults('incomplete')
        }
    };

    const [useEffectGroupSnapshotData, setUseEffectGroupSnapshotData] = useState({});
    const [groupMembers, setGroupMembers] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [groupOwnerName, setGroupOwnerName] = useState('')
    const [topicCount, setTopicCount] = useState(0)
    const [groupMembersCount, setGroupMembersCount] = useState(0)

    const getGroupMemberData = async (memberUID, groupOwnerUID) => {

        const userSnapshot = await db
            .collection('users')
            .doc(memberUID)
            .get()
            .catch((error) => console.log(error));

        const userSnapshotData = userSnapshot.data();

        if (groupOwnerUID === memberUID) setGroupOwnerName(`${userSnapshotData.firstName} ${userSnapshotData.lastName}`)

        console.log(`NAME OF USER: ${userSnapshotData.firstName} ${userSnapshotData.lastName}`)
        setGroupMembers((previous) => [...previous, {
            name: `${userSnapshotData.firstName} ${userSnapshotData.lastName}`,
            pfp: userSnapshotData.pfp,
            uid: memberUID,
        }]);
    }

    const [leaveGroupFlag, setLeaveGroupFlag] = useState(false);

    const leaveGroup = async () => {

        // Set the groupID for repeated use throughout function
        const groupID = topicObjectForPassing.groupId;

        // Set this flag as true, to not trigger the "REMOVED FROM GROUP" Alert
        setLeaveGroupFlag(true);

        // Get fresh snapshot of Group
        const groupSnapshot = await db
            .collection('groups')
            .doc(topicObjectForPassing.groupId)
            .get()
            .catch((error) => console.log(error));

        // Set the Data variable for repeated use throughout function
        const groupSnapshotData = groupSnapshot.data();

        // Get all topics within the Group
        const groupTopicsQuery = await db
            .collection('groups')
            .doc(topicObjectForPassing.groupId)
            .collection('topics')
            .get()
            .catch((error) => console.log(error));

        // Get the current user's information
        const userQuery = await db
            .collection('users')
            .doc(auth.currentUser.uid)
            .get()
            .catch((error) => console.log(error));

        // Set variable for the current user's topicMap
        const topicMapObject = userQuery.data().topicMap;

        // Build an array from the object of objects; topicMap
        let userTopicMapArray = []

        for (var key in topicMapObject) {
            userTopicMapArray.push(key)
        }

        // Map through the all of the group's topics
        await groupTopicsQuery.docs.map(async (topicObject, index) => {
            console.log('/////// Entered "topics.map()"');

            // Check to see if the user is involved with any of the group topics
            if (userTopicMapArray.includes(topicObject.id)) {
                console.log('//// Entered "relevant topic"', topicObject.topicName);

                // Set variables from the Topic for repeated use throughout the function
                const topicID = topicObject.id;
                const topicObjectData = topicObject.data();

                // ***********************************************************************************************
                // Check for all of the edge cases, considering that:
                // We're trying to allow the user to leave a group,
                // And they might be part of topics within that group
                // We need to remove them from those topics
                // And account for the possibility of them being the topic Owner
                // ***********************************************************************************************

                // If the user is involved with a Topic, and the member count is 1...
                // then the assumption is that they're the only member
                // Which means that if they're leaving, that we should just delete the Topic + messages
                if (topicObjectData.members.length === 1) {

                    // Remove the topicMap value from the current user's document
                    const removeTopicMapValueFromUser = await db
                        .collection('users')
                        .doc(auth.currentUser.uid)
                        .update({
                            [`topicMap.${topicID}`]: firebase.firestore.FieldValue.delete()
                        })
                        .catch((error) => console.log(error));

                    // Get the Topic's messages
                    const chatRef = await db
                        .collection('chats')
                        .doc(topicID)
                        .collection('messages')
                        .get()
                        .catch((error) => console.log(error));

                    // If the Topic has any messages
                    if (chatRef) {
                        chatRef.docs.map(async (topicMessage, index) => {

                            // Go through and delete every message in that topic
                            const chatMessagesQuery = await db
                                .collection('chats')
                                .doc(topicID)
                                .collection('messages')
                                .doc(topicMessage.id)
                                .delete()
                                .catch((error) => console.log(error));
                        })
                    }

                    // Delete the Topic document from the Chats collection
                    const deleteChatQuery = await db
                        .collection('chats')
                        .doc(topicID)
                        .delete()
                        .catch((error) => console.log(error));

                    // Delete the Topic document from the Groups collection
                    const deleteTopicQuery = await db
                        .collection('groups')
                        .doc(groupID)
                        .collection('topics')
                        .doc(topicID)
                        .delete()
                        .catch((error) => console.log(error));

                    // ------------------------------------------------------
                    // CONSOLE LOGS FOR TESTING THE EDGE CASES
                    console.log('--------')
                    console.log('Topic Name:', topicObjectData.topicName)
                    console.log('Owner:', topicObjectData.topicOwner)
                    console.log()
                    console.log('compared to group ... GroupName:', groupSnapshotData.groupName, ' / GroupOwner:', groupSnapshotData.groupOwner)
                    console.log('--------')

                    console.log()

                    console.log('*********** SCENARIO: ***********')
                    console.log('LEAVE GROUP > Current User is the ONLY member > Delete the topic messages + topicChatDocument + topic document from Group')
                    console.log('(Topic deleted) which should not be in the Group topics documents list : ', topicID)
                    // ------------------------------------------------------

                }

                // The Length of members is greater than 1
                // meaning that there are other users involved in the Topic
                else {

                    // Check if the current user (who is trying to leave the Topic+Group), is NOT the owner
                    if (topicObjectData.topicOwner !== auth.currentUser.uid) {

                        // 1. Remove the current user from the members list
                        const removeFromMembersQuery = await db
                            .collection('groups')
                            .doc(groupID)
                            .collection('topics')
                            .doc(topicID)
                            .update({
                                members: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.uid)
                            })
                            .catch((error) => console.log(error));

                        // 2. Remove the topic:timestamp value from the current user's topicMap
                        const removeTopicMapValueFromUser = await db
                            .collection('users')
                            .doc(auth.currentUser.uid)
                            .update({
                                [`topicMap.${topicID}`]: firebase.firestore.FieldValue.delete()
                            })
                            .catch((error) => console.log(error));

                        // ------------------------------------------------------
                        // CONSOLE LOGS FOR TESTING THE EDGE CASES
                        console.log('--------')
                        console.log('Topic Name:', topicObjectData.topicName)
                        console.log('Owner:', topicObjectData.topicOwner)
                        console.log()
                        console.log('compared to group ... GroupName:', groupSnapshotData.groupName, ' / GroupOwner:', groupSnapshotData.groupOwner)
                        console.log('--------')

                        console.log()

                        console.log('*********** SCENARIO: ***********')
                        console.log('LEAVE GROUP > Multiple members > Current User is NOT the TOPIC Owner > Ownership stays > User just leaves')
                        // ------------------------------------------------------

                    }

                    // The current user IS the owner
                    // and there are other members
                    // Now check if any of those other members are the GroupOwner
                    // Try to default the ownership to the GroupOwner first
                    else {

                        let newTopicOwnerByDefault = '';

                        topicObjectData.members.map(async (topicMemberUID, index) => {

                            // Enter if one of the Topic members is ALSO the Group Owner
                            if (topicMemberUID === groupSnapshotData.groupOwner) {

                                // 1. Replace the Owner
                                const newTopicOwnerQuery = await db
                                    .collection('groups')
                                    .doc(groupID)
                                    .collection('topics')
                                    .doc(topicID)
                                    .update({
                                        topicOwner: topicMemberUID
                                    })
                                    .catch((error) => console.log(error));

                                // 2. Remove the current user from the members list
                                const removeFromMembersQuery = await db
                                    .collection('groups')
                                    .doc(groupID)
                                    .collection('topics')
                                    .doc(topicID)
                                    .update({
                                        members: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.uid)
                                    })
                                    .catch((error) => console.log(error));

                                // 3. Remove the topic:timestamp value from the current user's topicMap
                                const removeTopicMapValueFromUser = await db
                                    .collection('users')
                                    .doc(auth.currentUser.uid)
                                    .update({
                                        [`topicMap.${topicID}`]: firebase.firestore.FieldValue.delete()
                                    })
                                    .catch((error) => console.log(error));

                                // ------------------------------------------------------
                                // CONSOLE LOGS FOR TESTING THE EDGE CASES
                                console.log('--------')
                                console.log('Topic Name:', topicObjectData.topicName)
                                console.log('Owner:', topicObjectData.topicOwner)
                                console.log()
                                console.log('compared to group ... GroupName:', groupSnapshotData.groupName, ' / GroupOwner:', groupSnapshotData.groupOwner)
                                console.log('--------')

                                console.log()

                                console.log('*********** SCENARIO: ***********')
                                console.log('LEAVE GROUP > Current User IS the TOPIC Owner > GROUP Owner IS in Members list > Ownership given to GROUP OWNER')
                                console.log('New owner should be: ', topicMemberUID)
                                // ------------------------------------------------------

                            } else { if (topicMemberUID !== auth.currentUser.uid) newTopicOwnerByDefault = topicMemberUID };
                        })

                        // If reached, this means that:
                        // --- Current user IS the topic owner
                        // --- There ARE other members
                        // --- GROUP owner is not in the members list
                        // So default to the next last other member in the list

                        // 1. Replace the Owner
                        const newTopicOwnerQuery = await db
                            .collection('groups')
                            .doc(groupID)
                            .collection('topics')
                            .doc(topicID)
                            .update({
                                topicOwner: newTopicOwnerByDefault
                            })
                            .catch((error) => console.log(error));

                        // 2. Remove the current user from the members list
                        const removeFromMembersQuery = await db
                            .collection('groups')
                            .doc(groupID)
                            .collection('topics')
                            .doc(topicID)
                            .update({
                                members: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.uid)
                            })
                            .catch((error) => console.log(error));

                        // 3. Remove the topic:timestamp value from the current user's topicMap
                        const removeTopicMapValueFromUser = await db
                            .collection('users')
                            .doc(auth.currentUser.uid)
                            .update({
                                [`topicMap.${topicID}`]: firebase.firestore.FieldValue.delete()
                            })
                            .catch((error) => console.log(error));

                        // ------------------------------------------------------
                        // CONSOLE LOGS FOR TESTING THE EDGE CASES
                        console.log('--------')
                        console.log('Topic Name:', topicObjectData.topicName)
                        console.log('Owner:', topicObjectData.topicOwner)
                        console.log()
                        console.log('compared to group ... GroupName:', groupSnapshotData.groupName, ' / GroupOwner:', groupSnapshotData.groupOwner)
                        console.log('--------')

                        console.log()

                        console.log('*********** SCENARIO: ***********')
                        console.log('LEAVE GROUP > Current User IS the TOPIC Owner > GROUP Owner is NOT in Members list > Ownership defaulted to last member')
                        console.log('New owner should be: ', newTopicOwnerByDefault)
                        // ------------------------------------------------------

                    }
                }
            }
        })

        // Update the user's groups Array
        const removeGroupFromUserArrayQuery = await db
            .collection('users')
            .doc(auth.currentUser.uid)
            .update({
                groups: firebase.firestore.FieldValue.arrayRemove(groupID)
            })
            .catch((error) => console.log(error));

        const removeFromMembersQuery = await db
            .collection('groups')
            .doc(groupID)
            .update({
                members: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.uid)
            })
            .catch((error) => console.log(error));

        console.log('/// FINISHED WITH TOPICS MAP + User removed from Group + Group removed from User')

        // Current user has now been removed from all topics
        // Group removed from current user's groups Array
        // All GROUP involvement removed
        // Now, Send Alert and leave the group screen
        // Navigate back to the GroupsTab
        Alert.alert(
            `Left the Group`,
            `You have successfully left the group.`,
            [{ text: "OK" }]
        );

        console.log('.')
        console.log('.')
        console.log('[Navigating back to the GroupsTab]')

        navigation.navigate('GroupsTab')
        return;
    }

    const deleteGroup = async () => {

        // get all members in group
        // get all topics in group
        // go through and remove the all topicMap value from user
        // remove group from user

        // Set the groupID for repeated use throughout function
        const groupID = topicObjectForPassing.groupId;

        // Set this flag as true, to not trigger the "REMOVED FROM GROUP" Alert
        setLeaveGroupFlag(true);

        try {
            // Get fresh snapshot of Group
            const groupSnapshot = await db
                .collection('groups')
                .doc(groupID)
                .get()
                .catch((error) => console.log(error));

            // Set the Data variable for repeated use throughout function
            const groupSnapshotData = groupSnapshot.data();

            // Get all topics within the Group
            const groupTopicsQuery = await db
                .collection('groups')
                .doc(groupID)
                .collection('topics')
                .get()
                .catch((error) => console.log(error));

            // For each group member, go through and clear data history of topics + group
            groupSnapshotData.members.map(async (groupMemberUID, index) => {

                // Get the current user's information
                const userQuery = await db
                    .collection('users')
                    .doc(groupMemberUID)
                    .get()
                    .catch((error) => console.log(error));

                // Set variable for the current user's topicMap
                const topicMapObject = userQuery.data().topicMap;

                // Build an array from the object of objects; topicMap
                let userTopicMapArray = []

                for (var key in topicMapObject) {
                    userTopicMapArray.push(key)
                }

                // Map through the all of the group's topics
                await groupTopicsQuery.docs.map(async (topicObject, index) => {

                    // Check to see if the user is involved with any of the group topics
                    if (userTopicMapArray.includes(topicObject.id)) {

                        // Set variables from the Topic for repeated use throughout the function
                        const topicID = topicObject.id;
                        const topicObjectData = topicObject.data();

                        // 1. Remove the topic:timestamp value from the current user's "topicMap" Map
                        const removeTopicMapValueFromUser = await db
                            .collection('users')
                            .doc(groupMemberUID)
                            .update({
                                [`topicMap.${topicID}`]: firebase.firestore.FieldValue.delete()
                            })
                            .catch((error) => console.log(error));
                    }
                })

                // All of the topics have been removed from the user's document (topicMap)
                // 2. Remove the group from the current user's "groups" Array
                const removeGroupFromUserArrayQuery = await db
                    .collection('users')
                    .doc(groupMemberUID)
                    .update({
                        groups: firebase.firestore.FieldValue.arrayRemove(groupID)
                    })
                    .then((result) => { console.log('RESULT last......:', result) })
                    .catch((error) => console.log(error));

                // console.log(removeGroupFromUserArrayQuery)
            })

            // User has been cleaned of any affiliation with the Group / Topic(s)
            // Now removed the actual data for the Group / Topic(s) / Messages

            // get topics
            // get all message in those topics
            // delete those messages
            // delete the topicMap
            // delete those topics
            // delete the group document

            // Map through the all of the group's topics
            await groupTopicsQuery.docs.map(async (topicObject, index) => {

                // Set variables from the Topic for repeated use throughout the function
                const topicID = topicObject.id;
                const topicObjectData = topicObject.data();

                // Get the Topic's messages
                const chatRef = await db
                    .collection('chats')
                    .doc(topicID)
                    .collection('messages')
                    .get()
                    .catch((error) => console.log(error));

                // If the Topic has any messages
                if (chatRef) {
                    chatRef.docs.map(async (topicMessage, index) => {

                        // Go through and delete every message in that topic
                        const chatMessagesQuery = await db
                            .collection('chats')
                            .doc(topicID)
                            .collection('messages')
                            .doc(topicMessage.id)
                            .delete()
                            .catch((error) => console.log(error));
                    })
                }

                // Delete the Topic document from the Chats collection
                const deleteChatQuery = await db
                    .collection('chats')
                    .doc(topicID)
                    .delete()
                    .catch((error) => console.log(error));

                // Delete the Topic document from the Topics sub-collection
                const deleteTopicQuery = await db
                    .collection('groups')
                    .doc(groupID)
                    .collection('topics')
                    .doc(topicID)
                    .delete()
                    .catch((error) => console.log(error));
            })

            // Delete the Group document from the Groups collection
            const deleteGroupQuery = await db
                .collection('groups')
                .doc(groupID)
                .delete()
                .catch((error) => console.log(error));

            // Messages, Topics, and the Group has been deleted
            // Send an Alert confirming the deletion to the User
            // Navigate them back to the GroupsTab
            Alert.alert(
                `Group Deleted`,
                `You have successfully deleted the group.`,
                [{ text: "OK" }]
            );

            console.log('.')
            console.log('.')
            console.log('[Owner Deletes Group] Alert sent + Navigating to GroupsTab')

            navigation.navigate('GroupsTab')
            // return;
        } catch (error) { console.log(error) };
    }

    const addNewGroupMembersToDatabase = async () => {

        // Set the groupID for repeated use throughout function
        const groupID = topicObjectForPassing.groupId;

        // Get fresh snapshot of Group
        const groupSnapshot = await db
            .collection('groups')
            .doc(groupID)
            .get()
            .catch((error) => console.log(error));

        // Set the Data variable for repeated use throughout function
        const groupSnapshotData = groupSnapshot.data();

        // Get all topics within the Group
        const groupTopicsQuery = await db
            .collection('groups')
            .doc(groupID)
            .collection('topics')
            .get()
            .catch((error) => console.log(error));

        // Get group's General Topic ID/data
        const generalTopicSnapshot = await db
            .collection("groups")
            .doc(groupID)
            .collection("topics")
            .where("topicName", '==', 'General')
            .get()
            .catch((error) => console.log(error));

        const generalTopicSnapshotID = generalTopicSnapshot.docs[0].id;

        // Create new array for the UIDs of the current group members
        const newGroupMembersUIDArray = []
        const createArrayOfUIDs = groupMembers.map((groupMemberObject, index) => {
            newGroupMembersUIDArray.push(groupMemberObject.uid)
        })

        // Create new array for the UIDs of the group members REMOVED by owner
        let membersToRemoveArray = [];
        const checkForMembersToRemove = await groupSnapshotData.members.map((memberUID, index) => {
            if (!newGroupMembersUIDArray.includes(memberUID)) membersToRemoveArray.push(memberUID);
        })
        console.log('TO REMOVE', membersToRemoveArray)

        // Create new array for the UIDs of the group members ADDED by owner
        let membersToAddArray = [];
        const checkForMembersToAdd = await newGroupMembersUIDArray.map((memberUID, index) => {
            if (!groupSnapshotData.members.includes(memberUID)) membersToAddArray.push(memberUID);
        })
        console.log('TO ADD', membersToAddArray)

        // ***********************************************************************************************
        // figure out who to remove
        // go through their topicMap and get all the relevant topics
        // compare with group's topics
        // check those topics and see if they're owners
        // if only member delete topic + messages
        // default ownership (if group owner, else last person)
        // remove them from members list in topics
        // remove the topic from user topicMap
        // remove the group from user Array
        //***********************************************************************************************

        if (membersToRemoveArray.length > 0) {

            membersToRemoveArray.map(async (memberUIDToRemove, index) => {

                // Get the current user's information
                const userQuery = await db
                    .collection('users')
                    .doc(memberUIDToRemove)
                    .get()
                    .catch((error) => console.log(error));

                // Set variable for the current user's topicMap
                const topicMapObject = userQuery.data().topicMap;

                // Build an array from the object of objects; topicMap
                let userTopicMapArray = []
                for (var key in topicMapObject) {
                    userTopicMapArray.push(key)
                }

                // Map through the all of the group's topics
                await groupTopicsQuery.docs.map(async (topicObject, index) => {

                    // Check to see if the user is involved with any of the group topics
                    if (userTopicMapArray.includes(topicObject.id)) {

                        // Set variables from the Topic for repeated use throughout the function
                        const topicID = topicObject.id;
                        const topicObjectData = topicObject.data();

                        // Start the if checks for which Edge case to handle
                        if (topicObjectData.members.length === 1) {

                            // Remove the topicMap value from the current user's document
                            const removeTopicMapValueFromUser = await db
                                .collection('users')
                                .doc(memberUIDToRemove)
                                .update({
                                    [`topicMap.${topicID}`]: firebase.firestore.FieldValue.delete()
                                })
                                .catch((error) => console.log(error));

                            if (topicID != generalTopicSnapshotID) {
                                // Get the Topic's messages
                                const chatRef = await db
                                    .collection('chats')
                                    .doc(topicID)
                                    .collection('messages')
                                    .get()
                                    .catch((error) => console.log(error));

                                // If the Topic has any messages
                                if (chatRef) {
                                    chatRef.docs.map(async (topicMessage, index) => {

                                        // Go through and delete every message in that topic
                                        const chatMessagesQuery = await db
                                            .collection('chats')
                                            .doc(topicID)
                                            .collection('messages')
                                            .doc(topicMessage.id)
                                            .delete()
                                            .catch((error) => console.log(error));
                                    })
                                }

                                // Delete the Topic document from the Chats collection
                                const deleteChatQuery = await db
                                    .collection('chats')
                                    .doc(topicID)
                                    .delete()
                                    .catch((error) => console.log(error));

                                // Delete the Topic document from the Groups collection
                                const deleteTopicQuery = await db
                                    .collection('groups')
                                    .doc(groupID)
                                    .collection('topics')
                                    .doc(topicID)
                                    .delete()
                                    .catch((error) => console.log(error));
                            }

                            // ------------------------------------------------------
                            // CONSOLE LOGS FOR TESTING THE EDGE CASES
                            console.log('--------')
                            console.log('Topic Name:', topicObjectData.topicName)
                            console.log('Owner:', topicObjectData.topicOwner)
                            console.log('--------')

                            console.log('.')

                            console.log('*********** SCENARIO: ***********')
                            console.log('USER REMOVED FROM GROUP > [EDGE 1] Current User is the ONLY member')
                            console.log('(Topic deleted) which should not be in the Group topics documents list : ', topicID)
                            // ------------------------------------------------------
                        }

                        // The Length of members is greater than 1
                        // meaning that there are other users involved in the Topic
                        else {

                            // Check if the current user (who is trying to leave the Topic+Group), is NOT the owner
                            if (topicObjectData.topicOwner !== memberUIDToRemove) {

                                // 1. Remove the current user from the members list
                                const removeFromMembersQuery = await db
                                    .collection('groups')
                                    .doc(groupID)
                                    .collection('topics')
                                    .doc(topicID)
                                    .update({
                                        members: firebase.firestore.FieldValue.arrayRemove(memberUIDToRemove)
                                    })
                                    .catch((error) => console.log(error));

                                // 2. Remove the topic:timestamp value from the current user's topicMap
                                const removeTopicMapValueFromUser = await db
                                    .collection('users')
                                    .doc(memberUIDToRemove)
                                    .update({
                                        [`topicMap.${topicID}`]: firebase.firestore.FieldValue.delete()
                                    })
                                    .catch((error) => console.log(error));

                                // ------------------------------------------------------
                                // CONSOLE LOGS FOR TESTING THE EDGE CASES
                                console.log('--------')
                                console.log('Topic Name:', topicObjectData.topicName)
                                console.log('Owner:', topicObjectData.topicOwner)
                                console.log('--------')

                                console.log('.')

                                console.log('*********** SCENARIO: ***********')
                                console.log('USER REMOVED FROM GROUP > [EDGE 2] Multiple members > Current User is NOT the TOPIC Owner')
                                // ------------------------------------------------------

                            }

                            // The current user IS the owner
                            // and there are other members
                            // Now check if any of those other members are the GroupOwner
                            // Try to default the ownership to the GroupOwner first
                            else {

                                let newTopicOwnerByDefault = '';

                                topicObjectData.members.map(async (topicMemberUID, index) => {

                                    // Enter if one of the Topic members is ALSO the Group Owner
                                    if (topicMemberUID === groupSnapshotData.groupOwner) {

                                        // 1. Replace the Owner
                                        const newTopicOwnerQuery = await db
                                            .collection('groups')
                                            .doc(groupID)
                                            .collection('topics')
                                            .doc(topicID)
                                            .update({
                                                topicOwner: topicMemberUID
                                            })
                                            .catch((error) => console.log(error));

                                        // 2. Remove the current user from the members list
                                        const removeFromMembersQuery = await db
                                            .collection('groups')
                                            .doc(groupID)
                                            .collection('topics')
                                            .doc(topicID)
                                            .update({
                                                members: firebase.firestore.FieldValue.arrayRemove(memberUIDToRemove)
                                            })
                                            .catch((error) => console.log(error));

                                        // 3. Remove the topic:timestamp value from the current user's topicMap
                                        const removeTopicMapValueFromUser = await db
                                            .collection('users')
                                            .doc(memberUIDToRemove)
                                            .update({
                                                [`topicMap.${topicID}`]: firebase.firestore.FieldValue.delete()
                                            })
                                            .catch((error) => console.log(error));

                                        // ------------------------------------------------------
                                        // CONSOLE LOGS FOR TESTING THE EDGE CASES
                                        console.log('--------')
                                        console.log('Topic Name:', topicObjectData.topicName)
                                        console.log('Owner:', topicObjectData.topicOwner)
                                        console.log('--------')

                                        console.log('.')

                                        console.log('*********** SCENARIO: ***********')
                                        console.log('USER REMOVED FROM GROUP > [EDGE 3] Current User IS the TOPIC Owner > GROUP Owner IS in Members list')
                                        console.log('New owner should be: ', topicMemberUID)
                                        // ------------------------------------------------------

                                    } else {
                                        if (topicMemberUID !== memberUIDToRemove) {
                                            newTopicOwnerByDefault = topicMemberUID
                                            if ((newTopicOwnerByDefault === '') || (newTopicOwnerByDefault === undefined)) newTopicOwnerByDefault = auth.currentUser.uid
                                        }
                                    };
                                })

                                // If reached, this means that:
                                // --- Current user IS the topic owner
                                // --- There ARE other members
                                // --- GROUP owner is not in the members list
                                // So default to the next last other member in the list
                                console.log('************', newTopicOwnerByDefault)
                                console.log('und', newTopicOwnerByDefault === undefined)
                                console.log('empty', newTopicOwnerByDefault === '')
                                if (newTopicOwnerByDefault === undefined) newTopicOwnerByDefault = auth.currentUser.uid
                                if ((newTopicOwnerByDefault === '') || (newTopicOwnerByDefault === undefined)) newTopicOwnerByDefault = auth.currentUser.uid
                                console.log('after if -', newTopicOwnerByDefault)

                                // 1. Replace the Owner
                                const newTopicOwnerQuery = await db
                                    .collection('groups')
                                    .doc(groupID)
                                    .collection('topics')
                                    .doc(topicID)
                                    .update({
                                        topicOwner: newTopicOwnerByDefault
                                    })
                                    .catch((error) => console.log(error));

                                // 2. Remove the current user from the members list
                                const removeFromMembersQuery = await db
                                    .collection('groups')
                                    .doc(groupID)
                                    .collection('topics')
                                    .doc(topicID)
                                    .update({
                                        members: firebase.firestore.FieldValue.arrayRemove(memberUIDToRemove)
                                    })
                                    .catch((error) => console.log(error));

                                // 3. Remove the topic:timestamp value from the current user's topicMap
                                const removeTopicMapValueFromUser = await db
                                    .collection('users')
                                    .doc(memberUIDToRemove)
                                    .update({
                                        [`topicMap.${topicID}`]: firebase.firestore.FieldValue.delete()
                                    })
                                    .catch((error) => console.log(error));

                                // ------------------------------------------------------
                                // CONSOLE LOGS FOR TESTING THE EDGE CASES
                                console.log('--------')
                                console.log('Topic Name:', topicObjectData.topicName)
                                console.log('Owner:', topicObjectData.topicOwner)
                                console.log('--------')

                                console.log('.')

                                console.log('*********** SCENARIO: ***********')
                                console.log('USER REMOVED FROM GROUP > [EDGE 4] Current User IS the TOPIC Owner > GROUP Owner is NOT in Members list > Ownership defaulted to last member')
                                console.log('New owner should be: ', newTopicOwnerByDefault)
                                // ------------------------------------------------------

                            }
                        }
                    }
                })

                console.log('/// Helllllooooo????')

                // Update the user's groups Array
                const removeGroupFromUserArrayQuery = await db
                    .collection('users')
                    .doc(memberUIDToRemove)
                    .update({
                        groups: firebase.firestore.FieldValue.arrayRemove(groupID)
                    })
                    .catch((error) => console.log(error));

                // Update the user's groups Array
                const removeFromMembersQuery = await db
                    .collection('groups')
                    .doc(groupID)
                    .update({
                        members: firebase.firestore.FieldValue.arrayRemove(memberUIDToRemove)
                    })
                    .catch((error) => console.log(error));

                console.log('/// FINISHED WITH TOPICS MAP + User removed from Group + Group removed from User')
                //--
            })
        }

        // ***********************************************************************************************
        // figure out who to add        
        // for those who you add
        // go through and give them the topicMap updates for general topic
        // go through and give them the group array update
        // add them to group members + general topic members
        // ***********************************************************************************************

        if (membersToAddArray.length > 0) {

            console.log('----------------------------------------------- entered ADD')

            console.log(generalTopicSnapshot.docs[0].data())

            membersToAddArray.map(async (memberUIDToAdd, index) => {

                console.log('----------------------------------------------- entered map', memberUIDToAdd)

                // Add the user to the GROUP members list
                const addUserToGroupMembersArray = await db
                    .collection('groups')
                    .doc(groupID)
                    .update({
                        members: firebase.firestore.FieldValue.arrayUnion(memberUIDToAdd)
                    })
                    .catch((error) => console.log(error));




                // Add the user to the 'General' TOPIC members list
                const addUserToTopicGeneralMembersArray = await db
                    .collection('groups')
                    .doc(groupID)
                    .collection('topics')
                    .doc(generalTopicSnapshotID)
                    .update({
                        members: firebase.firestore.FieldValue.arrayUnion(memberUIDToAdd)
                    })
                    .catch((error) => console.log(error));




                // Add the groupID to the user's 'groups' ARRAY
                const addGroupToUsersArray = await db
                    .collection('users')
                    .doc(memberUIDToAdd)
                    .update({
                        groups: firebase.firestore.FieldValue.arrayUnion(groupID)
                    })
                    .catch((error) => console.log(error));

                // console.log('-----------------------------------------------')
                // console.log('.')
                // // Get the current user's information
                // const userQuery = await db
                //     .collection('users')
                //     .doc(memberUIDToAdd)
                //     .get()
                //     .catch((error) => console.log(error));
                // // Set variable for the current user's topicMap
                // console.log(userQuery.data().groups);
                // console.log('-----------------------------------------------')

                // Add the 'General' topic value to the user's 'topicMap' MAP
                const addValueToUserTopicMap = await db
                    .collection('users')
                    .doc(memberUIDToAdd)
                    .update({
                        [`topicMap.${generalTopicSnapshotID}`]: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .catch((error) => console.log(error));
            })
        }

        setIsEditing(false);
    }

    const [ownershipOverlayVisibility, setOwnershipOverlayVisibility] = useState(false);


    const toggleOverlay = () => {
        console.log('ENTER TOGGLE OVERLAY')
        console.log('newGroupOwner', newGroupOwner)
        console.log('useEffectGroupSnapshotData.groupOwner', useEffectGroupSnapshotData.groupOwner)

        if ((newGroupOwner != useEffectGroupSnapshotData.groupOwner) && (leaveGroupFlag === false)) {
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
                            setNewGroupOwner(useEffectGroupSnapshotData.groupOwner);
                        },
                    },
                ]
            );
        } else setOwnershipOverlayVisibility(!ownershipOverlayVisibility);
    }

    const transferGroupOwnership = async () => {
        toggleOverlay();
    }

    const [newGroupOwner, setNewGroupOwner] = useState('');
    const [newOwnerSaveTrigger, setNewOwnerSaveTrigger] = useState(false)

    const addNewGroupOwner = async () => {

        const groupID = topicObjectForPassing.groupId;

        const newGroupOwnerQuery = await db
            .collection('groups')
            .doc(groupID)
            .update({
                groupOwner: newGroupOwner
            })
            .catch((error) => console.log(error));

        const currentGroupOwnerQuery = await db
            .collection('groups')
            .doc(groupID)
            .get()
            .catch((error) => console.log(error));

        currentGroupOwnerQuery.data().groupOwner === newGroupOwner ? console.log('SUCCESSFUL') : console.log('FAILED')

        useEffectGroupSnapshotData.groupOwner = newGroupOwner;
        console.log('useEffect', useEffectGroupSnapshotData.groupOwner)
        topicObjectForPassing.groupOwner = newGroupOwner;
        console.log('topicObject', topicObjectForPassing.groupOwner)
        console.log('NEW GROUP OWNER ****', newGroupOwner)
        console.log('GROUP OWNER NAME', groupOwnerName)

        const userSnapshot = await db
            .collection('users')
            .doc(newGroupOwner)
            .get()
            .catch((error) => console.log(error));

        const userSnapshotData = userSnapshot.data();

        setGroupOwnerName(`${userSnapshotData.firstName} ${userSnapshotData.lastName}`)

        console.log('GROUP OWNER NAME', groupOwnerName)
        console.log(`${userSnapshotData.firstName} ${userSnapshotData.lastName}`)

        const generalTopicSnapshot = await db
            .collection("groups")
            .doc(groupID)
            .collection("topics")
            .where("topicName", '==', 'General')
            .get()
            .catch((error) => console.log(error));

        const generalTopicSnapshotID = generalTopicSnapshot.docs[0].id;

        console.log('GENERAL ID', generalTopicSnapshotID)

        const generalTopicOwnerUpdate = await db
            .collection("groups")
            .doc(groupID)
            .collection("topics")
            .doc(generalTopicSnapshotID)
            .update({
                topicOwner: newGroupOwner
            })
            .catch((error) => console.log(error));

        setIsOwner(false);
        setIsLoadingTransferButton(false)
        setOwnershipOverlayVisibility(!ownershipOverlayVisibility);
    }

    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingEditContent, setIsLoadingEditContent] = useState(true);
    const [isLoadingEditButton, setIsLoadingEditButton] = useState(false);
    const [isLoadingSaveButton, setIsLoadingSaveButton] = useState(false);
    const [isLoadingTransferButton, setIsLoadingTransferButton] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        setIsLoadingEditContent(true);
        setIsLoadingEditButton(false);
        setIsLoadingSaveButton(false);
        setIsLoadingTransferButton(false)
        setIsEditing(false)

        setTimeout(() => setIsLoadingEditContent(false), 3000);

        return () => {
            setIsLoadingEditContent();
            setIsLoadingEditButton();
            setIsLoadingSaveButton();
            setIsLoadingTransferButton()
            setIsEditing();
        };
    }, [isFocused]);

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
                            Transfer Group Ownership of:
                        </Text>
                        <View style={[styles.overlayTitleBox, { height: 30, borderRadius: 2, backgroundColor: 'white', opacity: .75, padding: 5, marginTop: 8, minWidth: 50, maxWidth: '100%', marginBottom: 5, }]}>
                            <Text style={[styles.overlayTitle, { fontSize: 16, fontWeight: '600', }]}>
                                {useEffectGroupSnapshotData.groupName}
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
                                {groupMembers.map((groupMember, index) => (
                                    <View style={[styles.memberRow, {}]} key={index} id={index}>
                                        <View style={[styles.member, {}]}>
                                            <View style={[styles.memberLeftPortion, {}]}>
                                                <Image
                                                    source={imageSelection(groupMember.pfp)}
                                                    style={{ width: 26, height: 26, borderRadius: 5, }}
                                                />
                                                <Text style={[styles.memberName, {}]}>
                                                    {groupMember.name}
                                                </Text>
                                                {(groupMember.uid === useEffectGroupSnapshotData.groupOwner)
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
                                                checked={(groupMember.uid === newGroupOwner)}
                                                onPress={() => setNewGroupOwner(groupMember.uid)}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {(newGroupOwner == useEffectGroupSnapshotData.groupOwner)
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
                                addNewGroupOwner();
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

                <View style={styles.innerContainer}>
                    <View style={[styles.settingsBar, { backgroundColor: getHexValue(useEffectGroupSnapshotData.color), }]}>
                        <View style={styles.groupSettingsBlock}>
                            <Text style={styles.groupSettingsText}>
                                Group Settings:
                            </Text>
                        </View>

                        <View>
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
                                                onSelect={() => transferGroupOwnership()}
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
                        </View>
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
                        ?
                        <View style={[styles.groupUsersInvolved, {}]}>
                            <View style={styles.textInput}>
                                <Icon
                                    name="person-search"
                                    type="material"
                                    size={24}
                                    color="#363732"
                                />
                                <Text style={styles.textInputTitle}>
                                    Search for users to invite:
                                </Text>
                            </View>
                            <View style={styles.textInputField}>
                                <TextInput
                                    placeholder='(201) 555-0123'
                                    value={shownPhoneText}
                                    hideUnderline
                                    keyboardType={'phone-pad'}
                                    maxLength={14}
                                    onChangeText={(textChange) => handlePhoneInput(textChange)}
                                />
                                <Icon
                                    name="search"
                                    type="material"
                                    size={24}
                                    color="#363732"
                                />
                            </View>

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
                                                    onPress={() => { setGroupMembers([...groupMembers, searchedUser]) }}
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
                            </View>
                            <View style={styles.textInput}>
                                <Icon
                                    name="groups"
                                    type="material"
                                    size={24}
                                    color="#363732"
                                />
                                <Text style={styles.textInputTitle}>
                                    Members List:
                                </Text>
                            </View>

                            <View style={[styles.membersListContainer, { height: 310 }]}>
                                <ScrollView
                                    width={'100%'}
                                    height={215}
                                    contentContainerStyle={{
                                        justifyContent: "flex-start",
                                        flexDirection: "column",
                                    }}
                                >
                                    {groupMembers.map((individualMember, index) => (
                                        <View style={[styles.memberEditRow, { width: '85%' }]} key={index} id={index}>
                                            <View style={[styles.member, {}]}>
                                                <View style={styles.memberLeftPortion}>

                                                    <Image
                                                        source={imageSelection(individualMember.pfp)}
                                                        style={{ width: 30, height: 30, borderRadius: 5 }}
                                                    />
                                                    <Text style={styles.memberName}>
                                                        {individualMember.name}
                                                    </Text>
                                                </View>
                                            </View>
                                            {!(individualMember.uid === useEffectGroupSnapshotData.groupOwner)
                                                ? <TouchableOpacity
                                                    activeOpacity={0.75}
                                                    onPress={() => {
                                                        setGroupMembers(groupMembers.filter((memberToKeep) => memberToKeep.name !== individualMember.name))
                                                        console.log('NEW', groupMembers)
                                                    }}
                                                >
                                                    <Icon
                                                        name="close-circle"
                                                        type="material-community"
                                                        size={18}
                                                        color="#363732"
                                                        style={{ marginRight: 4 }}
                                                    />
                                                </TouchableOpacity>
                                                :
                                                <View style={[styles.ownerBadge, { right: 4 }]}>
                                                    <Icon
                                                        name='crown'
                                                        type='material-community'
                                                        color='#363732'
                                                        size={16}
                                                    />
                                                </View>
                                            }
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                            {isOwner
                                ? <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => {
                                        setIsLoadingSaveButton(true);
                                        setIsLoadingEditButton(false);
                                        addNewGroupMembersToDatabase();
                                        setSearchResults('incomplete')
                                        // console.log(groupMembers)
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
                                {isOwner
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

    membersListContainer: {
        width: '100%',
        minHeight: 75,
        padding: 15,
        marginBottom: 22,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#C4C4C4',
        backgroundColor: '#F8F8F8'
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

    //


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

    innerContainer: {
        margin: 20,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 5,
        shadowOpacity: .2,
    },

    componentHeaderBar: {
        height: 15,
        width: "100%",
    },

    textContainer: {
        margin: 20,
    },

    componentTitle: {
        fontSize: 16,
        textAlign: 'left',
        display: 'flex',
        fontWeight: '800',
    },

    textInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    textInputTitle: {
        marginLeft: 10,
        fontSize: 16,
        textAlign: 'left',
        display: 'flex',
        fontWeight: '700',
    },

    textInputField: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#9D9D9D',
        borderRadius: 3,
        fontSize: 16,
        textAlign: 'left',
        padding: 10,
        backgroundColor: '#F8F8F8',
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: 'space-between',
    },

    buttonSpacing: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 10,
    },

    searchResultsContainer: {
        width: '100%',
        height: 100,
        padding: 15,
        backgroundColor: '#C4C4C4',
        marginBottom: 22,
    },

    incompleteSearchResult: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
    },

    incompleteSearchResultText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#363732'
    },

    userExistsSearchResult: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F8F8F8',
        flexDirection: 'row',
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'center',
        shadowColor: 'black',
        padding: 15,
        shadowOffset: { width: 3, height: 3 },
        shadowRadius: 3,
        shadowOpacity: .3,
        borderWidth: 1,
        borderColor: '#9D9D9D',
    },

    userNonexistentSearchResult: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F8F8F8',
        flexDirection: 'row',
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#9D9D9D',
        padding: 15
    },

    completedSearchResultText: {
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 10
    },

    memberExists: {
        width: 35,
        height: 35,
        borderRadius: 200,
        backgroundColor: '#3D8D04',
        justifyContent: 'center',
        alignItems: 'center',
    },

    userResult: {
        flexDirection: 'row',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
    },

    searchResultsButtonAdd: {
        width: 80,
        height: 35,
        borderWidth: 3,
        borderStyle: 'solid',
        borderRadius: 200,
        flexDirection: 'row',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        borderColor: '#2352DF',
    },

    searchResultsButtonAddText: {
        color: '#2352DF',
        fontSize: 12,
        fontWeight: '800',
        marginRight: 5
    },

    searchResultsButtonInvite: {
        width: 120,
        height: 35,
        borderWidth: 3,
        borderStyle: 'solid',
        borderRadius: 200,
        flexDirection: 'row',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
    },

    searchResultsButtonInviteText: {
        color: '#363732',
        fontSize: 12,
        fontWeight: '800',
        marginRight: 5
    },


})


export default GroupSettings;