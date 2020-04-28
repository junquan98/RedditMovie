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
  TouchableHighlight,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const axios = require('axios');
const CancelToken = axios.CancelToken;
const paddingAnimation = new Animated.Value(0.25 * height);
const image_url_base = "http://image.tmdb.org/t/p/w185";
const key = 'dd2663f90eea8915b4119abab4159ba6';
var cancel = null;
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

  async search() {
    if (cancel != null) {
      cancel();
      cancel = null;
    }
    if (this.state.input.length > 0) {
      this.state.paddingTo = 40;
      await axios.get("https://api.themoviedb.org/3/search/movie?api_key=" + key + "&query=" + this.state.input, {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        })
      }).then((res) => {
        let data = res.data.results;
        cancel = null;
        this.setState({
          data: data,
        })
      }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log("Request cancelled.");
        }
      });
    } else {
      this.setState({
        data: [],
        paddingTo: 0.25 * height
      });
    }
  }

  render() {
    if (this.state.input.length > 0) {
      rows = [];
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.state.data[i].release_date) {
          year = "(" + this.state.data[i].release_date.split("-")[0] + ")";
        } else {
          year = ""
        }
        row =
          <TouchableHighlight key={i + 5 * this.state.data.length}
            onPress={() => {
              this.props.navigation.navigate("Movie", {
                name: this.state.data[i].original_title,
                img: this.state.data[i].poster_path,
                desp: this.state.data[i].overview,
                isfav: null,
              })
            }}>
            <View key={i} style={styles.row} >
              <Image key={i + 2 * this.state.data.length} style={styles.movieImg} source={{ uri: image_url_base + this.state.data[i].poster_path }} />
              <View key={i + 3 * this.state.data.length} style={styles.movies}>
                <Text key={i + 4 * this.state.data.length} style={styles.movieName}>{this.state.data[i].original_title + year}</Text>
              </View>
            </View>
          </TouchableHighlight>;
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
    Animated.timing(paddingAnimation, { toValue: this.state.paddingTo, duration: 500 }).start();

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
              onChangeText={(input) => { this.setState({ input: input }); this.state.input = input; this.search(); }}
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