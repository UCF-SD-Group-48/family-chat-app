import CreateGroupObj from "../helperFunctions/CreateGroupObj";

describe('CreateGroupObj', () => {
      it('returns first part of Group Object', () => {

        
        const groupName = "UnitTestCreateGroup"
        const currentUserID = "1234567"
        const imageNumber = 5
        const color = "red"
        const membersArray = [currentUserID]

        const result = CreateGroupObj(groupName, currentUserID, imageNumber, color, membersArray);
        const expected = {
            "color": "red",
            "coverImageNumber": 5,
            "groupName": "UnitTestCreateGroup",
            "groupOwner": "1234567",
            "members":  ["1234567"]
        };
    
        expect(result).toEqual(expected);
      });
    });