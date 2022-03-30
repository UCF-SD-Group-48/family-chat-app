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

// *************************************************************

const TopicSettings = ({ navigation, route }) => {

    const topicObjectForPassing = route.params.topicObjectForPassing;

    const goBackward = () => navigation.navigate("Chat",
        {
            color: groupColor,
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

    const [groupColor, setGroupColor] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const [topicMembers, setTopicMembers] = useState([]);
    const [isGeneral, setIsGeneral] = useState(true);
    const [isOwner, setIsOwner] = useState(true);
    const [topicData, setTopicData] = useState({})

    const getMemberData = async (memberUID, destination) => {

        const userSnapshot = await db
            .collection('users')
            .doc(memberUID)
            .get()
            .catch((error) => console.log(error));

        const userSnapshotData = userSnapshot.data();

        switch (destination) {
            case 'group': {
                setGroupMembers((previous) => [...previous, {
                    name: `${userSnapshotData.firstName} ${userSnapshotData.lastName}`,
                    pfp: userSnapshotData.pfp,
                    uid: memberUID,
                }]);
                break;
            }
            case 'topic': {
                setTopicMembers((previous) => [...previous, {
                    name: `${userSnapshotData.firstName} ${userSnapshotData.lastName}`,
                    pfp: userSnapshotData.pfp,
                    uid: memberUID,
                }]);
                break;
            }
            default: {
                return;
            }
        }
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
                    const topicMembers = topicSnapshotData.members;

                    if (!topicMembers.includes(auth.currentUser.uid)) {
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

                    topicSnapshotData.members.map((memberUID, index) => {
                        getMemberData(memberUID, 'topic');
                    })

                    if (topicSnapshotData.topicName === 'General') setIsGeneral(true);
                    if (topicSnapshotData.topicOwner === auth.currentUser.uid) setIsOwner(true);

                    await setTopicData({
                        topicId: topicSnapshotData.id,
                        topicName: topicSnapshotData.topicName,
                        topicOwner: topicSnapshotData.topicOwner,
                    })

                    groupSnapshotData.members.map((memberUID, index) => {
                        getMemberData(memberUID, 'group');
                    })

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

    const [isLoadingGroupSettings, setIsLoadingGroupSettings] = useState(false);
    const [isLoadingEditButton, setIsLoadingEditButton] = useState(false);
    const [isLoadingSaveButton, setIsLoadingSaveButton] = useState(false);

    const isFocused = useIsFocused();

    useEffect(() => {
        setIsLoadingGroupSettings(false);
        setIsLoadingEditButton(false);
        setIsLoadingSaveButton(false);

        return () => {
            setIsLoadingGroupSettings();
            setIsLoadingEditButton();
            setIsLoadingSaveButton();
        };
    }, [isFocused]);

    const [isEditing, setIsEditing] = useState(false);

    const leaveTopic = () => {
        console.log('leave')
    }

    const transferTopicOwnership = () => {
        console.log('transfer')
    }

    const deleteTopic = () => {
        console.log('delete')
    }

    const addTopicMembers = () => {

        db.collection('chats').doc(topicId).collection('banners').doc(alert.id).update({
            viewedBy: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid),
        })
    }

    const [checkedList, setCheckedList] = useState([]);

    const getCheckedList = () => {
        setCheckedList([])
        topicMembers.map((topicMember, index) => {
            setCheckedList((previous) => [...previous, topicMember.uid]);
        })
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
                                                            ? <View style={styles.ownerBadge}>
                                                                <Icon
                                                                    name='crown'
                                                                    type='material-community'
                                                                    color='#363732'
                                                                    size={16}
                                                                />
                                                            </View>
                                                            : <View style={{ alignSelf: 'center', justifyContent: 'flex-start' }}>
                                                                
                                                                <CheckBox />

                                                                <CheckBox
                                                                    center
                                                                    checked={checkedList.includes(topicMember.uid)}
                                                                    onPress={() => {
                                                                        if (checkedList.includes(topicMember.uid)) {
                                                                            setCheckedList((previous) => {
                                                                                return previous.filter((memberToKeep) => { return memberToKeep != topicMember.uid })
                                                                            })
                                                                        } else setCheckedList((previous) => { return [...previous, topicMember.uid] });
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
                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => {
                                        console.log(groupMembers)
                                        setIsLoadingEditButton(false);
                                        setIsLoadingSaveButton(true);
                                        console.log(checkedList)
                                        setIsEditing(false);
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
                                    {topicMembers
                                        .filter(memberObject => (memberObject.uid === topicData.topicOwner))
                                        .map((topicOwnerData, index) => (
                                            <Text style={styles.topicOwnerNameText} key={index} id={index}>
                                                {topicOwnerData.name}
                                            </Text>
                                        ))}
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
                                        {topicMembers.map((topicMember, index) => (
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
                                                            ?
                                                            <View style={styles.ownerBadge}>
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
                                                </View>
                                            </View>
                                        ))
                                        }
                                    </ScrollView>
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => {
                                        setIsLoadingSaveButton(false);
                                        setIsLoadingEditButton(true);
                                        getCheckedList();
                                        console.log(checkedList.length)
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
        maxHeight: 210,
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
        height: 20,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
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
    },

    memberRightPortion: {
        alignSelf: 'center'
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