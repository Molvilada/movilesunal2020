import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, View, Text, Picker } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import axios from "axios";

export default function App() {
  const [region, setRegion] = useState({});
  const [estado, setEstado] = useState("Ninguno");
  const [actualLoc, setActualLoc] = useState({});
  const [filters, setFilters] = useState({
    LOCALIDAD_ASIS: "Ninguno",
  });
  const [localidad, setLocalidad] = useState([
    { nombre: "Barrios Unidos", longitud: -74.084, latitud: 4.666 },
    { nombre: "Engativá", longitud: -74.107, latitud: 4.707 },
    { nombre: "Sumapaz", longitud: -74.315, latitud: 4.035 },
    { nombre: "Teusaquillo", longitud: -74.094, latitud: 4.645 },
    { nombre: "La Candelaria", longitud: -74.074, latitud: 4.594 },
    { nombre: "Santa Fe", longitud: -74.03, latitud: 4.596 },
    { nombre: "Suba", longitud: -74.082, latitud: 4.765 },
    { nombre: "Fontibón", longitud: -74.148, latitud: 4.683 },
    { nombre: "Los Mártires", longitud: -74.091, latitud: 4.603 },
    { nombre: "San Cristóbal", longitud: -74.088, latitud: 4.546 },
    { nombre: "Usme", longitud: -74.103, latitud: 4.477 },
    { nombre: "Puente Aranda", longitud: -74.123, latitud: 4.615 },
    { nombre: "Usaquén", longitud: -74.031, latitud: 4.749 },
    { nombre: "Bosa", longitud: -74.195, latitud: 4.631 },
    { nombre: "Ciudad Bolívar", longitud: -74.154, latitud: 4.507 },
    {
      nombre: "Rafael Uribe Uribe",
      longitud: -74.116,
      latitud: 4.565,
    },
    { nombre: "Kennedy", longitud: -74.157, latitud: 4.627 },
    { nombre: "Chapinero", longitud: -74.047, latitud: 4.657 },
    { nombre: "Tunjuelito", longitud: -74.141, latitud: 4.588 },
    { nombre: "Antonio Nariño", longitud: -74.101, latitud: 4.549 },
  ]);

  const getInfo = async (loc, filters) => {
    try {
      let copyFilters = {};
      for (let filter in filters) {
        if (filters[filter] !== "Ninguno") {
          copyFilters[filter] = filters[filter];
        }
      }

      const response = await axios.get(
        `https://datosabiertos.bogota.gov.co/api/3/action/datastore_search`,
        {
          params: {
            resource_id: "b64ba3c4-9e41-41b8-b3fd-2da21d627558",
            filters: {
              ...copyFilters,
            },
          },
        }
      );
      setActualLoc({
        nombre: filters.LOCALIDAD_ASIS,
        cant: response.data.result.total,
      });
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    setRegion({
      latitude: 4.624335,
      longitude: -74.099644,
      latitudeDelta: 0.001663 * 120,
      longitudeDelta: 0.002001 * 120,
    });
  }, []);

  useEffect(() => {
    if (filters.LOCALIDAD_ASIS !== "Ninguno") {
      getInfo(filters.LOCALIDAD_ASIS, filters);
    }
  }, [filters]);

  return (
    <View>
      {Object.keys(region).length > 0 ? (
        <MapView style={styles.mapStyle} initialRegion={region}>
          {localidad.map((loc, index) => {
            return (
              <>
                <Marker
                  key={loc.nombre}
                  coordinate={{
                    latitude: loc.latitud,
                    longitude: loc.longitud,
                  }}
                  onPress={() => {
                    let copyFilters = { ...filters };
                    copyFilters["LOCALIDAD_ASIS"] = loc.nombre;
                    setFilters(copyFilters);
                  }}
                />
              </>
            );
          })}
        </MapView>
      ) : null}
      <View
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          backgroundColor: "white",
          borderRadius: 5,
        }}
      >
        <Picker
          selectedValue={filters["ESTADO"] ? filters["ESTADO"] : "Ninguno"}
          style={{
            height: 40,
            width: 160,
          }}
          onValueChange={(itemValue) => {
            let copyFilters = { ...filters };
            copyFilters["ESTADO"] = itemValue;
            setFilters(copyFilters);
          }}
        >
          <Picker.Item label="Ninguno" value="Ninguno" />
          <Picker.Item label="Recuperados" value="Recuperado" />
          <Picker.Item label="Fallecidos" value="Fallecido" />
          <Picker.Item label="Graves" value="Grave" />
          <Picker.Item label="Leves" value="Leve" />
          <Picker.Item label="Moderado" value="Moderado" />
        </Picker>
      </View>
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "column",
          position: "absolute",
          bottom: 30,
          left: 30,
          padding: 15,
          borderRadius: 5,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          Localidad:{" "}
          <Text
            style={{
              fontWeight: "normal",
            }}
          >
            {actualLoc.nombre ? actualLoc.nombre : "Sin información"}
          </Text>
        </Text>
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          Cantidad:{" "}
          <Text
            style={{
              fontWeight: "normal",
            }}
          >
            {actualLoc.cant ? actualLoc.cant : "Sin información"}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
