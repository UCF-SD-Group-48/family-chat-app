import { StyleSheet, Platform } from 'react-native'

  
 export default StyleSheet.create({
    container: {
        height:'100%',
        flexDirection: "column",
        backgroundColor: 'white',
    },
    top_centerAligned_view: {
        borderWidth: 2,
        borderColor: "#888",
    
        paddingVertical: 10,
        paddingHorizontal: 10,
    
        width: '100%',
    
        flex: -1,
        justifyContent: 'flex-start',
        alignItems: "center"
      },
    middle_centerAligned_view: {
        flex: 1,
        flexGrow: 1
    }
    // ,
    // bottom_centerAligned_view: {
    //     height: Platform.OS === 'ios' ? 22 : 0
    // }
 });