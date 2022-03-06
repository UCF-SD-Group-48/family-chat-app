// Large Title showing context to the user on which step of the registration process their on, used amongst the Authentication screens.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

{/* EXAMPLE INPUT: <LargeTitle title='Family Chat' /> */ }
const LargeTitle = (props) => {
  return (
    <View
      style={styles.view}
      height={props.height || 125}
      marginTop={props.topSpacing || 15}
    >
      <Text style={styles.text}>
        {props.title || ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: '600',
    color: 'black',
  },
});

export default LargeTitle;