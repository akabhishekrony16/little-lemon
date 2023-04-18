import * as React from 'react';
import { Text, View,StyleSheet } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={{ flex:1,backgroundColor: 'white'}}>
      <Text
        style={StyleMain.container}>
          Loading...
      </Text>
    </View>
  );
};

const StyleMain = StyleSheet.create({
  container:{
    paddingTop: 40,
    fontSize: 30,
    color: 'black',
    textAlign:'center',
    margin:20,
  }
})

