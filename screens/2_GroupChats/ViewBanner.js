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
import { AntDesign, SimpleLineIcons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";


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


const ViewBanner = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;
    const bannerId = route.params.bannerId;
    const bannerData = route.params.bannerData;
    
    const [bannerOwner, setBannerOwner] = useState([]);

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
            title: "View Alert",
            headerRight: () => (
				<View style={{
						flexDirection: "row",
						marginRight: 20,
					}}>
                    <MyView hide={bannerData.ownerUID != auth.currentUser.uid}>
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
                                        db.collection("chats").doc(topicId).collection("banners").doc(bannerId).delete();
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

        getBannerOwner();
        

    }, [navigation]);

    const getBannerOwner = async () => {
		let phoneNumber = bannerData.ownerPhoneNumber.substring(2); //takes off the + from the phone number
        const snapshot = await db.collection("users").where('phoneNumber', '==', phoneNumber).limit(1).get();
        if (!snapshot.empty) {
            setBannerOwner(snapshot.docs[0].data());
        }
        else { return [] };
	};

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView width={"100%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    flex: 1, flexGrow: 1,
                }}>
                <View style={[
                    {
                        width: "95%",
                        justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#EC7169"
                    },
                    {
                        shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                        shadowRadius: 3, shadowOpacity: 0.4,
                    }]}>
                    <View style={{
                        justifyContent: "space-between", alignItems: "center", flexDirection: "row",
                    }}>
                        <Entypo name="megaphone" size={25} color="#333" style={{
                            paddingVertical: 15, paddingHorizontal: 15,
                        }}/>
                        <Text style={{
                            paddingLeft: 5,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: "#222",
                            }}>
                            {"Alert Details:"}
                        </Text>
                    </View>
                    {(bannerData.ownerUID === auth.currentUser.uid) ? (
                        <View style={{
                            width: 26, height: 26,
                            marginRight: 15,
                            justifyContent: "center", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#F8D353", borderWidth: 2, borderColor: "black", borderRadius: 15,
                        }}>
                            <MaterialCommunityIcons name="crown" size={16} color="#333" style={{paddingLeft: 1}} />
                        </View>
                    ) : (
                        <View style={{
                            width: 26, height: 26,
                            marginRight: 15,
                            justifyContent: "center", alignItems: "center", flexDirection: "row",
                        }}></View>
                    )}
                </View>
                <View style={[
                        {
                            width: "95%",
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                            backgroundColor: "#fff",
                        },
                        {
                            shadowColor: "#000", shadowOffset: {width: 0, height: 3},
                            shadowRadius: 3, shadowOpacity: 0.4,
                        }
                    ]}>
                    
                    {/* Message Content */}
                        {/* -label */}
                    <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 15,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <Text style={{
                            paddingLeft: 0,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Message:"}
                        </Text>
                    </View>
                        {/* -content */}
                    <View style={{
                        width: "90%", flexDirection: "row",
                    }}>
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 0, marginHorizontal: 0, marginBottom: 0,
                            paddingTop: 10, paddingBottom: 12, paddingHorizontal: 15,
                            justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "row",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <Entypo name="megaphone" size={20} color="#333" />
                            <Text style={{
                                paddingLeft: 12,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '500',
                                color: "#222",
                                }}>
                                {bannerData.description}
                            </Text>
                        </View>
                    </View>

                    {/* Announcer */}
                        {/* -label */}
                        <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 15,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <Text style={{
                            paddingLeft: 0,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Announcer:"}
                        </Text>
                    </View>
                        {/* -content */}
                    <View style={{
                        width: "90%", flexDirection: "row",
                    }}>
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 0, marginHorizontal: 0, marginBottom: 0,
                            paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            {/* <Entypo name="megaphone" size={18} color="#333" /> data.pfp (a number) */}
                            <Image source={imageSelection(bannerOwner.pfp)}
                                style={{
                                    width: 25, height: 25,
                                    borderRadius: 4, borderWidth: 0, borderColor: "#333",
                                }}/>
                            <Text style={{
                                paddingLeft: 12,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '500',
                                color: "#222",
                                }}>
                                {bannerOwner.firstName+" "+bannerOwner.lastName}
                            </Text>
                        </View>
                    </View>

                    {/* Sent On Date */}
                        {/* -label */}
                        <View style={{
                            width: "90%", minHeight: 30,
                            marginHorizontal: 20, marginTop: 15,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            backgroundColor: "#6660",
                        }}>
                        <Text style={{
                            paddingLeft: 0,
                            textAlign: 'left',
                            fontSize: 16,
                            fontWeight: '700',
                            color: 'black',
                            }}>
                            {"Sent on:"}
                        </Text>
                    </View>
                        {/* -content */}
                    <View style={{
                        width: "90%", flexDirection: "row",
                    }}>
                        <View style={{
                            width: 50, minHeight: 10, maxHeight: 250, flex: 1, flexGrow: 1, flexDirection: "column",
                            marginTop: 0, marginHorizontal: 0, marginBottom: 35,
                            paddingTop: 10, paddingBottom: 10, paddingHorizontal: 12,
                            justifyContent: "flex-start", alignItems: "center", flexDirection: "row",
                            borderWidth: 1, borderColor: "#333", borderRadius: 3, backgroundColor: "#F8F8F8"
                        }}>
                            <MaterialCommunityIcons name="calendar-clock" size={24} color="#333" />
                            <Text style={{
                                paddingLeft: 12,
                                textAlign: 'left',
                                fontSize: 16,
                                fontWeight: '500',
                                color: "#222",
                                }}>
                                {(bannerData.timestamp != null) ? (bannerData.timestamp.toDate().toLocaleDateString("en-US", {
                                    month: "short", day: "2-digit", year: "numeric", })
                                    +" @ "+bannerData.timestamp.toDate().toLocaleTimeString("en-US", 
                                    {hour: "numeric", minute: "2-digit", timeZoneName: "short" })) : ("")}
                            </Text>
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
        paddingHorizontal: 10,
        alignItems: 'center',
        backgroundColor: "#EFEAE2",
    },
})

export default ViewBanner;
