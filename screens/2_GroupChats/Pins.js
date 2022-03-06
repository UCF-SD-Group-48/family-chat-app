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
    Icon,
    Image,
    Input,
    Tooltip,
} from 'react-native-elements';
import { AntDesign, Feather } from "@expo/vector-icons";


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

// *************************************************************


const Pins = ({ navigation, route }) => {
    const [pins, setPins] = useState([])
    const groupId = route.params.groupId;

    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(route.params.id)
            .collection('pins')
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) =>
                setPins(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                ));
        return unsubscribe;
    }, [route]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Pins",
            headerRight: () => (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginRight: 20,
					}}>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={addPin}
					>
						<Feather name="plus" size={30} color="black" />
					</TouchableOpacity>
				</View>
			),
        });
    }, [navigation]);

    
    const addPin = () => {
        navigation.navigate("AddPin", { topicId: route.params.id, topicName: route.params.topicName, groupId, groupName: route.params.groupName });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView width={"100%"}
                contentContainerStyle={{
                    justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
                    flex: 1, flexGrow: 1,
                }}>
                {/* Info Blurb to descripe/encourage making of a pin */}
                <ScrollView contentContainerStyle={{ paddingTop: 0, width: "100%" }}>
                    {pins.map(({ id, data }) => (
                            <View key={id} style={styles.message}>
                                <View
                                    style={styles.userContainer} />
                                <View style={styles.textContainer}>
                                    <Text style={styles.userName}>
                                        {data.ownerPhoneNumber || "Display Name"}
                                    </Text>
                                    <Text style={styles.titleText}>
                                            {data.title}
                                    </Text>
                                    <View style={styles.textOutline}>
                                        <Text style={styles.text}>
                                            {data.content}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                    ))}
                </ScrollView>
            </ScrollView>
            <View style={{
                width: "100%", minHeight: 100,
                borderTopWidth: 2, backgroundColor: "#ffc0",
                flex: 1, flexGrow: 0, flexDirection: "row", justifyContent: "center", alignItems:  "center",
            }}>
                {/* Add Pin Button */}
                <TouchableOpacity onPress={addPin} activeOpacity={0.7}
                    style={{
                        width: 200, height: 75,
                        marginTop: 0,
                        justifyContent: "center", alignItems: "center", flexDirection: "row",
                        backgroundColor: "#afc",
                        borderColor: "#000", borderWidth: 2, borderRadius: 10,
                    }}>
                    <Icon
						name='plus'
                        type='antdesign'
                        color='#000'
						style={{
							width: 50, height: 50, marginRight: 0, justifyContent: "center"
						}}
					/>
					<Text style={{
						textAlign: "center",
						fontSize: 18,
						fontWeight: '600',
						color: 'black', marginRight: 15
					}}>
						{"Add Pin"}
					</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%", height: "100%",
        paddingTop: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
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

export default Pins;
