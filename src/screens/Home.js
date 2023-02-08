import React from "react";
import { View, Linking } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
} from "react-native-rapi-ui";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth();
  return (
    <Layout>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 20,
          flex: 1,
          marginTop: 15,
          marginBottom: 15,
          marginLeft: 15,
          marginRight: 15,
          padding: 8,
      //backgroundColor: '#4e8264',
          backgroundColor: '#9ab4a0',
          borderRadius: 10,
     
        }}
      >
        <Section backgroundColor='white'>
          <SectionContent>
  
            <Button
            color="#0d4023"
              style={{ marginTop: 10 }}
              text="Botão em fase de teste"
              status="info"
              onPress={() => Linking.openURL("https://rapi-ui.kikiding.space/")}
            />
            
            <Button 
              color="#0d4023"
              text="Sair"
              onPress={() => {
                signOut(auth);
              }}
              style={{
                marginTop: 30,
              }}
            />
           
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
