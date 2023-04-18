import React, { useState } from 'react'; 
import { ScrollView, View ,Text, StyleSheet, TextInput,Pressable} from 'react-native';
import Validation from '../utilities/validation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const green  = '#495E57';
const yellow = '#f4ce14';

export default function OnboardingScreen({navigation}) {
    const [firstname, onChangefirstname] = useState('');
    const [email, onChangeemail] = useState('');
    const storeData = async (value) => {
      try {
        await AsyncStorage.setItem('@storage_Key', JSON.stringify(value))
      } catch (error) {
        console.log(error)
      }
    }

function NavigateToProfile(){
  storeData({first_name:firstname,mail:email});
  return(
    navigation.navigate('Profile')
  );
};

return (
    <View style={styles.container}>
    <ScrollView>
    <View style = {{backgroundColor:green,paddingBottom:30}}>
      <Text style={styles.headerText}>Let us get to know you</Text>
      <Text style={styles.NameText}>First Name</Text>
      <TextInput
       style={styles.input} 
       value={firstname} 
       onChangeText={onChangefirstname}
       keyboardType='default'
      >
      </TextInput>
      <Text style={styles.EmailText}>Email</Text>
      <TextInput
       style={styles.input} 
       value={email}
       onChangeText={onChangeemail}
       keyboardType='email-address'
      >
      </TextInput>
      </View>
      <View>
      <Pressable
        style={[styles.button,{backgroundColor:Validation(firstname,email)?yellow:'#D9D8D4'}]}
        onPress={NavigateToProfile}
        disabled={!Validation(firstname,email)}
        >
        <Text style={[styles.buttonText,{color:Validation(firstname,email)?'white':'#333333'}]}>
          Next
        </Text>
      </Pressable>
      </View>
    </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    padding: 30,
    fontSize: 30,
    color: '#EDEFEE',
    textAlign: 'center',
    marginTop:20
  },
  NameText: {
    fontSize: 24,
    padding: 20,
    marginVertical: 8,
    color: '#EDEFEE',
    textAlign: 'center',
    marginTop:30
  },
  EmailText: {
    fontSize: 24,
    padding: 20,
    marginVertical: 8,
    color: '#EDEFEE',
    textAlign: 'center',
  },
  input: { 
    height:60, 
    width:280, 
    borderWidth: 1,
    borderRadius:10, 
    padding: 10, 
    fontSize:32, 
    borderColor: '#EDEFEE', 
    backgroundColor: '#EDEFEE',
    alignSelf:'center' 
},
button: {
    fontSize:15,
    borderColor: '#EDEFEE',
    borderWidth: 2,
    borderRadius:10,
    marginTop:50,
    marginBottom:50,
    width:150,
    height:60,
    justifyContent:'center',
    marginLeft:160
  },
  buttonText: {
    textAlign: 'center',
    fontSize:32,
  },
  loginText:{
    fontSize: 30,
    color: '#EDEFEE',
    textAlign: 'center',
    padding:40
  } 
});

