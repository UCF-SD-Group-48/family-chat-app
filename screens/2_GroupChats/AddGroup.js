import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Input, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/FontAwesome";
import { db, auth } from '../../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";
import firebase from 'firebase/compat/app';


const AddGroup = ({navigation}) => {
    const [input, setInput] = useState("");
	
    useLayoutEffect(() => {
		navigation.setOptions({
			title: "Create new Group",
		});
	}, []);

    const createGroup = async () => {
		let currentUserId = auth.currentUser.uid
		await db
			.collection("groups")
			.add({
				groupName: input,
				groupOwner: auth.currentUser.uid,
				members: [auth.currentUser.uid]
			})
			.then( async (docRef) => {
				await db.collection("users").doc(currentUserId).update({
					groups: arrayUnion(docRef.id) // adds the uid's only

				})

				await db.collection('groups').doc(docRef.id)
				.collection("topics")
				.add({
					topicName: "General",
				})
				.then( (docRef) => {
					// add the topicId to the User's TopicId Map here
					const topicId = docRef.id
					db.collection('users').doc(currentUserId).update({
						topicMap: {
							topicId : firebase.firestore.FieldValue.serverTimestamp()
						} 
					})
					navigation.goBack();
				})
				.catch((error) => alert(error));
			})
			.catch((error) => alert(error));
	};


    return (
        <View style={styles.container}>
			<Input
				leftIcon={
					<Icon name="wechat" type="antdesign" size={24} color="blue" />
				}
				placeholder="Enter a Group name"
				value={input}
				onSubmitEditing={createGroup}
				onChangeText={setInput}
			/>
			<Button disabled={!input} title="Create new Group" onPress={createGroup} />
		</View>
  )
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 30,
		height: "100%",
	},
});

export default AddGroup;