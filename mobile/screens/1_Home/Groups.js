import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
// import CustomListItem from '../../components/CustomListItem';
import GroupListItem from '../../components/GroupListItem';
import { NavigationContainer } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { auth, db } from '../../firebase';
import {AntDesign, SimpleLineIcons} from "@expo/vector-icons";
import { Button } from 'react-native-elements/dist/buttons/Button';

const Groups = ({ navigation }) => {
	const [groups, setGroups] = useState([]);

    const signOut = () => {
		auth.signOut().then(() => navigation.replace("Login"));
	};

	useEffect(() => {
		const unsubscribe = db.collection("groups").onSnapshot((snapshot) =>
			setGroups(
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
			title: "Groups",
			headerStyle: { backgroundColor: "white" },
			headerTitleStyle: { color: "black" },
			headerTintColor: "black",
			headerLeft: () => (
				<View style={{ marginLeft: 20 }}>
					<TouchableOpacity activeOpacity={0.5} onPress={signOut}>
						<Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
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
						onPress={() => navigation.navigate("AddGroup")}
					>
						<SimpleLineIcons name="pencil" size={24} color="black" />
					</TouchableOpacity>
				</View>
			),
		});
	}, [navigation]);

    const enterGroup = (id, groupName) => {
		navigation.navigate("Topics", { id, groupName });
	};

  return (
    <SafeAreaView>
			<ScrollView style={styles.container}>
				{groups.map(({ id, data: { groupName } }) => (
					<GroupListItem
						key={id}
						id={id}
						groupName={groupName}
						enterGroup={enterGroup}
					/>
				))}
			</ScrollView>
		</SafeAreaView>
  )
}

export default Groups

const styles = StyleSheet.create({
    container: {
		height: "100%",
	},
})