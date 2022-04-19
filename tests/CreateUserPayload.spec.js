import firebase from "firebase/compat";
import CreateUserPayload from '../helperFunctions/CreateUserPayload'

describe('CreateUserPayload', () => {
      it('returns first part of Group Object', () => {

        
        const firstName = "First"
        const lastName = "Last"
        const pfp = 5
        const color = 'Blue'
        const statusText = 'New to FamilyChat!'
        const statusEmoji = '👋'
        const email = "test@email.com"
        const phoneNumber = "1234567890"
        const pushNotificationEnabled = true
        const discoverableEnabled = true
        const groups = []
        const lastOn = firebase.firestore.FieldValue.serverTimestamp()
        const topicMap = ([])

        const result = CreateUserPayload(firstName, lastName, pfp , email, phoneNumber);
        const expected = {
            "firstName": "First",
            "lastName": "Last",
            "pfp": 5,
            "color": "Blue",
            "statusText":  'New to FamilyChat!',
            "statusEmoji": '👋',
            "email": "test@email.com",
            "phoneNumber": "1234567890",
            "pushNotificationEnabled": true,
            "discoverableEnabled":  true,
            "groups": [],
            "lastOn": firebase.firestore.FieldValue.serverTimestamp(),
            "topicMap":  ([])
        };
    
        expect(result).toEqual(expected);
      });
    });