import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View,StyleSheet,Pressable,Image,FlatList,ScrollView,SafeAreaView} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import SplashScreen from './splashscreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SQLite from 'expo-sqlite';

const green  = '#495E57';
const yellow = '#f4ce14';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

const IMG_URL = 'https://github.com/akabhishekrony16/little-lemon/blob/main/assets/'

const db = SQLite.openDatabase('little_lemon')

export default function HomeScreen({navigation}) {
  const [image, setImage] = useState(null);
  const [Data,setData] = useState([]);
  const [Category,setCategory] = useState([]);
  var   [Filter,setFilter] = useState([]);
  var   [search, onChangesearch] = useState('');
  const [loading,setloading] = useState(true);
  const [firstname, onChangefirstname] = useState('');
  const [lastname, onChangelastname] = useState('');

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
      style = {{backgroundColor:item.status?yellow:"#EDEFEE",marginRight:20,borderRadius:25,marginTop:10,marginBottom:15}}
      onPress={SelectTitle}
      >
        <Text style = {{fontSize:15,padding:10}}>{item.name}</Text>
      </Pressable>
    );
};




function renderMenuItems({ item }) {
  return (
    <View style = {{marginTop:10}}>
      <Text style={{fontWeight:'700'}}>{item.name}</Text>
      <View style ={{flexDirection:'row',justifyContent:'space-between',marginTop:10,marginBottom:10}}>
        <Text style={{fontWeight:'200',width:220}}>{item.description}{"\n"}{"\n"}
        <Text style={{fontWeight:'700'}} >{'$' + item.price}</Text>
        </Text> 
        <Image style={StyleMain.MenuImage} source={{uri:IMG_URL + item.image + '?raw=true'}} />
      </View>
      <View style={{borderColor:'#EDEFEE',borderWidth:1}}/>
    </View>
      
  );
};

const getData = async () => {
  
  try {
    const value = await AsyncStorage.getItem('@storage_Key')
    if(value !== null) {
      const json = JSON.parse(value)
      setImage(json['image_uri'])
      onChangefirstname(json['first_name'])
      onChangelastname(json['last_name']) 
    }
  } catch(error) {
    console.log(error)
  }
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    if (json !== null){
      db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS Menu');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Menu(name VARCHAR(100) PRIMARY KEY NOT NULL,price INTEGER,description VARCHAR(100),image VARCHAR(100),category VARCHAR(100))');
        for(var i=0;i<json["menu"].length;i++){
          tx.executeSql('INSERT INTO Menu (name,price,description,image,category) VALUES (?,?,?,?,?)', [json["menu"][i]['name'],json["menu"][i]['price'],json["menu"][i]['description'],json["menu"][i]['image'],json["menu"][i]['category']]);
        }
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
        
      })} 
  }catch(error){
    console.log(error)
  }finally{

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
      
    })
    }
    setloading(false);
  }; 

  useEffect(() => {
    getData();
  }, [image,Filter,search]);

  function Image_Header(){
    if(image=== null){
      return <Text  style = {{backgroundColor:'#10b6c2',textAlign:'center',padding:18,borderRadius:30,marginLeft:10,marginBottom:5,color:'white',fontSize:15,width:60,height:60}} >{firstname.slice(0,1) + lastname.slice(0,1)}</Text>
    }else{
      return <Image source={{ uri: image }} style={{ width:60, height:60,borderRadius:30,resizeMode:'contain',alignSelf:'flex-start',marginLeft:10,marginBottom:5}} />
    }
  }

  if(loading){
    return <SplashScreen/>;
  }else{
  
  return (
    <View style={{ flex:1,backgroundColor: 'white'}}>
        <ScrollView>
        <View>
        <Pressable
        onPress={()=>{navigation.navigate('Profile')}}
        >
        <Image_Header/>
        </Pressable>
     </View>
      
      <View style={{ flex:0.7,backgroundColor:green}}>
        <View style = {{marginLeft:10,marginRight:10}}>
            <Text
            style={StyleMain.HeaderContainer}>
              Little Lemon{"\n"}
              <Text style = {StyleMain.SubHeaderContainer}>Chicago</Text>
            </Text>
            <View style ={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style ={{fontSize:16,marginTop:30,color:'white',fontWeight:'200',width:180}}>
                We are a family owned Mediterranean restaurant 
                focused on traditional recipes reserved with a modern twist...
            </Text>
                <Image style={StyleMain.HeaderImage} source={require('../assets/header.png')} />
            </View>
            <View style = {{flexDirection:'row'}}>
              <Image style={StyleMain.logo} source={require('../assets/search.png')} />
              <TextInput
              style = {StyleMain.input}
              value = {search}
              onChangeText={onChangesearch}
              >
              </TextInput>
            </View>
        </View>
     </View>
      
    <View style = {{marginLeft:10,marginRight:10}}>
      <Text
        style={{fontSize:15,fontWeight:'bold',marginTop:10}}>
          ORDER FOR DELIVERY!
      </Text>
        <FlatList
          horizontal={true}
          data={CategoriesToDisplay}
          renderItem={renderFlatList}
          >
       </FlatList>
     </View>
      
      <View style={{borderColor:'#EDEFEE',borderWidth:1,marginLeft:10,marginRight:10}}/>
      
        <View style={{flex:0.45,marginLeft:10,marginRight:10}}>
        <FlatList
          data={Data}
          renderItem={renderMenuItems}
          >
       </FlatList>
        </View>
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
  width:250, 
  borderWidth: 1,
  borderRadius:10, 
  fontSize:25, 
  borderColor: 'black', 
  backgroundColor: '#EDEFEE',
  alignSelf:'center',
  marginTop:10,
  marginLeft:10,
  marginBottom:10
},
})

