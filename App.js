import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TouchableHighlight,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { theme } from './color';
import AsyncStorage from '@react-native-async-storage/async-storage';


const STORAGE_KEY = "@toDos"; 

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {loadToDos()
  },[]);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const saveToDos = async (toSave) => {
    const s = JSON.stringify(toSave);
    await AsyncStorage.setItem(STORAGE_KEY, s);
  };
  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };
 
  const onChangeText = (playload) => setText(playload);
  const addToDo = async () => {
    if (text=== "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: {text, working},
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  }
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do","Are you sure", [
      {text:"Cancel"},
      {text:"I'm sure",
      style:"destructive",
      onPress: () => {
        const newToDos = {...toDos}
        delete newToDos[key]
        setToDos(newToDos);
         saveToDos(newToDos);
      }}
    ])
    return;

    
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color:working ? "white":theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color:!working ? "white":theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType="done"
          value={text}
          placeholder={working ? "Add a To Do" : "Where do you want yo go?" } 
          style={styles.input}/>
          <ScrollView>
            {Object.keys(toDos).map((key) => (
              toDos[key].working === working ? <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={()=> deleteToDo(key)}>
                  <Text style={styles.delbtn}>X</Text>
                </TouchableOpacity>
              </View> : null
            ))}
          </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header:{
    justifyContent:"space-between",
    flexDirection:"row",
    marginTop:100,
  },
  btnText: {
    fontSize:38,
    fontWeight:"600",
  },
  input: {
    backgroundColor:"white",
    paddingVertical:15,
    paddingHorizontal:20,
    borderRadius:30,
    marginVertical:20,
    fontSize:18,
  },
  toDo: {
    backgroundColor:theme.grey,
    marginBottom:20,
    paddingVertical:20,
    paddingHorizontal:40,
    borderRadius:15,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    
  },
  toDoText : {
    color: "white",
    fontSize:16,
    fontWEight:"500",
  },
  delbtn : {
    color:"white",
  }
});
