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
import { AntDesign, SimpleLineIcons, Feather } from '@expo/vector-icons';


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
import { collection } from 'firebase/firestore';
import { set } from 'react-native-reanimated';

// *************************************************************


const GroupsTab = ({ navigation }) => {
	const [groups, setGroups] = useState([]);

	useEffect(async () => {
		const unsubscribe = db
			.collection('groups')
			.where('members', 'array-contains', auth.currentUser.uid)
			.onSnapshot((snapshot) => {
				setGroups(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						data: doc.data(),
					}))
				)
			});
		return unsubscribe;
	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Groups',
			headerStyle: { backgroundColor: 'white' },
			headerTitleStyle: { color: 'black'},
			headerTintColor: 'black',
			headerLeft: '',
			headerRight: () => (
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginRight: 12,
					}}>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => navigation.push('CreateGroup_1_NameImage')}
					>
						<Icon
							name='folder-plus'
							type='material-community'
							size={24}
							color='#363732'
						/>
					</TouchableOpacity>
				</View>
			),
		});
	}, [navigation]);

	const enterGroup = (groupId, groupName, groupOwner) => {
		// Navigating straight from Groups to Topic 'General' or the first Topic found (if General does not exist)
		let topic = null;
		const ref = db
			.collection('groups')
			.doc(groupId)
			.collection('topics')
			.get()
			.then((snapshot) => {
				snapshot.forEach((doc) => {
					if (doc.data().topicName == 'General' || topic == null) { topic = doc }
				});
			})
			.then(() => {
				const topicId = topic.id;
				const topicName = topic.data().topicName;
				navigation.push('Chat', { topicId, topicName, groupId, groupName, groupOwner });
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<SafeAreaView style={styles.mainContainer}>
			<ScrollView
				width={'100%'}
				contentContainerStyle={{
					justifyContent: 'flex-start',
					flexDirection: 'column',
				}}
			>
				<View>
					{groups.map(({ id, data: { groupName, groupOwner, color, coverImageNumber, members } }) => (
						<GroupListItem
							key={id}
							id={id}
							groupName={groupName}
							groupOwner={groupOwner}
							enterGroup={enterGroup}
							color={color}
							coverImageNumber={coverImageNumber}
							groupMemberCount={members.length}

						/>
					))}
				</View>

				<View style={{ width: '100%', alignItems: 'center' }}>
					<TouchableOpacity
						activeOpacity={0.75}
						onPress={() => navigation.push('CreateGroup_1_NameImage')}
					>
						<View style={styles.buttonSpacing}>
							<View style={[styles.buttonCreateGroup, {}]}>
								<Text style={styles.buttonCreateGroupText}>
									CREATE GROUP
								</Text>
								<Icon
									name='folder-plus'
									type='material-community'
									size={30}
									color='#777777'
									style={{ marginLeft: 5 }}
								/>
							</View>
						</View>
					</TouchableOpacity>
				</View>

			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	mainContainer: {
		backgroundColor: '#EFEAE2',
		height: '100%',
	},

	buttonSpacing: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		margin: 35,
	},

	buttonCreateGroup: {
		width: 240,
		height: 55,
		borderColor: '#777777',
		borderWidth: 3,
		borderStyle: 'solid',
		borderRadius: 200,
		flexDirection: 'row',
		justifyContent: 'center',
		display: 'flex',
		alignItems: 'center',
	},

	buttonCreateGroupText: {
		color: '#777777',
		fontSize: 18,
		fontWeight: '800',
		marginRight: 5,
	}


})

export default GroupsTab;