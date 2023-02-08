import React, {useState, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,  
  View,
  Image,
  Modal,
} from 'react-native';
import { storage, auth, firestore } from "../navigation/firebase";
import {Usuario} from "../model/Usuario"
import Filtro from "./Filtro"

const Listar = ({navigation}) => {
  const [modalListaVisible, setModalListaVisible] = useState(false);
  const [itemLista, setItemLista]=
  useState({...itemLista,
    id:"",
    categoria:""});
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [usuarios, setUsuarios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  
   // Initial empty array of users

  useEffect(() => {
    const subscriber = firestore.collection('Usuario')
    .where ('listasimples', 'array-contains',itemLista.categoria+ " ")
      .onSnapshot(querySnapshot => {
        const usuarios: React.SetStateAction<Partial<Usuario>[]> | { key: string; }[] = [];
        querySnapshot.forEach(documentSnapshot => {
          
          usuarios.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });

        });
        
        setUsuarios(usuarios);
        setLoading(false);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []); 


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
 




  const Item = ({ item }) => (
    
    <TouchableOpacity
  onPress={() => {
    navigation.navigate("ProfileEstatico",{parametrouser:item});
  }}>  
  <View style={MeuEstilo.alinhamentoLinha}>   
   
      <Image style={MeuEstilo.image} source={{uri: item.urlfoto}} />
      {/* // coloca alinhamento em coluna justificado flex-start */}
      <View style={MeuEstilo.alinhamentoColuna}>  
          <Text style={MeuEstilo.title} >{item.nome}</Text>  
          <Text  numberOfLines={1} style={MeuEstilo.describe} >{item.descricao} </Text>     
          <Text>{item.listasimples}</Text>
         
          {/* fecha alinhamento colunas */}
      </View>

  {/* fecha alinhamento linhas */}
  </View>
  </TouchableOpacity>
  );

  
  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View style={MeuEstilo.separador}/>
    );
  };

 

  const renderItem = ({ item }) => <Item item={item} />;
  
  return (
    <SafeAreaView style={MeuEstilo.containerlistar}>
        <TouchableOpacity
          style={MeuEstilo.loginScreenButton}
          onPress={() => {
            setModalListaVisible(true);
        }}>
          <Text style={MeuEstilo.loginText}>Filtrar {itemLista.categoria}</Text>
      </TouchableOpacity>
    
      <FlatList 
      data={usuarios} 
      renderItem={renderItem} 
      keyExtractor={item => item.id} 
      ItemSeparatorComponent={ItemSeparatorView}
      
      />
         {/* MODAL DA LISTA */}

         <Modal
        animationType="slide"
        transparent={true}
        visible={modalListaVisible}
        onRequestClose={() => {
          //Alert.alert('Modal Fechado.');
          setModalListaVisible(!modalListaVisible);
        }}>
        <View style={MeuEstilo.centeredView}>
          <View style={MeuEstilo.modalView}>
          
        <Filtro setModalListaVisible={setModalListaVisible}
            setItemLista={setItemLista}>
          
        </Filtro>
          </View>
        </View>
      </Modal>


      
    </SafeAreaView>
  );
};

 const MeuEstilo = StyleSheet.create({
 containerlistar: {
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10, //tela branca do fundo
    padding: 30,
    marginvertical: 8,
    marginhorizontal: 16,
  },
  item: {
     backgroundColor: 'white',
     padding: 50,
     marginVertical: 8,
     marginHorizontal: 16,
    borderColor: 'pink',
//     borderWidth: 2,
//     borderRadius: 10,
  },
  title: {
    fontSize: 20,
    color: '#0d4023',
    fontWeight: '500',
   
 
 },
 describe: {
  fontSize: 12,
  color: '#0d4023',
  fontWeight: '480',
  textAlign: 'left',
  marginRight: 90,
  marginLeft: 11,
 
 
},
 image:{
  width: 85,
  height: 85,
  borderRadius: 100,
  marginLeft: 5,
  marginRight: 15
 
 },
 text: {
  color: "white",
  fontSize: 9,
  lineHeight: 16,
  textAlign: "center",
  justifyContent: "center",
    alignItems: "center"
},
  
 alinhamentoLinha:{
  flexDirection: 'row',
  padding: 8,
  //backgroundColor: '#4e8264',
  backgroundColor: '#9ab4a0',
  borderRadius: 10,
 
},
alinhamentoColuna:{
  flexDirection:'column', 
  justifyContent: 'center',


},
separador:{
  height: 20,
  width: '100%',
  backgroundColor: "white"
  //backgroundColor: '#C8C8C8',
},

loginScreenButton:{
  marginRight:40,
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
 });

export default Listar;