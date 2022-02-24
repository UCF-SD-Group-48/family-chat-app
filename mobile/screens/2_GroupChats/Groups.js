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

	useEffect( async () => {
		// const test1 =  db.collection('users').doc(auth.currentUser.uid)
		// console.log("unicorn madness " + JSON.stringify(test1, null, "\t"))
		// const test1 = await db.collection('users').doc(auth.currentUser.uid).get()
		// console.log("unicorn conundrum: " )
		// console.log(test1.ref.path)
		const unsubscribe = db.collection("groups").where('members', 'array-contains', auth.currentUser.uid).onSnapshot((snapshot) =>
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
			<ScrollView width={"100%"}
				contentContainerStyle={{
					justifyContent: "flex-start", alignItems: "center", flexDirection: "column",
				}}
				>
				{groups.map(({ id, data: { groupName } }) => (
					<GroupListItem
						key={id}
						id={id}
						groupName={groupName}
						enterGroup={enterGroup}
					/>
				))}
				<LineDivider topSpacing={5}/>
				<TouchableOpacity onPress={() => navigation.navigate("AddGroup")} activeOpacity={0.7}
					style={{
						width: 350, height: 75,
						marginTop: 25,
						justifyContent: "center", alignItems: "center", flexDirection: "row",
						backgroundColor: "#afc",
						borderColor: "#000", borderWidth: 2, borderRadius: 10,
					}}
				>
					<Icon
						name='plus'
                        type='antdesign'
                        color='#000'
						style={{
							width: 50, height: 50, marginRight: 0, justifyContent: "center"
						}}
					/>
					<Text style={{
						textAlign: "center",
						fontSize: 18,
						fontWeight: '600',
						color: 'black', marginRight: 15
					}}>
						{"Create New Group"}
					</Text>
				</TouchableOpacity>
			</ScrollView>
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