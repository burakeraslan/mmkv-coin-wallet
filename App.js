import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Homescreen from "./Components/Homescreen"
import Coinadd from "./Components/Coinadd"

import { useFonts } from 'expo-font'

const Stack = createNativeStackNavigator()

const App = () => {

  const [fontsLoaded] = useFonts({
    'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf')
  })

  return(
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen name="Home Screen"
          component={Homescreen}
          options={{headerShown: false}}
        />
        
        <Stack.Screen name="Coin Add"
          component={Coinadd}
          options={{
            headerTitle: "YOU BOUGHT",
            headerTitleStyle: {
              fontSize: 16,
              fontFamily: "Roboto-Bold",
              color: '#DDDDDD'
            },
            headerStyle: {
              backgroundColor: '#333333'
            },
            headerTintColor: '#DDDDDD'
          }}
          
        />

      </Stack.Navigator>
    </NavigationContainer>
  )

}

export default App