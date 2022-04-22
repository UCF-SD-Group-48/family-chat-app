import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import CustomListItem from '../../components/CustomListItem';
import { NavigationContainer } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { auth, db } from '../../firebase';
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Button } from 'react-native-elements/dist/buttons/Button';
import { collection } from 'firebase/firestore';

const Topics = ({ navigation, route }) => {
	const [topics, setTopics] = useState([]);
	const [invite, setInvite] = useState();
	const groupId = route.params.id;
	const groupName = route.params.groupName;

	const signOut = () => {
		auth.signOut().then(() => navigation.replace("Login"));
	};

	useEffect(() => {
		const unsubscribe = db.collection("groups").doc(groupId).collection("topics").onSnapshot((snapshot) =>
			setTopics(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data(),
				}))
			)
		);
		return unsubscribe;
	}, []);

	// useLayoutEffect(() => {
	// 	navigation.setOptions({
	// 		title: "Topics",
	// 		headerStyle: { backgroundColor: "white" },
	// 		headerTitleStyle: { color: "black" },
	// 		headerTintColor: "black",
	// 		headerLeft: () => (
	// 			<View style={{ marginLeft: 20 }}>
	// 				<TouchableOpacity activeOpacity={0.5} onPress={signOut}>
	// 					{/* <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} /> */}
	// 					<SimpleLineIcons name="arrow-left" size={24} color="black" onPress={() => { navigation.replace('Groups') }} />
	// 				</TouchableOpacity>
	// 			</View>
	// 		),
	// 		headerRight: () => (
	// 			<View
	// 				style={{
	// 					flexDirection: "row",
	// 					justifyContent: "space-between",
	// 					width: 80,
	// 					marginRight: 20,
	// 				}}
	// 			>
	// 				<TouchableOpacity activeOpacity={0.5}>
	// 					<AntDesign name="camerao" size={24} color="black" />
	// 				</TouchableOpacity>
	// 				<TouchableOpacity
	// 					activeOpacity={0.5}
	// 					// onPress={() => navigation.navigate("AddChat")}
	// 					onPress={() => navigation.navigate("AddTopic", { groupId, groupName })}

	// 				>
	// 					<SimpleLineIcons name="pencil" size={24} color="black" />
	// 				</TouchableOpacity>
	// 			</View>
	// 		),
	// 	});
	// }, [navigation]);

	const enterTopic = (id, topicName) => {
		navigation.navigate("Chat", { id, topicName, groupId });
	};
	
	//users.groups 
	//groups.members
	
	const inviteUser = (groupId) => {

		// Check phone number in database,


		const check = db.collection('users').where('phoneNumber', '==', invite).get()
			.then((phoneNumber) => {
				// find that invited user's uid. 
				// add user to groups.members array

				// Add groupID to users's array
			})
			.catch((error) => {
				alert(error)
			}	
			);

		

		// if no: alert message
		// else yes: 
			// retrieve userID
			// add the user's ID that corresponds to inputted number to groups.members array
			// & add group reference to the users.groups for the user that is invited
			// Redirect to Groups Page?

		// Accept or Reject for invitee
		


	}

	return (
		<SafeAreaView>
			<Button title={"Add a Topic"} onPress={() => navigation.navigate("AddTopic", { groupId, groupName })} />
			<Button title={"Go Back"} onPress={() => navigation.goBack()}/>
			
			<ScrollView style={styles.container}>
				{topics.map(({ id, data: { topicName } }) => (
					<CustomListItem
						key={id}
						id={id}
						topicName={topicName}
						enterTopic={enterTopic}
					/>
				))}
			</ScrollView>

			<Input
				leftIcon={
					<Icon name="wechat" type="antdesign" size={24} color="blue" />
				}
				placeholder="Enter a number to invite to this group"
				value={invite}
				onSubmitEditing={inviteUser}
				onChangeText={(invite) => setInvite(invite)}
			/>
			<Button disabled={!invite} title="Invite user" onPress={inviteUser} />

		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
})

export default Topics;