import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, StatusBar, Image } from 'react-native';
import Swiper from 'react-native-swiper'
import { Picker } from '@react-native-picker/picker';
import { _bg, _header, _textHeader } from './components/style';

const BREEDS = "https://dog.ceo/api/breeds/list/all"

export default function App() {
  const [isLoading, setLoading] = useState();
  const [imageURL, setImageURL] = useState([]);
  const [estadoSwiper, setEstadoSwiper] = useState(false);
  const [racaSelecionada, setRacaSelecionada] = useState({});
  const [racas, setRacas] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState();


  const getDogImage = async (raca) => {
    try {
      setLoading(true);
      const URI = "https://dog.ceo/api/breed/" + raca + "/images/random/5";
      const response = await fetch(URI);
      const json = await response.json();
      const arrayImg = json.message;
      if (arrayImg != "Breed not found (master breed does not exist)") {
        setImageURL(json.message);
        setEstadoSwiper(true);
      } else {
        setImageURL([]);
        setEstadoSwiper(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getDogBreeds = async () => {
    try {
      setLoading(true);
      const response = await fetch(BREEDS);
      const json = await response.json();
      const arrayRacas = Object.keys(json.message).map(raca => raca)
      setRacas(arrayRacas);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    getDogBreeds();
  }, []);

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>DOG API</Text>
      </View>
      <Picker
        style={styles.picker}
        selectedValue={racaSelecionada}
        onValueChange={itemValue => { getDogImage(itemValue), setRacaSelecionada(itemValue) }}
      >
        <Picker.Item label="Selecione uma raca" value="0" />
        {racas.map((raca) => {
          return (<Picker.Item label={raca} value={raca} />)
        })}
      </Picker>
      <Swiper
        loop={false}
      >
        {!estadoSwiper ? <><View><Text>Erro</Text></View></> :
          imageURL.map((img) => {
            return (<View><Image style={styles.img} source={{
              uri: img,
            }} /></View>)
          })
        }
      </Swiper>
      <StatusBar barStyle='default' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: _bg,
  },
  textHeader: {
    textAlign: 'center',
    fontSize: 32,
    color: _textHeader,
  },
  header: {
    backgroundColor: _header,
    padding: 10,
  },
  img: {
    width: 500,
    height: 500,
  },
  picker: {
    padding: 30
  },
});