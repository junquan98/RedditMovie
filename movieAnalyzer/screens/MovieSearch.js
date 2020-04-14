import { Component } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Animatable from 'react-native-animatable';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
AnimatImg = Animatable.createAnimatableComponent(Image);
AnimatView = Animatable.createAnimatableComponent(View);
import React from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  View,
  Text,
  Animated,
  ScrollView,
} from 'react-native';
const { width, height } = Dimensions.get('window');
const axios = require('axios');
const paddingAnimation = new Animated.Value(0.25 * height);
export default class MovieSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      data: [],
      paddingTo: 0.25 * height,
      table: null,
    }
    // detec the change of orientation and resize the screen
    Dimensions.addEventListener('change', (event) => {
      this.render();
    });
  }

  search(input) {
    if (input.length > 0) {
      this.state.paddingTo = 40;
    } else {
      this.state.paddingTo = 0.25 * height;
    }
    this.setState({
      input: input,
    });
  }

  findReview(input) { }

  render() {
    if (this.state.input.length > 0) {
      rows = [];
      for (let i = 0; i < 40; i++) {
        row =
          <View key={i} style={styles.row}>
            <Image key={i + 2 * 40} style={styles.movieImg} source={{ uri: 'https://facebook.github.io/react-native/img/tiny_logo.png' }} />
            <View key={i + 3 * 40} style={styles.movies}>
              <Text key={i + 4 * 40} style={styles.movieName}>{"movie" + i}</Text>
            </View>
          </View>;
        rows.push(row);
      }
      if (rows.length == 0) {
        rows.push(
          <View key={"nomoviecotainer"} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 0.5 * height }}>
            <Text key={"nomovie"} style={styles.movieName}>No Movie Found</Text>
          </View>);
      }
      this.state.table = rows;
    } else {
      this.state.table = null;
    }
    Animated.timing(paddingAnimation, { toValue: this.state.paddingTo, duration: 1000 }).start();

    return (
      <LinearGradient colors={['#555555', '#303030', '#101010']} style={styles.container}>
        <AnimatView animation='fadeInDown'>
          <Animated.View style={[{ alignItems: "center", paddingTop: paddingAnimation }]}>
            <Image
              style={{ width: 200, height: 200 }}
              source={require('../assets/images/logo.png')}
            />
            <TextInput
              placeholder="Search a movie..."
              placeholderTextColor='white'
              style={styles.input}
              autoCapitalize='none'
              returnKeyType='next'
              autoCorrect={false}
              value={this.state.input}
              onSubmitEditing={null}
              onChangeText={(input) => this.search(input)}
            />
          </Animated.View>
        </AnimatView>
        <ScrollView style={styles.grid}>
          {this.state.table}
        </ScrollView>
      </LinearGradient>
    );
  }

  componentDidMount() {
  }

}

MovieSearch.navigationOptions = {
  header: null
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    height: 50, width: 0.8 * width, borderColor: 'gray', borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10, paddingRight: 30,
    marginBottom: 10,
    fontSize: 20,
    fontFamily: 'AppleSDGothicNeo-Thin',
    textAlign: "left",
    backgroundColor: 'transparent',
    color: 'white',
  },
  row: {
    flexDirection: "row",
    flex: 1,
    width: 0.8 * width,
    height: 100,
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  movies: {
    marginLeft: 20,
    width: 0.8 * width - 60,
    height: 90,
    flex: 1,
    justifyContent: 'center',
  },
  movieName: {
    fontFamily: 'AppleSDGothicNeo-Thin',
    fontSize: 25,
    color: 'white',
  },
  movieImg: {
    width: 60, height: 90,
  },
  grid: {
    width: 0.8 * width,
    height: 0.6 * height,
  },
});