import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import RegisterPage from './RegisterPage';

const VerifyPage = ({ navigation }) => {

    const [confirm, setConfirm] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    const onSubmit = () => {

    }


    async function confirmVerificationCode(code) {
        try {
          await confirm.confirm(code);
          setConfirm(null);
        } catch (error) {
          alert('Invalid code');
        }
      }
    
      auth().onAuthStateChanged((user) => {

        if(user) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      })




    return (
        <View>Verify Page</View>
        // <Button title="Confirm OTP" onPress={() => onSubmit()} />
    );
};

export default VerifyPage;

const styles = StyleSheet.create({

});
