import React, { useState, useEffect } from "react";
import { ScrollView, Modal, View } from "react-native";
import {
  Item,
  Input,
  Button,
  Text,
  Icon,
  Card,
  CardItem,
  Body,
  Container,
  Picker,
  Label,
} from "native-base";
import * as SQLite from "expo-sqlite";

export default function Buscador({ navigation }) {
  const [filtros, setFiltros] = useState({
    nombre: "",
    clasificacion: "Ninguno",
  });
  const [listaEmpresas, setListaEmpresas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [empresaActual, setEmpresaActual] = useState({});
  const db = SQLite.openDatabase("Reto8");

  // useEffect(() => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       "SELECT * FROM empresas",
  //       null,
  //       (txObj, { rows: { _array } }) => setListaEmpresas(_array),
  //       (txObj, error) => console.log("Error ", error)
  //     );
  //   });
  // }, []);

  useEffect(() => {
    console.log("listaEmpresas", listaEmpresas);
  }, [listaEmpresas]);

  useEffect(() => {
    if (!filtros.nombre && filtros.clasificacion === "Ninguno") {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM empresas",
          null,
          (txObj, { rows: { _array } }) => setListaEmpresas(_array),
          (txObj, error) => console.log("Error ", error)
        );
      });
    } else if (filtros.nombre && filtros.clasificacion === "Ninguno") {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM empresas WHERE nombre LIKE ?",
          [`%${filtros.nombre}%`],
          (txObj, { rows: { _array } }) => setListaEmpresas(_array),
          (txObj, error) => console.log("Error ", error)
        );
      });
    } else if (!filtros.nombre && filtros.clasificacion !== "Ninguno") {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM empresas WHERE clasificacion = ?",
          [filtros.clasificacion],
          (txObj, { rows: { _array } }) => setListaEmpresas(_array),
          (txObj, error) => console.log("Error ", error)
        );
      });
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM empresas WHERE clasificacion = ? AND nombre LIKE ?",
          [filtros.clasificacion, `%${filtros.nombre}%`],
          (txObj, { rows: { _array } }) => setListaEmpresas(_array),
          (txObj, error) => console.log("Error ", error)
        );
      });
    }
  }, [filtros]);

  const eliminarEmpresa = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM empresas WHERE id = ? ",
        [empresaActual.id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let newList = listaEmpresas.filter((empresa) => {
              if (empresa.id === empresaActual.id) return false;
              else return true;
            });
            setListaEmpresas(newList);
          }
        }
      );
    });

    setModalVisible(false);
  };

  return (
    <Container
      style={{
        padding: 10,
      }}
    >
      <View>
        <Modal transparent animationType="slide" visible={modalVisible}>
          <View
            style={{
              margin: 10,
              backgroundColor: "#F2F2F2",
              borderRadius: 20,
              padding: 35,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              marginTop: 230,
            }}
          >
            <Text>
              Estás seguro que quieres eliminar la empresa "
              {empresaActual.nombre}"
            </Text>
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                marginTop: 10,
                backgroundColor: "#F2F2F2",
              }}
            >
              <Button
                danger
                small
                iconLeft
                rounded
                onPress={() => eliminarEmpresa()}
              >
                <Icon type="FontAwesome" name="minus" />
                <Text>Eliminar</Text>
              </Button>
              <Button
                light
                small
                iconLeft
                rounded
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancelar</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
      <Text>Filtros</Text>
      <Item style={{ marginBottom: 10 }}>
        <Icon type="FontAwesome" name="search" />
        <Input
          placeholder="Nombre de la empresa"
          onChangeText={(value) => setFiltros({ ...filtros, nombre: value })}
          value={filtros.nombre}
        />
      </Item>
      <Item style={{ marginBottom: 10 }}>
        <Label>Categoría: </Label>
        <Picker
          note
          mode="dropdown"
          selectedValue={filtros.clasificacion}
          onValueChange={(value) =>
            setFiltros({ ...filtros, clasificacion: value })
          }
        >
          <Picker.Item label="Ninguno" value="Ninguno" />
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
      <ScrollView>
        {listaEmpresas.map((empresa) => {
          return (
            <Card key={empresa.id}>
              <CardItem header bordered>
                <Text>{empresa.nombre}</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>URL: {empresa.url}</Text>
                  <Text>Email: {empresa.email}</Text>
                  <Text>Teléfono: {empresa.telefono}</Text>
                  <Text>Productos y servicios: {empresa.productos}</Text>
                  <Text>Clasificación: {empresa.clasificacion}</Text>
                </Body>
              </CardItem>
              <CardItem
                footer
                bordered
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  danger
                  small
                  iconLeft
                  rounded
                  onPress={() => {
                    setEmpresaActual(empresa);
                    setModalVisible(true);
                  }}
                >
                  <Icon type="FontAwesome" name="minus" />
                  <Text>Eliminar</Text>
                </Button>
                <Button
                  warning
                  small
                  iconLeft
                  rounded
                  onPress={() => navigation.push("Formulario", empresa)}
                >
                  <Icon type="FontAwesome" name="pencil" />
                  <Text>Actualizar</Text>
                </Button>
              </CardItem>
            </Card>
          );
        })}
      </ScrollView>
      <Button
        info
        rounded
        large
        onPress={() => navigation.push("Formulario")}
        style={{ display: "flex", padding: 5, marginTop: 10 }}
      >
        <Icon type="FontAwesome" name="plus" />
      </Button>
    </Container>
  );
}
