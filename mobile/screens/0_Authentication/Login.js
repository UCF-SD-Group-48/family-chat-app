import React, {
    useEffect,
    useLayoutEffect,
    useState,
} from 'react';
import {
    KeyboardAvoidingView,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Button,
    Icon,
    Image,
    Input,
    Tooltip,
} from 'react-native-elements';
import { auth } from '../../firebase';

import LargeTitle from '../../components/LargeTitle'
import LineDivider from '../../components/LineDivider'
import LargeButton from '../../components/LargeButton'


const Login = ({ navigation }) => {

    const goBackToPreviousScreen = () => {
        navigation.replace('UserAuth');
    };

    const goToVerifyPhone = () => {
        navigation.replace('VerifyPhone');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Login',
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { color: 'black' },
            headerTintColor: 'black',
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={goBackToPreviousScreen}>
                        <Icon
                            name='md-chevron-back-sharp'
                            type='ionicon'
                            color='black'
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: '',
        });
    }, [navigation]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.replace('HomeTab');
            }
        });
        return unsubscribe;
    }, []);

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password).catch(error => alert(error));
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>

                    <LargeTitle title='Welcome back!' />

                    <LineDivider />

                    <Text style={styles.subtext}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Text>

                    <Input placeholder='Email'
                        autoFocus
                        type='email'
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />
                    <Input placeholder='Password'
                        secureTextEntry
                        type='password'
                        value={password}
                        onChangeText={text => setPassword(text)}
                        onSubmitEditing={signIn}
                    />

                    <View style={styles.button}>
                        <LargeButton title='Submit' type='' onPress={signIn} />
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',

    },
    subtext: {
        width: '85%',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        margin: 10,
        padding: 15,
        fontSize: 18,
        textAlign: 'center',

    },
    elements: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 25,
        paddingHorizontal: 25,
    },
    inputContainer: {
        width: 300,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        margin: 25,
    },
});

export default Login;