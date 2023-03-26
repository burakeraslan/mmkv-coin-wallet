import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, ScrollView, Image, StyleSheet } from "react-native";

import { MMKV } from 'react-native-mmkv'
export const storage = new MMKV()

// Import the useFonts hook from Expo font
import { useFonts } from 'expo-font'
import { TextInput } from "react-native-web";

const Homescreen = ({navigation}) => {

  // Load the Roboto-Thin font
  const [fontsLoaded] = useFonts({
    'Roboto-Thin': require('../assets/fonts/Roboto-Thin.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto-Black': require('../assets/fonts/Roboto-Black.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
  })

  // We call the recorded data using MMKV and save it to the array.
  const jsonCoins = storage.getString('coins')
  const coinsArray = jsonCoins ? Object.values(JSON.parse(jsonCoins)) : []

  // Data
  const [newCoinsArray, setNewCoinsArray] = useState([])
  
  // Some information in the data
  const [totalBalance, setTotalBalance] = useState(0)
  const [totalSpend, setTotalSpend] = useState(0)
  const [percent, setPercent] = useState(0)

  // For the view of adding elements to the list
  const [isButtonPressed, setIsButtonPressed] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [searchResult, setSearchResult] = useState([])
  
  
  // We draw data using the array we created with the data we obtained. Our goal is to create a new array with the data we want to show the user.
  const fetchCoinData = async () => {
    
    const fetchArray = []

    for (let i = 0; i < coinsArray.length; i++) {  
      const id = coinsArray[i].id
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
      const data = await response.json()
      const { image, market_data } = data

      // The "i." inside the created directory. We create a new attribute with the data in the attribute and other data we have pulled.
      const newCoin = {
        ...coinsArray[i],
        image: image.large,
        currentPrice: market_data.current_price.usd,
        name: data.name
      }
      
      // We add all the attributes to the array we defined above, respectively.
      fetchArray.push(newCoin)

    }

    // We save the defined array in a useState variable that we will use.
    setNewCoinsArray(fetchArray)
  }

  useEffect(() => {  
    fetchCoinData()
  }, [])


  // We reflect the array, including our new data created above, to the user.
  const returnRows = () => {
    
    return newCoinsArray.map((e,i)=>{

      const spendMoney = e.price * e.amount

      return(
        <View 
          style={styles.row}
          key={i}  
        >
          <View style={styles.line}>
            
            <Image 
              source={{uri:`${e.image}`}}
              style={styles.icon}
            />
            
            <Text 
              style={{
                fontFamily: 'Roboto-Light',
                fontSize: 16,
                marginLeft: 10,
                color: '#DDDDDD'
              }}
            >
                {e.name}
            </Text>

            <Text 
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: 16,
                position: 'absolute',
                right: 20,
                color: '#DDDDDD'
              }}
            >
              ${(e.currentPrice * e.amount).toFixed(2)}
            </Text>

          </View>              

          <View style={styles.line}>
            
            <View style={styles.detail}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../assets/price.png') }
              />
              <Text style={styles.detailText}>
                ${e.price}
              </Text>
            </View>

            <View style={styles.detail}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../assets/buy.png') }
              />
              <Text style={styles.detailText}>
                ${spendMoney.toFixed(2)}
              </Text>
            </View>
            
            
            <View style={styles.detail}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../assets/graph.png') }
              />
              <Text style={styles.detailText}>
                ${e.currentPrice.toFixed(2)}
              </Text>
            </View>
            
            
              <TouchableOpacity style= {styles.delete}
              onPress={()=>{    
                handleDeleteButton(e)
              }}
              >
                <Image
                  style={{width: 25, height: 25}}
                  source={require('../assets/delete.png') }
                />
              </TouchableOpacity>
                      
          </View>
     
        </View>
      )
    })
  }

  // Some functions or values to be used among the data to be projected.

  const totalBalanceFunc = () => {
    let totalBalance = 0
    newCoinsArray.forEach((e) => {
      totalBalance += (e.currentPrice * e.amount)
    })
    setTotalBalance(totalBalance)
  }
  
  const totalSpendFunc = () => {
    let totalSpend = 0
    newCoinsArray.forEach((e) => {
      totalSpend += (e.price * e.amount)
    })
    setTotalSpend(totalSpend)
  }
  
  useEffect(() => {
    totalBalanceFunc()
    totalSpendFunc()
  }, [newCoinsArray])
  
  const walletPercentage = () => {
    let final = totalBalance
    let first = totalSpend
  
    let percent = ((final - first) / Math.abs(first)) * 100
    setPercent(percent)
  }
  
  useEffect(() => {
    walletPercentage()
  }, [totalBalance, totalSpend])

  // The function that allows the desired row to be deleted on the screen displayed with the returnRows function.
  const  handleDeleteButton = (coin) =>{
    // We got the ID of the selected row.
    let attributeId = coin.id

    // We saved the JSON we pulled from MMKV in the data.
    const data = JSON.parse(jsonCoins)
    
    // Using the row's ID, that attribute was deleted in the data.
    delete data[attributeId]
    
    // We updated the deleted JSON and database.
    const updatedJson = JSON.stringify(data)
    storage.set('coins', (updatedJson))

    // We re-run the function that we pulled data to refresh the page and remove the deleted coin.
    fetchCoinData()
  }

   // Define a function to handle the search button press.
   const handleSearchButton = () => {
    // If no search text is entered, display an alert.
    if(searchText.length<1){
      alert("Please enter coin name or symbol")
      return
    }

     // Fetch the search results from the CoinGecko API and update the state with the results.
    fetch(`https://api.coingecko.com/api/v3/search?query=${searchText}`)
    .then(res => res.json())
    .then(data => setSearchResult(data.coins))

    // Clear the search text input.
    setSearchText('')
  }

  // Return coins searched from input
  const returnSearched = () => {
    return searchResult.map((coin,index)=>{
      return(
        <TouchableOpacity 
          key={index}
          style={styles.searched}
          onPress={()=>{
            navigation.navigate('Coin Add', { selectedCoin: coin.id})
          }}
        >
          <Image 
            style={styles.searchedIcon} 
            source={{uri: `${coin.large}`}}
          />
          
          <Text
            style={{
              fontFamily: 'Roboto-Light',
              fontSize: 14,
              marginLeft: 20,
              color: '#DDDDDD'
            }}
          >
            {coin.name}
          </Text>

          <Text
            style={{
              fontFamily: 'Roboto-Bold',
              fontSize: 14,
              position: 'absolute',
              right: 10,
              color: '#DDDDDD'
            }}
          >
            {coin.market_cap_rank}
          </Text>
        </TouchableOpacity>
      )
    })
  }

  return (
    <View style={styles.container}>

      <View style={styles.total}>   
        
        <Text 
          style={{
            fontFamily: 'Roboto-Light',
            fontSize: 18,
            marginTop: 20,
            marginLeft: 20,
            color: '#222222'
          }}
        >
          Total estimated value
        </Text>
        
        {/* to center numbers vertically */}
        <View style={styles.totalPrice}>
          
          <Text 
            style={{
              fontFamily: 'Roboto-Light', 
              fontSize: 18,
              marginLeft: 20,
              color: '#222222'
            }}
          >
            $
          </Text>

          <Text 
            style={{
              fontFamily: 'Roboto-Bold',
              fontSize: 40,
              marginLeft: 5,
              color: '#222222'
            }}
          >
            {totalBalance.toFixed(2)}
          </Text>

          <View style={[styles.totalPercent, {backgroundColor: percent < 0 ? '#FFA500':'#00FA9A'}]}>

            <Text 
              style={{
                fontFamily: 'Roboto-Light',
                fontSize: 18,
                color: '#222222'
              }}
            >
              {percent.toFixed(0)}%
            </Text>
          </View>

        </View>

        <Text
            style={{
              fontFamily: 'Roboto-Light',
              fontSize: 18,
              marginLeft: 20,
              marginTop: 10,
              color: '#222222'
            }}
          >
            Total spend
          </Text>
 
        {/* to center numbers vertically */}
        <View style={styles.totalSpend}>
          
          <Text
            style={{
              fontFamily: 'Roboto-Light', 
              fontSize: 18,
              marginLeft: 20,
              color: '#222222'
            }}
          >
            $
          </Text>

          <Text
            style={{
              fontFamily: 'Roboto-Bold',
              fontSize: 25,
              marginLeft: 5,
              color: '#222222'
            }}
          >
            {totalSpend.toFixed(2)}
          </Text>

          <TouchableOpacity 
            style={styles.refresh}
            onPress={()=>{fetchCoinData()}}
          >
            <Text 
              style={{
                fontFamily: 'Roboto-Light',
                fontSize: 14,
                color: '#DDDDDD'
              }}
            >
              refresh
            </Text>
          </TouchableOpacity>

        </View>
        
      </View>

      {
        isButtonPressed ? (
          
          // After clicking the add button
          <View style={styles.coinSearch}>
            <View style={styles.inputView}>
        
              {/* Back button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={()=>{setIsButtonPressed(false)}}
              >

                <Image 
                  style={{width:25, height:25}} 
                  source={require('../assets/back.png')}
                />

              </TouchableOpacity>

              <TextInput 
                style={styles.input}
                placeholder="Type a coin name"
                placeholderTextColor="#DDDDDD"
                onChangeText={setSearchText}
                value={searchText}
              />

              <TouchableOpacity
                style={styles.searchButton}
                onPress={()=>{handleSearchButton()}}
              >
                
                <Image 
                  style={{width:25, height:25}} 
                  source={require('../assets/search.png')}
                />

              </TouchableOpacity>

            </View>

            <ScrollView style={{flex:1, borderRadius: 10}}>
                {returnSearched()}
            </ScrollView>

          </View>

        ) : (
          
          // Before clicking the add button
          <ScrollView style={styles.wallet}>
            {/* Function with lines written above */}
            {returnRows()}
            
            {/* An append view at the end of the lines */}
            <View style={styles.add}>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={()=>{setIsButtonPressed(true)}}
              >

                <Image 
                  style={{width:25, height:25}} 
                  source={require('../assets/add.png')}
                />

              </TouchableOpacity>
            </View>
          </ScrollView>

        )
      }

    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#222222',
    alignItems: 'center'
  },

  total: {
    width: '95%',
    height: 175,
    borderRadius: 10,
    backgroundColor: '#D1E8E2',
    marginTop: 25
  },

  totalPrice: {
    width:'100%',
    flexDirection:'row', 
    alignItems: 'center',
    marginTop: 5,
  },

  totalPercent: {
    width: 60,
    height: 35,
    position: 'absolute',
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },

  totalSpend: {
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
    flexDirection: 'row',
  },

  refresh: {
    width: 60,
    height: '100%',
    borderRadius: 10,
    position: 'absolute',
    right: 20,
    backgroundColor: '#444444',
    justifyContent: 'center',
    alignItems: 'center'
  },

  wallet: {
    width: '95%',
    height: '65%',
    backgroundColor: '#222222',
    borderRadius: 10,
    marginTop: 10
  },

  row: {
    width: '100%',
    backgroundColor: '#333333',
    borderRadius: 10,
    marginTop: 5,
    height: 110,
  },

  line: {
    width: '100%',
    height: 40, 
    marginTop: 10, 
    alignItems: 'center', 
    flexDirection: 'row',
    backgroundColor: '#333333'
  },

  detail: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },

  detailText: {
    marginTop: 5,
    fontFamily: 'Roboto-Light',
    fontSize: 14,
    color: '#DDDDDD'
  },

  delete: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginLeft: 20
  },
  
  add: {
    width: '100%',
    height: 40,
    marginTop: 5,
    borderRadius: 10,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center'
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },

  coinSearch: {
    width: '95%',
    height: '65%',
    backgroundColor: '#333333',
    borderRadius: 10,
    marginTop: 10,
  },

  inputView: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#555555',
    flexDirection: 'row'
  },

  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },

  input: {
    flex:1,
    padding: 5,
    fontFamily: 'Roboto-Light',
    fontSize: 14,
    color: '#DDDDDD'
  },

  searched: {
    width:'100%',
    marginBottom: 1,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
    alignItems: 'center',
    flexDirection: 'row'
  },

  searchedIcon: {
    width:30,
    height:30,
    borderRadius: 30,
    marginLeft: 10,
  }

})

export default Homescreen