import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
//import { Button } from 'react-native-elements';
//import { db } from '../firebase';

const LargeButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={ props.style=="Secondary" ? styles.viewSecondary :
                    props.style=="Tertiary" ? styles.viewTertiary : styles.viewPrimary }>
        <Text style={ props.style=="Secondary" ? styles.textSecondary :
                      props.style=="Tertiary" ? styles.textTertiary : styles.textPrimary }>
          {props.title || ""}
        </Text>
      </View>
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

    justifyContent: 'center',
    alignItems: 'center',
  },
  textPrimary: {
    color: "white",
    fontSize: 20,
    fontWeight: '600'
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

    justifyContent: 'center',
    alignItems: 'center',

  },
  textSecondary: {
    color: "black",
    fontSize: 20,
    fontWeight: '600'
  },

  viewTertiary: {
    backgroundColor: "#0000",
    borderRadius: 20,
    borderWidth: 0,
    borderColor: "#0000",

    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 40,
    marginTop: 15,

    height: 40,

    justifyContent: 'center',
    alignItems: 'center',

  },
  textTertiary: {
    color: "black",
    fontSize: 20,
    fontWeight: '600'
  },
});

export default LargeButton;
