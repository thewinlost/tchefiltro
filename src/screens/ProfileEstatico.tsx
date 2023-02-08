
import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, SafeAreaView, Image, Linking } from "react-native";
import {
  Layout,
  TopNav,
  Button,
  
  Text,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import { useRoute } from "@react-navigation/native"; //talvez tenha q colocar core
import { storage, auth, firestore } from "../navigation/firebase";
import {Usuario} from "../model/Usuario"
import { Ionicons } from "@expo/vector-icons";
import { FlatGrid } from 'react-native-super-grid';
import { Categoria } from "../model/Categoria";


export default function ProfileEstatico ({ navigation })  {
  const { isDarkmode } = useTheme();
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [usuario, setUsuario] = useState<Partial<Usuario>>({});
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [especialidades, setEspecialidades] = useState<Partial<Categoria>[]>([{}]);
  const route = useRoute ();
  const {parametrouser}= route.params


  useEffect(() => {
    const subscriber = firestore
      .collection('Usuario')
     // .doc(auth.currentUser.uid)
     .doc(parametrouser.id)
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
    .doc(parametrouser.id).collection('Especialidade')
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




  return (
    <Layout>
      <TopNav
        middleContent="Perfil"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.black}
          />
        }
        leftAction={() => navigation.goBack()}
      />


      <SafeAreaView style={MeuEstilo.screen}>
      <View style={MeuEstilo.imageContainer}>
          {pickedImagePath !== "" && (
          
              <Image source={{ uri: pickedImagePath }} style={MeuEstilo.image} />
           )}
          {pickedImagePath === "" && (
          
              <Image source={require("../../assets/camera.png")}
              style={MeuEstilo.image} />
            )}
      </View>
      <Text style={MeuEstilo.title}>{usuario.nome}</Text>
      <Text>{usuario.descricao}</Text>
      <Text>{usuario.telefone}</Text>
      
      
      <FlatGrid
      itemDimension={93}
      data={especialidades} 
      style={MeuEstilo.gridView}
      spacing={4}
      renderItem={({ item }) => (
        
        <View style={[MeuEstilo.itemContainer, { backgroundColor: '#4e8264'}]}>
         <Text style={MeuEstilo.text}>{item.categoria}</Text>
         
        </View>
      
      )
      }/>
      <Button
            color="#0d4023"
            style={{ marginTop: 10, borderRadius:80}}
            text="Conversar no Whatsapp"
            status="info"
             
              onPress={() => Linking.openURL('whatsapp://send?text=Olá encontrei seu perfil no Tchê Emprega &phone='+usuario.telefone)}
      />

    </SafeAreaView>
  
    </Layout>
    
    
  );
  };
      



const MeuEstilo = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 40,
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    padding: 8,
      //backgroundColor: '#4e8264',
    backgroundColor: '#9ab4a0',
    borderRadius: 10,
     
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
  gridView: {
    marginTop: 0,
    flex: 1,
    //spacebetween: 100,
    marginLeft: 37,
    marginRight: 37
    
    
  },
  text: {
    color: "white",
    fontSize: 9,
    lineHeight: 16,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  
itemContainer: {
  justifyContent: 'space-evenly',
  borderRadius: 50,
  padding: 3,
  height: 30,
  width: 110,
  alignItems: 'center',
  
 
},
title:{
  fontSize: 24,
  textAlign: 'center',
},

  });
 
