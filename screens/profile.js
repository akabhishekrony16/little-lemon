import React, { useState, useEffect } from 'react';
import { Pressable, Image, View,Text,StyleSheet,ScrollView,TextInput,Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Checkbox from 'expo-checkbox';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Validate_PhoneNumber from '../utilities/phonevalidation';

import SplashScreen from './splashscreen';


const green  = '#495E57';
const yellow = '#f4ce14';

export default function ProfileScreen({navigation}) {
  const [firstname, onChangefirstname] = useState('');
  const [lastname, onChangelastname] = useState('');
  const [email, onChangeemail] = useState('');
  const [phone, onChangephone] = useState('');
  const [image, setImage] = useState(null);
  const [order_status, set_order_status] = useState(false);
  const [password_change, set_password_change] = useState(false);
  const [special_offers, set_special_offers] = useState(false);
  const [newsletters, set_newsletters] = useState(false);
  const [loading,setloading] = useState(true);

  async function pickImage() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const removeImage = () =>{
    setImage(null);
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if(value !== null) {
        const json = JSON.parse(value)
        onChangefirstname(json['first_name']);
        onChangeemail(json['mail']);
        onChangelastname(json['last_name']);
        onChangephone(json['phone_no']);
        setImage(json['image_uri']);
        set_order_status(json['order_status']);
        set_password_change(json['password_change']);
        set_special_offers(json['special_offers']);
        set_newsletters(json['newsletters']); 
      }
    } catch(error) {
      console.log(error)
    }
    setloading(false);
  }

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@storage_Key', JSON.stringify(value))
    } catch (error) {
      console.log(error)
    }
  }

 const RemoveItem = async (key) =>{
  try {
    await AsyncStorage.removeItem('@storage_Key')
  } catch (error) {
    console.log(error)
  }
 }

