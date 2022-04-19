import CreateChatObj from '../helperFunctions/CreateChatObj'
import firebase from "firebase/compat";

describe('CreateChatObj', () => {
      it('returns chat object', () => {

        const trimmedInput = "HelloThere"
        const currentUser = "987654321"
        const phoneNumber = "1234567890"

        const result = CreateChatObj(trimmedInput, currentUser, phoneNumber);
        const expected = {
            "editedTime": null,
            "membersWhoReacted": [],
            "message": "HelloThere",
            "ownerUID":  "987654321",
            "phoneNumber": "1234567890",
            "timestamp": firebase.firestore.FieldValue.serverTimestamp()
        };
    
        expect(result).toEqual(expected);
      });
    });