import { Component } from 'react';
import { Stitch, AnonymousCredential, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions,TouchableHighlight } from 'react-native';
AnimatImg = Animatable.createAnimatableComponent(Image);
AnimatView = Animatable.createAnimatableComponent(View);
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
} from 'react-native';
const { height, width } = Dimensions.get('window');

export default class Favorite extends Component {

  constructor(props) {
    super(props);
    this.state = {
      table: []
    }
    // detec the change of orientation and resize the screen
    Dimensions.addEventListener('change', () => {
      this.render();
    });
  }

  render() {

    return (
      <LinearGradient colors={['#555555', '#353535', '#101010']} style={styles.container} >
        <AnimatView animation='fadeInDown'>
          <Text style={styles.title}> FAVs </Text>
          <ScrollView style={styles.grid}>
            {this.state.table}
          </ScrollView>
        </AnimatView>
      </LinearGradient>

    );
  }

  async getData() {
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("app");
    const users = db.collection("movie_reviewer");
    let username = await AsyncStorage.getItem("username");
    console.log(username)
    users.find({ user_name: username }).asArray().then((doc) => {
      let data = doc[0].favs;
      rows = [];
      for (let i = 0; i < data.length; i++) {
        row =
          <TouchableHighlight key={i} style={styles.row}
            onPress={() => {
              this.props.navigation.navigate("Movie", {
                name: data[i].name,
                img: data[i].img_url,
                desp: data[i].desp,
              })
            }}>
            <View key={i + 3 * 200} style={styles.movies}>
              <Text key={i + 4 * 200} style={styles.movieName}>{data[i].name}</Text>
              <Text key={i + 5 * 200} style={[styles.score, { color: data[i].score > 75 ? "#FA320A" : "#fff" }]}>{data[i].score}</Text>
            </View>
          </TouchableHighlight>;
        rows.push(row);
      }
      if (rows.length == 0) {
        rows.push(
          <View key={"nomoviecotainer"} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 0.5 * height }}>
            <Text key={"nomovie"} style={styles.movieName}>No Favorites</Text>
          </View>);
      }
      this.setState({
        table: rows,
      });
    })
  }

  componentDidMount() {
    this.getData();
  }

}



Favorite.navigationOptions = {
  header: null
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'AppleSDGothicNeo-Thin',
    marginTop: 0.1 * height,
  },
  row: {
    flexDirection: "row",
    flex: 1,
    width: 0.8 * width,
    height: 100,
    marginTop: 15,
    marginLeft: 30,
    marginRight: 20,
  },
  grid: {
    width: width,
    height: 0.8 * height,
    marginTop: 10,
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
  score: {
    fontFamily: 'AppleSDGothicNeo-Bold',
    fontSize: 20
  },
  movieImg: {
    width: 60, height: 90,
  },
});