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
import { AntDesign, Feather, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";


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
import LineDivider from '../../components/LineDivider';
import MyView from '../../components/MyView';

// Imports for: Components

// *************************************************************


const Polls = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;

    const [pastPolls, setPastPolls] = useState([]);
    const [activePolls, setActivePolls] = useState([]);

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

    //past polls
    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(topicId)
            .collection('polls')
            .where("endTime", "<=", new Date())
            .orderBy('endTime', 'desc')
            .onSnapshot((snapshot) =>
                setPastPolls(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                ));
        
        return unsubscribe;
    }, [route]);

    //Active Polls
    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(topicId)
            .collection('polls')
            .where("endTime", ">", new Date())
            .orderBy('endTime', 'desc')
            .onSnapshot((snapshot) =>
                setActivePolls(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            );
        
        return unsubscribe;
    }, [route]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Polls",
            headerRight: () => (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginRight: 20,
					}}>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={addPoll}
					>
						<Feather name="plus" size={30} color="black" />
					</TouchableOpacity>
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
    }, [navigation]);

    // useEffect(() => {
    //     getBannerOwners();
    //     return () => {
    //         setBannerOwners({});
    //     }
    // }, [phoneNumbers]);

    // const getBannerOwners = async () => {
    //     if(phoneNumbers.length > 0) {
    //         let bannerMap = {};

    //         const snapshot = await db.collection("users").where('phoneNumber', 'in', phoneNumbers).get();
    //         snapshot.docs.map((doc) => {
    //             bannerMap[doc.id] = doc.data();
    //             console.log("doc.id = "+doc.id);
    //         });

    //         setBannerOwners(bannerMap);
    //     }
	// };
    
    const addPoll = () => {
        navigation.push("AddPoll", { topicId, topicName, groupId, groupName, groupOwner });
    };

    const viewPoll = (pollId, pollData) => {
        navigation.push("ViewPoll", { topicId, topicName, groupId, groupName, groupOwner, pollId, pollData });
    };

    // const getString = (uid) => {
    //     if(bannerOwners != undefined && uid != undefined && bannerOwners[uid.toString()] != undefined) {
    //         return (bannerOwners[uid.toString()].firstName+" "+bannerOwners[uid.toString()].lastName);
    //     }
    //     else return "";
    // }

    const unselectPollOption = async (pollData, pollId, option) => {
        const pollMapString = "memberVotes."+auth.currentUser.uid;
        const votingOptionString = "votingOptions."+option;
        await db.collection("chats").doc(topicId).collection("polls").doc(pollId).update({
            [pollMapString]: "",
            [votingOptionString]: pollData.votingOptions[option] - 1,
        });
    };

    const selectPollOption = async (pollData, pollId, option) => {
        const pollMapString = "memberVotes."+auth.currentUser.uid;
        const votingOptionString = "votingOptions."+option;
        
        if(pollData.memberVotes[auth.currentUser.uid] != undefined && pollData.memberVotes[auth.currentUser.uid] != ""){
            let pastVotingOptionString = "votingOptions."+pollData.memberVotes[auth.currentUser.uid];
            await db.collection("chats").doc(topicId).collection("polls").doc(pollId).update({
                [pollMapString]: option,
                [votingOptionString]: pollData.votingOptions[option] + 1,
                [pastVotingOptionString]: pollData.votingOptions[pollData.memberVotes[auth.currentUser.uid]] - 1,
            });
        }
        else {
            await db.collection("chats").doc(topicId).collection("polls").doc(pollId).update({
                [pollMapString]: option,
                [votingOptionString]: pollData.votingOptions[option] + 1,
            });
        }
    };

    const getWinner = (data) => {
        let returnString = "";
        let max = 0;
        Object.keys(data.votingOptions).forEach(key => {
            if(data.votingOptions[key] > max) {
                returnString = key;
                max = data.votingOptions[key];
            }
            else if(data.votingOptions[key] == max) {
                returnString = "--Tie--";
            }
        });

        return returnString;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{
                    width: "100%",
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    flex: 0, flexGrow: 1, borderWidth: 0, paddingBottom: 75,
                }}>

                {/* Active Polls */}
                <View style={{
                    marginTop: 30, marginBottom: 0, width: "100%",
                    flexDirection: "column", flexShrink: 0,
                    justifyContent: "flex-start", alignItems: "center",
                }}>
                    <View style={{ paddingTop: 0, width: "90%", }}>
                        {activePolls.map(({ id, data }) => (
                        <View key={id} style={{
                                width: "100%",
                                backgroundColor: "#fff0", borderWidth: 0,
                                flex: 0, flexGrow: 0,
                                flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
                                borderRadius: 1,
                            }}>

                            {/* Top Container */}
                            <View
                                style={[
                                    {
                                        width: "100%", marginTop: 1,
                                        backgroundColor: "#F1A45C", borderWidth: 0,
                                        flex: 0, flexGrow: 0, flexDirection: "row",
                                        justifyContent: "flex-start", alignItems: "center",
                                        borderRadius: 1,
                                    },
                                    {
                                        shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                                        shadowRadius: 3, shadowOpacity: 0.4,
                                    }
                                ]} >
                                {/* Active Poll */}
                                <View style={{
                                    // minWidth: "10%",
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                    flex: 1, flexGrow: 1, flexDirection: "row",
                                    justifyContent: "flex-start", alignItems: "center",
                                }}>
                                    <View style={{
                                        width: "100%", height: 60,
                                        paddingHorizontal: 15, paddingVertical: 10,
                                        backgroundColor: "#F1A45C", borderRadius: 0, borderWidth: 0,
                                        flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                    }}>
                                        <View style={{
                                            width: 150, height: 35, paddingLeft: 12, borderRadius: 7,
                                            borderColor: "#000", borderWidth: 0, backgroundColor: "#FCE8D6",
                                            flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                        }}>
                                            <Entypo name="bar-graph" size={20} color="#333" />
                                            <Text style={{
                                                        fontSize: 18,
                                                        fontWeight: '800',
                                                        textAlign: "left",
                                                        marginLeft: 15, marginRight: 10,
                                                        color: "#333",
                                                        flex: 1,
                                                }}>
                                                    {"Open Poll"}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Moderator */}
                                {(data.ownerUID === auth.currentUser.uid) ? (
                                    <Menu>
                                        <MenuTrigger text='' triggerOnLongPress={false} customStyles={triggerStyles}>
                                            <MaterialCommunityIcons name="dots-horizontal" size={35} color="black" style={{marginHorizontal: 12,}} />
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
                                                    db.collection("chats").doc(topicId).collection("polls").doc(id).delete();
                                                }}/>
                                        </MenuOptions>
                                    </Menu>
                                ) : (
                                    <View style={{
                                        minWidth: 26, minHeight: 26,
                                        borderColor: "#000", borderWidth: 0, backgroundColor: "#afc0",
                                        paddingVertical: 0, paddingHorizontal: 0, marginRight: 15, borderRadius: 15, borderWidth: 2,
                                        flex: 1, flexGrow: 0, justifyContent: "center", alignItems: "center",
                                    }}>
                                        {/* <MaterialCommunityIcons name="crown" size={16} color="#333" style={{paddingLeft: 1}} /> */}
                                    </View>
                                )}
                            </View>

                            {/* Middle Container */}
                            <View style={[
                                    {
                                        width: "100%", marginTop: 0, marginBottom: 30,
                                        backgroundColor: "#fff", borderWidth: 0,
                                        flex: 0, flexGrow: 0, flexDirection: "row",
                                        justifyContent: "flex-start", alignItems: "center",
                                        borderRadius: 1,
                                    },
                                    {
                                        shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                                        shadowRadius: 3, shadowOpacity: 0.4,
                                    }
                                ]} >

                                {/* Main Content */}
                                <View style={{
                                    minWidth: "10%",
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                    flex: 1, flexGrow: 1, flexDirection: "row",
                                    justifyContent: "flex-start", alignItems: "center",
                                }}>
                                    <View style={{
                                        width: "100%", //height: 90,
                                        paddingHorizontal: 0, paddingVertical: 10,
                                        backgroundColor: "#0000", borderRadius: 7, borderWidth: 0,
                                        flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
                                    }}>
                                        {/* Question */}
                                        <View style={{
                                                width: "90%", minHeight: 30,
                                                marginHorizontal: 20, marginTop: 5,
                                                justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                                                backgroundColor: "#6660",
                                            }}>
                                            <Text style={{
                                                paddingLeft: 0,
                                                textAlign: 'left',
                                                fontSize: 18,
                                                fontWeight: '700',
                                                color: 'black',
                                                }}>
                                                {"Question:"}
                                            </Text>
                                        </View>
                                        <View style={{
                                            width: "90%", flexDirection: "row",
                                        }}>
                                            <View style={{
                                                width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                                                marginTop: 2, marginHorizontal: 0, paddingTop: 7, paddingBottom: 12, paddingHorizontal: 15,
                                                justifyContent: "flex-start", alignItems: "center",
                                                borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                                            }}>
                                                <View style={{
                                                    width: "100%", borderWidth: 0,
                                                    flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start",
                                                }}>
                                                    <FontAwesome5 name="question-circle" size={18} color="#333" />
                                                    <Text style={{
                                                        textAlign: 'left', fontSize: 16, fontWeight: '700',
                                                        color: 'black', borderWidth: 0, marginLeft: 15, marginRight: 5, flexGrow: 1,
                                                        }}>
                                                        {data.question}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Choices */}
                                        <View style={{
                                                width: "90%", minHeight: 30,
                                                marginHorizontal: 20, marginTop: 20,
                                                justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                                                backgroundColor: "#6660",
                                            }}>
                                            <Text style={{
                                                paddingLeft: 0,
                                                textAlign: 'left',
                                                fontSize: 18,
                                                fontWeight: '700',
                                                color: 'black',
                                                }}>
                                                {"Choices:"}
                                            </Text>
                                        </View>

                                        <View style={{ paddingTop: 0, width: "90%", }}>
                                        {Object.keys(data.votingOptions).sort().map((option) => (
                                        <View key={option.length+""+option} style={{
                                                width: "100%",
                                                backgroundColor: "#fff0", borderWidth: 0,
                                                flex: 0, flexGrow: 0,
                                                flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
                                                marginBottom: 7,
                                            }}>
                                            
                                            {(data.memberVotes[auth.currentUser.uid] != undefined && data.memberVotes[auth.currentUser.uid] == option
                                            ) ? (
                                            <TouchableOpacity activeOpacity={0.7} onPress={() => {unselectPollOption(data, id, option)}}
                                            style={{width: "100%", height: 35,
                                                flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                                borderRadius: 3,  borderWidth: 1.5,  borderColor: "#1174EC", backgroundColor: "#F8F8F8"
                                                }}>
                                                <Text numberOfLines={1} style={{
                                                    textAlign: 'left', fontSize: 16, fontWeight: '700',
                                                    color: 'black', borderWidth: 0, marginLeft: 15, flexGrow: 1,
                                                    }}>
                                                    {option}
                                                </Text>
                                                <MaterialIcons name="check-box" size={24} color="#1174EC" style={{marginHorizontal: 5}} />
                                            </TouchableOpacity>
                                            ) : (
                                            <TouchableOpacity activeOpacity={0.7} onPress={() => {selectPollOption(data, id, option)}}
                                            style={{width: "100%", height: 35,
                                                flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                                borderRadius: 3,  borderWidth: 1,  borderColor: "#777",
                                                }}>
                                                <Text numberOfLines={1} style={{
                                                    textAlign: 'left', fontSize: 16, fontWeight: '500',
                                                    color: '#333', borderWidth: 0, marginLeft: 15, flexGrow: 1,
                                                    }}>
                                                    {option}
                                                </Text>
                                                <MaterialIcons name="check-box-outline-blank" size={24} color="black" style={{marginHorizontal: 5}} />
                                            </TouchableOpacity>
                                            )}
                                        </View>
                                        ))}
                                        </View>

                                        {/* Closes at */}
                                        <View style={{
                                                width: "90%", minHeight: 30,
                                                marginHorizontal: 20, marginTop: 15,
                                                justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                                                backgroundColor: "#6660",
                                            }}>
                                            <Text style={{
                                                paddingLeft: 0,
                                                textAlign: 'left',
                                                fontSize: 14,
                                                fontWeight: '500',
                                                color: '#DF3D23',
                                                }}>
                                                <Text style={{fontWeight: '700',}}> {"Closes: "}</Text>
                                                {(data.endTime != null) ? (data.endTime.toDate().toLocaleDateString("en-US", {
                                                month: "short", day: "2-digit", year: "numeric", })
                                                +" @ "+data.endTime.toDate().toLocaleTimeString("en-US", 
                                                {hour: "numeric", minute: "2-digit", timeZoneName: "short" })) : ("")}
                                            </Text>
                                        </View>

                                    </View>
                                </View>
                            </View>
                            
                        </View>
                        ))}
                    </View>
                </View>

                {/* Add Poll Button */}
                <TouchableOpacity onPress={addPoll} activeOpacity={0.7}
                    style={[
                        {
                            minWidth: 200, minHeight: 60,
                            marginTop: 5, paddingHorizontal: 40,
                            justifyContent: "center", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#3D8D04",
                            borderColor: "#000", borderWidth: 2, borderRadius: 30,
                        },
                        {
                            shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                            shadowRadius: 3, shadowOpacity: 0.4,
                        }
                    ]}>
					<Text style={{
						textAlign: "center",
						fontSize: 22,
						fontWeight: '700',
						color: 'white', marginRight: 20
					}}>
						{"Create New Poll"}
					</Text>
                    <Entypo name="plus" size={30} color="white" />
                </TouchableOpacity>

                {/* History Text */}
                <View style={{
                    marginTop: 50,
                    flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                }}>
                <Divider width={2} color={"#777"}
                    style={{
                        minWidth: "10%",
                        flexGrow: 1, flex: 1,
                    }}/>
                <Text style={{
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: '700',
                    color: 'black', marginHorizontal: 10
                }}>
                    {"History: Closed Polls ("+pastPolls.length+")"}
                </Text>
                <Divider width={2} color={"#777"}
                    style={{
                        minWidth: "10%",
                        flexGrow: 1, flex: 1,
                    }}/>
                </View>

                {/* Past Polls */}
                <View style={{
                    marginTop: 30, marginBottom: 0, width: "100%",
                    flexDirection: "column", flexShrink: 1,
                    justifyContent: "flex-start", alignItems: "center",
                }}>
                    {/* Prompt for no Polls at all (when pastPolls.length == 0 && activePolls == 0) */}
                    <MyView hide={pastPolls.length != 0 || activePolls.length != 0}
                        style={{
                            width: "100%", minHeight: 300, paddingTop: 10,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                        }}>
                        <Entypo name="bar-graph" size={65} color="#555" />
                        <Text style={{
                                    fontSize: 20,
                                    fontWeight: '800',
                                    textAlign: "center",
                                    marginTop: 15,
                                    color: "#555",
                            }}>
                                {"No polls found."}
                        </Text>
                        <Text style={{
                                    fontSize: 20,
                                    fontWeight: '400',
                                    textAlign: "center",
                                    maxWidth: 350,
                                    lineHeight: 24,
                                    marginTop: 15,
                                    color: "#555",
                            }}>
                                {"Looks like there haven't been any created polls within this Topic."+
                                    "\nClick the button above to create one."}
                        </Text>
                        <MaterialCommunityIcons name="dots-horizontal" size={65} color="#999" />
                    </MyView>
                    <View style={{ paddingTop: 0, width: "100%", paddingLeft: 20, }}>
                        {pastPolls.map(({ id, data }) => (
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {viewPoll(id, data)}} key={id}
                                style={[
                                    {
                                        width: "100%", marginTop: 1,
                                        backgroundColor: "#fff", borderWidth: 0,
                                        flex: 0, flexGrow: 0, flexDirection: "row",
                                        justifyContent: "flex-start", alignItems: "center",
                                        borderRadius: 1,
                                    },
                                    {
                                        shadowColor: "#000", shadowOffset: {width: 0, height: 1},
                                        shadowRadius: 0, shadowOpacity: 0.5,
                                    }
                                ]} >
                                {/* Left Content */}
                                <View style={{
                                    minWidth: "10%",
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                    flex: 1, flexGrow: 1, flexDirection: "row",
                                    justifyContent: "flex-start", alignItems: "center",
                                }}>
                                    <View style={{
                                        width: "100%", height: 65,
                                        paddingHorizontal: 15, paddingVertical: 10,
                                        backgroundColor: "#0000", borderRadius: 7, borderWidth: 0,
                                        flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start",
                                    }}>
                                        <View style={{
                                            width: "100%",
                                            borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                            flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                        }}>
                                            <FontAwesome5 name="question-circle" size={18} color="#777" />
                                            <Text numberOfLines={1}
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: '800',
                                                    textAlign: "left",
                                                    marginLeft: 15, marginRight: 10,
                                                    color: "#777",
                                                    flex: 1,
                                                }}>
                                                {data.question}
                                            </Text>
                                        </View>
                                        <View style={{
                                            width: "100%",
                                            borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                            flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                        }}>
                                            <MaterialCommunityIcons name="check-decagram" size={20} color="#777" />
                                            <Text numberOfLines={1}
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: '400',
                                                    textAlign: "left",
                                                    marginLeft: 15, marginRight: 10,
                                                    color: "#777",
                                                    flex: 1,
                                            }}>
                                                {getWinner(data)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Right Chevron */}
                                <View style={{
                                    minWidth: 60,
                                    borderColor: "#000", borderWidth: 0, backgroundColor: "#afc0",
                                    paddingVertical: 0, paddingHorizontal: 15,
                                    flex: 1, flexGrow: 0, justifyContent: "center", alignItems: "center",
                                }}>
                                    <Entypo name="chevron-right" size={34} color="#333" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%", height: "100%",
        paddingTop: 20,
        paddingHorizontal: 0,
        alignItems: 'center',
        backgroundColor: "#EFEAE2",
    },
    message: {
        flex: 1,
        width: "100%",
        alignItems: 'flex-start',
        flexDirection: "row",
        paddingTop: 20,
        paddingHorizontal: 10,
        backgroundColor: "#6660",
    },
    userContainer: {
        width: 50,
        height: 50,

        backgroundColor: '#0cc',
        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: '#0cc0',
    },
    userName: {
        marginLeft: 5,
        height: 20,
        textAlign: 'left',
        fontSize: 12,
        fontWeight: '600',
        color: 'black',
    },
    textOutline: {
        flex: 1,
        flexGrow: 1,
        marginLeft: 5,
        minHeight: 30,
        justifyContent: "center",
        backgroundColor: '#cff0',
        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 5,
    },
    text: {
        marginLeft: 10,
        paddingVertical: 5,
        textAlign: 'left',
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
    },
    titleText: {
        marginLeft: 10,
        paddingVertical: 0,
        textAlign: 'left',
        fontSize: 20,
        fontWeight: '600',
        color: 'black',
    },
})

export default Polls;
