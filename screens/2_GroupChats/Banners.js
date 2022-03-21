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
import { AntDesign, Feather, Entypo, Ionicons } from "@expo/vector-icons";


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

// Imports for: Components

// *************************************************************


const Banners = ({ navigation, route }) => {
    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;

    const [banners, setBanners] = useState([])

    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(topicId)
            .collection('banners')
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) =>
                setBanners(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                ));
        return unsubscribe;
    }, [route]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Alerts",
            headerRight: () => (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginRight: 20,
					}}>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={addBanner}
					>
						<Feather name="plus" size={30} color="black" />
					</TouchableOpacity>
				</View>
			),
        });
    }, [navigation]);

    
    const addBanner = () => {
        navigation.push("AddBanner", { topicId, topicName, groupId, groupName, groupOwner });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView width={"100%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    flex: 1, flexGrow: 1,
                }}>
                {/* Add Banner Button */}
                <TouchableOpacity onPress={addBanner} activeOpacity={0.7}
                    style={[
                        {
                            minWidth: 200, minHeight: 60,
                            marginTop: 25, paddingHorizontal: 40,
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
						{"Create New Alert"}
					</Text>
                    <Entypo name="plus" size={30} color="white" />
                </TouchableOpacity>

                {/* History Text */}
                <View style={{
                    marginTop: 30,
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
                    {"History: Previous Alerts (XX)"}
                </Text>
                <Divider width={2} color={"#777"}
                    style={{
                        minWidth: "10%",
                        flexGrow: 1, flex: 1,
                    }}/>
                </View>

                {/* All Banners */}
                <ScrollView contentContainerStyle={{ paddingTop: 30, width: "100%", paddingLeft: 20, }}>
                    {banners.map(({ id, data }) => (
                        <View key={id}
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
                                        <Entypo name="megaphone" size={18} color="#777" />
                                        <Text numberOfLines={1}
                                                style={{
                                                    fontSize: 18,
                                                    fontWeight: '600',
                                                    textAlign: "left",
                                                    marginLeft: 15, marginRight: 10,
                                                    color: "#777",
                                                    flex: 1,
                                            }}>
                                            <Text style={{fontWeight: '600'}}>"</Text>
                                                {data.description}
                                            <Text style={{fontWeight: '600'}}>"</Text>
                                        </Text>
                                    </View>
                                    <View style={{
                                        width: "100%",
                                        borderColor: "#000", borderWidth: 0, backgroundColor: "#fac0",
                                        flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                                    }}>
                                        <Ionicons name="person-circle" size={18} color="#777" />
                                        <Text numberOfLines={1}
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '400',
                                                textAlign: "left",
                                                marginLeft: 15, marginRight: 10,
                                                color: "#777",
                                                flex: 1,
                                        }}>
                                            {data.ownerPhoneNumber}
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
                        </View>
                    ))}
                </ScrollView>
            </ScrollView>
            {/* <View style={{
                width: "100%", minHeight: 100,
                borderTopWidth: 2, backgroundColor: "#ffc0",
                flex: 1, flexGrow: 0, flexDirection: "row", justifyContent: "center", alignItems:  "center",
            }}>
                <TouchableOpacity onPress={addBanner} activeOpacity={0.7}
                    style={{
                        width: 200, height: 75,
                        marginTop: 0,
                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#afc",
                        borderColor: "#000", borderWidth: 2, borderRadius: 10,
                    }}>
					<Text style={{
						textAlign: "center",
						fontSize: 18,
						fontWeight: '600',
						color: 'black', marginRight: 0
					}}>
						{"Create Alert"}
					</Text>
                    <Icon
						name='plus'
                        type='antdesign'
                        color='#000'
						style={{
							width: 25, height: 25, marginLeft: 7, justifyContent: "center"
						}}
					/>
                </TouchableOpacity>
            </View> */}
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

export default Banners;
