import { StatusBar } from 'expo-status-bar';
import {ScrollView, StyleSheet, Text, View, ActivityIndicator, Dimensions } from 'react-native';
import {useEffect, useState} from "react";
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

const API_KEY = "1234"
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const icons = {
  Clouds : "cloudy",
  Clear : "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow : "snow",
  Rain : "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning"
}


export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const {granted} =  await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy : 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps : false})
    console.log(location[0].region)
    setCity(location[0].region)
    console.log('latitude, longitude', latitude, longitude)
    const URL = "https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&exclude=alerts&appid="+API_KEY+"&units=metric"
    const response = await fetch(URL)
    const json = await response.json()
    setDays(json.daily)
    console.log(json.daily[0])
  }
  useEffect(()=>{
    getWeather()
  }, [])

  return (
      <View style={styles.container}>
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
        <ScrollView
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weather}
        >
          {days.length === 0 ? (
              <View style={{...styles.day, alignItems  : "center"}}>
                <ActivityIndicator color="white"
                                   style={{marginTop : 10}}
                                   size="large"/>
              </View>) : (
                  days.map((day, index) => (
                      <View key={index} style = {styles.day}>

                        <View style={{
                          flexDirection : "row",
                          alignItems : "center",
                          justifyContent : "space-between",
                          width : "100%"
                        }}>
                          <Text style={styles.temp}>
                            {parseFloat(day.temp.day).toFixed(1)}
                          </Text>
                          <Fontisto name={icons[day.weather[0].main]} size={70} color="white" />
                        </View>

                        <Text style={styles.description}>{day.weather[0].main}</Text>
                        <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                      </View>
                  ))
          )}
        </ScrollView>
      </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',

  },
  city : {
    flex : 1.2,
    justifyContent : 'center',
    alignItems : "center",
  },
  cityName : {
    fontSize: 58,
    fontWeight: "500",
    color: "white",

  },
  weather : {
    color: "white",
    alignItems: "flex-start",
  },
  day : {
    flex : 1,
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    color: "white"
  },
  temp : {
    marginTop : 50,
    fontSize: 100,
    fontWeight: "600",
    color: "white",
    alignItems: "flex-start",
  },
  tinyText: {
    fontSize: 20,
    color: "white",
    alignItems: "flex-start",
  },
  description : {
    marginTop: -30,
    fontSize : 60,
    color: "white",
    alignItems: "flex-start",
  }
});
