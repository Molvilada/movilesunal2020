import React, { useState, useEffect } from "react";
import { View } from "react-native";
import {
  Item,
  Input,
  Button,
  Text,
  Icon,
  Form,
  Picker,
  Label,
  Container,
} from "native-base";
import * as SQLite from "expo-sqlite";

export default function Formulario({ route, navigation }) {
  const [info, setInfo] = useState({
    nombre: "",
    url: "",
    telefono: "",
    email: "",
    productos: "",
    clasificacion: "Consultoria",
  });

  const [tipo, setTipo] = useState("crear");
  const db = SQLite.openDatabase("Reto8");

  const updateInfo = (key, value) => {
    let copyInfo = { ...info };
    copyInfo[key] = value;
    setInfo(copyInfo);
  };

  const addInfoBD = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO empresas (nombre, url, telefono, email, productos, clasificacion) values (?, ?, ?, ?, ?, ?)",
        [
          info.nombre,
          info.url,
          info.telefono,
          info.email,
          info.productos,
          info.clasificacion,
        ],
        (txObj, resultSet) => console.log(resultSet),
        (txObj, error) => console.log("Error", error)
      );
    });
    navigation.push("Empresas");
  };

  const updateInfoBD = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        "UPDATE empresas SET nombre = ?, url = ?, telefono = ?, email = ?, productos = ?, clasificacion = ? WHERE id = ?",
        [
          info.nombre,
          info.url,
          info.telefono,
          info.email,
          info.productos,
          info.clasificacion,
          info.id,
        ],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            console.log(resultSet);
          }
        }
      );
    });
    navigation.push("Empresas");
  };

  useEffect(() => {
    if (route.params) {
      setInfo(route.params);
      setTipo("editar");
    }
  }, []);
  return (
    <Container
      style={{
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: "column",
      }}
    >
      <Form>
        <Item>
          <Input
            placeholder=" Nombre de la empresa"
            onChangeText={(value) => updateInfo("nombre", value)}
            value={info.nombre}
          />
        </Item>
        <Item>
          <Input
            placeholder=" URL de la página web"
            onChangeText={(value) => updateInfo("url", value)}
            value={info.url}
          />
        </Item>
        <Item>
          <Icon type="FontAwesome" name="phone" />
          <Input
            placeholder=" Teléfono de contacto"
            onChangeText={(value) => updateInfo("telefono", value)}
            value={info.telefono}
          />
        </Item>
        <Item>
          <Icon type="FontAwesome" name="envelope" />
          <Input
            placeholder=" Email de contacto"
            onChangeText={(value) => updateInfo("email", value)}
            value={info.email}
          />
        </Item>
        <Item>
          <Input
            placeholder=" Productos y servicios"
            onChangeText={(value) => updateInfo("productos", value)}
            value={info.productos}
          />
        </Item>
        <Item>
          <Label>Categoría: </Label>
          <Picker
            note
            mode="dropdown"
            selectedValue={info.clasificacion}
            onValueChange={(value) => updateInfo("clasificacion", value)}
          >
            <Picker.Item label="Consultoria" value="Consultoria" />
            <Picker.Item
              label="Desarrollo a la medida"
              value="Desarrollo a la medida"
            />
            <Picker.Item
              label="Fábrica de software"
              value="Fabrica de software"
            />
          </Picker>
        </Item>
      </Form>
      {tipo === "crear" ? (
        <Button
          rounded
          info
          iconLeft
          onPress={() => addInfoBD()}
          style={{ marginTop: 10, alignSelf: "center" }}
        >
          <Icon type="FontAwesome" name="plus" />
          <Text>Agregar empresa</Text>
        </Button>
      ) : (
        <Button
          rounded
          warning
          iconLeft
          onPress={() => updateInfoBD()}
          style={{ marginTop: 10, alignSelf: "center" }}
        >
          <Icon type="FontAwesome" name="pencil" />
          <Text>Editar empresa</Text>
        </Button>
      )}
    </Container>
  );
}
