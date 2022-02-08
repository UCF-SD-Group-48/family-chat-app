// Input field for the user's phone number, used amongst the Authentication screens.

import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

{/* EXAMPLE INPUT: <LoginInput title="Enter Phone #:" value={ inputText } placeholder={ '+1 (123) 456 - 7890' }/> */ }
const LoginInput = (props) => {
  return (
    <View
      style={styles.primaryView}
      marginTop={props.topSpacing || 15}
    >
      <Text style={styles.text}>
        {props.title || ''}
      </Text>
      <View style={styles.secondaryView}>
        <TextInput
          style={styles.textInput}
          placeholder={props.placeholder}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  primaryView: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#eee',
  },
  secondaryView: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    marginTop: 5,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderWidth: 2.5,
    borderColor: 'black',
    borderRadius: 5,
  },

  text: {
    textAlign: 'left',
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  textInput: {
    height: 35,
    backgroundColor: '#0000',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
});

export default LoginInput;