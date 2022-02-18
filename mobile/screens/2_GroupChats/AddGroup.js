import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Input, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from '../../firebase';

const AddGroup = ({navigation}) => {

    const [input, setInput] = useState("");

    useLayoutEffect(() => {
		navigation.setOptions({
			title: "Add a new Group",
			headerBackTitle: "Groups",
		});
	}, []);

    const createGroup = async () => {
		await db
			.collection("groups")
			.add({
				groupName: input,
			})
			.then(() => {
				navigation.goBack();
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

export default AddGroup

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 30,
		height: "100%",
	},
});


