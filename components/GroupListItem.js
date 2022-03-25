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
  Linking,
} from 'react-native';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Icon,
  Image,
  Input,
  Tooltip,
  Switch,
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


// *************************************************************

import { getGroupCoverImage } from '../screens/5_Supplementary/GenerateProfileIcon';


const GroupListItem = ({ id, groupName, enterGroup, groupOwner, color, coverImageNumber }) => {

  const getGroupCoverImage = (color, number) => {

    if (color === 'purple') {
      switch (number) {
        case 1: {
          return require('../assets/groupCoverImages/cover_P1.png')
        }
        case 2: {
          return require('../assets/groupCoverImages/cover_P2.png')
        }
        case 3: {
          return require('../assets/groupCoverImages/cover_P3.png')
        }
        case 4: {
          return require('../assets/groupCoverImages/cover_P4.png')
        }
      }
    } else if (color === 'blue') {
      switch (number) {
        case 1: {
          return require('../assets/groupCoverImages/cover_B1.png')
        }
        case 2: {
          return require('../assets/groupCoverImages/cover_B2.png')
        }
        case 3: {
          return require('../assets/groupCoverImages/cover_B3.png')
        }
        case 4: {
          return require('../assets/groupCoverImages/cover_B4.png')
        }
      }
    } else if (color === 'green') {
      switch (number) {
        case 1: {
          return require('../assets/groupCoverImages/cover_G1.png')
        }
        case 2: {
          return require('../assets/groupCoverImages/cover_G2.png')
        }
        case 3: {
          return require('../assets/groupCoverImages/cover_G3.png')
        }
        case 4: {
          return require('../assets/groupCoverImages/cover_G4.png')
        }
      }
    } else if (color === 'yellow') {
      switch (number) {
        case 1: {
          return require('../assets/groupCoverImages/cover_Y1.png')
        }
        case 2: {
          return require('../assets/groupCoverImages/cover_Y2.png')
        }
        case 3: {
          return require('../assets/groupCoverImages/cover_Y3.png')
        }
        default: {
          return;
        }
      }
    } else if (color === 'orange') {
      switch (number) {
        case 1: {
          return require('../assets/groupCoverImages/cover_O1.png')
        }
        case 2: {
          return require('../assets/groupCoverImages/cover_O2.png')
        }
        case 3: {
          return require('../assets/groupCoverImages/cover_O3.png')
        }
        default: {
          return;
        }
      }
    } else if (color === 'red') {
      switch (number) {
        case 1: {
          return require('../assets/groupCoverImages/cover_R1.png')
        }
        case 2: {
          return require('../assets/groupCoverImages/cover_R2.png')
        }
        case 3: {
          return require('../assets/groupCoverImages/cover_R3.png')
        }
        default: {
          return;
        }
      }
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => enterGroup(id, groupName, groupOwner)}
        style={styles.mainView}
        activeOpacity={0.7}
      >
        <View>
          <Image
            source={getGroupCoverImage(color, coverImageNumber)}
            style={{ width: 75, height: 75, borderRadius: 200}}
          />
        </View>

        <Text style={styles.text}>
          {groupName || 'default text'}
        </Text>
        <Icon
          style={styles.icon}
          name='right'
          type='antdesign'
          color='black'
        />

      </TouchableOpacity>
      <View height={20} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  mainView: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 20,

    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  emoji: {
    flex: 0,
    width: 70,
    height: 70,
    justifyContent: 'center',

    backgroundColor: '#0cc',
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 15,
  },
  emojiText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  text: {
    flex: 1,
    flexGrow: 1,

    textAlign: 'left',
    paddingLeft: 20,
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  icon: {
    backgroundColor: '#0cc0',
    width: 35,
    height: 80,
    justifyContent: 'center',
    flex: 0,
  },
});

export default GroupListItem

