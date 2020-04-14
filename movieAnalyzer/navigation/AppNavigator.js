import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator, HeaderBackButton } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/Login';
import Registration from '../screens/Registration';

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Login: LoginScreen,
    Main: MainTabNavigator,
    Registration: Registration,

  })
);
