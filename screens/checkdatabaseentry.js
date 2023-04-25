import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View,StyleSheet,Pressable,FlatList,Dimensions} from 'react-native';
import SplashScreen from './splashscreen';

import * as SQLite from 'expo-sqlite';

const green  = '#495E57';
const yellow = '#f4ce14';
const windowWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase('little_lemon')

export default function CheckDatabaseScreen({navigation}) {
  const [Data,setData] = useState([]);
  const [loading,setloading] = useState(true);
  const [bill,setbill] = useState('');

  const getData = async () => {
    db.transaction(tx => {
          tx.executeSql(
          'SELECT * FROM Checkout', 
            null, 
          (_, { rows: { _array } }) => {
            setData(_array);
            setbill(_array.map(function z(x){return x.billno})[0])
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
      <Text style={{fontWeight:'300',fontSize:14}}>{'$' + item.quantity*item.price}</Text>
    </View>
      
  );
};

if(loading){
    return <SplashScreen/>;
  }else{
  
  return (
    <View style={{ flex:1,backgroundColor: 'white'}}>
      <Text style = {{textAlign:'center',backgroundColor:'black',color:'white',padding:5,fontSize:15,fontWeight:'500'}}>Billing Details</Text>
      <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
      <Text style={{fontWeight:'600',fontSize:16,marginLeft:10,marginTop:15}}>{bill}</Text>
      <Text style={{fontWeight:'600',fontSize:16,marginLeft:10,marginTop:15,marginRight:10}}>Date:24/4/23</Text>
      </View>
      <View style={{borderColor:'#EDEFEE',borderWidth:1,marginTop:5,marginLeft:10,marginRight:10}}/>
      <View>
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

