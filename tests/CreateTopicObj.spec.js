import CreateTopicObj from "../helperFunctions/CreateTopicObj";

describe('CreateTopicObj', () => {
    it('returns a Topic Object', () => {
        
      const currentUser =  "12345"
      const topicName = "Topic Unit Test"
      const members = ["12345"]
      const originalMessageUID = ""

      const result = CreateTopicObj(currentUser, topicName, members, originalMessageUID);
      const expected = {
        "members": ["12345"],
        "originalMessageUID": "",
        "topicName": "Topic Unit Test",
        "topicOwner": "12345",
      };
  
      expect(result).toEqual(expected);
    });
  });