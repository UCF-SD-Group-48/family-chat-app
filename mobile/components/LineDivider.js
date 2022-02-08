import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';

const LineDivider = (props) => {
  return (
      <Divider style={styles.view} width={ 2.6 } color={ '#333' } marginTop={ props.topSpacing } />
  );
};

const styles = StyleSheet.create({
  view: {
    marginTop: 15,
    
    width: '80%',
  },
});

export default LineDivider;
