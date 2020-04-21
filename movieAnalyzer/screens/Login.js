import { View, Text, AppRegistry, Image, Icon, TextInput, TouchableOpacity, Linking, AsyncStorage, Alert } from 'react-native';
import React, { Component } from 'react';
import { Stitch, AnonymousCredential, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";

// Splash Screen that will appears before displaying the main page
class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      users: undefined,
    }
  }

  // check username and password validation 
  signin() {
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("app");
    const users = db.collection("movie_reviewer");
    if (this.state.username == undefined || this.state.username.length == 0) { // user haven't entered username
      Alert.alert('Alert', 'Please enter user name', [
        { text: 'OK' }
      ])
    } else {
      if (this.state.password == undefined || this.state.password.length == 0) { // user haven't entered password
        Alert.alert('Alert', 'Please enter password', [
          { text: 'OK' }
        ])
      } else {
        users.find({ user_name: this.state.username }).first().then((doc) => { // user enters unexisted username
          if (doc == undefined) {
            Alert.alert('Alert', 'Incorrect username or password', [
              { text: 'OK' }
            ])
          }
          else {
            if (this.state.password != doc.pwd) {
              Alert.alert('Alert', 'Incorrect username or password', [ // user enter incorrect password
                { text: 'OK' }
              ])
            } else {
              AsyncStorage.setItem("username", this.state.username); // authentication complete 
              this.props.navigation.navigate('Main')
            }
          }
        })
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')}
          style={{ marginBottom: 50, width: 200, height: 200, alignSelf: 'center' }}
        />
        <View style={styles.regform}>
          <Text style={styles.header}>WELCOME</Text>
        </View>

        <TextInput
          style={styles.text_input_name}
          placeholder='Your name'
          placeholderTextColor='#fff'
          autoCapitalize='none'
          onChangeText={(text) => this.setState({ username: text })} />

        <TextInput
          style={styles.text_input_password}
          placeholder='Your password'
          placeholderTextColor='#fff'
          autoCapitalize='none'
          secureTextEntry={true}
          onSubmitEditing={()=> this.signin()}
          onChangeText={(text) => this.setState({ password: text })} />

        <View style={{ marginTop: 5, height: 20, alignSelf: 'baseline' }}>
          <Text style={{ color: '#fff' }}>Do not have account?</Text>
        </View>
        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Registration') }}>
          <Text style={{ color: '#871614' }}>{'<Create new account>'}</Text>
        </TouchableOpacity>

        {/* check the authentication */}
        <TouchableOpacity style={styles.btn} onPress={() => this.signin()}> 
          <Text style={{ color: '#fff' }}>Login</Text>
        </TouchableOpacity>


      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 60,
    paddingRight: 60,
    backgroundColor: '#000',
  },
  regform: {
    alignSelf: 'stretch',
    borderBottomWidth: 2,
    borderBottomColor: '#871614',
    marginBottom: 40
  },
  header: {
    fontSize: 24,
    color: '#fff',
    paddingBottom: 10,
    alignSelf: 'center'
  },
  text_input_name: {
    alignSelf: 'stretch',
    height: 50,
    padding: 10,
    color: '#fff',
    borderColor: '#871614',
    borderWidth: 1,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  text_input_password: {
    alignSelf: 'stretch',
    height: 50,
    padding: 10,
    color: '#fff',
    borderColor: '#871614',
    borderWidth: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  btn: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
    marginTop: 50,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10
  }
}

export default LoginScreen;