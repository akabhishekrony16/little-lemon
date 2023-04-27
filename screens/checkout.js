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

export default function CheckoutScreen({navigation}) {
  const [Data,setData] = useState([]);
  const [loading,setloading] = useState(true);
  const [id,setId] = useState('');

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

  function GenerateId(){
    try{
      AsyncStorage.getItem('SavedId', (err, result) => {
      if (result !== null) {
        console.log('Data Found', result)
        const json = JSON.parse(result)
        var newid = json["Id"]
        // let n = 4
        // var next = (parseInt(id.slice(1,)) + 1).toString();
        // var zero = '0'
        // for (var i =0;i<n-next.length;i++){
        //     zero = zero + '0'
        // }
        setId(newid);
        return console.log('Id',newid)
      } else {
        console.log('Data Not Found',result)
        setId("M00001")
        AsyncStorage.setItem('SavedId', JSON.stringify({Id:"M00001"}));
        return console.log('Id Generated',"M00001")
      }
    });
  }catch(error){
    console.log(error)
  }};


  const getData = async () => {
    GenerateId();
    try{
      const value = await AsyncStorage.getItem('SavedOrder')
        if(value !== null) {
          console.log("Data Found",value)
          const json = JSON.parse(value);
          setData(json)
        }else{
          console.log("Data not Found")
        }
      
    }catch(error){
      console.log(error)
    }
    setloading(false);
      };

useEffect(() => {
    getData();
  }, [loading]);

  function renderMenuItems({ item }) {
  
  const RemoveItem = async () => {
    try{
      await AsyncStorage.getItem('SavedOrder', (err, result) => {
      if (result !== null) {
        console.log('Data Found', result);
        const json = JSON.parse(result);
        console.log(json,item.name);
        var newValue = json.filter(function (y){return y.name !== item.name});
        console.log(newValue);
        AsyncStorage.setItem('SavedOrder', JSON.stringify(newValue));
        return setloading(true);
      } else {
        console.log('Data Not Found',result);
      }
    });
  }catch(error){
    console.log(error)
  }};

  return (
    <View style = {{marginTop:10,marginLeft:10,marginRight:10}}>
      <Text style={{fontWeight:'700',fontSize:18}}>{item.name}</Text>
      <Text style={{fontWeight:'300',marginTop:5}}>{'Price: ' + '$' + parseFloat(item.price).toFixed(2)}</Text>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      <Text style={{fontWeight:'300'}}>{'Qty: ' + item.qty}</Text>
      <Pressable
        style = {{backgroundColor:'#c44935',alignSelf:'center',marginLeft:10,borderRadius:5,width:80,borderColor:'black',borderWidth:1}}
        onPress={RemoveItem}
       >
        <Text style = {{fontSize:10,textAlign:'center',padding:8,fontWeight:'500',color:'white'}}>Remove Item</Text>
      </Pressable>   
      </View>
      <Text style={{fontWeight:'400',marginRight:10}}>{'Amount: '+ '$' + parseFloat(item.qty*item.price).toFixed(2)}</Text>
      <View style={{borderColor:'#eaebe1',borderWidth:1,marginTop:5}}/>
    </View>
      
  );
};

function SaveData(){
  setloading(true);
  db.transaction(tx => {
    tx.executeSql('DROP TABLE IF EXISTS Checkout');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Checkout(id INTEGER PRIMARY KEY AUTOINCREMENT,name VARCHAR(100),price INTEGER,quantity VARCHAR(100),billno VARCHAR(100))');
    for(var i=0;i<Data.length;i++){
      tx.executeSql('INSERT INTO Checkout (name,price,quantity,billno) VALUES (?,?,?,?)', [Data[i]['name'],Data[i]['price'],Data[i]['qty'],id]);
    }});
  setloading(false);
  return navigation.navigate("Confirmation")
}

function Header(){
  return(
  <View style={{flexDirection:'row',justifyContent:'space-between',marginRight:10,marginLeft:10,marginTop:40}}>
  <Pressable
  onPress={()=>{navigation.navigate("Search")}}
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
  <Image source={require('../assets/home.png')} style={{ width:30, height:25,resizeMode:'contain',alignSelf:'flex-start'}} />
  </Pressable>
</View>)
};

if(loading){
    return <SplashScreen/>;
  }else{
  
  return (
    <View style={{ flex:1}}>
      <Header/>
      <Text style = {{textAlign:'center',backgroundColor:green,color:yellow,padding:5,marginTop:20,fontSize:15,fontWeight:'500'}}>Order Details</Text>
       <View style = {{flex:0.9}}>
       <FlatList
        data={Data}
        renderItem={renderMenuItems}
        >
       </FlatList>
       </View>
       <View style={{borderColor:'black',borderStyle:'dashed',borderWidth:1,marginTop:20,marginLeft:10,marginRight:10}}/>
       <View style={{flexDirection:'row',justifyContent:'space-between'}}>
       <Pressable
        style = {{backgroundColor:'#e4eaeb',alignSelf:'center',marginTop:16,marginLeft:10,borderRadius:5,width:100,borderColor:green,borderWidth:1}}
        onPress={()=>{navigation.navigate("Search")}}
       >
        <Text style = {{fontSize:12,textAlign:'center',padding:5,fontWeight:'700'}}>
        <Text style = {{fontSize:18}}>+</Text>
        Add Items</Text>
      </Pressable>
       <Text style={{marginLeft:10,marginRight:10,marginTop:20,fontWeight:'700',textAlign:'right',fontSize:20}}>
       {'Total: ' + '$' + parseFloat(Data.map(function z(y){return y.price*y.qty}).reduce((a, b) => a + b, 0)).toFixed(2)}
        </Text>
       </View>
       
       <View style={{borderColor:'#EDEFEE',borderWidth:1,marginTop:20,marginLeft:10,marginRight:10}}/>

      <View style = {{flexDirection:'row',justifyContent:'space-between',margin:10,marginTop:40}}>
        <Pressable
        style = {{backgroundColor:Data.length>0?'black':'#D9D8D4',borderRadius:5,width:windowWidth/2-20,borderColor:Data.length>0?'white':'black',borderWidth:1}}
        onPress={RemoveData}
        disabled={Data.length>0?false:true}
        >
        <Text style = {{color:Data.length>0?'white':'black',padding:10,textAlign:'center'}}>Cancel</Text>
        </Pressable>
        <Pressable
        style = {{backgroundColor:Data.length>0?'white':'#D9D8D4',borderRadius:5,width:windowWidth/2-20,borderColor:'black',borderWidth:1}}
        onPress={SaveData}
        disabled={Data.length>0?false:true}
        >
        <Text style = {{color:'black',padding:10,textAlign:'center'}}>Checkout</Text>
        </Pressable>
    </View>
    </View>
  );
}};