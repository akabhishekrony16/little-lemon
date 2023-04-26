import * as React from 'react';
import { Text, View,StyleSheet,Image} from 'react-native';

const green  = '#495E57';
const yellow = '#f4ce14';

export default function SplashScreen() {
  return (
    <View style={{ flex:1,justifyContent:'center',alignSelf:'center'}}>
      <Image style ={{width:200,height:200,alignSelf:'center',resizeMode:'contain'}} source={require('../assets/little-lemon-logo.png')} />
      <Text
        style={StyleMain.container}>
          Loading...
      </Text>
    </View>
  );
};

const StyleMain = StyleSheet.create({
  container:{
    paddingTop:20,
    fontSize: 30,
    color:green,
    textAlign:'center',
    margin:20,
  }
})

