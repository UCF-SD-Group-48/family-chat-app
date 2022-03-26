// *************************************************************
// Imports for: React, React Native, & React Native Elements
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
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

import { useIsFocused } from '@react-navigation/native';

// *************************************************************

const GroupListItem = ({ id, groupName, enterGroup, groupOwner, color, coverImageNumber, groupMemberCount }) => {

  const [isLoading, setIsLoading] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    setIsLoading(false);

    return () => {
      setIsLoading();
    };
  }, [isFocused]);

  const getGroupCoverImage = (color, number) => {
    // let letter;

    // if (color === 'purple')letter = 'P';
    // else if (color === 'blue') letter = 'B';
    // else if  (color === 'green') letter = 'G';
    // else if  (color === 'yellow') letter = 'Y';
    // else if  (color === 'orange') letter = 'O';
    // else if  (color === 'red') letter = 'R';

    // const pathValue = `${letter}` + `${number}`
    // console.log(pathValue, 'is a', typeof(pathValue))

    // return require('../assets/groupCoverImages/cover_' + pathValue + '.png')

    // return require(`../assets/groupCoverImages/cover_${letter}${number}.png`)

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
    <View style={styles.mainContainer}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => {
          setIsLoading(true)
          enterGroup(id, groupName, groupOwner)
        }}
        style={styles.groupListItemComponent}
      >
        
        <View style={styles.notificationBadge}>

        </View>
        <View style={styles.groupContent}>
          <Image
            source={getGroupCoverImage(color, coverImageNumber)}
            style={{ width: 80, height: 80, borderRadius: 500 }}
          />

          <View style={styles.groupText}>
            <Text style={styles.cheese}>
              {groupName || 'Group Name'}
            </Text>
            <View style={styles.groupSubtitle}>
              <Icon
                name='groups'
                type='material'
                color='#9D9D9D'
                size={25}
              />
              <Text style={styles.groupSubtitleText}>
                {groupMemberCount || 'X'} members
              </Text>
            </View>
          </View>
        </View>

        {isLoading
          ? <ActivityIndicator
            size="small"
            color="#363732"
            style={{ marginRight: 10 }}
          />
          : <Icon
            name='chevron-right'
            type='entypo'
            color='#363732'
            size={30}
            style={{ marginRight: 10 }}
          />
        }

      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '95%',
    alignSelf: 'flex-end',
  },

  groupListItemComponent: {
    width: '100%',
    height: 80,
    marginTop: 30,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 500,
    borderTopLeftRadius: 500,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    shadowOpacity: .25,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",

  },

  groupContent: {
    height: '100%',
    flexDirection: "row",
    alignItems: 'center',
  },

  groupText: {
    marginLeft: 20,
  },

  cheese: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
  },

  groupTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },

  groupSubtitle: {
    flexDirection: "row",
    alignItems: 'center',
  },

  groupSubtitleText: {
    fontSize: 16,
    color: '#363732',
    marginLeft: 10
  },

  notificationBadge: {
    width: 22,
    height: 22,
    backgroundColor: '#DF3D23',
    borderRadius: 500,
    position: 'absolute',
    top: -10,
    right: 12,
  },

});

export default GroupListItem