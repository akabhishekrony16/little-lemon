import { StyleSheet, View } from 'react-native';
import { useState,useEffect } from 'react';

import Header from './components/header';
import ProfileScreen from './screens/profile';
import OnboardingScreen from './screens/onboarding';
import SplashScreen from './screens/splashscreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();


export default function App() {

  const [login, setlogin] = useState(false);
  const [loading,setloading] = useState(true);


  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if(value !== null) {
        setlogin(true)
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
            <Stack.Screen options={{title:"Personal Information"}} name="Profile" component={ProfileScreen} />
            <Stack.Screen options={{title:"Welcome"}} name="Onboarding" component={OnboardingScreen} />
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
            <Stack.Screen options={{title:"Welcome"}} name="Onboarding" component={OnboardingScreen} />
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
