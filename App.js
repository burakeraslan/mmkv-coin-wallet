import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import HomeScreen from "./Components/Homescreen"
import Coin from "./Components/Coin"
import CoinAdd from "./Components/CoinAdd"

import { useFonts } from 'expo-font'

const Stack = createNativeStackNavigator()

const App = () => {

  const [fontsLoaded] = useFonts({
    'Roboto-Thin': require('./assets/fonts/Roboto-Thin.ttf')
  })

  return(
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen name="Home Screen"
          component={HomeScreen}
          options={{
            headerTitle: "WALLET",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 17,
              fontFamily: "Roboto-Thin",
            }
          }}
        
        />
        <Stack.Screen name="Coin"
          component={Coin}
          options={{
            headerTitle: "CHOOSE YOUR CRYPTO CURRENCY",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 17,
              fontFamily: "Roboto-Thin",
            }
          }}
        />
        <Stack.Screen name="Coin Add"
          component={CoinAdd}
          options={{
            headerTitle: "YOU BOUGHT",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 17,
              fontFamily: "Roboto-Thin",
            }
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  )

}

export default App