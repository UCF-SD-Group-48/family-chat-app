import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from 'expo-status-bar';
import React, {useState, useLayoutEffect, useEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { KeyboardAvoidingView, Platform } from 'react-native';
import ImagePicker from "expo-image-picker";
import { auth } from '../firebase';

const RegisterScreen = ({ navigation, route }) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [profilePic, setProfilePic] = useState();
    const phoneNumber = route.params.phoneNumber;

	const getPermissions = async () => {
        const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log("status: " + status);
        if (status !== "granted") {
            alert("We need permission to access your camera ");
        }
		pickImage();
	};

	const pickImage = async () => {
		try {

			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.5,
			});

			if (!result.cancelled) {
				setProfilePic(result.uri);
			}

		} catch (error) {
			console.log("Error @pickImage:", error);
		}
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			headerBackTitle: "Back to Login",
		});
	}, [navigation]);

	const register = async () => {
        const currentUser = auth.currentUser;
        console.log("Current User:" + JSON.stringify(currentUser));
        await auth
			.updateCurrentUser(auth.currentUser, 
                {
					firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
					photoURL:
						profilePic ||
						"https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
						
				}
            )
			.then(() => {
				console.log("Profile Updated!")
                navigation.replace("Home");
			})
			.catch((error) => alert(error.message));
	};

	return (
		<KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
			<StatusBar style="light" />
			<Text h3 style={{ marginBottom: 50 }}>
				SUCCESS PAGE
			</Text>
			<View style={styles.inputContainer}>
				<View style={styles.profileImage}>
					{!profilePic ? (
						<AntDesign
							name="plus"
							size={24}
							color="#FFFF"
							onPress={getPermissions}

						/>
					) : (
						<Image
							source={{ uri: profilePic }}
							style={{ width: 100, height: 100 }}
							onPress={getPermissions}
						/>
					)}
				</View>
				<Input
					placeholder="First Name"
					autoFocus
					type="text"
					value={firstName}
					onChangeText={(text) => setFirstName(text)}
				/>
                <Input
					placeholder="Last Name"
					autoFocus
					type="text"
					value={lastName}
					onChangeText={(text) => setLastName(text)}
				/>
			</View>
			<Button
				containerStyle={styles.button}
				onPress={register}
				title="Register"
				raised
			/>
		</KeyboardAvoidingView>
	);
};

export default RegisterScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
		backgroundColor: "white",
	},
	button: {
		width: 200,
		marginTop: 10,
	},
	inputContainer: {
		width: 300,
	},
	profileImage: {
		backgroundColor: "#2c6bed",
		borderRadius: 40,
		height: 80,
		width: 80,
		marginTop: -20,
		marginBottom: 10,
		overflow: "hidden",
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
	},
});
