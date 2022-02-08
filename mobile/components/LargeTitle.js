import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const LargeTitle = (props) => {
  return (
      <View style={ styles.view } height={props.height} marginTop={ props.topSpacing } >
        <Text style={ styles.text }>
          {props.title || ""}
        </Text>
      </View>
  );
};

const styles = StyleSheet.create({
  view: {
    borderWidth: 2,
    borderColor: "#eee",

    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 15,

    height: 125,
    width: '100%',

    justifyContent: 'center',
    
  },
  text: {
    color: "black",
    fontSize: 50,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LargeTitle;
