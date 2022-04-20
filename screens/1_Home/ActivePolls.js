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
import { AntDesign, Feather, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";


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
import helpers from '../../helperFunctions/helpers';


const ActivePolls = ({ navigation, route }) => {
    
    const numPolls = route.params.numPolls;
    const groupToData = route.params.groupToData;

    const [currentTime, setCurrentTime] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Active Polls",
            // headerRight: () => (
			// 	<View
			// 		style={{
			// 			flexDirection: "row",
			// 			justifyContent: "space-between",
			// 			marginRight: 20,
			// 		}}>
			// 		<TouchableOpacity
			// 			activeOpacity={0.5}
			// 			onPress={addEvent}
			// 		>
			// 			<Feather name="plus" size={30} color="black" />
			// 		</TouchableOpacity>
			// 	</View>
			// ),
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

        setCurrentTime(new Date());

    }, [navigation]);

    const getCurrentTime = () => {
        return firebase.firestore.FieldValue.serverTimestamp();
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
                    marginTop: 0, marginBottom: 0, width: "100%",
                    flexDirection: "column", flexShrink: 0,
                    justifyContent: "flex-start", alignItems: "center",
                }}>
                    <View style={{ paddingTop: 0, width: "90%", }}>
                    {groupToData.map((group, index) => (
                        <MyView hide={group.activePolls.length <= 0} key={group.groupID} style={[{
                        width: "100%", minHeight: 100, marginTop: 15, backgroundColor: "#fff0",
                        flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
                        borderRadius: 25, borderWidth: 0, borderColor: "#777",
                        paddingBottom: 0, marginBottom: 5, flex: 0, flexGrow: 0,
                        },]}>

                        {/* Group Image & Title */}
                        <View style={{
                            width: "100%", minHeight: 10, backgroundColor: "#abe0",
                            flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                            flex: 0, flexGrow: 0,
                        }}>
                            <View style={{
                                flex: 1, flexGrow: 1,
                                flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                            }}>
                            <Image
                                source={helpers.getGroupCoverImage(group.groupColor, group.groupImageNumber)}
                                style={{
                                    width: 60, height: 60,
                                    marginLeft: 0, marginRight: 20, marginVertical: 15,
                                    borderRadius: 5,
                                }}
                            />
                            <Text numberOfLines={1} style={{
                                fontSize: 22,
                                fontWeight: '800',
                                textAlign: "center",
                                maxWidth: 350,
                                paddingVertical: 5,
                                paddingRight: 15,
                                color: "#000",
                                }}>
                                {group.groupName}
                            </Text>
                            </View>
                        </View>
                        

                        {/* Active Polls */}
                        {group.activePolls.map((poll, index) => (
                            
                        <TouchableOpacity key={index} activeOpacity={0.7} onPress={() => {
                            
                            navigation.push('ViewPollHome',
                            {topicId: poll.topicId, pollId: poll.id, pollData: poll.data, groupToData});
                        }}
                        style={[{
                            maxWidth: "100%", minHeight: 10, backgroundColor: "#fff",
                            flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                            borderWidth: 1, borderColor: "#777", borderRadius: 3,
                            marginHorizontal: 0, marginTop: 0, marginBottom: 15,
                            borderRadius: 10,
                        },
                        {
                            shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                            shadowRadius: 3, shadowOpacity: 0.4,
                        }]}>
                        <View style={{
                            width: 70, height: 70, backgroundColor: "#ED984F",
                            flexDirection: "row", justifyContent: "center", alignItems: "center",
                            borderTopLeftRadius: 10, borderBottomLeftRadius: 10,
                        }}>
                            <View style={{
                                width: 45, height: 45, backgroundColor: "#FBE5D3",
                                flexDirection: "row", justifyContent: "center", alignItems: "center",
                                marginHorizontal: 12, marginVertical: 15,
                                borderRadius: 10,
                            }}>
                                <Entypo name="bar-graph" size={30} color="#333" />
                            </View>
                        </View>

                        <View style={{
                            flex: 1, flexGrow: 1, height: 70, marginLeft: 10, backgroundColor: "#abe0",
                            flexDirection: "column", justifyContent: "center", alignItems: "flex-start",
                        }}>
                            <Text numberOfLines={1} style={{
                                fontSize: 18,
                                fontWeight: '700',
                                textAlign: "center",
                                maxWidth: 350,
                                paddingVertical: 0,
                                paddingHorizontal: 0, borderWidth: 0,
                                marginRight: 15,
                                color: "#333",
                                marginBottom: 5,
                            }}>
                                {poll.data.question}
                            </Text>
                            <MyView hide={poll.data.memberVotes[auth.currentUser.uid] == undefined || poll.data.memberVotes[auth.currentUser.uid] == ""}
                            style={{
                                flexDirection: "row", justifyContent: "center", alignItems: "flex-start",
                            }}>
                                <MaterialIcons name="check-box" size={20} color="#3D8D04" />
                                <Text numberOfLines={1} style={{
                                fontSize: 14,
                                fontWeight: '800',
                                textAlign: "center",
                                paddingRight: 15,
                                paddingLeft: 5,
                                color: "#3D8D04",
                                }}>
                                    {"You already voted"}
                                </Text>
                            </MyView>
                            <MyView hide={poll.data.memberVotes[auth.currentUser.uid] != undefined && poll.data.memberVotes[auth.currentUser.uid] != ""}
                            style={{
                                flexDirection: "row", justifyContent: "center", alignItems: "flex-start",
                            }}>
                                <Feather name="clock" size={18} color="#DF3D23" />
                                <Text numberOfLines={1} style={{
                                fontSize: 14,
                                fontWeight: '600',
                                textAlign: "center",
                                paddingRight: 15,
                                paddingLeft: 5,
                                color: "#DF3D23",
                                }}>
                                
                                <Text style={{fontWeight: '800',}}>{"Closes:    "}</Text>
                                {(poll.data.endTime != null) ? (poll.data.endTime.toDate().toLocaleDateString("en-US", {
                                    month: "short", day: "2-digit", })
                                    +" @ "+poll.data.endTime.toDate().toLocaleTimeString("en-US", 
                                    {hour: "numeric", minute: "2-digit", })) : ("")}
                                
                                </Text>
                            </MyView>
                        </View>
                        <Icon
                            name='arrow-forward'
                            type='ionicon'
                            color='#333'
                            size={30}
                            style={{marginHorizontal: 10,}}
                        />
                        </TouchableOpacity>
                        ))}

                        {(index != groupToData.length-1) ? (
                        <Divider width={1} color={"#999"} style={{minWidth: "100%", marginTop: 5,}}/>
                        ) : (null)}

                    </MyView>
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

export default ActivePolls;
