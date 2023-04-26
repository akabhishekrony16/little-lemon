import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View,StyleSheet,Pressable,Image,FlatList,Dimensions} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import SplashScreen from './splashscreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SQLite from 'expo-sqlite';

const green  = '#495E57';
const yellow = '#f4ce14';
const windowWidth = Dimensions.get('window').width;

const IMG_URL = 'https://github.com/akabhishekrony16/little-lemon/blob/main/assets/'

const db = SQLite.openDatabase('little_lemon')

export default function SearchScreen({navigation}) {
  const [Data,setData] = useState([]);
  const [Category,setCategory] = useState([]);
  var   [Filter,setFilter] = useState([]);
  var   [search, onChangesearch] = useState('');
  const [loading,setloading] = useState(true);


  const CategoriesToDisplay = [];

  for(var i = 0;i<Category.length;i++){
    CategoriesToDisplay.push({name:Category[i],status:Filter[i]})
  }

  function convert(){
    var x = Category;
    var y = Filter;
    var z = [];
    for(var i =0;i<y.length;i++){
      if (y[i] == true){
          z.push(x[i])
      }
    };
    var final = "";
    for(i=0;i<z.length;i++){
      final +=`"` + z[i] + `"` + ",";
    }
    final = '(' + final.slice(0,-1) + ')';
    return final;
      };
  
  function renderFlatList({ item }) {
    function SelectTitle(){
      var z = [];
      var x = Category.indexOf(item.name);
      for(var j =0;j<Filter.length;j++){
        if (j==x){
          z.push(!Filter[j])
        }else{
          z.push(Filter[j])
        }
      }
      setFilter(z);
    };
    return (
      <Pressable
      style = {{backgroundColor:item.status?green:"#eaebe1",marginRight:20,borderRadius:25,marginTop:10,marginBottom:15}}
      onPress={SelectTitle}
      >
        <Text style = {{fontSize:15,padding:10,color:item.status?'white':'black'}}>{item.name}</Text>
      </Pressable>
    );
};

const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@Order_Key', JSON.stringify(value))
    } catch (error) {
      console.log(error)
    }
  }

function renderMenuItems({ item }) {
    function AddItem(){
            storeData({name:item.name,
            description:item.description,
            price:item.price,
            category:item.category,
            image_uri:item.image});
            return (navigation.navigate("Order"))
      
        };
  
    return (
    <View style = {{marginTop:10,marginLeft:10,marginRight:10}}>
      <Text style={{fontWeight:'700'}}>{item.name}</Text>
      <View style ={{flexDirection:'row',justifyContent:'space-between',marginTop:10,marginBottom:10}}>
        <Text style={{fontWeight:'200',width:220}}>{item.description}{"\n"}{"\n"}
        <Text style={{fontWeight:'700'}} >{'$' + item.price}</Text>
        </Text> 
        <Image style={StyleMain.MenuImage} source={{uri:IMG_URL + item.image + '?raw=true'}} />
      </View>
      <Pressable
      style = {{backgroundColor:yellow,borderRadius:10,marginTop:10,marginBottom:15,width:80,borderColor:'black',borderWidth:1}}
      onPress={AddItem}
      >
        <Text style = {{fontSize:15,textAlign:'center',padding:5}}>Add</Text>
      </Pressable>
      <View style={{borderColor:'#eaebe1',borderWidth:1}}/>
    </View>
      
  );
};

const getData = async () => {
        db.transaction(tx => {
      if (Filter.includes(true)){
            if(search.length>0){

              tx.executeSql(
                `select * from Menu where category in ("starters") and name like "%f%";`.replace("%f%","%" + search + "%").replace('("starters")',convert()), 
                  null, 
                (_, { rows: { _array } }) => {
                  setData(_array);
                }, 
                  (_, error) => console.log('Error ', error)
                  )


            }else{
                tx.executeSql(
                  'SELECT * FROM Menu WHERE category in ("starters")'.replace('("starters")',convert()), 
                    null, 
                  (_, { rows: { _array } }) => {
                    setData(_array);
                  }, 
                    (_, error) => console.log('Error ', error)
                    )
                 }
        }else if(search.length>0){

          tx.executeSql(
            `select * from Menu where name like "%f%";`.replace("%f%","%" + search + "%"), 
              null, 
            (_, { rows: { _array } }) => {
              setData(_array);
            }, 
              (_, error) => console.log('Error ', error)
              )
            }
        else{
        tx.executeSql(
        'SELECT * FROM Menu', 
          null, 
        (_, { rows: { _array } }) => {
          setData(_array);
          setCategory([... new Set(_array.map((x)=>{return x['category']}))]);
          for (var i = 0; i < Category.length; i++) {
            Filter.push(false)
          };
          setFilter(Filter);
        }, 
          (_, error) => console.log('Error ', error)
          )
          };
    setloading(false);
        })};

  useEffect(() => {
    getData();
  }, [Filter,search]);

function Header(){
    return(
    <View style={{flexDirection:'row',justifyContent:'space-between',marginRight:10,marginLeft:10}}>
    <Pressable
    onPress={()=>{navigation.navigate("Home")}}
    >
    <Image source={require('../assets/back.png')} style={{ width:30, height:30,resizeMode:'contain',alignSelf:'flex-start'}} />
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
        <View style = {{marginLeft:10,marginRight:10}}>
        <TextInput
        style = {StyleMain.input}
        value={search}
        onChangeText={onChangesearch}
        >
        </TextInput>
            <FlatList
            horizontal={true}
            data={CategoriesToDisplay}
            renderItem={renderFlatList}
            >
        </FlatList>
        </View>
            <FlatList
                data={Data}
                renderItem={renderMenuItems}
                >
            </FlatList>
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
  HeaderImage:{
    height:140,
    width: 130,
    resizeMode:'cover',
    borderRadius:30,
  },
  MenuImage:{
    height:100,
    width:100,
    resizeMode:'cover',
    borderRadius:15,
    borderColor:yellow,
    borderWidth:2
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
  width:windowWidth - 20, 
  borderWidth: 1,
  borderRadius:10, 
  fontSize:15, 
  borderColor: 'black', 
  backgroundColor: '#eaebe1',
  alignSelf:'center',
  margin:20,
  padding:10
},
})

