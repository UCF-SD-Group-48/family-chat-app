import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Icon, Divider } from 'react-native-elements';

import LargeTitle from '../../components/LargeTitle'
import LoginInput from '../../components/LoginInput'
import LargeButton from '../../components/LargeButton'

const RegisterUser = ({ navigation }) => {
    
    const goBackToPreviousScreen = () => {
        navigation.replace('UserAuth');
    };

    const [inputText, onChangeText] = useState("");

    const goToVerifyPhone = () => {
        navigation.replace('VerifyPhone');
    };

    useLayoutEffect(() => {
        navigation.setOptions({

            title: '',
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { color: 'black' },
            headerTintColor: 'black',

            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity activeOpacity={ 0.5 } onPress={ goBackToPreviousScreen }>
                        <Icon
                            name='md-chevron-back-sharp'
                            type='ionicon'
                            color='black'
                        />
                    </TouchableOpacity>
                </View>
            ),

            headerRight: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginRight: 20,
                    }}
                >
                    <Text>
                        *TRANSITION CONTEXT*
                    </Text>
                </View>
            )
        });
    }, [navigation]);

    return (
        <SafeAreaView>
            <ScrollView style={ styles.container }>
                
                <LargeTitle title="Register" />

                <Divider inset={true} insetType="middle" width={ 1 } color={ 'gray' } />

                <View style={ styles.subtext }>
                    <Text style={{ fontSize: 18 }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Mauris malesuada lorem vel dui porta, in molestie justo interdum.
                    </Text>
                </View>
                
                <View style={ styles.elements }>
                    <LoginInput title="Enter Phone #:" value={ inputText } placeholder={ '+1 (123) 456 - 7890' }/>
                </View>

                <View style={ styles.elements }>
                    <LargeButton title="Submit" type="" onPress={ goToVerifyPhone }/>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default RegisterUser;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: 'white'
    },

    subtext: {
        width: '85%',
        position: 'relative',

        padding: 25,
        marginLeft: 'auto',
        marginRight: 'auto'
    },

    elements: {
        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 2,
        borderColor: "#888",

        paddingVertical: 25,
        paddingHorizontal: 25,
        marginTop: 10,
    },
});