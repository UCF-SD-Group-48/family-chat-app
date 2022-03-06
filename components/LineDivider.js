// Divider for Title & Sub-Title text, used amongst the Authentication screens.

import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';

const LineDivider = (props) => {
  return (
    <Divider
      style={styles.view}
      width={2.6}
      color={'#333'}
      marginTop={props.topSpacing || 15}
    />
  );
};

const styles = StyleSheet.create({
  view: {
    width: '80%',
  },
});

export default LineDivider;