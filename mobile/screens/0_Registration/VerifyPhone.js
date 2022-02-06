import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Icon, Divider } from 'react-native-elements';

import LargeTitle from '../../components/LargeTitle'

const VerifyPhone = ({ navigation }) => {
    
    const goBackToPreviousScreen = () => {
        navigation.replace('RegisterPhone');
    };

    const [inputText, onChangeText] = useState("");

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
                        *VERIFY YOUR PHONE*
                    </Text>
                </View>
            )
        });
    }, [navigation]);

    return (
        <SafeAreaView>
            <ScrollView style={ styles.container }>
                
                <LargeTitle title="Verify" />

                <Divider inset={true} insetType="middle" width={ 1 } color={ 'gray' } />

                <View style={ styles.subtext }>
                    <Text style={{ fontSize: 18 }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Mauris malesuada lorem vel dui porta, in molestie justo interdum.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default VerifyPhone;

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