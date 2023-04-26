import * as React from 'react';
import { Text, View,StyleSheet,Image} from 'react-native';

export default function Header() {
  return (
    <View style={StyleHeader.container}>
      <Text
        style={StyleHeader.innerContainer}>
        Little Lemon
      </Text>
      <Image style={StyleHeader.logo} source={require('../assets/logo.png')} />
    </View>
  );
}

const StyleHeader = StyleSheet.create({
  container:{ 
    flex: 0.12, 
    backgroundColor: 'white',
    flexDirection:'row',
    width:360,
    justifyContent:'center',
    alignItems:'center',

  },
  innerContainer:{
    fontSize: 25,
    color: 'black',
    textAlign: 'right',
    marginTop:30
  },
  logo: {
    height:50,
    width: 100,
    resizeMode: 'contain',
    marginTop:30
 },

})
