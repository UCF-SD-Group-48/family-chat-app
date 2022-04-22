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
	Divider,
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

// Imports for: Helper Functions
import CreateUserPayload from '../../helperFunctions/CreateUserPayload';

// *************************************************************
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// The provided phone was accepted, now take the user's input to create account.
const PhoneSuccess = ({ navigation, route }) => {

    const [createButtonDisabled, setCreateButtonDisabled] = useState(true);

    useEffect(() => {
        setCreateButtonDisabled(lastName.length > 0 ? false : true);
    }, email);

	const goBackToPreviousScreen = () => {
		navigation.navigate('RegisterPhone');
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Create Account',
			headerStyle: { backgroundColor: '#FFE5B8' },
			headerTitleStyle: { color: 'black' },
			headerTintColor: 'black',
			headerLeft: () => (
				<View style={{ marginLeft: 20 }}>
					<TouchableOpacity activeOpacity={0.5} onPress={goBackToPreviousScreen}>
						<Icon
							name='arrow-back'
							type='ionicon'
							color='black'
							size={28}
						/>
					</TouchableOpacity>
				</View>
			),
			headerRight: ''
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
	const phoneNumber = phoneNum.slice(2, phoneNum.length);

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

	let userPayload = CreateUserPayload(firstName, lastName, pfp , email, phoneNumber);

	// const register = async () => {
	// 	await db
	// 		.collection('users')
	// 		.doc(auth.currentUser.uid)
	// 		.set(userPayload)
	// 		.then((result) => {
	// 			console.log('Profile Updated!')
	// 			console.log(result)
	// 			navigation.navigate('UserCreated', { firstName, lastName, pfp, });
	// 		})
	// 		.catch((error) => { alert(error.message) });
	// };
	
	const register = async () => {
		await db
			.collection('users').doc(auth.currentUser.uid)
			.set({
				firstName: firstName,
				lastName: lastName,
				pfp: pfp,
				color: 'Blue',
				statusText: 'New to FamilyChat!',
				statusEmoji: '👋',
				email: email,
				phoneNumber: phoneNumber,
				pushNotificationEnabled: true,
				discoverableEnabled: true,
				groups: [],
				lastOn: firebase.firestore.FieldValue.serverTimestamp(),
				topicMap: ([]),
			})
			.then((result) => {
				console.log('Profile Updated!')
				console.log(result)
				navigation.navigate('UserCreated', { firstName, lastName, pfp, });
			})
			.catch((error) => { alert(error.message) });
	};

    const handleEmailInput = (textChange) => {
        setEmail(textChange);
    };

	return (
		<SafeAreaView>
			<KeyboardAwareScrollView style={styles.container}>
				<View style={styles.title}>
					<Text style={{ fontSize: 30, textAlign: 'center', fontWeight: 'bold' }}>
						User Information:
					</Text>
					<View style={{ width: '85%' }}>

						<Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>
							Great job! Enter these final details to create your account.
						</Text>
					</View>
				</View>
				<View style={styles.centered}>
					<View>
						<Divider
							width={2}
							color={'#e3e6e8'}
						/>
						<Text
							style={{
								fontSize: 18,
								fontWeight: 'bold',
								marginBottom: 10,
								marginTop: 20,
							}}
						>
							Choose a Profile Image:
						</Text>
						<View
							style={{
								borderRadius: 10,
								borderWidth: 2,
								borderColor: 'lightgrey',
								width: '95%',
								alignContent: 'center',
								justifyContent: 'center',
								backgroundColor: 'white',
								padding: 20
							}}>
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
										setPFP(12)
									}}
								>
									<Image
										source={require('../../assets/pfpOptions/avatar_12.png')}
										style={checkIfSelected(12)}
									/>
								</TouchableOpacity>
							</View>
							<View style={styles.pfpOptions}>
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
										setPFP(14)
									}}
								>
									<Image
										source={require('../../assets/pfpOptions/avatar_14.png')}
										style={checkIfSelected(14)}
									/>
								</TouchableOpacity>
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
										setPFP(5)
									}}
								>
									<Image
										source={require('../../assets/pfpOptions/avatar_5.png')}
										style={checkIfSelected(5)}
									/>
								</TouchableOpacity>
							</View>

						</View>
					</View>
					<View style={styles.centered}>

						<View style={styles.inputContainer}>
							<KeyboardAvoidingView
								enabled
								behavior='padding'
							>
								<View>
									<Text
										style={{
											marginTop: 9,
											fontSize: 18,
											fontWeight: 'bold',
											marginBottom: 10,
										}}
									>
										First Name:
									</Text>
									<TextInput
										style={
											(firstName.length === 0)
												? styles.inputStart
												: styles.inputEnd
										}
										onChangeText={(textChange) => setFirstName(textChange)}
										placeholder={'John'}
										hideUnderline
										value={firstName}
										keyboardType={'default'}
										maxLength={25}
									/>
								</View>

								<View>
									<Text
										style={{
											marginTop: 20,
											fontSize: 18,
											fontWeight: 'bold',
											marginBottom: 10,
										}}
									>
										Last Name:
									</Text>
									<TextInput
										style={
											(lastName.length === 0)
												? styles.inputStart
												: styles.inputEnd
										}
										onChangeText={(textChange) => setLastName(textChange)}
										placeholder={'Doe'}
										hideUnderline
										value={lastName}
										keyboardType={'default'}
										maxLength={25}
									/>
								</View>

								<View>
									<Text
										style={{
											marginTop: 20,
											fontSize: 18,
											fontWeight: 'bold',
											marginBottom: 10,
										}}
									>
										Email: <Text style={{ fontSize: 16, fontWeight: '400', color: 'grey', alignContent: 'center' }}>(Optional)</Text>
									</Text>
									<TextInput
										style={
											(email.length === 0)
												? styles.inputStart
												: styles.inputEnd
										}
										onChangeText={(textChange) => handleEmailInput(textChange)}
										placeholder={'JohnDoe@gmail.com'}
										value={email}
										keyboardType={'email-address'}
									/>
								</View>
							</KeyboardAvoidingView>
						</View>

						{createButtonDisabled
							? <View>
								<TouchableOpacity
									style={styles.createButtonDisabledStyling}
									disabled={true}
								>
									<Text style={styles.createButtonTextDisabledStyling}>Create</Text>
								</TouchableOpacity>
							</View>
							: <View>
								<TouchableOpacity
									activeOpacity={0.75}
									onPress={register}
									style={styles.createButtonEnabledStyling}
									disabled={false}
								>
									<Text style={styles.createButtonTextEnabledStyling}>Create</Text>
									<Icon
										name='arrow-forward'
										type='ionicon'
										color='white'
										size={28}
									/>
								</TouchableOpacity>
							</View>
						}
					</View>
				</View>

			</KeyboardAwareScrollView>
		</SafeAreaView >
	);
};

