// Line item, showing a user and their message within a group chat.

import { ListItem, Avatar } from 'react-native-elements';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const CustomListItem = ({ id, topicName, enterTopic }) => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection('chats')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) =>
        setChatMessages(snapshot.docs.map((doc) => doc.data()))
      );

    return unsubscribe;
  })

  return (
    <ListItem
      key={id}
      onPress={() => enterTopic(id, topicName)}
      key={id}
      buttomDivider
    >
      <Avatar
        rounded
        source={{
          uri:
            chatMessages?.[0]?.photoURL ||
            'http://www.cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png',
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: '800' }}>
          {topicName}
        </ListItem.Title>
        <ListItem.Subtitle
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;