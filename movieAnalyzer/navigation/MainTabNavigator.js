import React from 'react';
import { Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import MovieSearch from '../screens/MovieSearch';
import Favorite from '../screens/Favorite';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const MovieSearchStack = createStackNavigator(
  {
    MovieSearch: MovieSearch,
  },
  config
);

MovieSearchStack.navigationOptions = {
  tabBarLabel: 'search',
  tabBarIcon: ({ tintColor }) => (
    <Icon color={tintColor} name='search' />
  ),
};

MovieSearchStack.path = '';

const FavoriteStack = createStackNavigator(
  {
    Favorite: Favorite,
  },
  config
);

FavoriteStack.navigationOptions = {
  tabBarLabel: 'favorite',
  tabBarIcon: ({ tintColor }) => (
    <Icon color={tintColor} name='favorite' />
  ),
};

FavoriteStack.path = '';


const tabNavigator = createBottomTabNavigator({
  MovieSearchStack,
  FavoriteStack,
},
  {
    tabBarOptions: {
      activeTintColor: '#871614',
      inactiveTintColor: '#a4a4a4',
      labelStyle: {
        fontSize: 18,
        fontFamily: 'AppleSDGothicNeo-Light',

      },
      style: {
        backgroundColor: '#101010',
        borderTopColor: 'transparent'
      },

    }
  });

tabNavigator.path = '';

export default tabNavigator;
