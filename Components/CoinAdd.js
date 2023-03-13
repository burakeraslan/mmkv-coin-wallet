import React, { useEffect, useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"

import { storage } from "./HomeScreen"

import { useFonts } from 'expo-font';


const CoinAdd = ({route, navigation}) => {

  // Installing Roboto-Thin font.
  const [fontsLoaded] = useFonts({
    'Roboto-Thin': require('../assets/fonts/Roboto-Thin.ttf'),
  });

  const [selectedCoin, setSelectedCoin] = useState('')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')

  const coinInfo = {
    id: selectedCoin,
    price: price,
    amount: amount
  }

  // Getting the coin ID selected on the previous page.
  useEffect(() => {
    if(route.params?.selectedCoin){
      setSelectedCoin(route.params.selectedCoin)
    }
  }, [route.params])

  useEffect(() => {

    // Using the selectedCoin data we received, we extract data and save it to the price variable.
    // Our goal is to use the current price in the input when asking the user to enter a price. The user can change it if he wants.
    const fetchCoinDetails = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${selectedCoin}`)
        const data = await response.json()

        setPrice(data.market_data.current_price.usd)

      } catch (error) {
        console.error('Error adding coin to database:', error);
      }
    };
    
    fetchCoinDetails();
  }, [selectedCoin]);

  // We get the price data we want from the user, allowing only numbers and decimals.
  const handlePriceChange = (value) => {
    if (/^\d+(\.\d{1,10})?$/.test(value)) {
      setPrice(value)
    }
  }

  // We get the amount data we want from the user, allowing only numbers and decimals.
  const handleAmountInput = (value) => {
    if (/^\d+(\.\d{1,5})?$/.test(value)) {
      setAmount(value)
    }
  }

  // We convert the data we save to the states into attributes.
  const saveFunc = async () => {
    
    // We are adding new data that we have pulled and saved over the old data.
    const jsonCoins = storage.getString('coins')
    const currentCoins = jsonCoins ? JSON.parse(jsonCoins) : {}

    const updatedCoins = {
      ...currentCoins,
      [selectedCoin]: coinInfo
    }

    // Storage update.
    storage.set('coins', JSON.stringify(updatedCoins))
  }

  return(
    <View style={styles.container}>
      <Text style={styles.text}>Price:</Text>
      <TextInput
        style={styles.input}
        onChangeText={handlePriceChange}
        value={price}
        keyboardType="numeric"
      />

      <Text style={styles.text}>Amount:</Text>
      <TextInput
        style={[styles.input, styles.amountInput]}
        onChangeText={handleAmountInput}
        keyboardType="numeric"
        value={amount}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={()=>{
          saveFunc()
          alert("Saved")
          navigation.navigate("Home Screen")
        }}

      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
    //
    fontFamily: 'Roboto-Thin.ttf',
    fontWeight: 500
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 17,
    //
    fontFamily: 'Roboto-Thin.ttf',
    fontWeight: 100
  },
  amountInput: {
    marginBottom: 20,
    fontFamily: 'Roboto-Thin.ttf',
    fontWeight: 100,
    fontSize: 17,
    padding: 10,
    borderWidth: 1,
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: 'gray'
  },
  button: {
    width: '40%',
    height: 40,
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    //
    fontFamily: 'Roboto-Thin.ttf',
    fontWeight: 500
  },
});

export default CoinAdd