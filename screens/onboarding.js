import React, { useState } from 'react'; 
import { ScrollView, View ,Text, StyleSheet, TextInput,Pressable,Image} from 'react-native';
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
  storeData({first_name:firstname,
    last_name:"",
    mail:email,
    phone_no:null,
    image_uri:null,
    order_status:false,
    password_change:false,
    special_offers:false,
    newsletters:false});
  return(
    navigation.navigate('Home')
  );
};

return (
    <View style={styles.container}>
    <ScrollView>
    <View style = {{paddingBottom:30}}>
      <Text style={styles.headerText}>Let us get to know you</Text>
      <Image style ={{width:100,height:100,alignSelf:'center',resizeMode:'contain'}} source={require('../assets/little-lemon-logo.png')} />
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
      <Pressable
        style={[styles.button,{backgroundColor:Validation(firstname,email)?yellow:'#D9D8D4'}]}
        onPress={NavigateToProfile}
        disabled={!Validation(firstname,email)}
        >
        <Text style={[styles.buttonText,{color:Validation(firstname,email)?'white':'#333333'}]}>
          Next
        </Text>
      </Pressable>
    </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:40
  },
  headerText: {
    padding:30,
    fontSize:24,
    color:green,
    textAlign: 'center',
    marginTop:20
  },
  NameText: {
    fontSize:18,
    padding: 20,
    marginVertical: 8,
    color:green,
    textAlign: 'center',
    marginTop:30
  },
  EmailText: {
    fontSize:18,
    padding: 20,
    marginVertical: 8,
    color:green,
    textAlign: 'center',
  },
  input: { 
    height:50, 
    width:280, 
    borderWidth: 1,
    borderRadius:10, 
    padding: 10, 
    fontSize:16, 
    borderColor:green, 
    backgroundColor: 'white',
    alignSelf:'center' 
},
button: {
    fontSize:15,
    borderColor:'black',
    borderWidth: 2,
    borderRadius:5,
    marginTop:50,
    marginBottom:50,
    width:100,
    height:40,
    justifyContent:'center',
    alignSelf:'flex-end',
    marginRight:43
  },
  buttonText: {
    textAlign: 'center',
    fontSize:16,
  },
  loginText:{
    fontSize: 30,
    color: '#EDEFEE',
    textAlign: 'center',
    padding:40
  } 
});

