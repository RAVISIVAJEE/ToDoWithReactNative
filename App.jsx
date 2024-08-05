import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthProvider, useAuth} from './AuthContext';
import HomeScreen from './screens/HomeScreen';
import ViewTaskScreen from './screens/ViewTaskScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const {isAuthenticated} = useAuth();

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? 'Home' : 'Login'}>
      {isAuthenticated ? (
        <>
          {console.log('isauthenticated', isAuthenticated)}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ViewTasks" component={ViewTaskScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
