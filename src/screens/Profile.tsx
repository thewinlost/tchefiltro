import React, { useState, useEffect } from "react";
import {useNavigation} from "@react-navigation/core";
import { TextInputMask } from 'react-native-masked-text'
import { View, Text, StyleSheet, Image, Button, Pressable, AlertButton, TouchableOpacity, Alert, Modal, KeyboardAvoidingView,} from "react-native";
import {TextInput} from "react-native-rapi-ui";
// import firebaseConfig from "./firebase";
// import firebase from "firebase/compat/app";
// import "firebase/compat/storage";
// const app = firebase.initializeApp(firebaseConfig);
import { storage, auth, firestore } from "../navigation/firebase";
import { FlatGrid } from 'react-native-super-grid';
import { getStorage, uploadBytes } from "firebase/storage"; //access the storage databaSse
import * as ImagePicker from "expo-image-picker";
import {Categoria} from '../model/Categoria';
import {Usuario} from '../model/Usuario';
import ListarCategoria from './ListarCategoria';
import { arrayRemove } from "firebase/firestore";


const Profile= function() { //antes era só function profile
  const [modalListaVisible, setModalListaVisible] = useState(false);
  const [itemLista, setItemLista]=
  useState({...itemLista,
    id:"",
    categoria:""});
  const [usuario, setUsuario] = useState<Partial<Usuario>>({});
  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [especialidades, setEspecialidades] = useState<Partial<Categoria>[]>([{}]);

  const escolhefoto = ()=>{

  Alert.alert(
    "Alert Title",
    "My Alert Msg",
    [
      {
        text: "Camera",
        onPress: () => openCamera(),
        style: "default",
      },
    
      {
        text: "Abrir galeria",
        onPress: () => showImagePicker(),
        style: "cancel",
      },

    ],
    {
      cancelable: true,
      onDismiss: () => {}
    }
  );
  
  }
  useEffect(() => {
    const subscriber = firestore
      .collection('Usuario')
      .doc(auth.currentUser.uid)
      .onSnapshot(documentSnapshot => {
        setUsuario(documentSnapshot.data());
        if (usuario.urlfoto==null){
          setPickedImagePath("")
        }else {
          setPickedImagePath(usuario.urlfoto)
        }
      });
    return () => subscriber();
  }, [usuario.urlfoto]);
  
  useEffect(() => {
    const subscriber = firestore.collection('Usuario')
    .doc(auth.currentUser.uid).collection('Especialidade')
      .onSnapshot(querySnapshot => {
        const especialidades = [];
        querySnapshot.forEach(documentSnapshot => {
          especialidades.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setEspecialidades(especialidades);
      
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const salvar= ()=>{
    const reference = firestore.collection("Usuario").doc(auth.currentUser.uid);
    reference.update({
       id: reference.id,
       nome: usuario.nome,
       telefone: usuario.telefone,
       descricao: usuario.descricao,
       urlfoto:usuario.urlfoto,
     }).then(()=>{alert('Salvo com sucesso')}).catch(error=>alert(error.message))
  }


  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
     // const storage = app.storage();
      const ref = storage.ref(`imagens/profile/IMAGE-${auth.currentUser.uid}.jpg`);
    //  const ref = storage.ref(`imagens/IMAGE-${Date.now()}.jpg`);

      const img = await fetch(result.uri);
      const bytes = await img.blob();
      const fbResult = await uploadBytes(ref, bytes);

      const paraDonwload= await storage.ref(fbResult.metadata.fullPath).getDownloadURL();

      console.log(result.uri);
      console.log("firebase url :", fbResult.metadata.fullPath);
      const reference = firestore.collection("Usuario").doc(auth.currentUser.uid);
      reference.update({ urlfoto: paraDonwload});
    }
  };

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      //const storage = storage.storage();
      const ref = storage.ref(`imagens/profile/IMAGE-${auth.currentUser.uid}.jpg`);
      const img = await fetch(result.uri);
      const bytes = await img.blob();
      const fbResult = await uploadBytes(ref, bytes);
      console.log(result.uri);

      const paraDonwload= await storage.ref(fbResult.metadata.fullPath).getDownloadURL();

      console.log("firebase url :", fbResult.metadata.fullPath);
      const reference = firestore.collection("Usuario").doc(auth.currentUser.uid);
      reference.update({ urlfoto: paraDonwload});
    }
      
  };
  const LongClick=async (item)=>{
    const reference = await firestore.collection("Usuario").doc(auth.currentUser.uid).collection('Especialidade').doc(item.id).delete();
    await firestore.collection("Usuario").doc(auth.currentUser.uid)
    .update ({
      listasimples:
        arrayRemove (item.categoria+" ")
    })
}

const ShortClick=(item)=>{
alert('Para excluir a categoria pressione por 3 segundos');

}


  return (
    <View style={styles.screen}>

        {/* MODAL DA LISTA */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalListaVisible}
        onRequestClose={() => {
          //Alert.alert('Modal Fechado.');
          setModalListaVisible(!modalListaVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          
        <ListarCategoria setModalListaVisible={setModalListaVisible}
            setItemLista={setItemLista}>
          
        </ListarCategoria>
          </View>
        </View>
      </Modal>


    
      <Pressable onPress={()=> escolhefoto()}>

      <View style={styles.imageContainer}>
          {pickedImagePath !== "" && (
          
              <Image source={{ uri: pickedImagePath }} style={styles.image} />
           )}
          {pickedImagePath === "" && (
          
              <Image source={require("../../assets/camera.png")}
              style={styles.image} />
            )}
      </View>
      </Pressable>
          <TextInput 
          containerStyle={{ marginTop: 10, marginRight: 30, marginLeft:30, marginBottom: 15}}
          placeholder="Nome"
          value={usuario.nome}
          onChangeText={text => setUsuario({...usuario, nome: text})}
          keyboardType="default"
        />
        <TextInputMask
          type={'cel-phone'}
          style={{ marginTop: 5, padding: 9, justifyContent: "center", borderColor: "#d8d8d8", borderRadius: 8,  alignItems: "center", borderWidth:1, marginRight: 30, marginLeft:30, marginBottom: 15, backgroundColor:'white'}}
          placeholder="Telefone"
          value={usuario.telefone} 
          onChangeText={text => setUsuario({...usuario, telefone: text})}
          keyboardType="phone-pad"
        />
        
        <TextInput 
          containerStyle={{ marginTop: 5, marginRight: 30, marginLeft:30, marginBottom: 10}}
          placeholder="Descrição"
          multiline={true} 
          value={usuario.descricao} 
          onChangeText={text => setUsuario({...usuario, descricao: text})}
          keyboardType="default"
        />
      
      <Pressable style={[styles.button, styles.buttonOpen]} 
      onPress={() => setModalListaVisible(true)}>
        <Text style={styles.textStyle}>Selecionar especialidades</Text>
      </Pressable>
      

     
      <FlatGrid
      itemDimension={93}
      data={especialidades} 
      style={styles.gridView}
      spacing={0.6}
      renderItem={({ item }) => (
        <Pressable
                style={({ pressed }) => [{ backgroundColor: pressed ? '#9ab4a0' : 'transparent' }, styles.listItem]}
                onLongPress={() => LongClick(item)}
                onPress={() => { ShortClick(item) }}
         >
        <View style={[styles.itemContainer, { backgroundColor: '#9ab4a0'}]}>
         <Text style={styles.text}>{item.categoria}</Text>
         
        </View>
        </Pressable>
      )
      }/>

      
    
      <TouchableOpacity
          style={styles.loginScreenButton}
          onPress={() => {
            salvar();
        }}>
          <Text style={styles.loginText}>Salvar alterações</Text>
      </TouchableOpacity>
     
     
    </View>
  );
}

// Kindacode.com
// Just some styles
const styles = StyleSheet.create({
  
  screen: {
    flex: 1,
    marginTop: 50,
    marginBottom: 25
    
  },
  imageContainer: {
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
   listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    justifyContent: "center"

    
},
  buttonContainer: {
    width: 300,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: '#0df023',
    alignItems: "center",
  },
  loginScreenButton:{
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#0d4023',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    width: 350,
   
  },
  loginText:{
      color:'#fff',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10,
      //fontWeight: 'bold',
      //fontSize: 18,
      justifyContent: "center",
      alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
    justifyContent: "center",
 
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#0d4023',
    justifyContent: "center",
    alignItems: "center",
    
  },
  buttonOpen: {
    backgroundColor: '#0d4023',
    justifyContent: 'center',     
    borderRadius: 5,
    padding: 3,
    height: 40,
    width: 350,
    marginTop: 15, 
    marginRight: 30, 
    marginLeft:30,
    marginBottom: 15,
    alignItems: "center"
  },
  buttonClose: {
    backgroundColor: '#0d4023',
    justifyContent: "center",
    alignItems: "center"
  },
  textStyle: {
    color: 'white',
    textAlign: 'left',
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    justifyContent: "center",
    alignItems: "center"
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    justifyContent: "center",
    alignItems: "center"

 },

/*/alinhamentoLinha:{
    flexDirection:'row', 
    justifyContent: "space-between",
    
},
alinhamentoColuna:{
    flexDirection:'column', 
    justifyContent: 'flex-start',
   
   
},*/
gridView: {
  marginTop: 0,
  flex: 1,
  marginLeft: 37,
  marginRight: 37,
  
},
itemContainer: {
  justifyContent: 'flex-end',
  borderRadius: 50,
  padding: 3,
  height: 30,
  width: 110,
  alignItems: 'center',
 
},
itemCode: {
  fontWeight: '600',
  fontSize: 5,
  color: '#fff',
  justifyContent: "center",
  alignItems: "center"
},
text: {
  color: "white",
  fontSize: 9,
  lineHeight: 16,
  textAlign: "center",
  justifyContent: "center",
    alignItems: "center"
},
  
});

export default Profile;