function SaveChanges(){
  if (!Validate_PhoneNumber(phone)){
   return  Alert.alert("Incorrect Phone Number")
  }else{
      storeData({first_name:firstname,
      last_name:lastname,
      mail:email,
      phone_no:phone,
      image_uri:image,
      order_status:order_status,
      password_change:password_change,
      special_offers:special_offers,
      newsletters:newsletters});
      return navigation.navigate("Home")

  }};

  function DiscardChanges(){
    onChangefirstname('');
    onChangelastname('');
    onChangeemail('');
    onChangephone('');
    setImage(null);
    set_order_status(false);
    set_password_change(false);
    set_special_offers(false);
    set_newsletters(false);
    return RemoveItem('@storage_Key')
  }

  function LogOut(){
    DiscardChanges();
    return(
      navigation.navigate('Onboarding')
    );
  };

  useEffect(() => {
    getData();
  },[firstname,email]);

  function Image_Header(){
    if(image=== null){
      return <Text  style = {{backgroundColor:'#10b6c2',textAlign:'center',padding:30,borderRadius:50,color:'white',fontSize:30}} >{firstname.slice(0,1) + lastname.slice(0,1)}</Text>
    }else{
      return <Image source={{ uri: image }} style={{borderRadius:50,resizeMode:'contain',height:100,width:100}} />
    }
  };

  if(loading){
    return <SplashScreen/>;
  }else{
    return (
      <View>
    <ScrollView >
    <View style={{marginLeft:20,marginRight:20,marginTop:20}}>
      <View style={{ flex: 1, alignItems:'center', justifyContent:'flex-start',flexDirection:'row'}}>
      <Image_Header/>
      <View style = {{marginLeft:20,marginRight:20}}>
          <Pressable
            style= {styles.button} 
            onPress={pickImage}>
            <Text
            style = {styles.buttonText}
            >Change</Text>
          </Pressable>
      </View>
      <View>
          <Pressable
            style= {[styles.button,{backgroundColor:'white',borderWidth:1,borderColor:'black'}]} 
            onPress={removeImage}>
            <Text
            style = {[styles.buttonText,{color:'black'}]}
            >Remove</Text>
          </Pressable>
      </View>
     </View>
     <View style={{marginTop:20}}>
      <Text>First Name</Text>
      <TextInput
       style={styles.input} 
       value={firstname} 
       onChangeText={onChangefirstname}
       keyboardType='default'
      >
      </TextInput>
      </View>

      <View style={{marginTop:20}}>
      <Text>Last Name</Text>
      <TextInput
       style={styles.input} 
       value={lastname} 
       onChangeText={onChangelastname}
       keyboardType='default'
      >
      </TextInput>
      </View>
      <View style={{marginTop:20}}>
      <Text>Email</Text>
      <TextInput
       style={styles.input} 
       value={email} 
       onChangeText={onChangeemail}
       keyboardType='email-address'
      >
      </TextInput>
      </View>
      <View style={{marginTop:20}}>
      <Text>Phone Number</Text>
      <TextInput
       style={styles.input} 
       value={phone}
       maxLength={14} 
       onChangeText={onChangephone}
       keyboardType='name-phone-pad'
      >
      </TextInput>
      </View>
      
      <View style={{marginTop:20}}>
      <Text style={{fontWeight:'bold',fontSize:18}}>Email Notifications</Text>
        <View style={{flexDirection:'row',marginTop:20}}>
        <Checkbox
          style={styles.checkbox}
          value={order_status}
          onValueChange={set_order_status}
          color={order_status ? '#4630EB' : undefined}
        />
        <Text style = {{ marginLeft:10 }}>Order Status</Text>
       </View>
       <View style={{flexDirection:'row',marginTop:20}}>
        <Checkbox
          style={styles.checkbox}
          value={password_change}
          onValueChange={set_password_change}
          color={password_change ? '#4630EB' : undefined}
        />
        <Text style = {{ marginLeft:10 }}>Password Changes</Text>
       </View>
       <View style={{flexDirection:'row',marginTop:20}}>
        <Checkbox
          style={styles.checkbox}
          value={special_offers}
          onValueChange={set_special_offers}
          color={special_offers ? '#4630EB' : undefined}
        />
        <Text style = {{ marginLeft:10 }}>Special Offers</Text>
       </View>
       <View style={{flexDirection:'row',marginTop:20}}>
        <Checkbox
          style={styles.checkbox}
          value={newsletters}
          onValueChange={set_newsletters}
          color={newsletters ? '#4630EB' : undefined}
        />
        <Text style = {{ marginLeft:10 }}>Newsletter</Text>
       </View>
      </View>

        <View style = {{ marginTop:20 }}>
            <Pressable
               style= {[styles.button,{width:320,height:50,alignSelf:'center',backgroundColor:yellow}]}
               onPress={LogOut} 
              >
              <Text
               style = {[styles.buttonText,{fontSize:18,color:'black',fontWeight:'bold'}]}
              >Log out</Text>
              </Pressable>
        </View>
        <View style = {{ marginTop:20,flexDirection:'row',alignSelf:'center',marginBottom:40}}>
              <Pressable
               style= {[styles.button,{width:120,height:50,alignSelf:'center',backgroundColor:'white',borderWidth:1,borderColor:'black',marginRight:15}]} 
               onPress={DiscardChanges}
              >
              <Text
               style = {[styles.buttonText,{fontSize:12,color:'black',fontWeight:'bold'}]}
              >Discard Changes</Text>
              </Pressable>
              <Pressable
               style= {[styles.button,{width:120,height:50,alignSelf:'center',backgroundColor:green}]}
               onPress={SaveChanges} 
              >
              <Text
               style = {[styles.buttonText,{fontSize:12,color:'white',fontWeight:'bold'}]}
              >Save Changes</Text>
              </Pressable>
        </View>
        </View>
  </ScrollView>
      </View>
    )
 }};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    fontSize:15,
    borderColor:'#EDEFEE',
    backgroundColor:green,
    justifyContent:'center',
    borderWidth: 2,
    borderRadius:10,
    width:60,
    height:40,
  },
  buttonText: {
    textAlign: 'center',
    fontSize:10,
    color:'white'
  },
  input: { 
    height:50,
    width:320, 
    borderWidth: 1,
    borderRadius:10, 
    padding: 10, 
    fontSize:25, 
    borderColor: 'black', 
    backgroundColor: '#EDEFEE',
    alignSelf:'center' 
},
})