const styles = StyleSheet.create({
	container: {
		height: '100%',
		backgroundColor: '#FCF3EA',
	},
	title: {
		position: 'relative',
		textAlign: 'center',
		justifyContent: 'center',
		marginLeft: 'auto',
		marginRight: 'auto',
		padding: 25,
		justifyContent: 'center',
		alignItems: 'center',
	},
	elements: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10,
		paddingHorizontal: 25,
	},
	centered: {
		width: '90%',
		position: 'relative',
		marginLeft: 'auto',
		marginRight: 'auto',
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
		width: 200,
		marginTop: 10,
	},
	inputContainer: {
		width: 300,
		justifyContent: 'center',
		alignSelf: 'center',
		alignItems: 'center',

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

	inputStart: {
		flexDirection: 'row',
		backgroundColor: 'white',
		height: 50,
		width: 320,
		alignItems: 'center',
		marginLeft: 0,
		paddingLeft: 13,
		borderColor: 'grey',
		borderWidth: 2,
		fontSize: 20,
	},

	inputEnd: {
		flexDirection: 'row',
		backgroundColor: 'white',
		height: 50,
		width: 320,
		alignItems: 'center',
		marginLeft: 0,
		paddingLeft: 13,
		borderColor: '#4492D2',
		borderWidth: 2,
		fontSize: 20,

	},

    createButtonEnabledStyling: {
		marginTop: 35,
        height: 65,
        width: 250,
        textAlign: 'center',
        marginBottom: 15,
        backgroundColor: '#4A5060',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'black',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    createButtonTextEnabledStyling: {
        fontSize: 25,
        fontWeight: '600',
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 7,
        marginLeft: 12,
    },

    createButtonDisabledStyling: {
		marginTop: 25,
        height: 65,
        width: 250,
        textAlign: 'center',
        marginBottom: 15,
        backgroundColor: '#e3e6e8',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'lightgrey',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonTextDisabledStyling: {
        fontSize: 25,
        fontWeight: '500',
        color: 'lightgrey',
    },
});

export default PhoneSuccess;