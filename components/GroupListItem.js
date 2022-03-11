import { Icon } from 'react-native-elements';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const GroupListItem = ({ id, groupName, enterGroup, groupOwner }) => {
    
    // const [groups, setGroups] = useState([]);

    //   useEffect(() => {
    //     const unsubscribe = db
    //       .collection('groups')
    //       .doc(id)
    //       .collection('topics')
    //       .onSnapshot((snapshot) =>
    //         setGroups(snapshot.docs.map((doc) => doc.data()))
    //       );
    
    //     return unsubscribe;
    //   })


  return (
    <View style={ styles.container }>
      <TouchableOpacity
        onPress={() => enterGroup(id, groupName, groupOwner)}
        style={ styles.mainView }
        activeOpacity={0.7}
      >
        <View style={ styles.emoji }>
          <Text style={ styles.emojiText }>
            {"" || '🥳'}
          </Text>
        </View>
        <Text style={ styles.text }>
          {groupName || 'default text'}
        </Text>
        <Icon
          style={ styles.icon}
          name='right'
          type='antdesign'
          color='black'
        />

      </TouchableOpacity>
      <View height={20} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  mainView: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 20,

    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  emoji: {
    flex: 0,
    width: 70,
    height: 70,
    justifyContent: 'center',

    backgroundColor: '#0cc',
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 15,
  },
    emojiText: {
      textAlign: 'center',
      fontSize: 24,
      fontWeight: '600',
      color: 'black',
    },
  text: {
    flex: 1,
    flexGrow: 1,

    textAlign: 'left',
    paddingLeft: 20,
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  icon: {
    backgroundColor: '#0cc0',
    width: 35,
    height: 80,
    justifyContent: 'center',
    flex: 0,
  },
});

export default GroupListItem

