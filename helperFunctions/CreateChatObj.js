import firebase from "firebase/compat";

const CreateChatObj = (trimmedInput, currentUser, phoneNumber) => {
	
	let payload = {
        editedTime: null,
        membersWhoReacted: [],
        message: trimmedInput,
        ownerUID: currentUser,
        phoneNumber: phoneNumber,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()	
	}
    
	return payload;
        

};

export default CreateChatObj;