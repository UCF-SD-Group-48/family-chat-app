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
import { AntDesign, SimpleLineIcons, Entypo, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";


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
import { collection } from 'firebase/firestore';
import { set } from 'react-native-reanimated';
import MyView from '../../components/MyView';
import { imageSelection } from '../5_Supplementary/GenerateProfileIcon';

// *************************************************************


const ViewPoll = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;
    const pollId = route.params.pollId;
    const pollData = route.params.pollData;
    
    const [max, setMax] = useState(0);

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

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "View Poll",
            headerRight: () => (
				<View style={{
						flexDirection: "row",
						marginRight: 20,
					}}>
                    <MyView hide={pollData.ownerUID != auth.currentUser.uid}>
                        <Menu>
                            <MenuTrigger text='' triggerOnLongPress={false} customStyles={triggerStyles}>
                                <MaterialCommunityIcons name="dots-horizontal" size={30} color="black" />
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
                                        db.collection("chats").doc(topicId).collection("polls").doc(pollId).delete();
                                        navigation.goBack();
                                    }}/>
                            </MenuOptions>
                        </Menu>
                    </MyView>
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

        setMax(getMax(pollData));
        

    }, [navigation]);

    // const getBannerOwner = async () => {
	// 	let phoneNumber = bannerData.ownerPhoneNumber.substring(2); //takes off the + from the phone number
    //     const snapshot = await db.collection("users").where('phoneNumber', '==', phoneNumber).limit(1).get();
    //     if (!snapshot.empty) {
    //         setBannerOwner(snapshot.docs[0].data());
    //     }
    //     else { return [] };
	// };

    const getMax = (data) => {
        // let returnString = "";
        let max = 0;
        Object.keys(data.votingOptions).forEach(key => {
            if(data.votingOptions[key] > max) {
                // returnString = key;
                max = data.votingOptions[key];
            }
            // else if(data.votingOptions[key] == max) {
            //     returnString = "--Tie--";
            // }
        });

        return max;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView width={"100%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    flex: 1, flexGrow: 1,
                }}>
                
                {/* Finished Poll */}
                <View style={{
                    width: "90%",
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
                                width: 165, height: 35, paddingLeft: 12, borderRadius: 7,
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
                                        {"Poll Results"}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/* Moderator */}
                    {(pollData.ownerUID === auth.currentUser.uid) ? (
                        <View style={{
                            minWidth: 26, minHeight: 26,
                            borderColor: "#000", borderWidth: 0, backgroundColor: "#F8D353",
                            paddingVertical: 0, paddingHorizontal: 0, marginRight: 15, borderRadius: 15, borderWidth: 2,
                            flex: 1, flexGrow: 0, justifyContent: "center", alignItems: "center",
                        }}>
                            <MaterialCommunityIcons name="crown" size={16} color="#333" style={{paddingLeft: 1}} />
                        </View>
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
                                            {pollData.question}
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
                            {Object.keys(pollData.votingOptions).sort().map((option) => (
                            <View key={option.length+""+option} style={{
                                    width: "100%",
                                    backgroundColor: "#fff0", borderWidth: 0,
                                    flex: 0, flexGrow: 0,
                                    flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
                                    marginBottom: 7,
                                }}>
                                
                                {(pollData.votingOptions[option] != undefined && pollData.votingOptions[option] == max
                                ) ? (
                                <View style={{width: "100%", height: 35,
                                    flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                    borderRadius: 3,  borderWidth: 1.5,  borderColor: "#83BA5C", backgroundColor: "#F8F8F8"
                                    }}>
                                    <MaterialCommunityIcons name="check-decagram" size={20} color="#83BA5C" style={{marginLeft: 10,}} />
                                    <Text numberOfLines={1} style={{
                                        textAlign: 'left', fontSize: 16, fontWeight: '700',
                                        color: 'black', borderWidth: 0, marginLeft: 10, flexGrow: 1,
                                        }}>
                                        {option}
                                    </Text>
                                    <View style={{
                                        width: 20, height: 20, borderRadius: 3, backgroundColor: "#83BA5C", marginHorizontal: 7,
                                        flexDirection: "row", justifyContent: "center", alignItems: "center",
                                        }}>
                                        <Text numberOfLines={1} style={{
                                            textAlign: 'center', fontSize: 11, fontWeight: '600',
                                            color: '#fff',
                                            }}>
                                            {pollData.votingOptions[option]}
                                        </Text>
                                    </View>
                                </View>
                                ) : (
                                <View style={{width: "100%", height: 35,
                                    flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                    borderRadius: 3,  borderWidth: 1,  borderColor: "#777",
                                    }}>
                                    <View style={{width: 6, height: 6, borderRadius: 50, backgroundColor: "#aaa", marginLeft: 17,}} />
                                    <Text numberOfLines={1} style={{
                                        textAlign: 'left', fontSize: 16, fontWeight: '500',
                                        color: '#777', borderWidth: 0, marginLeft: 17, flexGrow: 1,
                                        }}>
                                        {option}
                                    </Text>
                                    <View style={{
                                        width: 20, height: 20, borderRadius: 3, borderWidth: 1, borderColor: "#777", marginHorizontal: 7,
                                        flexDirection: "row", justifyContent: "center", alignItems: "center",
                                        }}>
                                        <Text numberOfLines={1} style={{
                                            textAlign: 'center', fontSize: 11, fontWeight: '400',
                                            color: '#777',
                                            }}>
                                            {pollData.votingOptions[option]}
                                        </Text>
                                    </View>
                                </View>
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
                                    color: '#333',
                                    }}>
                                    <Text style={{fontWeight: '700',}}> {"Closed: "}</Text>
                                    {(pollData.endTime != null) ? (pollData.endTime.toDate().toLocaleDateString("en-US", {
                                    month: "short", day: "2-digit", year: "numeric", })
                                    +" @ "+pollData.endTime.toDate().toLocaleTimeString("en-US", 
                                    {hour: "numeric", minute: "2-digit", timeZoneName: "short" })) : ("")}
                                </Text>
                            </View>

                        </View>
                    </View>
                </View>
                
            </View>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%", height: "100%",
        paddingVertical: 20,
        paddingHorizontal: 0,
        alignItems: 'center',
        backgroundColor: "#EFEAE2",
    },
})

export default ViewPoll;
