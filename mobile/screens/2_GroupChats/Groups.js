// *************************************************************
// Imports for: React, React Native, & React Native Elements
import React, {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import {
	Alert,
	Avatar,
	Button,
	Icon,
	Image,
	Input,
	Tooltip,
} from 'react-native-elements';
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";


// Imports for: Expo
import { StatusBar } from 'expo-status-bar';
import ImagePicker from 'expo-image-picker';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

// Imports for: Firebase
import {
	apps,
	auth,
	db,
	firebaseConfig
} from '../../firebase';
import firebase from 'firebase/compat/app';

// Imports for: Components
import CustomListItem from '../../components/CustomListItem';
import LargeButton from '../../components/LargeButton';
import LargeTitle from '../../components/LargeTitle';
import LineDivider from '../../components/LineDivider';
import LoginInput from '../../components/LoginInput';
import LoginText from '../../components/LoginText';
import UserPrompt from '../../components/UserPrompt';
import GroupListItem from '../../components/GroupListItem'

// *************************************************************


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

	useEffect(async () => {
		// const unsubscribe = db.collection("groups").onSnapshot((snapshot) =>
		// 	setGroups(
		// 		snapshot.docs.map((doc) => ({
		// 			id: doc.id,
		// 			data: doc.data(),
		// 		}))
		// 	)
		// );
		// return unsubscribe;

		const user = await db.collection('users').doc('13214125192').get();
		if (user) console.log(true)
		else console.log(false)



	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Groups",
			headerStyle: { backgroundColor: "white" },
			headerTitleStyle: { color: "black" },
			headerTintColor: "black",
			headerLeft: '',
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
		<SafeAreaView style={styles.container}>
			<Button title={"Add a Group"} onPress={() => navigation.navigate("AddGroup")}/>
			<ScrollView width={"100%"}>
				{groups.map(({ id, data: { groupName } }) => (
					<GroupListItem
						key={id}
						id={id}
						groupName={groupName}
						enterGroup={enterGroup}
					/>
				))}
			</ScrollView>
			<LineDivider />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
        paddingVertical: 20,
        paddingHorizontal: 10,
		alignItems: 'center',
	},
})

export default Groups;