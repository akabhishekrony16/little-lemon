import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View,StyleSheet,Pressable,FlatList,Dimensions} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
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
        return navigation.navigate("Search")
      }
    });
  }catch(error){
    console.log(error)
    return navigation.navigate("Search")
  }
  };


  const getData = async () => {
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
        setloading(true);
        console.log('Data Found', result);
        const json = JSON.parse(result);
        console.log(json,item.name);
        var newValue = json.filter(function (y){return y.name !== item.name});
        console.log(newValue);
        AsyncStorage.setItem('SavedOrder', JSON.stringify(newValue));
      } else {
        console.log('Data Not Found',result);
      }
    });
  }catch(error){
    console.log(error)
  }
  setloading(false);
  };
  
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
      <View style={{borderColor:'#EDEFEE',borderWidth:1,marginTop:5}}/>
    </View>
      
  );
};

function SaveData(){
  setloading(true);
  db.transaction(tx => {
    tx.executeSql('DROP TABLE IF EXISTS Checkout');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Checkout(id INTEGER PRIMARY KEY AUTOINCREMENT,name VARCHAR(100),price INTEGER,quantity VARCHAR(100),billno VARCHAR(100))');
    for(var i=0;i<Data.length;i++){
      tx.executeSql('INSERT INTO Checkout (name,price,quantity,billno) VALUES (?,?,?,?)', [Data[i]['name'],Data[i]['price'],Data[i]['qty'],"M-00001"]);
    }});
  setloading(false);
  return navigation.navigate("Checkdatabase")
}

if(loading){
    return <SplashScreen/>;
  }else{
  
  return (
    <View style={{ flex:1,backgroundColor: 'white'}}>
      <Text style = {{textAlign:'center',backgroundColor:green,color:yellow,padding:5,fontSize:15,fontWeight:'500'}}>Order Details</Text>
       <FlatList
        data={Data}
        renderItem={renderMenuItems}
        >
       </FlatList>
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
       
       <Pressable
        style = {{backgroundColor:'black',alignSelf:'flex-end',borderRadius:5,marginTop:30,marginRight:10,width:100,borderColor:'black',borderWidth:1}}
        onPress={RemoveData}
       >
        <Text style = {{fontSize:10,textAlign:'center',padding:10,fontWeight:'500',color:'white'}}>Cancel Order</Text>
      </Pressable>
      
      <View style={{borderColor:'#EDEFEE',borderWidth:1,marginTop:20,marginLeft:10,marginRight:10}}/>
      
      <Pressable
        style = {{backgroundColor:Data.length>0?yellow:'#e4eaeb',alignSelf:'flex-end',borderRadius:5,marginTop:30,marginRight:10,marginBottom:20,width:windowWidth-20,borderColor:green,borderWidth:1}}
        onPress={SaveData}
        disabled = {Data.length>0?false:true}
       >
        <Text style = {{fontSize:18,textAlign:'center',padding:10,fontWeight:'500'}}>Checkout</Text>
      </Pressable>
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
    borderColor:'#EBEAD3',
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

