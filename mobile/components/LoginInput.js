import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

const LoginInput = (props) => {
  return (
      <View style={ styles.view }>
        <Text style={ styles.text }>
          {props.title || ""}
        </Text>
        <View style={ styles.secondaryView }>
          <TextInput
            style={ styles.textInput }
            placeholder={ props.placeholder }/>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  view: {
    borderWidth: 2,
    borderColor: "#888",

    paddingVertical: 0,
    paddingHorizontal: 10,
    marginTop: 15,

    height: 100,
    width: '100%',

    justifyContent: 'center',
  },
  secondaryView: {
    borderWidth: 2.5,
    borderRadius: 5,
    borderColor: "black",

    paddingVertical: 0,
    paddingHorizontal: 10,
    marginTop: 5,

    height: 50,
    width: '100%',

    justifyContent: 'center',
  },
  text: {
    color: "black",
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'left',
  },
  textInput: {
    backgroundColor: "#0000",
    height: 35,

    fontSize: 18,
    color: '#444',
    fontWeight: '600',
    textAlign: 'left',
  },
});

export default LoginInput;
