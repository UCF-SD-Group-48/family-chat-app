import {
	Keyboard,
	KeyboardAvoidingView,
	Linking,
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

import * as SMS from 'expo-sms';
import { imageSelection } from '../5_Supplementary/GenerateProfileIcon';

const CreateGroup_2_Members = ({ navigation, route }) => {

	const [mapUpdate, setMapUpdate] = useState({});
	const [coverImage, setCoverImage] = useState({ color: 'purple', imageNumber: 1 })
	const [members, setMembers] = useState([]);
	let [membersList, setMembersList] = useState([])

	const goBackward = () => navigation.navigate('CreateGroup_1_NameImage');

	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Create Group',
			headerStyle: '',
			headerTitleStyle: { color: 'black' },
			headerTintColor: 'black',
			headerLeft: () => (
				<View style={{ marginLeft: 12 }}>
					<TouchableOpacity activeOpacity={0.5} onPress={goBackward}>
						<Icon
							name='arrow-back'
							type='ionicon'
							color='#363732'
							size={28}
						/>
					</TouchableOpacity>
				</View>
			),
			headerRight: ''
		});
	}, [navigation]);

	const getHexValue = () => {
		switch (`${route.params.coverImage.color}`) {
			case 'purple': {
				return '#C0B7CC'
			}
			case 'blue': {
				return '#9DAFD1'
			}
			case 'green': {
				return '#87AC7B'
			}
			case 'yellow': {
				return '#DFCF8C'
			}
			case 'orange': {
				return '#D5B592'
			}
			case 'red': {
				return '#CB9B99'
			}
		}
	}

	useEffect(async () => {
		const ownerPhoneNumber = (auth.currentUser.phoneNumber).slice(2);
		const query = await db
			.collection('users')
			.where('phoneNumber', '==', ownerPhoneNumber)
			.get();
		const snapshot = query.docs[0];
		const data = snapshot.data();
		const searchedUserFullName = `${data.firstName} ${data.lastName}`
		setMembersList([...membersList, { uid: snapshot.id, name: `${searchedUserFullName}`, pfp: data.pfp, owner: true }])
	
        return () => {
            setMembersList([])
        }
	}, [])

	useEffect(() => {
		if (searchedUserPhoneNumber.length === 10) {
			if (searchResults != ('exists' || 'nonexistent')) {
				searchForUser();
			}
		}

        // return () => {
        //  setSearchResults();
        //  setSearchedUser({});
        // }
	}, searchedUserPhoneNumber);

	const checkTheMembersList = (searchedUserPhoneNumber) => {
		if (!membersList.includes(memberToCheck)) setMembersList([...membersList, searchedUserName]);
	}

	const [searchedUserPhoneNumber, setSearchedUserPhoneNumber] = useState('');

    const openTextMessage = () => {
        // const searchedUserPhoneNumber = '+16505551234'
        const textMessageText = `I just created a group within the FamilyChat app. Join in on the conversation by clicking this download link: https://www.familychat.app/`
        Linking.openURL(`sms://+1${searchedUserPhoneNumber}&body=${textMessageText}`)
    }

	let [searchResults, setSearchResults] = useState('incomplete');
	let [shownPhoneText, setShownPhoneText] = useState('');
	let [searchedUser, setSearchedUser] = useState({})

	const searchForUser = async () => {
		const query = await db
			.collection('users')
			.where('phoneNumber', '==', searchedUserPhoneNumber)
			.get();

		if (!query.empty) {
			setSearchResults('exists')
			const snapshot = query.docs[0];
			const data = snapshot.data();
			const searchedUserFullName = `${data.firstName} ${data.lastName}`;
			setSearchedUser({ uid: snapshot.id, name: `${searchedUserFullName}`, pfp: data.pfp, owner: false })
		} else { setSearchResults('nonexistent') }
	};

	function formatPhoneInput(value) {
		if (!value) {
			if (searchedUserPhoneNumber.length === 1) setSearchedUserPhoneNumber('');
			return value;
		};
		const phoneEntry = value.replace(/[^\d]/g, '');
		setSearchedUserPhoneNumber(phoneEntry);
		const phoneEntryLength = phoneEntry.length;
		if (phoneEntryLength < 4) return phoneEntry;
		if (phoneEntryLength < 7) return `(${phoneEntry.slice(0, 3)}) ${phoneEntry.slice(3)}`;
		return `(${phoneEntry.slice(0, 3)}) ${phoneEntry.slice(3, 6)}-${phoneEntry.slice(6, 10)}`;
	}

	const handlePhoneInput = (textChange) => {
		const phoneInputFormatted = formatPhoneInput(textChange);
		setShownPhoneText(phoneInputFormatted);
		if (searchedUserPhoneNumber.length != 10) {
			setSearchResults('incomplete')
		}
	};

	const createGroup = async () => {
		const currentUserID = auth.currentUser.uid;

		let membersArray = [];

		membersList.map((member) => {
			membersArray.push(member.uid)
		})

		let groupID, topicID;

		await db
			.collection("groups")
			.add({
				groupName: route.params.groupName,
				groupOwner: currentUserID,
				coverImageNumber: route.params.coverImage.imageNumber,
				color: route.params.coverImage.color,
				members: membersArray
			})
			.then(async (newlyCreatedGroup) => {
				groupID = newlyCreatedGroup.id;
				membersArray.map(async (memberUID) => {
					await db.collection("users").doc(memberUID).update({
						groups: arrayUnion(groupID)
					})
				})
				await db.collection('groups').doc(groupID)
					.collection("topics")
					.add({
						topicOwner: currentUserID,
						topicName: "General",
						members: membersArray,
					})
					.then((newlyCreatedTopic) => {
						let mapTopics = {}
						topicID = newlyCreatedTopic.id
						mapTopics[`topicMap.${topicID}`] = firebase.firestore.FieldValue.serverTimestamp()
						setMapUpdate(mapTopics)
						membersArray.map(async (memberUID) => {
							await db.collection('users').doc(memberUID).update(mapUpdate);
						})
					})
					.catch((error) => alert(error));
			})
			.catch((error) => alert(error));

		enterGroup(groupID, route.params.groupName, currentUserID)
	};

	const enterGroup = (groupId, groupName, groupOwner) => {
		// Navigating straight from Groups to Topic "General" or the first Topic found (if General does not exist)
		let topic = null;
		const ref = db.collection("groups").doc(groupId).collection("topics").get()
			.then((snapshot) => {
				snapshot.forEach((doc) => {
					if (doc.data().topicName == "General" || topic == null) {
						topic = doc;
					}
				});
			})
			.then(() => {
				const topicId = topic.id;
				const topicName = topic.data().topicName;
				navigation.push("Chat", { topicId, topicName, groupId, groupName, groupOwner });
			})
			.catch((error) => console.log(error));
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

					<View style={[styles.componentHeaderBar, { backgroundColor: getHexValue(), }]} />

					<View style={styles.textContainer}>
						<View>
							<Text style={styles.componentTitle}>
								Almost there! Let's add your family:
							</Text>
						</View>

						<Divider style={{ marginTop: 20, marginBottom: 20 }} />

						<View style={styles.textInput}>
							<Icon
								name="person-search"
								type="material"
								size={24}
								color="#363732"
							/>
							<Text style={styles.textInputTitle}>
								Search for users to invite:
							</Text>
						</View>
						<View style={styles.textInputField}>
							<TextInput
								placeholder='(201) 555-0123'
								value={shownPhoneText}
								hideUnderline
								keyboardType={'phone-pad'}
								maxLength={14}
								onChangeText={(textChange) => handlePhoneInput(textChange)}
							/>
							<Icon
								name="search"
								type="material"
								size={24}
								color="#363732"
							/>
						</View>

						<View style={styles.searchResultsContainer}>
							{(searchResults === 'incomplete')
								? <View style={styles.incompleteSearchResult}>
									<Text style={styles.incompleteSearchResultText}>
										No results
									</Text>
								</View>
								: (searchResults === 'exists')
									? <View style={styles.userExistsSearchResult}>
										<View style={styles.userResult}>
											<Image
												source={imageSelection(searchedUser.pfp)}
												style={{ width: 30, height: 30, borderRadius: 5 }}
											/>
											<Text style={styles.completedSearchResultText}>
												{searchedUser.name}
											</Text>
										</View>
										{(membersList.some(memberObject => memberObject.name === searchedUser.name))
											? <View style={styles.memberExists}>
												<Icon
													name="check-bold"
													type="material-community"
													size={24}
													color="white"
												/>
											</View>
											: <TouchableOpacity
												activeOpacity={0.75}
												onPress={() => { setMembersList([...membersList, searchedUser]) }}
											>
													<View style={[styles.searchResultsButtonAdd, { orderColor: '#2352DF', }]}>
														<Text style={styles.searchResultsButtonAddText}>
															ADD
														</Text>
														<Icon
															name="person-add"
															type="material"
															size={18}
															color="#2352DF"
														/>
													</View>
											</TouchableOpacity>
										}
									</View>
									: <View style={styles.userNonexistentSearchResult}>
										<Text style={styles.completedSearchResultText}>
											No user found.
										</Text>
										<TouchableOpacity
                                            activeOpacity={0.75}
                                            onPress={() => openTextMessage()}
                                        >
                                                <View style={[styles.searchResultsButtonInvite, { orderColor: '#363732', }]}>
                                                    <Text style={styles.searchResultsButtonInviteText}>
                                                        App Invite
                                                    </Text>
                                                    <Icon
                                                        name="email-outline"
                                                        type="material-community"
                                                        size={18}
                                                        color="#363732"
                                                    />
                                                </View>
                                        </TouchableOpacity>
									</View>
							}
						</View>
						<View style={styles.textInput}>
							<Icon
								name="groups"
								type="material"
								size={24}
								color="#363732"
							/>
							<Text style={styles.textInputTitle}>
								Members List:
							</Text>
						</View>

						<View style={styles.membersListContainer}>
							{membersList.map((individualMember, index) => (
								<View style={styles.memberEditRow} key={index} id={index}>
									<View style={styles.member}>
										<Image
											source={imageSelection(individualMember.pfp)}
											style={{ width: 30, height: 30, borderRadius: 5 }}
										/>
										<Text style={styles.memberName}>
											{individualMember.name}
										</Text>
									</View>
									{!individualMember.owner
										? <TouchableOpacity
											activeOpacity={0.75}
											onPress={() => {
												setMembersList(membersList.filter((memberToKeep) => memberToKeep.name !== individualMember.name))
												console.log('NEW', membersList)
											}}
										>
											<Icon
												name="close-circle"
												type="material-community"
												size={18}
												color="#363732"
												style={{ marginRight: 3 }}
											/>
										</TouchableOpacity>
										:
										<View style={styles.ownershipBadge}>
											<Icon
												name="local-police"
												type="material"
												size={15}
												color="#363732"
											/>
										</View>
									}
								</View>
							))}
						</View>

						<TouchableOpacity
							activeOpacity={0.75}
							onPressIn={() => createGroup()}
						>
							<View style={styles.buttonSpacing}>
								<View style={[styles.buttonCreate, { borderColor: '#363732', }]}>
									<Text style={styles.buttonCreateEnabled}>
										CREATE
									</Text>
									<Icon
										name="folder-plus"
										type="material-community"
										size={24}
										color="white"
									/>
								</View>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView >
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
		marginBottom: 15,
		flexDirection: "row",
		justifyContent: 'space-between',
	},

	buttonSpacing: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginBottom: 10,
	},

	searchResultsContainer: {
		width: '100%',
		height: 100,
		padding: 15,
		backgroundColor: '#C4C4C4',
		marginBottom: 22,
	},

	incompleteSearchResult: {
		width: '100%',
		height: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		display: 'flex',
		alignItems: 'center',
	},

	incompleteSearchResultText: {
		fontSize: 12,
		fontWeight: '800',
		color: '#363732'
	},

	userExistsSearchResult: {
		width: '100%',
		height: '100%',
		backgroundColor: '#F8F8F8',
		flexDirection: 'row',
		justifyContent: 'space-between',
		display: 'flex',
		alignItems: 'center',
		shadowColor: 'black',
		padding: 15,
		shadowOffset: { width: 3, height: 3 },
		shadowRadius: 3,
		shadowOpacity: .3,
		borderWidth: 1,
		borderColor: '#9D9D9D',
	},

	userNonexistentSearchResult: {
		width: '100%',
		height: '100%',
		backgroundColor: '#F8F8F8',
		flexDirection: 'row',
		justifyContent: 'space-between',
		display: 'flex',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#9D9D9D',
		padding: 15
	},

	completedSearchResultText: {
		fontSize: 12,
		fontWeight: '700',
		marginLeft: 10
	},

	memberExists: {
		width: 35,
		height: 35,
		borderRadius: 200,
		backgroundColor: '#3D8D04',
		justifyContent: 'center',
		alignItems: 'center',
	},

	userResult: {
		flexDirection: 'row',
		justifyContent: 'center',
		display: 'flex',
		alignItems: 'center',
	},

	searchResultsButtonAdd: {
		width: 80,
		height: 35,
		borderWidth: 3,
		borderStyle: 'solid',
		borderRadius: 200,
		flexDirection: 'row',
		justifyContent: 'center',
		display: 'flex',
		alignItems: 'center',
		borderColor: '#2352DF',
	},

	searchResultsButtonAddText: {
		color: '#2352DF',
		fontSize: 12,
		fontWeight: '800',
		marginRight: 5
	},

	searchResultsButtonInvite: {
		width: 120,
		height: 35,
		borderWidth: 3,
		borderStyle: 'solid',
		borderRadius: 200,
		flexDirection: 'row',
		justifyContent: 'center',
		display: 'flex',
		alignItems: 'center',
	},

	searchResultsButtonInviteText: {
		color: '#363732',
		fontSize: 12,
		fontWeight: '800',
		marginRight: 5
	},

	membersListContainer: {
		width: '100%',
		minHeight: 75,
		padding: 15,
		marginBottom: 22,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: '#C4C4C4',
		backgroundColor: '#F8F8F8'
	},

	memberEditRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		display: 'flex',
		alignItems: 'center',
		marginBottom: 5,
		marginTop: 5
	},

	member: {
		flexDirection: 'row',
		display: 'flex',
		alignItems: 'center',
	},

	memberName: {
		fontSize: 14,
		fontWeight: '700',
		marginLeft: 10
	},

	ownershipBadge: {
		width: 25,
		height: 25,
		backgroundColor: '#F8D353',
		borderRadius: 200,
		borderWidth: 2,
		borderColor: '#363732',
		justifyContent: 'center',
		display: 'flex',
		alignItems: 'center',
	},

	buttonCreate: {
		width: 125,
		height: 45,
		borderWidth: 3,
		borderStyle: 'solid',
		borderRadius: 200,
		flexDirection: 'row',
		justifyContent: 'center',
		display: 'flex',
		alignItems: 'center',
		backgroundColor: '#3D8D04'
	},

	buttonCreateDisabled: {
		color: 'white',
		fontSize: 16,
		fontWeight: '800',
	},

	buttonCreateEnabled: {
		color: 'white',
		fontSize: 16,
		fontWeight: '800',
		marginRight: 8
	}

});

export default CreateGroup_2_Members;