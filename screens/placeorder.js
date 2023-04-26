import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View,StyleSheet,Pressable,Image,FlatList,Dimensions} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import SplashScreen from './splashscreen';

import Validate_Quantity from '../utilities/quantityvalidation';

import AsyncStorage from '@react-native-async-storage/async-storage';


const green  = '#495E57';
const yellow = '#f4ce14';
const windowWidth = Dimensions.get('window').width;

const IMG_URL = 'https://github.com/akabhishekrony16/little-lemon/blob/main/assets/'

export default function OrderScreen({navigation}) {
  const [Data,setData] = useState([]);
  const [Qty, onChangeQty] = useState('');
  const [loading,setloading] = useState(true);



  const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('@Order_Key')
        if(value !== null) {
          const json = JSON.parse(value);
          setData(json);
        }
      } catch(error) {
        console.log(error)
      }
      setloading(false);
    };

  useEffect(() => {
    getData();
  }, []);

  const storeData = async (value) => {
    try{
      await AsyncStorage.getItem('SavedOrder', (err, result) => {
      if (result !== null && result.length>0) {
          console.log('Data Found', result)
          const x = JSON.parse(result)
          console.log(x)
          var newValue = x.filter(function (y){return y.name !== value.name})
          var finalValue = newValue.concat([value])
          AsyncStorage.setItem('SavedOrder', JSON.stringify(finalValue));
          console.log('Data Added',finalValue); 
       } else {
        console.log('Data Not Found',result);
        AsyncStorage.setItem('SavedOrder', JSON.stringify([value]));
        console.log('Data Added',value);
      }
    });
  }catch(error){
    console.log(error)
  }
  }

  function PlaceOrder(){
    storeData({name:Data['name'],price:Data['price'],qty:Qty})
    return navigation.navigate('Checkout')
  }



 
function Header(){
    return(
    <View style={{flexDirection:'row',justifyContent:'space-between',marginRight:10,marginLeft:10}}>
    <Pressable
    onPress={()=>{navigation.navigate("Search")}}
    >
    <Image source={require('../assets/back.png')} style={{ width:30, height:30,resizeMode:'contain',alignSelf:'flex-start'}} />
    </Pressable>
    <Pressable
    onPress={()=>{navigation.navigate("Home")}}
    >
    <Image source={require('../assets/home.png')} style={{ width:30, height:25,resizeMode:'contain',alignSelf:'flex-start'}} />
    </Pressable>
    <Pressable
    onPress={()=>{navigation.navigate("Checkout")}}
    >
    <Image source={require('../assets/basket.png')} style={{ width:30, height:30,resizeMode:'contain',alignSelf:'flex-start'}} />
    </Pressable>
 </View>)
}

  
if(loading){
    return <SplashScreen/>;
  }else{
  
  return (
    <View style={{ flex:1,marginTop:50}}>
      <Header/>
      <ScrollView>
        <Image style={StyleMain.MenuImage} source={{uri:IMG_URL + Data['image_uri'] + '?raw=true'}} />
        <Text  style={{fontWeight:'700',fontSize:25,marginLeft:10,marginTop:10}}>{Data['name']}</Text>
        <Text style={{fontWeight:'300',fontSize:15,marginTop:5,marginLeft:10,marginRight:10}}>{Data['description']}</Text>
        <Text style={{fontWeight:'500',fontSize:18,marginLeft:10,marginTop:10}}>{'$' + Data['price']}</Text>
        <View style={{flexDirection:'row',marginTop:20,marginLeft:10}}>
        <Text  style={{fontWeight:'500',fontSize:18,marginTop:3}}>
         Qty:
        </Text>
        <TextInput 
        style={StyleMain.input}
        keyboardType= 'numeric'
        value={Qty}
        onChangeText={onChangeQty}
        maxLength={1}
        ></TextInput>
        <Text style = {{marginTop:10,fontWeight:'300',fontSize:10,marginLeft:10}}>(**Quantity as Per Servings)</Text>
        </View>
        <Pressable
        style = {{backgroundColor:Validate_Quantity(Qty)?green:'#D9D8D4',alignSelf:'center',borderRadius:10,marginTop:50,marginBottom:15,width:windowWidth-20,borderColor:'black',borderWidth:1}}
        disabled={!Validate_Quantity(Qty)}
        onPress={PlaceOrder}
       >
        <Text style = {{fontSize:18,textAlign:'center',padding:10,fontWeight:'500',color:Validate_Quantity(Qty)?'white':'black',}}>Place Order</Text>
      </Pressable>
      </ScrollView>
        
    </View>
  );
}};

const StyleMain = StyleSheet.create({
  HeaderContainer:{
    paddingTop:5,
    fontSize:45,
    color:yellow,
    textAlign:'left',
    
  },
  SubHeaderContainer:{
    fontSize:30,
    color:'white',
    textAlign:'left',
    fontWeight:'300',
    
  },
  container:{
    paddingTop:5,
    fontSize: 30,
    color:'black',
    textAlign:'center',
  },
  MenuImage:{
    height:windowWidth-60,
    width:windowWidth-20,
    resizeMode:'cover',
    alignSelf:'center',
    borderRadius:15,
    borderWidth:5,
    borderColor:yellow,
    marginTop:20
  },
  SearchCOntainer:{
    flexDirection: 'row',
  },
  logo: {
    height:25,
    width:25,
    resizeMode: 'contain',
    marginTop:20
 },
 input: { 
  height:40,
  width:80, 
  borderWidth: 1,
  borderRadius:5, 
  fontSize:15, 
  borderColor: 'black', 
  backgroundColor: '#EDEFEE',
  marginLeft:5,
  padding:10
},
})

