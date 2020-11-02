import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

import * as SQLite from "expo-sqlite";

// SCREENS
import BuscadorScreen from "./src/screens/Buscador/Buscador";
import FormularioScreen from "./src/screens/Formulario/Formulario";

const Stack = createStackNavigator();

export default function App() {
  const db = SQLite.openDatabase("Reto8");
  const [fontsLoaded] = useFonts({
    Roboto: require("native-base/Fonts/Roboto.ttf"),
    Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    ...Ionicons.font,
  });

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS empresas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, url TEXT, telefono TEXT, email TEXT, productos TEXT, clasificacion TEXT)"
      );
    });
  }, []);

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Empresas">
          <Stack.Screen name="Empresas" component={BuscadorScreen} />
          <Stack.Screen name="Formulario" component={FormularioScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
