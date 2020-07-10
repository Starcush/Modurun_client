import React from 'react';
import { Provider } from 'react-redux';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import Developer from './components/Developer';
import store from './redux/store';
import ProductionApp from './components/ProductionApp';

navigator.geolocation = Location;

const Stack = createStackNavigator();
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Developer">
          <Stack.Screen options={{ headerShown: false }} name="ProductionApp" component={ProductionApp} />
          <Stack.Screen name="Developer" component={Developer} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
