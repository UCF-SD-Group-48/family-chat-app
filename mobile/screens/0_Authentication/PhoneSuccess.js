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

// Imports for: Expo
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
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

 // *************************************************************

 // The provided phone was accepted, now take the user's input to create account.
const PhoneSuccess = ({ navigation, route }) => {
	useLayoutEffect(() => {
		navigation.setOptions({
			headerBackTitle: 'Back to Login',
		});
	}, [navigation]);

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [profilePic, setProfilePic] = useState();
	const phoneNumber = route.params.phoneNumber;

	const getPermissions = async () => {
		const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			alert('We need permission to access your camera.');
		}
		pickImage();
	};

	const pickImage = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});

			console.log(result);
			if (!result.cancelled) {
				setProfilePic(result.uri);
			}

		} catch (error) {
			console.log('Error @pickImage:', error);
		}
	};

	const register = async () => {
		const currentUser = auth.currentUser;
		console.log('Current User:' + JSON.stringify(currentUser));
		await db
			.collection('users').add({
				firstName: firstName,
				lastName: lastName,
				pfp: '',
				color: 'Blue',
				status: 'Active',
				statusEmoji: 'Happy',
				email: email,
				phoneNumber: currentUser.phoneNumber,
				pushNotificationEnabled: true,
				locationServicesEnabled: true,
				importContactsEnabled: true,
				profilePic: profilePic,
				groups: [],
			})
			.then(() => {
				console.log('Profile Updated!')
				navigation.navigate('UserCreated', {firstName, lastName, profilePic});
			}) 
			.catch((error) => alert(error.message));
	};

	return (
		<KeyboardAvoidingView
			enabled
			behavior='padding'
			style={styles.container}
		>
			<StatusBar style='light' />
			<Text h3 style={{ marginBottom: 50 }}>
				SUCCESS PAGE
			</Text>
			<View style={styles.inputContainer}>
				<View style={styles.profileImage}>
					{!profilePic ? (
						<Icon
							name='plus'
							type='antdesign'
							color='white'
							size={24}
							// onPress={getPermissions}
							onPress={pickImage}
						/>
					) : (
						<Image
							source={{ uri: profilePic }}
							style={{ width: 100, height: 100 }}
							// onPress={getPermissions}
							onPress={pickImage}
						/>
					)}
				</View>
				<Input
					placeholder='First Name'
					autoFocus
					type='text'
					value={firstName}
					onChangeText={(text) => setFirstName(text)}
				/>
				<Input
					placeholder='Last Name'
					autoFocus
					type='text'
					value={lastName}
					onChangeText={(text) => setLastName(text)}
				/>
				<Input
					placeholder='Email'
					autoFocus
					type='email'
					value={email}
					onChangeText={(text) => setEmail(text)}
				/>
			</View>
			<Button
				containerStyle={styles.button}
				onPress={register}
				title='Register'
				raised
			/>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		backgroundColor: 'white',
	},
	button: {
		width: 200,
		marginTop: 10,
	},
	inputContainer: {
		width: 300,
	},
	profileImage: {
		backgroundColor: '#2c6bed',
		borderRadius: 40,
		height: 80,
		width: 80,
		marginTop: -20,
		marginBottom: 10,
		overflow: 'hidden',
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default PhoneSuccess;