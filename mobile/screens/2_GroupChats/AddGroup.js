import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Input, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/FontAwesome";
import { db, auth } from '../../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";

const AddGroup = ({navigation}) => {
    const [input, setInput] = useState("");
	
    useLayoutEffect(() => {
		navigation.setOptions({
			title: "Add a new Group",
			headerBackTitle: "Groups",
		});
	}, []);

    const createGroup = async () => {
		let currentUserId = auth.currentUser.uid
		await db
			.collection("groups")
			.add({
				groupName: input,
				members: [auth.currentUser.uid]
			})
			.then( async (docRef) => {
				// console.log("docRef " + docRef.id)
				// console.log("currentUser " + JSON.stringify(auth.currentUser, null, "\t"))
				await db.collection("users").doc(currentUserId).update({
					// groups: arrayUnion(docRef.id)
					groups: arrayUnion(db.collection("groups").doc('/' + docRef.id))

				})

				// then add to ref

				// console.log("uid " + JSON.stringify(auth.currentUser.uid))
				// const userRef = doc(db, "users", auth.currentUser.uid);
				// await updateDoc(userRef, {
				// 	groups: arrayUnion(docRef.id)
				// })

				await db.collection('groups').doc(docRef.id)
				.collection("topics")
				.add({
					topicName: "General",
				})
				.then( () => {
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