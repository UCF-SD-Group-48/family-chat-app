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
import React, { useLayoutEffect, useState, useEffect } from 'react';
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
import { db, auth } from '../../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";
import firebase from 'firebase/compat/app';

const AddGroup = ({ navigation }) => {

	const [mapUpdate, setMapUpdate] = useState({});
	const [groupName, setGroupName] = useState('');
	const [coverImage, setCoverImage] = useState({ color: 'purple', imageNumber: 1 })

	const goBackward = () => {
		navigation.navigate('Groups');
	};

	const goForward = () => {
		navigation.push('CreateGroup_2_Members', { groupName, coverImage });
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Create Group',
			headerStyle: '',
			headerTitleStyle: { color: 'black' },
			headerTintColor: 'black',
			headerLeft: () => (
				<View style={{ marginLeft: 20 }}>
					<TouchableOpacity activeOpacity={0.5} onPress={goBackward}>
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

	useEffect(() => {
		// createGroup();
		return () => {
			setMapUpdate({}); // This worked for me
		};
	}, []);

	// setCoverImage({})

	const createGroup = async () => {
		let currentUserId = auth.currentUser.uid
		await db
			.collection("groups")
			.add({
				groupName: input,
				groupOwner: auth.currentUser.uid,
				members: [auth.currentUser.uid]
			})
			.then(async (docRef) => {
				await db.collection("users").doc(currentUserId).update({
					groups: arrayUnion(docRef.id) // adds the uid's only

				})

				await db.collection('groups').doc(docRef.id)
					.collection("topics")
					.add({
						topicName: "General",
					})
					.then((docRef) => {
						// add the topicId to the User's TopicId Map here
						const topicId = docRef.id
						mapUpdate[`topicMap.${topicId}`] = firebase.firestore.FieldValue.serverTimestamp()
						console.log("doc.id ", mapUpdate)

						db.collection('users').doc(currentUserId).update(mapUpdate);

						// navigation.goBack(); // I have no clue where to place this

					})
					.catch((error) => alert(error));
			})
			.catch((error) => alert(error))

	};


	// const checkIfSelected = (imageNumber) => {
	// 	if (coverImage === imageNumber) {
	// 		// Selected Profile Option
	// 		return {
	// 			width: 50,
	// 			height: 50,
	// 			borderRadius: 8,
	// 			margin: 5,
	// 			opacity: 1,
	// 			borderWidth: 5,
	// 			borderColor: '#2C6BED'
	// 		}
	// 	}
	// 	else {
	// 		// Default faded styling for profile options
	// 		return {
	// 			width: 50,
	// 			height: 50,
	// 			borderRadius: 8,
	// 			margin: 5,
	// 			opacity: .3
	// 		}
	// 	}
	// };

	// const handleCoverImageSelection = () => {
	// 	switch (coverImageSelection) {
	// 		case 'P1': {

	// 			break;
	// 		}
	// 		case 'P1': {

	// 			break;
	// 		}
	// 	}
	// }


	// const handleInputGroupName = () => {
	// 	setGroupName(groupNameTextInput)
	// 	setShownGroupName()
	// }

	const getSelectedImage = () => {
		if (coverImage.color === 'purple') {
			switch (coverImage.imageNumber) {
				case 1: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_P1.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 2: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_P2.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 3: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_P3.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 4: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_P4.png')}
						style={styles.coverImageSelection}
					/>
				}
			}
		} else if (coverImage.color === 'blue') {
			switch (coverImage.imageNumber) {
				case 1: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_B1.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 2: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_B2.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 3: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_B3.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 4: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_B4.png')}
						style={styles.coverImageSelection}
					/>
				}
			}
		} else if (coverImage.color === 'green') {
			switch (coverImage.imageNumber) {
				case 1: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_G1.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 2: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_G2.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 3: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_G3.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 4: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_G4.png')}
						style={styles.coverImageSelection}
					/>
				}
			}
		} else if (coverImage.color === 'yellow') {
			switch (coverImage.imageNumber) {
				case 1: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_Y1.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 2: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_Y2.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 3: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_Y3.png')}
						style={styles.coverImageSelection}
					/>
				}
				default: {
					return;
				}
			}
		} else if (coverImage.color === 'orange') {
			switch (coverImage.imageNumber) {
				case 1: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_O1.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 2: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_O2.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 3: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_O3.png')}
						style={styles.coverImageSelection}
					/>
				}
				default: {
					return;
				}
			}
		} else if (coverImage.color === 'red') {
			switch (coverImage.imageNumber) {
				case 1: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_R1.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 2: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_R2.png')}
						style={styles.coverImageSelection}
					/>
				}
				case 3: {
					return <Image
						source={require('../../assets/groupCoverImages/cover_R3.png')}
						style={styles.coverImageSelection}
					/>
				}
				default: {
					return;
				}
			}
		}
	}

	const checkIfSelected = (color, number) => {
		if ((coverImage.color === color) & (coverImage.imageNumber === number)) {
			// Selected Profile Option
			return {
				width: 50,
				height: 50,
				borderWidth: 2,
				borderColor: '#2352DF',
				borderRadius: 5,
				marginLeft: 5,
				marginRight: 5,
			}
		}
		else {
			return {
				width: 50,
				height: 50,
				borderRadius: 5,
				marginLeft: 5,
				marginRight: 5,
			}
		}
	};

	return (
		<SafeAreaView style={styles.mainContainer}>
			<ScrollView
				contentContainerStyle={{
					justifyContent: "flex-start",
					flexDirection: "column",
				}}
			>
				<View style={styles.innerContainer}>

					<View style={styles.componentHeaderBar} />

					<View style={styles.textContainer}>
						<View>
							<Text style={styles.componentTitle}>
								Set the details for your new group:
							</Text>
						</View>

						<Divider style={{ marginTop: 20, marginBottom: 20 }} />

						<View style={styles.textInput}>
							<Icon
								name="folder-plus"
								type="material-community"
								size={24}
								color="#363732"
							/>
							<Text style={styles.textInputTitle}>
								Enter group name:
							</Text>
						</View>

						<TextInput
							placeholder="The Jetsons"
							value={groupName}
							onChangeText={(textChange) => {
								setGroupName(textChange);
							}}
							style={styles.textInputField}
						/>

						<View style={styles.textInput}>
							<Icon
								name="folder-image"
								type="material-community"
								size={24}
								color="#363732"
							/>
							<Text style={styles.textInputTitle}>
								Select cover image:
							</Text>
						</View>


						<View style={styles.imagesGridContainer}>
							<View style={styles.imagesGridTop2}>
								<View style={styles.Top2LeftHalf}>
									{getSelectedImage()}
								</View>
								<View style={styles.Top2RightHalf}>
									<View style={styles.imagesGridRow1}>
										<View style={styles.imageOptions}>
											<TouchableOpacity
												activeOpacity={0.75}
												onPress={() => setCoverImage({ color: 'purple', imageNumber: 1 })}
											>
												<Image
													source={require('../../assets/groupCoverImages/cover_P1.png')}
													style={checkIfSelected('purple', 1)}
												/>
											</TouchableOpacity>
										</View>
										<View style={styles.imageOptions}>
											<TouchableOpacity
												activeOpacity={0.75}
												onPress={() => setCoverImage({ color: 'blue', imageNumber: 1 })}
											>
												<Image
													source={require('../../assets/groupCoverImages/cover_B1.png')}
													style={checkIfSelected('blue', 1)}
												/>
											</TouchableOpacity>
										</View>
										<View style={styles.imageOptions}>
											<TouchableOpacity
												activeOpacity={0.75}
												onPress={() => setCoverImage({ color: 'green', imageNumber: 1 })}
											>
												<Image
													source={require('../../assets/groupCoverImages/cover_G1.png')}
													style={checkIfSelected('green', 1)}
												/>
											</TouchableOpacity>
										</View>
									</View>
									<View style={styles.imagesGridRow2}>
										<View style={styles.imageOptions}>
											<TouchableOpacity
												activeOpacity={0.75}
												onPress={() => setCoverImage({ color: 'yellow', imageNumber: 1 })}
											>
												<Image
													source={require('../../assets/groupCoverImages/cover_Y1.png')}
													style={checkIfSelected('yellow', 1)}
												/>
											</TouchableOpacity>
										</View>
										<View style={styles.imageOptions}>
											<TouchableOpacity
												activeOpacity={0.75}
												onPress={() => setCoverImage({ color: 'orange', imageNumber: 1 })}
											>
												<Image
													source={require('../../assets/groupCoverImages/cover_O1.png')}
													style={checkIfSelected('orange', 1)}
												/>
											</TouchableOpacity>
										</View>
										<View style={styles.imageOptions}>
											<TouchableOpacity
												activeOpacity={0.75}
												onPress={() => setCoverImage({ color: 'red', imageNumber: 1 })}
											>
												<Image
													source={require('../../assets/groupCoverImages/cover_R1.png')}
													style={checkIfSelected('red', 1)}
												/>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</View>
							<View style={styles.imagesGridBottom3}>
								<View style={styles.imagesGridRow3}>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'purple', imageNumber: 2 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_P2.png')}
												style={checkIfSelected('purple', 2)}
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'blue', imageNumber: 2 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_B2.png')}
												style={checkIfSelected('blue', 2)}
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'green', imageNumber: 2 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_G2.png')}
												style={checkIfSelected('green', 2)}
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'yellow', imageNumber: 2 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_Y2.png')}
												style={checkIfSelected('yellow', 2)}
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'orange', imageNumber: 2 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_O2.png')}
												style={checkIfSelected('orange', 2)}
											/>
										</TouchableOpacity>
									</View>
								</View>
								<View style={styles.imagesGridRow4}>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'red', imageNumber: 2 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_R2.png')}
												style={checkIfSelected('red', 2)}
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'purple', imageNumber: 3 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_P3.png')}
												style={checkIfSelected('purple', 3)}
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'blue', imageNumber: 3 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_B3.png')}
												style={checkIfSelected('blue', 3)}
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'green', imageNumber: 3 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_G3.png')}
												style={checkIfSelected('green', 3)}
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'yellow', imageNumber: 3 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_Y3.png')}
												style={checkIfSelected('yellow', 3)}
											/>
										</TouchableOpacity>
									</View>
								</View>
								<View style={styles.imagesGridRow5}>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'orange', imageNumber: 3 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_O3.png')}
												style={checkIfSelected('orange', 3)}
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'red', imageNumber: 3 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_R3.png')}
												style={checkIfSelected('red', 3)}
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'purple', imageNumber: 4 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_P4.png')}
												style={checkIfSelected('purple', 4)}
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'blue', imageNumber: 4 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_B4.png')}
												style={checkIfSelected('blue', 4)}
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.imageOptions}>
										<TouchableOpacity
											activeOpacity={0.75}
											onPress={() => setCoverImage({ color: 'green', imageNumber: 4 })}
										>
											<Image
												source={require('../../assets/groupCoverImages/cover_G4.png')}
												style={checkIfSelected('green', 4)}
											/>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</View>

						{!groupName
							? <View style={styles.buttonSpacing}>
								<View style={[styles.buttonNext, { borderColor: '#9D9D9D', backgroundColor: '#F8F8F8', }]}>
									<Text style={styles.buttonTextDisabled}>
										NEXT
									</Text>
								</View>
							</View>
							: <TouchableOpacity
								activeOpacity={0.75}
								onPress={() => goForward()}
							>
								<View style={styles.buttonSpacing}>
									<View style={[styles.buttonNext, { borderColor: '#363732', }]}>
										<Text style={styles.buttonTextEnabled}>
											NEXT
										</Text>
										<Icon
											name="arrow-right"
											type="material-community"
											size={24}
											color="#363732"
										/>
									</View>
								</View>
							</TouchableOpacity>
						}

						{/* <Button disabled={!input} title="Create new Group" /> */}

					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	mainContainer: {
		backgroundColor: "#EFEAE2",
		height: "100%",
	},

	innerContainer: {
		margin: 20,
		backgroundColor: 'white',
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 10 },
		shadowRadius: 5,
		shadowOpacity: .2,
	},

	componentHeaderBar: {
		backgroundColor: '#777777',
		height: 15,
		width: "100%",
	},

	textContainer: {
		margin: 20,
	},

	componentTitle: {
		fontSize: 16,
		textAlign: 'left',
		display: 'flex',
		fontWeight: '800',
	},

	textInput: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},

	textInputTitle: {
		marginLeft: 10,
		fontSize: 16,
		textAlign: 'left',
		display: 'flex',
		fontWeight: '700',
	},

	textInputField: {
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: '#9D9D9D',
		borderRadius: 3,
		fontSize: 16,
		textAlign: 'left',
		padding: 10,
		backgroundColor: '#F8F8F8',
		marginBottom: 22,
	},

	imagesGridContainer: {
		marginBottom: 22,
	},

	imagesGridTop2: {
		flexDirection: "row",
	},

	Top2LeftHalf: {

	},

	Top2RightHalf: {

	},

	imagesGridRow1: {
		flexDirection: "row",
		marginBottom: 10,
	},

	imagesGridRow2: {
		flexDirection: "row",
		marginBottom: 10,
	},

	imagesGridRow3: {
		flexDirection: "row",
		marginBottom: 10,
	},

	imagesGridRow4: {
		flexDirection: "row",
		marginBottom: 10,
	},

	imagesGridRow5: {
		flexDirection: "row",
		marginBottom: 10,
	},

	coverImageSelection: {
		width: 100,
		height: 100,
		borderRadius: 250,
		marginLeft: 5,
		marginRight: 15,
		borderWidth: 5,
		borderColor: '#2352DF'
	},

	coverImageOption: {
		width: 50,
		height: 50,
		borderRadius: 5,
		marginLeft: 5,
		marginRight: 5,
	},

	buttonSpacing: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginBottom: 10,
	},

	buttonNext: {
		width: 125,
		height: 45,
		borderWidth: 3,
		borderStyle: 'solid',
		borderRadius: 200,
		flexDirection: 'row',
		justifyContent: 'center',
		display: 'flex',
		alignItems: 'center',
	},

	buttonTextDisabled: {
		color: '#9D9D9D',
		fontSize: 16,
		fontWeight: '800',
	},

	buttonTextEnabled: {
		color: '#363732',
		fontSize: 16,
		fontWeight: '800',
		marginRight: 5,
	}

});

export default AddGroup;