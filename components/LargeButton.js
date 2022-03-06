// Large (primary, secondary, tertiary) button, used amongst the Authentication screens.

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

{/* EXAMPLE INPUT: <LargeButton title='Login' type='Secondary' /> */ }
const LargeButton = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={
        props.type == 'Secondary' ? styles.viewSecondary :
          props.type == 'Tertiary' ? styles.viewTertiary : styles.viewPrimary
      }
    >
      <Text
        style={
          props.type == 'Secondary' ? styles.textSecondary :
            props.type == 'Tertiary' ? styles.textTertiary : styles.textPrimary
        }
      >
        {props.title || ''}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Primary Button
  viewPrimary: {
    justifyContent: 'center',
    height: 65,
    width: '85%',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  textPrimary: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },

  // Secondary Button
  viewSecondary: {
    justifyContent: 'center',
    height: 65,
    width: '85%',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 20,
  },
  textSecondary: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
  },

  // Tertiary Button
  viewTertiary: {
    justifyContent: 'center',
    height: 45,
    width: '85%',
    marginTop: 10,
    marginHorizontal: 40,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#0000',
    borderWidth: 1,
    borderColor: '#0000',
    borderRadius: 20,
  },
  textTertiary: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
  },
});

export default LargeButton;