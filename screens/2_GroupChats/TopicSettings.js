// *************************************************************
// Imports for: React, React Native, & React Native Elements
import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import {
    Dimensions,
    Linking,
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
    Icon,
    Image,
    Input,
    Tooltip,
} from 'react-native-elements';
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";


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
import { collection, doc } from 'firebase/firestore';
import { set } from 'react-native-reanimated';

// *************************************************************

const TopicSettings = ({ navigation, route }) => {

    const [toggleWindowWidth, setToggleWindowWidth] = useState(() => {
        const windowWidth = Dimensions.get('window').width;
        return (windowWidth * .92);
    });

    const topicId = route.params.topicId;
    const topicName = route.params.topicName;
    const groupId = route.params.groupId;
    const groupName = route.params.groupName;
    const groupOwner = route.params.groupOwner;

    const goBackward = () => {
        navigation.navigate("Chat", { topicId, topicName, groupId, groupName, groupOwner,
        })
    };

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

    useEffect(() => {
        getTopicData();

        return () => {
            getTopicData();
        };
    }, [navigation]);

    const getTopicData = async () => {
        // const query = await db
        //     .collection('users')
        //     .where('phoneNumber', '==', searchedUserPhoneNumber)
        //     .get();

        console.log(topicName)

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





                {/* <View style={styles.innerContainer}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { viewBanner(id, data) }} key={id}
                        style={[
                            {
                                width: "100%", marginTop: 1,
                                backgroundColor: "#fff", borderWidth: 0,
                                flex: 0, flexGrow: 0, flexDirection: "row",
                                justifyContent: "flex-start", alignItems: "center",
                                borderRadius: 1,
                            },
                            {
                                shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
                                shadowRadius: 0, shadowOpacity: 0.5,
                            }
                        ]} >
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
                                    <Icon
                                        name='megaphone'
                                        type='entypo'
                                        color='#777777'
                                        size={18}
                                    />
                                    <Text numberOfLines={1}
                                        style={{
                                            fontSize: 18,
                                            fontWeight: '600',
                                            textAlign: "left",
                                            marginLeft: 15, marginRight: 10,
                                            color: "#777",
                                            flex: 1,
                                        }}>
                                        <Text style={{ fontWeight: '600' }}>"</Text>
                                        {data.description}
                                        <Text style={{ fontWeight: '600' }}>"</Text>
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
                                        {getString(data.ownerUID) || ""}
                                    </Text>
                                </View>
                            </View>
                        </View>
                       <View style={{
                            minWidth: 60,
                            borderColor: "#000", borderWidth: 0, backgroundColor: "#afc0",
                            paddingVertical: 0, paddingHorizontal: 15,
                            flex: 1, flexGrow: 0, justifyContent: "center", alignItems: "center",
                        }}>
                            <Entypo name="chevron-right" size={34} color="#333" />
                        </View>
                    </TouchableOpacity>
                </View> */}
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


})

export default TopicSettings;