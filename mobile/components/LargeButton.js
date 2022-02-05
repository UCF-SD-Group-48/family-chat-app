import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
//import { Button } from 'react-native-elements';
//import { db } from '../firebase';

const LargeButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={
                      props.type=="Secondary" ? styles.viewSecondary :
                      props.type=="Tertiary" ? styles.viewTertiary : styles.viewPrimary }>
        <Text style={ props.type=="Secondary" ? styles.textSecondary :
                      props.type=="Tertiary" ? styles.textTertiary : styles.textPrimary }>
          {props.title || ""}
        </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  viewPrimary: {
    backgroundColor: "#888",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#0000",

    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 40,
    marginTop: 15,

    height: 65,
    width: '85%',

    justifyContent: 'center',
  },
  textPrimary: {
    color: "white",
    fontSize: 20,
    fontWeight: '600',
    textAlign: "center",
  },

  viewSecondary: {
    backgroundColor: "#0000",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#888",

    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 40,
    marginTop: 15,

    height: 65,
    width: '85%',

    justifyContent: 'center',
  },
  textSecondary: {
    color: "black",
    fontSize: 20,
    fontWeight: '600',
    textAlign: "center",
  },

  viewTertiary: {
    backgroundColor: "#0000",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0000",

    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 40,
    marginTop: 5,

    height: 45,
    width: '85%',

    justifyContent: 'center',
  },
  textTertiary: {
    color: "black",
    fontSize: 20,
    fontWeight: '600',
    textAlign: "center",
  },
});

export default LargeButton;
