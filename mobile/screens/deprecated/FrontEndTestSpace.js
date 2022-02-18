// import React, {
//     useEffect,
//     useLayoutEffect,
//     useState
// } from 'react';
// import {
//     SafeAreaView,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import {
//     Avatar,
//     Icon,
// } from 'react-native-elements';
// import { NavigationContainer } from '@react-navigation/native';
// import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
// import { auth, db } from '../../firebase';

// import loginStyles from '../../styles/loginStyles.js';

// import AppLogo from '../../assets/appLogo.svg'

// import CustomListItem from '../../components/CustomListItem';
// import LargeButton from '../../components/LargeButton';
// import LargeTitle from '../../components/LargeTitle';
// import LineDivider from '../../components/LineDivider';
// import LoginInput from '../../components/LoginInput';
// import LoginText from '../../components/LoginText';
// import UserPrompt from '../../components/UserPrompt';
// import NavTab from '../../components/NavTab';

// import HomeTab from '../1_Home/HomeTab'

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// const FrontEndTestSpace = ({ navigation }) => {
//     const [chats, setChats] = useState([]);
//     const [inputText, onChangeText] = useState("");

//     useEffect(() => {
//         const unsubscribe = db.collection('chats').onSnapshot((snapshot) => (
//             setChats(
//                 snapshot.docs.map((doc) => ({
//                     id: doc.id,
//                     data: doc.data(),
//                 }))
//             )
//         ));
//         return unsubscribe;
//     }, [])

//     const goBackToPreviousScreen = () => {
//         navigation.replace('HomeTab');
//     };

//     useLayoutEffect(() => {
//         navigation.setOptions({
//             title: 'FE TEST SPACE',
//             headerStyle: { backgroundColor: '#fff' },
//             headerTitleStyle: { color: 'black' },
//             headerTintColor: 'black',
//             headerLeft: () => (
//                 <View style={{ marginLeft: 20 }}>
//                     <TouchableOpacity activeOpacity={0.5} onPress={goBackToPreviousScreen}>
//                         <Icon
//                             name='back'
//                             type='antdesign'
//                             color='black'
//                         />
//                     </TouchableOpacity>
//                 </View>
//             ),
//             headerRight: () => (
//                 <View
//                     style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         marginRight: 20,
//                     }}
//                 >
//                     <Icon
//                         name='resistor-nodes'
//                         type='material-community'
//                         color='grey'
//                         size='30'
//                     />
//                 </View>
//             )
//         });
//     }, [navigation]);

//     const enterChat = (id, chatName) => {
//         navigation.navigate('Chat', { id, chatName });
//     };

//     return (
//         <View style={loginStyles.container}>
//             <View style={loginStyles.top_centerAligned_view}>
//                 {/* <AppLogo /> */}
//                 <UserPrompt title={"Hi there! Let's get started!"} topSpacing={5} />
//                 <LargeTitle title="Family Chat" height={100} topSpacing={-1} />
//                 <LineDivider topSpacing={-5} />
//                 <LoginText title={"Enter your phone number below\nto setup your account"} topSpacing={45} />
//                 <LoginInput title="Enter Phone #:" value={inputText} placeholder={"1 (XXX) XXX - XXXX"} topSpacing={-1} />
//                 <NavTab />
//             </View>

//             <View style={loginStyles.middle_centerAligned_view}>
//             </View>

//             <View style={loginStyles.top_centerAligned_view}>
//                 <LargeButton title="Register" type="Primary" />
//                 <LargeButton title="Go to Home Screen" type="Tertiary" />
//             </View>

//             <View style={loginStyles.bottom_centerAligned_view} />
//             <Tab.Navigator>
//                 <Tab.Screen name="HomeTab" component={HomeTab} />
//             </Tab.Navigator>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         height: '100%',
//     }
// });

// export default FrontEndTestSpace;