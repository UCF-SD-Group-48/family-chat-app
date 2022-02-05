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




const FrontEndTestSpace = ({ navigation }) => {
    const [chats, setChats] = useState([]);

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

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'FE TEST GROUND',
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { color: 'black' },
            headerTintColor: 'black',
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity activeOpacity={ 0.5 } onPress={ signOutUser }>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }}/>
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View 
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 80,
                        marginRight: 20,
                    }}
                >
                    <TouchableOpacity activeOpacity={ 0.5 }
                        onPress={ () => navigation.navigate('Home') }
                    >
                        <Icon
                            name='back'
                            type='antdesign'
                            color='#517fa4'
                        />
                        
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={ () => navigation.navigate('AddChat') }
                        activeOpacity={ 0.5 }>
                        <SimpleLineIcons name='pencil' size={24} color='black' />
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
            <LargeTitle title="Family Chat" />
            <LargeTitle title="Welcome,"/>
            <LargeButton title="Get Started" type="Primary"/>
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