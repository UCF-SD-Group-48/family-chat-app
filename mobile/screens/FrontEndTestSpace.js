import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import CustomListItem from '../components/CustomListItem';
import LargeButton from '../components/LargeButton';
import { NavigationContainer } from '@react-navigation/native';
import { Avatar, Icon } from 'react-native-elements';
import { auth, db } from '../firebase';
import {AntDesign, SimpleLineIcons} from "@expo/vector-icons";
import loginStyles from '../styles/loginStyles.js';

// Landing Page - Avatar
import AppLogo from '../assets/appLogo.svg'
import LargeTitle from '../components/LargeTitle';
import LoginInput from '../components/LoginInput';
import LineDivider from '../components/LineDivider';
import UserPrompt from '../components/UserPrompt';




const FrontEndTestSpace = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [inputText, onChangeText] = useState("");

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login');
        });
    };

    useEffect(() => {
        const unsubscribe = db.collection('chats').onSnapshot((snapshot) => (
            setChats(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
            }))
         )
        ));
        return unsubscribe;
    }, [])

    const goBackToPreviousScreen = () => {
        navigation.replace('Home');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'FE TEST SPACE',
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { color: 'black' },
            headerTintColor: 'black',
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity activeOpacity={ 0.5 } onPress={ goBackToPreviousScreen }>
                        <Icon
                            name='back'
                            type='antdesign'
                            color='black'
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View 
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginRight: 20,
                    }}
                >
                    <TouchableOpacity 
                        onPress={ () => navigation.navigate('UserAuth') }
                        activeOpacity={ 0.5 }
                    >
                        <Icon
                            name='resistor-nodes'
                            type='material-community'
                            color='red'
                            size='30'
                        />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation]);

    const enterChat = (id, chatName) => {
		navigation.navigate('Chat', { id, chatName });
	};


  return (
    // <SafeAreaView>
    //   <ScrollView style={ styles.container }>
    //       {/* {chats.map( ({ id, data: { chatName } }) => (
    //             <CustomListItem 
    //                 key={ id } 
    //                 id={ id } 
    //                 chatName={ chatName }
    //                 enterChat={ enterChat }
    //             />
    //       ))} */}
        

    //   </ScrollView>
    // </SafeAreaView>

    <View style={ loginStyles.container }>
        <View style={ loginStyles.top_centerAligned_view }>
            {/* <AppLogo /> */}
            <UserPrompt title={"Hi there! Let's setup your account!"} topSpacing={5} />
            <LargeTitle title="Family Chat" height={100} topSpacing={15}/>
            <LineDivider/>
            <View height={25} />
            {/* Enter your phone number below\nto register your phone number */}
            <LoginInput title="Enter Phone #:" value={inputText} placeholder={"1 (XXX) XXX - XXXX"}/>
        </View>

        <View style={ loginStyles.middle_centerAligned_view }>
        </View>

        <View style={ loginStyles.top_centerAligned_view }>
            <LargeButton title="Log In" type="Secondary"/>
            <LargeButton title="Go to Home Screen" type="Tertiary"/>
            <LargeButton title="Log In" type="" style={{alignSelf: 'flex-end'}}/>
            <Text>hello</Text>
        </View>

        <View style={ loginStyles.bottom_centerAligned_view } />
    </View>
  );
};

export default FrontEndTestSpace;

const styles = StyleSheet.create({
    container: {
        height:'100%',
    }
});