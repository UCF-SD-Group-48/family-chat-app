import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
// import CustomListItem from '../../components/CustomListItem';
import GroupListItem from '../../components/GroupListItem';
import { NavigationContainer } from '@react-navigation/native';
import { auth, db } from '../../firebase';
import {AntDesign, SimpleLineIcons} from "@expo/vector-icons";
import {
	Alert,
	Avatar,
	Button,
	Icon,
	Image,
	Input,
	Tooltip,
  } from 'react-native-elements';

const Groups = ({ navigation }) => {
	const [groups, setGroups] = useState([]);
	const goToAddChat = () => {
		navigation.navigate('AddChat');
	  }
	
	  const goToHome = () => {
		navigation.navigate('HomeTab');
	  }
	
	  const goToGroupChats = () => {
		navigation.navigate('Groups');
	  }
	
	  const goToDMs = () => {
		navigation.navigate('DMsTab');
	  }
	
	  const goToProfile = () => {
		navigation.navigate('ProfileTab');
	  }
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
				<View style={{ padding: 20, borderWidth: 2, borderStyle: 'solid', borderColor: 'black', width: 200 }}>
        <Text>Temporary Navigation</Text>
        <TouchableOpacity activeOpacity={0.5} onPress={goToHome} style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0 }}>
          <Icon
            name='home'
            type='material-community'
            color='black'
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={goToGroupChats} style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0, marginLeft: 30 }}>
          <Icon
            name='group'
            type='material'
            color='black'
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={goToDMs} style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0, marginLeft: 60 }}>
          <Icon
            name='direction'
            type='entypo'
            color='black'
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={goToProfile} style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0, marginLeft: 90 }}>
          <Icon
            name='person-pin'
            type='material'
            color='black'
          />
        </TouchableOpacity>
      </View>
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