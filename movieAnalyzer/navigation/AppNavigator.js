import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator, HeaderBackButton } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/Login';
import Registration from '../screens/Registration';
import Favorite from '../screens/Favorite';
import Setting from '../screens/Setting';
import Edit from '../screens/EditAccount';

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    //Setting:Setting,
    //Edit: Edit,
    Login: LoginScreen,
    Main: MainTabNavigator,
    Registration: Registration,
  })
);
