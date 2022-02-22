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
    Badge,
    Button,
    Icon,
    Image,
    Input,
    Tab,
    TabView,
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
} from '../firebase';
import firebase from 'firebase/compat/app';
import LineDivider from './LineDivider';

// *************************************************************

const NewNotificationsBlock = () => {

    const data = {
        displayName: 'Evan C. Navarro',
        message: 'Lorem ipsum dolor sit amica',
    };

    return (
        <View
            style={{
                width: '90%',
                borderWidth: 5,
                orderColor: 'black',
                borderRadius: '10%',
                backgroundColor: 'lightgrey',
                marginTop: 8,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: 'center',
                    }}
                >
                    <View style={styles.emoji}>
                        <Text style={styles.emojiText}>
                            {"" || '🥳'}
                        </Text>
                    </View>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',

                        }}
                    >
                        Group Name
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        marginLeft: 'auto',
                        alignItems: 'center',
                    }}
                >
                    {/* 
                    <Badge value="99+" status="error" />
                    <Badge value="10" status="primary" />
                     */}

                    <View
                        style={{
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                height: 25,
                                width: 50,
                                borderRadius: '50%',
                                backgroundColor: 'red',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: 'white'
                                }}
                            >
                                99+
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 10
                            }}
                        >
                            @ mentions
                        </Text>
                    </View>

                    <View
                        style={{
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                height: 25,
                                width: 50,
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: 'black'
                                }}
                            >
                                99+
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 10
                            }}
                        >
                            new
                        </Text>
                    </View>
                </View>
            </View>

            <LineDivider />

            <View
                style={{
                    marginTop: 10,
                    marginBottom: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: 'center',
                    }}
                >
                    {/*
                    <View
                        style={{
                            height: 25,
                            width: 25,
                            backgroundColor: '#0cc',
                            borderWidth: 2,
                            borderColor: '#555',
                            borderRadius: '100%',

                        }}
                    />
                    */}

                    <Icon
                        name='bell'
                        type='material-community'
                        color='black'
                        size={20}
                    />

                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                        }}
                    >
                        Topic
                    </Text>
                </View>

                <View style={styles.messageOutline}>
                    <TouchableOpacity
                        activeOpacity={0.75}
                    // onPress={}
                    >
                        <View style={styles.message}>
                            <View style={styles.userContainer} />
                            <View style={styles.textContainer}>
                                <Text style={styles.userName}>
                                    {data?.displayName || "Display Name"}
                                </Text>
                                <Text style={styles.text}>
                                    {data.message}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.75}
                    // onPress={}
                    >
                        <View style={styles.message}>
                            <View style={styles.userContainer} />
                            <View style={styles.textContainer}>
                                <Text style={styles.userName}>
                                    {data?.displayName || "Display Name"}
                                </Text>
                                <Text style={styles.text}>
                                    {data.message}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.75}
                    // onPress={}
                    >
                        <View
                            style={{
                                borderColor: 'lightgrey',
                                borderWidth: 2,
                                marginTop: 7,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    padding: 12
                                }}
                            >
                                See all new messages
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View
                style={{
                    marginTop: 10,
                    marginBottom: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: 'center',
                    }}
                >
                    {/*
                    <View
                        style={{
                            height: 25,
                            width: 25,
                            backgroundColor: '#0cc',
                            borderWidth: 2,
                            borderColor: '#555',
                            borderRadius: '100%',

                        }}
                    />
                    */}

                    <Icon
                        name='bell'
                        type='material-community'
                        color='black'
                        size={20}
                    />

                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                        }}
                    >
                        Topic
                    </Text>
                </View>

                <View style={styles.messageOutline}>
                    <TouchableOpacity
                        activeOpacity={0.75}
                    // onPress={}
                    >
                        <View style={styles.message}>
                            <View style={styles.userContainer} />
                            <View style={styles.textContainer}>
                                <Text style={styles.userName}>
                                    {data?.displayName || "Display Name"}
                                </Text>
                                <Text style={styles.text}>
                                    {data.message}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    emoji: {
        flex: 0,
        width: 60,
        height: 60,
        justifyContent: 'center',

        backgroundColor: '#0cc',
        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 15,
    },
    emojiText: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
        color: 'black',
    },

    messageOutline: {
        flex: 1,
        flexGrow: 1,
        minHeight: 30,
        justifyContent: "center",
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 5,
        marginLeft: 20,
        marginRight: 20,
    },
    message: {
        flex: 1,
        width: "100%",
        alignItems: 'flex-start',
        flexDirection: "row",
        backgroundColor: "#6660",
        padding: 7,
    },
    userContainer: {
        width: 39,
        height: 39,

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
        marginLeft: 10,
        height: 20,
        textAlign: 'left',
        fontSize: 12,
        fontWeight: '600',
        color: 'black',
        fontWeight: 'bold',
    },
    text: {
        marginLeft: 10,
        textAlign: 'left',
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
    },
});

export default NewNotificationsBlock;