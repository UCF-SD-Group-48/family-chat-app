// Affirmational confirmation message to provide context for the user, used amongst the Authentication screens.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

{/* EXAMPLE INPUT: <UserPrompt title={'Hi there! Let's get started!'} topSpacing={5} /> */ }
const UserPrompt = (props) => {
  return (
    <View 
      onPress={props.onPress}
      style={styles.viewPrimary}
      marginTop={props.topSpacing || 15}
      height={props.height || 40}
      width={props.width || '95%'}
    >
      <Text style={styles.textPrimary}>
        {props.title || ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewPrimary: {
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#7dab',
    borderWidth: 0,
    borderColor: '#0000',
    borderRadius: 12,
  },
  textPrimary: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500',
    color: 'black',
  },
});

export default UserPrompt;