// Sub-title text, used amongst the Authentication screens.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const LoginText = (props) => {
  return (
    <View
      style={styles.view}
      height={props.height || 100}
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
    borderWidth: 2,
    borderColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  text: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '500',
    color: 'black',
  },
});

export default LoginText;