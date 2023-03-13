import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, ScrollView, Image, StyleSheet } from "react-native";

import { MMKV } from 'react-native-mmkv'
export const storage = new MMKV()

// Import the useFonts hook from Expo font
import { useFonts } from 'expo-font'

const HomeScreen = ({navigation}) => {

  // Load the Roboto-Thin font
  const [fontsLoaded] = useFonts({
    'Roboto-Thin': require('../assets/fonts/Roboto-Thin.ttf'),
  })

  // We call the recorded data using MMKV and save it to the array.
  const jsonCoins = storage.getString('coins')
  const coinsArray = jsonCoins ? Object.values(JSON.parse(jsonCoins)) : []

  const [newCoinsArray, setNewCoinsArray] = useState([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [totalSpend, setTotalSpend] = useState(0)
  const [result, setResult] = useState(0)
  const [bool, setBool] = useState(false)
  const [rowHeight, setRowHeight] = useState(90)

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

      const num = calculatePercentage(e.currentPrice, e.price)
      const spendMoney = e.price * e.amount

      return(
        <View 
          style={[HomeScreenStyles.row, {height: rowHeight}]}
          key={i}  
        >

          <View style={{width: '100%', height: 90, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
            <View style={HomeScreenStyles.iconView}>
              <Image 
                source={{uri:`${e.image}`}}
                style= {{width: 50, height: 50, borderRadius: 10}}
              />
            </View>

            <View style={HomeScreenStyles.nameView}>
              <Text style={{fontFamily: 'Roboto-Thin', fontWeight: '100', fontSize: 17, marginLeft: 5}}>
                {e.name}
              </Text>
            </View>
              
            <View style={HomeScreenStyles.priceView}>
              <Text style={{fontFamily: 'Roboto-Thin', fontWeight: '100', fontSize: 17}}>
                ${(e.currentPrice * e.amount).toFixed(2)}
              </Text>
            </View>
            <View style={HomeScreenStyles.infoView}>
              <View style={[
                            HomeScreenStyles.percentage,
                            {backgroundColor: num < 0 ? '#F5B7B1':'#ABEBC6'}
                            ]}>
                <Text style={{fontFamily: 'Roboto-Thin', fontWeight: '100', fontSize: 17}}> 
                  {calculatePercentage(e.currentPrice, e.price).toFixed(0)}%
                </Text>
              </View>
            </View>
          </View>
        
          <>
              {bool && (
                <View style={{width: '100%', height: 90, backgroundColor: 'white', flexDirection: 'row',justifyContent:'center', alignItems: 'center', borderRadius: 10, position: 'absolute', top: 70}}>
                  <View style={{width: '20%', height: '100%', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      style={{width: 20, height: 20}}
                      source={require('../assets/wallet.png') }
                    />
                    <Text style={{marginTop: 5, fontFamily: 'Roboto-Thin', fontWeight: '100', fontSize: 15}}>
                      {e.amount}
                    </Text>
                  </View>

                  <View style={{width: '20%', height: '100%', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      style={{width: 20, height: 20}}
                      source={require('../assets/price.png') }
                    />
                    <Text style={{marginTop: 5, fontFamily: 'Roboto-Thin', fontWeight: '100', fontSize: 15}}>
                      ${e.price}
                    </Text>
                  </View>

                  <View style={{width: '20%', height: '100%', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      style={{width: 20, height: 20}}
                      source={require('../assets/buy.png') }
                    />
                    <Text style={{marginTop: 5, fontFamily: 'Roboto-Thin', fontWeight: '100', fontSize: 15}}>
                      ${spendMoney.toFixed(2)}
                    </Text>
                  </View>
                  
                  
                  <View style={{width: '20%', height: '100%', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      style={{width: 20, height: 20}}
                      source={require('../assets/graph.png') }
                    />
                    <Text style={{marginTop: 5, fontFamily: 'Roboto-Thin', fontWeight: '100', fontSize: 15}}>
                      ${e.currentPrice.toFixed(2)}
                    </Text>
                  </View>
                  
                  <View style={{width: '10%', height: '100%', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity style= {{width: 35, height: 35, alignItems: 'center', justifyContent: 'center', borderRadius: 10}}
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
              )}
          </>

          <TouchableOpacity 
              style={{width: 25, height: 25, position: 'absolute', bottom: 0, left:'50%', transform: [{translateX: -20}], borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}
              onPress={()=>{
                if(bool==false){
                setBool(true)
                setRowHeight(2 * HomeScreenStyles.row.height)
                }else{
                  setBool(false)
                  setRowHeight(HomeScreenStyles.row.height)
                }
              }}
            >
              <Image
                style={{width: 20, height: 20}}
                source={bool ? require('../assets/up.png') : require('../assets/down.png')}
              />
            </TouchableOpacity>

        </View>
      )
    })
  }

  // Some functions or values to be used among the data to be projected.
  const calculatePercentage = (final, first) => {
    return (((final - first) / Math.abs(first)) * 100)
  }

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
  
    let result = ((final - first) / Math.abs(first)) * 100
    setResult(result)
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

  return (
    <View style={HomeScreenStyles.container}>
      <View style={HomeScreenStyles.walletResult}>

        <View style={HomeScreenStyles.totalBalance}>
          <View style={HomeScreenStyles.totalBalance1}>
            <Text style={HomeScreenStyles.totalBalanceText1}>
              TOTAL BALANCE
            </Text>
          </View>
          <View style={HomeScreenStyles.totalBalance2}>
            <Text style={HomeScreenStyles.totalBalanceText2}>
              $ {totalBalance.toFixed(2)}
            </Text>
            <View style={[HomeScreenStyles.result, {backgroundColor: result < 0 ? '#F5B7B1':'#ABEBC6'}]}>
              <Text style={{fontFamily: 'Roboto-Thin', fontWeight: '100', fontSize: 17}}>
                {result.toFixed(0)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={HomeScreenStyles.totalSpend}>
          <Text style={HomeScreenStyles.totalSpendText}>
            SPEND: $ {totalSpend.toFixed(2)}
          </Text>
        </View>
        
      </View>

      <ScrollView style={HomeScreenStyles.wallet}>
        <View style={HomeScreenStyles.walletScreen}>
          {returnRows()}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate('Coin')}
        style={HomeScreenStyles.addCoin}
      >
        <Image 
          style={{width: 20, height: 20}}
          source={require('../assets/add.png')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {fetchCoinData()}}
        style={HomeScreenStyles.refresh}
      >
        <Image 
          style={{width: 20, height: 20}}
          source={require('../assets/refresh.png')}
        />
      </TouchableOpacity>

    </View>
  )
}

const HomeScreenStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    alignItems: 'center'
  },

  addCoin: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#FAD7A0',
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  wallet: {
    width: '100%',
    backgroundColor: '#F0F0F0',
  },
  
  walletScreen: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0'
  },

  walletResult: {
    width: '95%',
    height: 150,
    backgroundColor: 'white',
    borderRadius: 10,
  },

  row: {
    width: '95%',
    margin: 2,
    backgroundColor: 'white',
    height: 90,
    borderRadius: 10,
  },

  iconView: {
    height: 75,
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  nameView: {
    width: 90,
    height: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
  },

  priceView: {
    width: 95,
    height: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
  },

  infoView: {
    width: 75,
    height: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
  },

  percentage: {
    width: '80%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },

  totalBalance: {
    width: '100%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 10
  },

  totalBalance1: {
    width: '100%',
    height: '50%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },

  totalBalanceText1: {
    fontFamily: 'Roboto-Thin',
    fontWeight: '100', 
    fontSize: 35
  },

  totalBalance2: {
    width: '100%',
    height: '50%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 10
  },

  totalBalanceText2: {
    fontFamily: 'Roboto-Thin',
    fontWeight: 'bold',
    fontSize: 35
  },

  result: {
    width: 60,
    height: 35,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },

  totalSpend: {
    width: '100%',
    height: '30%',
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  totalSpendText: {
    fontFamily: 'Roboto-Thin',
    fontWeight: '100',
    fontSize: 17
  },
  
  refresh: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#AED6F1',
    position: 'absolute',
    bottom: 20,
    left: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default HomeScreen