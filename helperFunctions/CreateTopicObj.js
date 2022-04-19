const CreateTopicObj = (currentUser, topicName, members, originalMessageUID,) => {
	
	let payload = 
        {
            topicOwner: currentUser,
            topicName: topicName,
            members: members,
            originalMessageUID: originalMessageUID || "",
        }
    
	return payload;
        

};

export default CreateTopicObj;