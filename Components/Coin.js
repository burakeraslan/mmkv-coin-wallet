import React, { useEffect, useState } from "react"
import { TextInput, TouchableOpacity, View, Text, StyleSheet, ScrollView, Image } from "react-native"

// Import the useFonts hook from Expo font.
import { useFonts } from 'expo-font';


const Coin = ({navigation}) => {
 
  // Load the Roboto-Thin font.
  const [fontsLoaded] = useFonts({
    'Roboto-Thin': require('../assets/fonts/Roboto-Thin.ttf'),
  });

  const [searchText, setSearchText] = useState('')
  const [searchResult, setSearchResult] = useState([])

  // Define a function to handle the button press.
  const handleButtonPress = () => {
    // If no search text is entered, display an alert.
    if(searchText.length<1){
      alert("Please enter coin name or symbol")
      return
    }

     // Fetch the search results from the CoinGecko API and update the state with the results.
    fetch(`https://api.coingecko.com/api/v3/search?query=${searchText}`,)
    .then(res => res.json())
    .then(data => setSearchResult(data.coins))

    // Clear the search text input.
    setSearchText('')
  }

  // Define a function to render the search result list.
  const searchResultList = () => {
    return searchResult.map((coin, index) => {
      return (
        <TouchableOpacity 
          key={coin.id}
          style={CoinStyles.coinItem}
          onPress={()=>{
            navigation.navigate('Coin Add', { selectedCoin: coin.id})
          }}
        >
          <Image
            source={{ uri: `${coin.large}` }}
            style={CoinStyles.coinIcon}
          />
          
          <Text style={CoinStyles.coinName}>{coin.name}</Text>
        </TouchableOpacity>
      )
    })
  }
  
  return(
    <View style={CoinStyles.container}>
      
      <View style={CoinStyles.searchView}>

        <View style={{width: '95%', height: 50, backgroundColor: 'white', borderRadius: 10, alignItems: 'center', flexDirection: 'row'}}>

        <TextInput 
          style={CoinStyles.input}
          onChangeText={setSearchText}
          value={searchText}
        />
        
        <TouchableOpacity onPress={handleButtonPress}>
          <View style={CoinStyles.button}>
            <Image 
            style={{width: 20, height: 20}}
            source={require('../assets/search.png')}
            />
          </View>
        </TouchableOpacity>  
      </View>
    </View>
      
      <View style={CoinStyles.searchResultList}>
        
        <ScrollView style={{backgroundColor: '#F0F0F0', width: '95%'}}>
          {searchResultList()}
        </ScrollView>
      
      </View>
    
    </View>
  )
}

export default Coin

const CoinStyles = StyleSheet.create({
  
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
  },

  searchView: {
    height: 75,
    width: '100%',
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    marginLeft: 2.5, 
    width: '86%', 
    height: 45, 
    backgroundColor: 'white', 
    borderRadius: 10,
    padding: 10,
    fontSize: 17,
    fontFamily: 'Roboto-Thin.ttf',
    fontWeight: 100
  },
  
  button: {
    width: 45, 
    height: 45, 
    backgroundColor: 'white', 
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchResultList: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },

  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    height: 50,
    marginBottom: 5,
    width: '100%'
  },

  coinName: {
    flex: 1,
    fontFamily: 'Roboto-Thin.ttf',
    fontSize: 17,
    fontWeight: 100,
    marginLeft: 20
  },

  coinIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    borderRadius: 10
  },

})