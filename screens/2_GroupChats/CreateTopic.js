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
} from 'react-native';
import {
    Alert,
    Avatar,
    Button,
    CheckBox,
    Divider,
    Icon,
    Image,
    Input,
    Tooltip,
} from 'react-native-elements';

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
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import { useIsFocused } from '@react-navigation/native';


import { getHexValue, imageSelection } from '../5_Supplementary/GenerateProfileIcon';

// *************************************************************
import MyView from '../../components/MyView';

const CreateTopic = ({ navigation, route }) => {


    const [input, setInput] = useState("");
    const [mapUpdate, setMapUpdate] = useState({});

    const oldTopicId = route.params.topicId;
    const oldTopicName = route.params.topicName;
    const groupId = route.params.groupId;
    const originalMessageUID = route.params.originalMessageUID;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;
    const currentUserPhoneNumber = (auth.currentUser.phoneNumber).slice(2);

    const [newTopicName, setNewTopicName] = useState('')

    const [groupMembers, setGroupMembers] = useState([])
    const [checked, setChecked] = useState([auth.currentUser.uid])
    const [shownText, setShownText] = useState('');
    const [color, setColor] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Create Topic",
            headerStyle: '',
            headerTitleStyle: { color: 'black' },
            headerTintColor: 'black',
            headerLeft: () => (
                <View style={{ marginLeft: 12 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => { navigation.goBack(); }}>
                        <Icon
                            name='arrow-back'
                            type='ionicon'
                            color='#363732'
                            size={28}
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: ''
        });
    }, []);

    const getGroupMembers = async () => {
        let includeInTopic = false;

        try {
            const snapshot = await db
                .collection('groups')
                .doc(groupId)
                .get()

            const membersArray = snapshot.data().members;

            membersArray.forEach(async (memberID) => {
                const memberQuery = await db
                    .collection('users')
                    .doc(memberID)
                    .get()

                const snapshot = memberQuery.data();

                if (snapshot.phoneNumber === currentUserPhoneNumber) includeInTopic = true;
                else includeInTopic = false;
                const searchedMember = {
                    uid: memberID,
                    name: `${snapshot.firstName} ${snapshot.lastName}`,
                    pfp: snapshot.pfp,
                    owner: includeInTopic,
                    checked: includeInTopic
                }
                setGroupMembers((previous) => [...previous, searchedMember])
            })
        } catch (error) {
            alert(error)
        }
    }

    useEffect(() => {
        try {
            getGroupMembers();
        } catch (error) {
            alert(error)
        }

        return () => {
            getGroupMembers();
        }
    }, [])

    const goBackward = () => navigation.navigate("Chat",
        {
            topicId: oldTopicId.id,
            topicName: oldTopicName,
            groupId,
            groupName,
            groupOwner,
            color: route.params.color,
            coverImageNumber: route.params.coverImageNumber
        }
    );

    const getHexValue = () => {
        const query = db
            .collection("groups")
            .doc(groupId)
            .get()
            .then((snapshot) => {
                // setColor(String(snapshot.data().color))
                setColor(snapshot.data().color)
            })

        switch (color) {
            case 'purple': {
                return '#C0B7CC'
            }
            case 'blue': {
                return '#9DAFD1'
            }
            case 'green': {
                return '#87AC7B'
            }
            case 'yellow': {
                return '#DFCF8C'
            }
            case 'orange': {
                return '#D5B592'
            }
            case 'red': {
                return '#CB9B99'
            }
            default: {
                return '#777777'
            }
        }
    }

    const getMemberCount = () => {
        if (checked.length >= 99) return '99+'
        else return `${checked.length}`
    }

    // let [membersList, setMembersList] = useState([])

    const createTopic = async () => {
        const currentUserID = auth.currentUser.uid;

        // let membersArray = [];

        // console.log('membersList', membersList)
        console.log('checked',checked)

        // checked.map((member) => {
        //     membersArray.push(member.uid)
        // })

        await db.collection('groups').doc(groupId)
            .collection("topics")
            .add({
                topicOwner: auth.currentUser.uid,
                topicName: newTopicName,
                members: checked,
                originalMessageUID: originalMessageUID || "",
                // parentGroup: groupId
            })
            .then((newlyCreatedTopic) => {
                let topicID = newlyCreatedTopic.id
                // mapUpdate[`topicMap.${topicID}`] = firebase.firestore.FieldValue.serverTimestamp()
                // membersArray.map(async (memberUID) => {
                //     await db.collection('users').doc(memberUID).update(mapUpdate);
                // })

                console.log('topicID', topicID)
                console.log(checked)
                checked.map(async (memberUID, index) => {

                    console.log(index, memberUID)

                    const addTopicMapValue = await db
                        .collection('users')
                        .doc(memberUID)
                        .update({
                            [`topicMap.${topicID}`]: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .catch((error) => console.log(error));
                })

                navigation.push("Chat",
                    {
                        topicId: newlyCreatedTopic.id,
                        topicName: newTopicName,
                        groupId,
                        groupName,
                        groupOwner,
                        color: route.params.color,
                        coverImageNumber: route.params.coverImageNumber
                    }
                );
            })
            // .then((result) => {
            //  setButtonText('CREATED');
            //  navigation.push("Chat", { topicId : String(result.id), topicName : newTopicName, groupId, groupName, groupOwner });
            // })
            .catch((error) => alert(error));
    };

    const [isLoading, setIsLoading] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        setIsLoading(false);

        return () => {
            setIsLoading();
        };
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView
                contentContainerStyle={{
                    justifyContent: "flex-start",
                    flexDirection: "column",
                }}
            >
                <View style={styles.innerContainer}>

                    <View style={[styles.componentHeaderBar, { backgroundColor: getHexValue(), }]} />

                    <View style={styles.textContainer}>
                        <View>
                            <Text style={styles.componentTitle}>
                                Set the details for your new topic:
                            </Text>
                        </View>

                        <Divider style={{ marginTop: 20, marginBottom: 20 }} />

                        <View style={styles.textInput}>
                            <Icon
                                name="chatbubble-ellipses-outline"
                                type="ionicon"
                                size={24}
                                color="#363732"
                            />
                            <Text style={styles.textInputTitle}>
                                Enter topic name:
                            </Text>
                        </View>

                        <TextInput
                            placeholder="The Jetsons"
                            value={newTopicName}
                            onChangeText={(textChange) => {
                                setNewTopicName(textChange);
                            }}
                            maxLength={17}
                            style={styles.textInputField}
                        />
                        {/* How many Characters newTopicName.length >= 15*/}
                        <MyView hide={newTopicName.length < 12}
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
                        </MyView>
                        <View style={{ marginBottom: 22, }} />

                        <View style={styles.textInput}>
                            <Icon
                                name="person-search"
                                type="material"
                                size={24}
                                color="#363732"
                            />
                            <Text style={styles.textInputTitle}>
                                Search for a group member:
                            </Text>
                        </View>
                        <View style={styles.searchInputField}>
                            <TextInput
                                placeholder='Christopher Washington'
                                value={shownText}
                                hideUnderline
                                keyboardType={'default'}
                                maxLength={50}
                                onChangeText={(textChange) => setShownText(textChange)}
                            />
                            <Icon
                                name="search"
                                type="material"
                                size={24}
                                color="#363732"
                            />
                        </View>

                        <View style={styles.groupMembersView}>
                            <ScrollView contentContainerStyle={{ paddingTop: 0, paddingBottom: 10, width: "100%", paddingLeft: 20, }}>
                                {groupMembers.filter((memberObject) => memberObject.name.toLowerCase().includes(shownText.toLowerCase())).map((member, index) => (
                                    <View style={styles.memberEditRow} key={index} id={index}>
                                        <View style={styles.member}>
                                            <Image
                                                source={imageSelection(member.pfp)}
                                                style={{ width: 30, height: 30, borderRadius: 5 }}
                                            />
                                            <Text style={styles.memberName}>
                                                {member.name}
                                            </Text>
                                        </View>
                                        {member.owner
                                            ? <View style={[styles.ownerBadge, { marginRight: 21 }]}>
                                                <Icon
                                                    name='crown'
                                                    type='material-community'
                                                    color='#363732'
                                                    size={16}
                                                />
                                            </View>
                                            : <View>
                                                <CheckBox
                                                    center
                                                    checked={checked.includes(member.uid)}
                                                    onPress={() => {
                                                        if (checked.includes(member.uid)) {
                                                            setChecked((previous) => {
                                                                return previous.filter((memberToKeep) => { return memberToKeep != member.uid })
                                                            })
                                                        } else setChecked((previous) => { return [...previous, member.uid] })
                                                    }}
                                                />
                                            </View>
                                        }
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.footer}>
                            <View style={styles.leftHalf}>
                                <Text style={styles.leftHalfText}>
                                    ({getMemberCount()} MEMBER{getMemberCount() > 1 ? <Text>S</Text> : null} SELECTED)
                                </Text>

                            </View>
                            <View style={styles.rightHalf}>
                                {(newTopicName.length === 0)
                                    ? <View style={styles.buttonSpacing}>
                                        <View style={[styles.buttonCreate, { borderColor: '#9D9D9D', }]}>
                                            <Text style={styles.buttonCreateDisabledText}>
                                                CREATE
                                            </Text>
                                        </View>
                                    </View>
                                    : <TouchableOpacity
                                        activeOpacity={0.75}
                                        onPressOut={() => setIsLoading(true)}
                                        onPress={() => createTopic()}
                                    >

                                        <View style={styles.buttonSpacing}>
                                            <View style={[styles.buttonCreate, { backgroundColor: '#3D8D04', borderColor: '#363732', }]}>
                                                <Text style={styles.buttonCreateEnabledText}>
                                                    CREATE
                                                </Text>
                                                {(isLoading)
                                                    ? <ActivityIndicator
                                                        size="small"
                                                        color="white"
                                                        size={18}
                                                    />
                                                    : <Icon
                                                        name="chatbubble-ellipses"
                                                        type="ionicon"
                                                        size={18}
                                                        color="white"
                                                    />
                                                }
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView >
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "#EFEAE2",
        height: "100%",
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
        backgroundColor: '#777777',
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
        flexDirection: "row",
        justifyContent: "space-between"

    },

    searchInputField: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#9D9D9D',
        borderRadius: 3,
        fontSize: 16,
        textAlign: 'left',
        padding: 10,
        backgroundColor: '#F8F8F8',
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12

    },

    groupMembersView: {
        width: "100%",
        backgroundColor: '#F8F8F8',
        height: 175,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#9D9D9D',
        borderRadius: 3,
    },

    memberEditRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'center',
        marginBottom: 0,
        marginTop: 10,
    },

    member: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
    },

    memberName: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 10
    },

    footer: {
        marginTop: 22,
        width: '100%',
        flexDirection: 'row',
        justifyContent: "space-between",
        display: 'flex',
        alignItems: 'center',

    },

    leftHalf: {
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
    },

    leftHalfText: {
        fontSize: 12,
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',

    },

    rightHalf: {
        display: 'flex',
        justifyContent: "flex-end",
        alignItems: 'center',
        textAlign: 'center',
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

    buttonSpacing: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 10,
    },

    buttonNext: {
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

    buttonTextDisabled: {
        color: '#9D9D9D',
        fontSize: 16,
        fontWeight: '800',
    },


    buttonTextEnabled: {
        color: '#363732',
        fontSize: 16,
        fontWeight: '800',
        marginRight: 5,
    },

    buttonCreate: {
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

    buttonCreateDisabledText: {
        color: '#9D9D9D',
        fontSize: 16,
        fontWeight: '800',
    },

    buttonCreateEnabledText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '800',
        marginRight: 8
    }

});

export default CreateTopic;