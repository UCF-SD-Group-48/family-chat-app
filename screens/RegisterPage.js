import { StatusBar } from 'expo-status-bar';
import React, {useState, useLayoutEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { KeyboardAvoidingView } from 'react-native';
import { auth } from '../firebase';

const RegisterPage = ({ navigation }) => {
    const[phoneNumber, setPhoneNumber] = useState('');
    const[confirm, setConfirm] = useState(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: 'Back to Login',
        })
    }, [navigation])

    // const register = () => {
    //     auth.createUserWithEmailAndPassword(email, password)

    //     .then((authUser) => {
    //         authUser.user.updateProfile({
    //             displayName: name,
    //             photoURL: imageUrl || 'https://connectingcouples.us/wp-content/uploads/2019/07/avatar-placeholder.png'
    //         });
    //     }).catch(error => alert(error.message));
    // };
    const register = async () => {
        try {
            const confirmation = await auth.signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation)
            if(confirm) {
                navigation.navigate('Verify Page');
            }
        } catch (error) {
            alert(error);
        }
    };

  return (
    <KeyboardAvoidingView behavior='padding' style={ styles.container }>
        <StatusBar style='light'/>

        <Text h3 style={{ marginBottom: 50 }}>
            ENTER PHONE #
        </Text>

        <View style={styles.inputContainer}>
            <Input 
                placeholder='1 (XXX) XXX-XXXX'
                autofocus 
                type = 'text'
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
            />

        </View>
        <Button 
            style={styles.button}
            raised
            onPress={ register }
            title='Submit'
        />
        <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    button: {
        width: 200,
        marginTop: 10,
    },
    inputContainer: {
        width: 300,
    }
});