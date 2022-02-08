import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';

const UserPrompt = (props) => {
  return (
    <View onPress={props.onPress} style={ styles.viewPrimary } marginTop={ props.topSpacing || 15 } height={props.height || 40} width={props.width || "95%"} >
        <Text style={ styles.textPrimary }>
          {props.title || ""}
        </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewPrimary: {
    backgroundColor: "#7dab",
    borderRadius: 12,
    borderWidth: 0,
    borderColor: "#0000",

    // marginTop: 15,

    textAlign: 'center',
    justifyContent: 'center',
  },
  textPrimary: {
    color: "black",
    fontSize: 17,
    fontWeight: '500',
    textAlign: "center",
  },
});

export default UserPrompt;
