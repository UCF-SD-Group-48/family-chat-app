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

	const checkIfSelected = (imageNumber) => {
		if (pfp === imageNumber) {
			// Selected Profile Option
			return {
				width: 50,
				height: 50,
				borderRadius: 8,
				margin: 5,
				opacity: 1,
				borderWidth: 5,
				borderColor: '#2C6BED'
			}
		}
		else {
			// Default faded styling for profile options
			return {
				width: 50,
				height: 50,
				borderRadius: 8,
				margin: 5,
				opacity: .3
			}
		}
	};

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [pfp, setPFP] = useState(1);
	const [profilePic, setProfilePic] = useState();
	let phoneNum = route.params.phoneNumber;
	const phoneNumber = phoneNum.slice(1, phoneNum.length);
	console.log("phoneNumber " + phoneNumber)

	const getPermissions = async () => {
		const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			alert('We need permission to access your camera.');
		}
		pickImage();
	};

	// Use this logic, that Tu provided for Image Sharing within conversations.
	const pickImage = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});

			if (!result.cancelled) {
				setProfilePic(result.uri);
			}

		} catch (error) {
			console.log('Error @pickImage:', error);
		}
	};

	const register = async () => {
		console.log('Current User:' + JSON.stringify(auth.currentUser));
		console.log("THIS SHOULD BE 6", setPFP)
		await db
			.collection('users')
			.doc(phoneNumber)
			.set({
				firstName: firstName,
				lastName: lastName,
				pfp: pfp,
				color: 'Blue',
				status: 'Active',
				statusEmoji: 'Happy',
				email: email,
				phoneNumber: phoneNumber,
				pushNotificationEnabled: true,
				locationServicesEnabled: true,
				importContactsEnabled: true,
				groups: [],
			})
			.then((result) => {
				console.log('Profile Updated!')
				console.log(result)
				navigation.navigate('UserCreated', { firstName, lastName, pfp, });
			})
			.catch((error) => { alert(error.message) });
	};

	return (
		<KeyboardAvoidingView
			enabled
			behavior='padding'
			style={styles.container}
		>
			<StatusBar style='light' />
			<View>
				<Text
					style={{
						fontSize: 18,
						fontWeight: 'bold',
						marginBottom: 10,
					}}
				>
					Choose a Profile Image:
				</Text>
				<View style={{ borderRadius: 2, borderWidth: 2, borderColor: 'lightgrey', width: '95%', alignContent: 'center', justifyContent: 'center', padding: 20 }}>
					<View style={styles.pfpOptions}>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(1)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_1.png')}
								style={checkIfSelected(1)}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(2)
							}}					>
							<Image
								source={require('../../assets/pfpOptions/avatar_2.png')}
								style={checkIfSelected(2)}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(3)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_3.png')}
								style={checkIfSelected(3)}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(4)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_4.png')}
								style={checkIfSelected(4)}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(5)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_5.png')}
								style={checkIfSelected(5)}
							/>
						</TouchableOpacity>
					</View>
					<View style={styles.pfpOptions}>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(6)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_6.png')}
								style={checkIfSelected(6)}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(7)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_7.png')}
								style={checkIfSelected(7)}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(8)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_8.png')}
								style={checkIfSelected(8)}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(9)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_9.png')}
								style={checkIfSelected(9)}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(10)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_10.png')}
								style={checkIfSelected(10)}
							/>
						</TouchableOpacity>
					</View>
					<View style={styles.pfpOptions}>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(11)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_11.png')}
								style={checkIfSelected(11)}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(12)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_12.png')}
								style={checkIfSelected(12)}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(13)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_13.png')}
								style={checkIfSelected(13)}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(14)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_14.png')}
								style={checkIfSelected(14)}
							/>
						</TouchableOpacity>

						{/* <TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(15)
							}}
						>
							<Image
								source={require('../../assets/pfpOptions/avatar_15.png')}
								style={checkIfSelected(15)}
							/>
						</TouchableOpacity> */}
						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() => {
								setPFP(6)
							}}
						>
							<View
								style={{
									width: 50,
									height: 50,
									borderRadius: 8,
									margin: 5,
									opacity: 1,
									backgroundColor: 'lightgrey',
									alignContent: 'center',
									justifyContent: 'center',
									borderColor: 'grey',
									borderWidth: 2,
								}}
							>
								<Icon
									name='add'
									type='material'
									color='grey'
									size={32}
									// onPress={getPermissions}
									onPress={pickImage}

								/>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>


			{/* <View style={styles.profileImage}>
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
				</View> */}

			<View style={styles.inputContainer}>
				<Input
					placeholder='First Name'
					autoFocus
					type='text'
					value={firstName}
					onChangeText={(text) => setFirstName(text)}
					style={{ marginTop: 20 }}
				/>
				<Input
					placeholder='Last Name'
					autoFocus
					type='text'
					value={lastName}
					onChangeText={(text) => setLastName(text)}
				/>
				{/* <Input
					placeholder='Email'
					autoFocus
					type='text'
					value={email}
					onChangeText={(text) => setEmail(text)}
				/> */}
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
	pfpOptions: {
		flexDirection: "row",
		justifyContent: 'center'
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