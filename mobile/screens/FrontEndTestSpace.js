import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import CustomListItem from '../components/CustomListItem';
import LargeButton from '../components/LargeButton';
import { NavigationContainer } from '@react-navigation/native';
import { Avatar, Icon } from 'react-native-elements';
import { auth, db } from '../firebase';
import {AntDesign, SimpleLineIcons} from "@expo/vector-icons";

// Landing Page - Avatar
import AppLogo from '../assets/appLogo.svg'




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
    <SafeAreaView>
      <ScrollView style={ styles.container }>
          {chats.map( ({ id, data: { chatName } }) => (
                <CustomListItem 
                    key={ id } 
                    id={ id } 
                    chatName={ chatName }
                    enterChat={ enterChat }
                />
          ))}

          {/* <AppLogo /> */}
          <LargeButton title="Get Started" style="Primary"/>
          <LargeButton title="Log In" style="Secondary"/>
          <LargeButton title="Go to Home Screen" style="Tertiary"/>
          <LargeButton title="Log In" style="Create Account"/>


      </ScrollView>
    </SafeAreaView>
  );
};

export default FrontEndTestSpace;

const styles = StyleSheet.create({
    container: {
        height:'100%'
    }
});