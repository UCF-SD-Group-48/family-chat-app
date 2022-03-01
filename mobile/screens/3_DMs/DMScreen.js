import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import CustomListItem from '../../components/CustomListItem';
import { NavigationContainer } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { auth, db } from '../../firebase';
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Button } from 'react-native-elements/dist/buttons/Button';
import CustomListItem from '../../components/CustomListItem';
import { collection } from 'firebase/firestore';

const DMScreen = ({navigation}) => {

    const [chats, setChats] = useState([])

    useEffect(() => {
		const unsubscribe = db.collection("users").onSnapshot((snapshot) =>
			setChats(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data(),
				}))
			)
		);
		return unsubscribe;
	}, []);
    
    const enterChat = (id, chatName) => {
		navigation.navigate("Chat", { id, chatName });
	};

  return (
		<SafeAreaView>
			<ScrollView style={styles.container}>
				{chats.map(({ id, data: { firstName } }) => (
					<CustomListItem
						key={id}
						id={id}
						chatName={firstName}
						enterChat={enterChat}
					/>
				))}
			</ScrollView>
		</SafeAreaView>
	);
}

export default DMScreen

const styles = StyleSheet.create({})