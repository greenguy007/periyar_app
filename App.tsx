import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native';
import {StatusBar} from 'react-native/Libraries/Components/StatusBar/StatusBar';
import LoginScreen from './src/screens/LoginScreen.tsx';
import MainNavigation from './src/navigation/MainNavigation.tsx';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  if (isLoggedIn === null) {
    return <></>;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {!isLoggedIn ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <Stack.Screen name="Main" component={MainNavigation} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
