import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import CustomListItem from '../../components/CustomListItem';
import { NavigationContainer } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { auth, db } from '../../firebase';
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";

const Topics = ({ navigation, route }) => {
	const [topics, setTopics] = useState([]);
	const groupId = route.params.id;
	const groupName = route.params.groupName;

	const signOut = () => {
		auth.signOut().then(() => navigation.replace("Login"));
	};

	useEffect(() => {
		console.log("Topics/groupid " + groupId)
		const unsubscribe = db.collection("groups").doc(String(groupId)).collection("topics").onSnapshot((snapshot) =>
			setTopics(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data(),
				}))
			)
		);
		return unsubscribe;
	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Topics",
			headerStyle: { backgroundColor: "white" },
			headerTitleStyle: { color: "black" },
			headerTintColor: "black",
			headerLeft: () => (
				<View style={{ marginLeft: 20 }}>
					<TouchableOpacity activeOpacity={0.5} onPress={signOut}>
						{/* <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} /> */}
						<SimpleLineIcons name="arrow-left" size={24} color="black" onPress={() => { navigation.replace('Groups') }} />
					</TouchableOpacity>
				</View>
			),
			headerRight: () => (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						width: 80,
						marginRight: 20,
					}}
				>
					<TouchableOpacity activeOpacity={0.5}>
						<AntDesign name="camerao" size={24} color="black" />
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.5}
						// onPress={() => navigation.navigate("AddChat")}
						onPress={() => navigation.navigate("AddTopic", { groupId, groupName })}

					>
						<SimpleLineIcons name="pencil" size={24} color="black" />
					</TouchableOpacity>
				</View>
			),
		});
	}, [navigation]);

	const enterTopic = (id, topicName) => {
		navigation.navigate("Chat", { id, topicName });
	};

	return (
		<SafeAreaView>
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
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
})

export default Topics;