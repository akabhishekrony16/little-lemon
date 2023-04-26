import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View,StyleSheet,Pressable,FlatList,Dimensions,Image} from 'react-native';
import SplashScreen from './splashscreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

const green  = '#495E57';
const yellow = '#f4ce14';
const windowWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase('little_lemon')

export default function ConfirmationScreen({navigation}) {
  const [Data,setData] = useState([]);
  const [loading,setloading] = useState(true);
  const [bill,setbill] = useState('');

  const RemoveData = async (value) => {
    try{
      await AsyncStorage.getItem('SavedOrder', (err, result) => {
      if (result !== null) {
        console.log('Data Found', result);
        AsyncStorage.removeItem('SavedOrder');
        console.log('Data Removed', result);
        return navigation.navigate("Search")
      } else {
        console.log('Data Not Found',result);
      }
    });
  }catch(error){
    console.log(error)
  }};
  
  const getData = async () => {
      db.transaction(tx => {
          tx.executeSql(
          'SELECT * FROM Checkout', 
            null, 
          (_, { rows: { _array } }) => {
            setData(_array)
            setbill(_array.map(function(x){return x.billno})[0]);
          }, 
            (_, error) => console.log('Error ', error)
            )
      })
      setloading(false);
    };

useEffect(() => {
    getData();
  }, [loading]);

  function renderMenuItems({ item }) {
  return (
    <View style = {{marginTop:10,marginLeft:10,marginRight:10,flexDirection:'row',justifyContent:'space-between'}}>
      <Text style={{fontWeight:'300',fontSize:14}}>{item.quantity + ' X '  + item.name + ' X $' + item.price}</Text>
      <Text style={{fontWeight:'300',fontSize:14}}>{'$' + parseFloat(item.quantity*item.price).toFixed(2)}</Text>
    </View>
      
  );
};

function Header(){
  return(
  <View style={{flexDirection:'row',justifyContent:'space-between',marginRight:10,marginLeft:10}}>
  <Pressable
  onPress={()=>{navigation.navigate("Checkout")}}
  >
  <Image source={require('../assets/back.png')} style={{ width:30, height:30,resizeMode:'contain',alignSelf:'flex-start'}} />
  </Pressable>
<View style={{flexDirection:'row',justifyContent:'center'}}>
  <Text style={{color:green,fontSize:24,justifyContent:'center',fontWeight:'500'}}>Little Lemon</Text>
  <Image source={require('../assets/little-lemon-logo-grey.png')} style={{ width:50, height:30,resizeMode:'contain',alignSelf:'center'}} />
</View>
<Pressable
  onPress={()=>{navigation.navigate("Home")}}
  >
  <Image source={require('../assets/home.png')} style={{ width:30, height:30,resizeMode:'contain',alignSelf:'flex-start'}} />
  </Pressable>
</View>)
}

if(loading){
    return <SplashScreen/>;
  }else{
  
  return (
    <View style={{ flex:1,marginTop:50}}>
      <Header/>
      <Text style = {{textAlign:'center',backgroundColor:'black',color:'white',marginTop:20,padding:5,fontSize:15,fontWeight:'500'}}>Billing Details</Text>
      <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
      <Text style={{fontWeight:'600',fontSize:16,marginLeft:10,marginTop:15}}>{bill}</Text>
      <Text style={{fontWeight:'600',fontSize:16,marginLeft:10,marginTop:15,marginRight:10}}>Date:24/4/23</Text>
      </View>
      <View style={{borderColor:'#eaebe1',borderWidth:1,marginTop:5,marginLeft:10,marginRight:10}}/>
      <View style = {{flex:0.9}}>
       <FlatList
        data={Data}
        renderItem={renderMenuItems}
        >
       </FlatList>
       </View>
      <View style={{borderColor:'black',borderStyle:'dashed',borderWidth:1,marginTop:10,marginLeft:10,marginRight:10}}/>
      <View style = {{marginTop:10,marginLeft:10,marginRight:10,flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={{fontWeight:'500',fontSize:18}}>Total</Text>
        <Text style={{fontWeight:'500',fontSize:18}}>{'$' + parseFloat(Data.map(function z(y){return y.price*y.quantity}).reduce((a, b) => a + b, 0)).toFixed(2)}</Text>
    </View>
    <Image source={require('../assets/hand.png')} style={{ width:windowWidth,height:windowWidth/2,resizeMode:'contain',alignSelf:'center',marginTop:10}} />
    <Pressable
        style = {{backgroundColor:green,alignSelf:'center',borderRadius:10,marginTop:50,marginBottom:15,width:windowWidth-20,borderColor:'black',borderWidth:1}}
        onPress={RemoveData}
       >
        <Text style = {{fontSize:18,textAlign:'center',padding:10,fontWeight:'500',color:'white'}}>Place Another Order</Text>
      </Pressable>
  </View>
  );
}};