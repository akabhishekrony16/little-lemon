import { StyleSheet, View,Image,Pressable } from 'react-native';
import { useState,useEffect } from 'react';

import Header from './components/header';
import ProfileScreen from './screens/profile';
import OnboardingScreen from './screens/onboarding';
import SplashScreen from './screens/splashscreen';
import HomeScreen from './screens/homescreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();



export default function App() {

  const [login, setlogin] = useState(false);
  const [loading,setloading] = useState(true);
  const [image, setImage] = useState(null);


  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if(value !== null) {
        setlogin(true)
        const json = JSON.parse(value)
        setImage(json['image_uri'])
      }
    } catch(error) {
      console.log(error)
    }
    setloading(false);
  }

  useEffect(() => {
    getData();
  }, [loading,login]);

  if(loading){
    return <SplashScreen/>;
  }else if(login){
    return(
      <View style={styles.container}>
      <Header/>
      <NavigationContainer>
       <Stack.Navigator>
            <Stack.Screen options={{headerShown:false}} name="Home" component={HomeScreen} />
            <Stack.Screen options={{title:"Welcome",headerShown:false}} name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen options={{title:"Personal Information"}} name="Profile" component={ProfileScreen} />
       </Stack.Navigator>
      </NavigationContainer>
    </View>
    );
  }else{
    return (
      <View style={styles.container}>
        <Header/>
        <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen options={{title:"Welcome",headerShown:false}} name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen options={{headerShown:false}} name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        </View>
    );
  }
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
