import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import MovieSearch from '../screens/MovieSearch';
import Favorite from '../screens/Favorite';
import Movie from '../screens/Movie';
import Setting from '../screens/Setting';
import Edit from '../screens/EditAccount';


import Library from '../screens/Library';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const MovieSearchStack = createStackNavigator(
  {
    MovieSearch: MovieSearch,
    Movie: Movie
  },
  config
);

MovieSearchStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "Movie") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible,
    tabBarLabel: 'search',
    tabBarIcon: ({ tintColor }) => (
      <Icon color={tintColor} name='search' size={23} />
    ),
  };
};
// MovieSearchStack.navigationOptions = {
//   tabBarLabel: 'search',
//   tabBarIcon: ({ tintColor }) => (
//     <Icon color={tintColor} name='search' />
//   ),
// };

MovieSearchStack.path = '';

// const FavoriteStack = createStackNavigator(
//   {
//     Favorite: Favorite,
//     Movie: Movie
//   },
//   config
// );

// FavoriteStack.navigationOptions = ({ navigation }) => {
//   let tabBarVisible;
//   if (navigation.state.routes.length > 1) {
//     navigation.state.routes.map(route => {
//       if (route.routeName === "Movie") {
//         tabBarVisible = false;
//       } else {
//         tabBarVisible = true;
//       }
//     });
//   }

//   return {
//     tabBarVisible,
//     tabBarLabel: 'favorite',
//     tabBarIcon: ({ tintColor }) => (
//       <Icon color={tintColor} name='favorite' size={23} />
//     ),
//   };
// };

// FavoriteStack.path = '';

const LibraryStack = createStackNavigator(
  {
    Library: Library,
    Movie: Movie
  },
  config
);

LibraryStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "Movie") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible,
    tabBarLabel: 'cinema',
    tabBarIcon: ({ tintColor }) => (
      <Icon color={tintColor} name='movie' size={23} />
    ),
  };
};

LibraryStack.path = '';



const SettingStack = createStackNavigator(
  {
    Setting: Setting,
    Favorite: Favorite,
    Movie: Movie,
    Edit: Edit,
  },
  config
);

SettingStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "Movie" | route.routeName === "Favorite"| route.routeName === "Edit") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible,
    tabBarLabel: 'Account',
    tabBarIcon: ({ tintColor }) => (
      <Icon color={tintColor} name='account-circle' size={23} />
    ),
  };
};

SettingStack.path = '';



const tabNavigator = createBottomTabNavigator({
  MovieSearchStack,
  LibraryStack,
  SettingStack,
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
