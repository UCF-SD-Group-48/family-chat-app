import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Input, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from '../../firebase';

const AddTopic = ({ navigation, route }) => {

    const [input, setInput] = useState("");
	const groupId = String(route.params.groupId);
	const groupName = route.params.groupName;

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Add a new Topic to ",
			headerBackTitle: "Topics",
		});
	}, []);

    const createTopic = async () => {
		console.log("groupID " + groupId)
		console.log("groupName " + groupName)
		await db.collection('groups').doc(groupId)
			.collection("topics")
			.add({
				topicName: input,
			})
			.then(() => {
				navigation.goBack();
			})
			.catch((error) => alert(error));

	};
    
  return (
        <View style={styles.container}>
			<Text>{groupName}</Text>
			<Input
				leftIcon={
					<Icon name="wechat" type="antdesign" size={24} color="black" />
				}
				placeholder="Enter a Topic name"
				value={input}
				onSubmitEditing={createTopic}
				onChangeText={setInput}
			/>
			<Button disabled={!input} title="Create new Topic" onPress={createTopic} />
		</View>
  )
}

export default AddTopic

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 30,
		height: "100%",
	},
});
