// *************************************************************
// Imports for: React, React Native, & React Native Elements
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Divider,
  Icon,
  Image,
  Input,
  Tooltip,
} from 'react-native-elements';

// Imports for: Expo
import { StatusBar } from 'expo-status-bar';
import ImagePicker from 'expo-image-picker';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

// Imports for: Firebase
import {
  apps,
  auth,
  db,
  firebaseConfig
} from '../../firebase';
import firebase from 'firebase/compat/app';

// Imports for: Components
import LargeButton from '../../components/LargeButton'
import LargeTitle from '../../components/LargeTitle'
import Logo from '../../assets/appLogo.svg'
import { imageSelection } from '../5_Supplementary/GenerateProfileIcon';
import GenerateProfileIcon from '../5_Supplementary/GenerateProfileIcon';

// *************************************************************

// Confirm to the user that their account was created, and give them the option to view a Guided Tour OR go straight to the Home screen.
const UserCreated = ({ navigation, route }) => {

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'New Account Created!',
      headerStyle: { backgroundColor: '#FFE5B8' },
      headerTitleStyle: { color: 'black' },
      headerTintColor: 'black',
      headerLeft: '',
      headerRight: ''
    });
  }, [navigation]);

  const firstName = route.params.firstName;
  const lastName = route.params.lastName;
  // const profilePic = route.params.profilePic;
  const pfp = route.params.pfp;

  const isLoggedIn = () => {
    if (auth?.currentUser === null) {
      return false;
    } else {
      return true;
    }
  };

	const enterApp = () => {
		navigation.navigate('TabStack', { screen: 'HomeTab'});
    console.log('[WELCOME TO: FamilyChat!]')
	};

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.title}>
          <Text style={{ fontSize: 25, textAlign: 'center', fontWeight: 'bold' }}>
            Welcome to FamilyChat,
          </Text>
          <View style={{
            width: '85%', justifyContent: 'center', alignContent: 'center', alignSelf: 'center',
          }}>
            <View
              style={{
                width: 250,
                height: 125,
                marginTop: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: 'lightgrey',
                alignContent: 'center',
                backgroundColor: 'white',
                padding: 30,
                alignSelf: 'center',
              }}>
              <View style={{
                flexDirection: "row",
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center'
              }}>
                <Image
                  source={imageSelection(pfp)}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
                <View>
                  <Text style={{
                    marginLeft: 25,
                    fontSize: 22,
                    fontWeight: 'bold'
                  }}
                  >
                    {firstName}
                  </Text>
                  <Text style={{
                    marginLeft: 25,
                    fontSize: 22,
                    fontWeight: 'bold'

                  }}>
                    {lastName}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.centered}>
          <View
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              width: '80%'
            }}
          >
            <Divider
              width={2}
              color={'#e3e6e8'}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 17,
                marginTop: 20,
                textAlign: 'center',
              }}
            >
              Your family is going to be so happy to talk with you!
            </Text>

            <Image
              source={require('../../assets/familyCelebration.gif')}
              style={{ width: 270, height: 130, }}
            />

            <View style={{ marginTop: 30}}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={enterApp}
                style={styles.enterAppButtonStyling}
                disabled={false}
              >
                <Text style={styles.enterAppButtonTextStyling}>Enter the App</Text>
                <Icon
                  name='arrow-forward'
                  type='ionicon'
                  color='white'
                  size={28}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#FCF3EA',
  },
  title: {
    position: 'relative',
    textAlign: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  elements: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  centered: {
    width: '90%',
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterAppButtonStyling: {
    height: 65,
    width: 250,
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: '#1982FC',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'black',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  enterAppButtonTextStyling: {
    fontSize: 25,
    fontWeight: '600',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
    marginLeft: 12,
  },
});

export default UserCreated;