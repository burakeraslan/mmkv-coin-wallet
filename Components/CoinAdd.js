import React, { useEffect, useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native"

import { storage } from "./Homescreen"

import { useFonts } from 'expo-font';


const Coinadd = ({route, navigation}) => {

  // Installing Roboto-Thin font.
  const [fontsLoaded] = useFonts({
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
  });

  const [selectedCoin, setSelectedCoin] = useState('')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [image, setImage] = useState('')
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [showPrice, setShowPrice] = useState('')

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
        setImage(data.image.large)
        setName(data.name)
        setSymbol(data.symbol)
        setShowPrice(data.market_data.current_price.usd)

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
      
      <View style={styles.information}>
        
        <Image 
          style={styles.image} 
          source={{uri: `${image}`}}
          />

        <View style={styles.infoTexts}>
          <Text 
            style={{
              fontFamily: 'Roboto-Light',
              fontSize: 18,
              color: '#222222',
            }}
          >
            {symbol}
          </Text>
          
          <Text 
            style={{
              fontFamily: 'Roboto-Light',
              fontSize: 40,
              color: '#222222'
            }}
          >
            {name}
          </Text>
          
          {/* to center numbers vertically */}
          <View style={styles.currentPrice}>
        
            <Text 
              style={{
                fontFamily: 'Roboto-Light', 
                fontSize: 18,
            
                color: '#222222'
              }}
            >
              $
            </Text>

            <Text 
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: 40,
        
                color: '#222222'
              }}
            >
              {showPrice}
            </Text>
          </View>
        </View>
        
      </View>

      <View style={[styles.inputView, {marginTop: 30}]}>
        
        <Text 
          style={{
            fontFamily: 'Roboto-Light',
            fontSize: 16, 
            color: '#DDDDDD'
        }}
        >
          Price
        </Text>
        
        <TextInput
          style={styles.input}
          onChangeText={handlePriceChange}
          value={price}
          keyboardType="numeric"
        />
      
      </View>

      <View style={[styles.inputView, {marginTop: 20}]}>
        
        <Text
          style={{
            fontFamily: 'Roboto-Light',
            fontSize: 16,
            color: '#DDDDDD'
          }}
        >
          Amount
        </Text>
        
        <TextInput
          style={styles.input}
          onChangeText={handleAmountInput}
          keyboardType="numeric"
          value={amount}
          placeholder={'Write how many you bought here'}
          placeholderTextColor={'#DDDDDD'}
        />
      
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={()=>{
          saveFunc()
          alert("Saved")
          navigation.navigate("Home Screen")
        }}

      >
        <Text 
          style={{
            fontFamily: 'Roboto-Bold',
            fontSize: 14,
            color: '#222222'
          }}
        >
          Save
        </Text>

      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#222222',
    alignItems: 'center'
  },

  information: {
    width: '95%',
    height: '30%',
    backgroundColor: '#EFE0FF',
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row'
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 80,
    marginLeft: 10
  },

  infoTexts: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20
  },

  currentPrice: {
    width:'100%',
    flexDirection:'row',
    alignItems: 'center'
  },

  inputView: {
    width: '95%',
    height: 100,
    backgroundColor: '#333333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  input: {
    width: '100%',
    height: 40,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#444444',
    fontFamily: 'Roboto-Light.ttf',
    color: '#DDDDDD',
    marginTop: 10,
  },

  button: {
    width: '40%',
    height: 40,
    backgroundColor: '#EFE0FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 30
  }

})

export default Coinadd