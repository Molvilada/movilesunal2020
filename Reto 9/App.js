import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, View, TextInput, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [location, setLocation] = useState({});
  const [region, setRegion] = useState({});
  const [radius, setRadius] = useState("500");
  const [map, setMap] = useState(null);
  const [pois, setPois] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.001663 * 5,
        longitudeDelta: 0.002001 * 5,
      });
    })();
  }, []);

  const getMarkers = async (longitude, latitude, radius) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${longitude},${latitude}.json`,
        {
          params: {
            radius: radius,
            layers: "poi_label",
            geometry: "point",
            limit: 10,
            access_token:
              "pk.eyJ1IjoibW9sdmlsYWRhIiwiYSI6ImNraGVkNWFxaDAxYnAyc3AxcmR4YmphcG8ifQ.iebe41bFwZaWe2cVVjXrPw",
            dedupe: true,
          },
        }
      );
      setPois(response.data.features);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (radius) getMarkers(location.longitude, location.latitude, radius);
  }, [location, radius]);

  return (
    <View>
      {Object.keys(region).length > 0 ? (
        <MapView
          style={styles.mapStyle}
          initialRegion={region}
          onPress={(e) => {
            setLocation(e.nativeEvent.coordinate);
          }}
        >
          {Object.keys(location).length > 0 ? (
            <Marker
              key={"actual"}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={"Localización actual"}
              description={"Localización actual"}
            />
          ) : null}
          {pois.map((poi, index) =>
            poi.properties.type !== "Residential" && poi.properties.name ? (
              <Marker
                key={index}
                coordinate={{
                  latitude: poi.geometry.coordinates[1],
                  longitude: poi.geometry.coordinates[0],
                }}
                title={poi.properties.name}
                description={poi.properties.type}
                image={require("./alfiler.png")}
              ></Marker>
            ) : null
          )}
        </MapView>
      ) : null}

      <Text
        style={{
          position: "absolute",
          top: 50,
          backgroundColor: "white",
          right: 50,
          fontWeight: "bold",
        }}
      >
        Ingrese el radio de su interés
      </Text>
      <TextInput
        keyboardType="numeric"
        style={{
          height: 40,
          width: 100,
          borderColor: "gray",
          borderWidth: 1,
          position: "absolute",
          top: 80,
          backgroundColor: "white",
          borderRadius: 10,
          right: 50,
          padding: 10,
        }}
        onChangeText={(text) => setRadius(text)}
        value={radius}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
