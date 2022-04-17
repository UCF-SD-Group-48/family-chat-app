const CreateTopicObj = (groupName, currentUserID, imageNumber, color, membersArray) => {
	
	let payload = 
        {
            groupName: groupName,
            groupOwner: currentUserID,
            coverImageNumber: imageNumber,
            color: color,
            members: membersArray
        }
    
	return payload;
        

};

export default CreateTopicObj;