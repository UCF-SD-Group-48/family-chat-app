import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView } from 'react-native';
import { auth } from '../firebase';
import loginStyles from '../styles/loginStyles.js';

const LandingPage = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if(authUser) {
                navigation.replace('Home');
            }
        });
        return unsubscribe;
    }, []);

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password).catch(error => alert(error))
    };

    return (
        <View style={loginStyles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <View style={ loginStyles.top_centerAligned_view }>
                    <StatusBar style='light'/>
                    <View style={ {height: 75} } />
                    <Image source={{
                            uri: 'https://logowik.com/content/uploads/images/signal-messenger-icon9117.jpg'
                        }}
                        style={{ width: 200, height: 200 }}
                    />

                    <View style={ styles.inputContainer }>
                        <Input placeholder='Email'
                            autoFocus
                            type='email'
                            value={ email }
                            onChangeText={ text => setEmail(text) }
                        />
                        <Input placeholder='Password'
                            secureTextEntry
                            type='password'
                            value={ password }
                            onChangeText={ text => setPassword(text) }
                            onSubmitEditing={ signIn }
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>

            <View style={ loginStyles.middle_centerAligned_view } />

            <View style={ loginStyles.top_centerAligned_view }>
                <Button
                    onPress={ () => navigation.navigate('Register Page') }
                    style={ styles.button }
                    type='outline'
                    title='Register Page'
                />
                <Button 
                    onPress={ () => navigation.navigate('PhoneVerification') }
                    style={ styles.button }
                    type='outline'
                    title='PhoneVerification'
                />
                <Button style={ styles.button } onPress={ signIn } title='Login' />
            </View>

            <View style={ loginStyles.bottom_centerAligned_view } />
        </View>
    );
};

export default LandingPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10,
    },
});
