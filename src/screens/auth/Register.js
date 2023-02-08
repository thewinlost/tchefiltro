import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
} from "react-native";

import { TextInputMask } from 'react-native-masked-text';
//import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { auth, firestore } from "../../navigation/firebase";

export default function  ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
 // const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [telefone, setTelefone] = useState("");
  const [urlfoto, setUrlfoto] = useState("");
  const [nome, setNome] = useState("");
  /*async function register() {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password).catch(function (
      error
    ) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      setLoading(false);
      alert(errorMessage);
    });
  }*/
  const handleSignUp = () => {
    setLoading(true);
    auth
   .createUserWithEmailAndPassword(email, password)
   .then((userCredentials) => {
     const user = userCredentials.user;
    const reference = firestore.collection("Usuario").doc(auth.currentUser.uid);
     reference.set({
       id: reference.id,
       nome: nome,
       email: email,
       telefone: telefone,
       urlfoto: urlfoto,
     });
     console.log("Registered with:", user.email);
   })
   .catch(function(error) {
     alert(error.message); 
     setLoading(false);
   } );
};

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:  "#9AB1a3",
              
              
              //backgroundColor:  "#9AB4a3",
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 120,
                width: 220,
              }}
              source={require("../../../assets/register.png")}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <Text
              fontWeight="bold"
              size="h3"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
            >
              Cadastre-se
            </Text>
            <Text style={{ marginTop: 15  }}>Nome</Text>
            <TextInput
            containerStyle={{ marginTop: 15 }}
            placeholder="Insira seu nome"
            value={nome}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            keyboardType="default"
            onChangeText={(text) => setNome(text)}
          />
          <Text style={{ marginTop: 15 }}>Email</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Insira seu e-mail"
              value={email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />

            <Text style={{ marginTop: 15, marginLeft:5 }}>Senha</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Insira sua senha"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <Text style={{ marginTop: 15, marginLeft:5  }}>Telefone</Text>
           
          <TextInputMask
            containerStyle={{ marginTop: 15 }}
            placeholder="Insira seu telefone"
            value={telefone}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            keyboardType='phone-pad'
            onChangeText={(text) => setTelefone(text)}
            type={'cel-phone'}
            style={{ marginTop: 5, padding: 9, justifyContent: "center", borderColor: "#d8d8d8", borderRadius: 8,  alignItems: "center", borderWidth:1, marginBottom: 15, backgroundColor:'white'}}
          />
          
            
            <Button
              color= "#4e8264"
              text={loading ? "Loading" : "Criar conta"}
              onPress={() => {
                handleSignUp();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                justifyContent: "center",
              }}
            >
              <Text size="md">Já possui uma conta?</Text>
              <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login");
              }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Entre aqui
                </Text>
              </TouchableOpacity>
            </View>
          
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
