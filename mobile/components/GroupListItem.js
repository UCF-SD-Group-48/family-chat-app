import { ListItem, Avatar } from 'react-native-elements';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const GroupListItem = ({ id, groupName, enterGroup }) => {
    
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const unsubscribe = db
          .collection('chats')
          .doc(id)
          .collection('messages')
          .orderBy('timestamp', 'desc')
          .onSnapshot((snapshot) =>
            setGroups(snapshot.docs.map((doc) => doc.data()))
          );
    
        return unsubscribe;
      })
      useEffect(() => {
        const unsubscribe = db
          .collection('groups')
          .doc(id)
          .collection('topics')
          .onSnapshot((snapshot) =>
            setGroups(snapshot.docs.map((doc) => doc.data()))
          );
    
        return unsubscribe;
      })


  return (
    <ListItem
      key={id}
      onPress={() => enterGroup(id, groupName)}
      key={id}
      bottomDivider
    >
      <Avatar
        rounded
        source={{
          uri:
            groups?.[0]?.photoURL ||
            'http://www.cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png',
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: '800' }}>
          {groupName}
        </ListItem.Title>
        <ListItem.Subtitle
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {groupName?.[0]?.displayName}: {groupName?.[0]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  )
}

export default GroupListItem

