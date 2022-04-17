
const CreateUserPayload = ({firstName, lastName, pfp, email, phoneNumber}) => {
	
	let payload = {
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
	}
        
	return payload;
        

};

export default CreateUserPayload;