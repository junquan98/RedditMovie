import { Component } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Animatable from 'react-native-animatable';
import { Avatar, Badge, Icon, withBadge, SearchBar } from 'react-native-elements';
import { AuthSession } from 'expo';
import { TouchableHighlight, Dimensions, Alert } from 'react-native'
import { Stitch, AnonymousCredential, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";
AnimatImg = Animatable.createAnimatableComponent(Image);
AnimatView = Animatable.createAnimatableComponent(View);
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  AsyncStorage,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
var {height, width} = Dimensions.get('window');
const axios = require('axios');

// Default class that represent the main components  in the
// home page
export default class Registration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      height:height,
      width:width,
      username: undefined,
      password: undefined,
    }
    // detec the change of orientation and resize the screen
    Dimensions.addEventListener('change', (event) => {
      this.setState({
        height: event.window.height,
        width: event.window.width,
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')}
          style={{marginBottom:73, width: 250, height: 150, alignSelf:'center'}}
        />
        <View style={styles.regform}>
            <Text style={styles.header}>Registration</Text>
        </View>

        <TextInput 
        style={styles.text_input} 
        placeholder='Your name' 
        autoCapitalize = 'none'
        onChangeText={(text) => this.setState({username: text})}
        placeholderTextColor='#fff'/>

        <TextInput 
        style={styles.text_input} 
        placeholder='Your password' 
        autoCapitalize = 'none'
        onChangeText={(text) => this.setState({password: text})}
        placeholderTextColor='#fff' 
        secureTextEntry={true}/>

        <TouchableOpacity style={styles.btn} onPress={()=>{
            const stitchAppClient = Stitch.defaultAppClient;
            const mongoClient = stitchAppClient.getServiceClient(
              RemoteMongoClient.factory,
              "mongodb-atlas"
            );
            const db = mongoClient.db("app");
            const users = db.collection("movie_reviewer");
            if(this.state.username==undefined || this.state.username.length == 0){ // check whether user has entered username
                Alert.alert('Alert','Please enter user name',[
                    {text: 'OK'}
                    ])
            }else{
                if(this.state.password==undefined || this.state.password.length == 0) { // check whether user has entered password
                    Alert.alert('Alert','Please enter password',[
                        {text: 'OK'}
                        ])
                }else{
                    users.find({user_name:this.state.username}).first().then((doc) => {
                        
                        if(doc == undefined){
                            users.insertOne({user_name:this.state.username, pwd:this.state.password}).then(result => { // no existed username in databse and create a new account 
                                Alert.alert('Note','Successfully creat an Account',[
                                    {text: 'OK'}
                                    ])
                                this.props.navigation.navigate('Login') // navigate to login page after successfully creating the account
                            })    
                        }
                        else{
                        Alert.alert('Alert','User name already exists',[ // user enters an username which is already existed
                            {text: 'OK'}
                            ])
                        }
                        
                    })
                }
            }
        }}>
            <Text style={{color: '#fff'}}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignSelf:'center', marginTop:15}} onPress={()=>{ // a Back button to go back to the login page
            this.props.navigation.navigate('Login')
        }}>
            <Text style={{color: '#871614', fontSize:15}}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft:60,
    paddingRight:60,
    backgroundColor: '#000',
  },
  regform: {
      alignSelf:'stretch',
      borderBottomWidth: 2,
      borderBottomColor: '#871614',
      marginBottom: 40
  },
  header: {
    fontSize: 24,
    color: '#fff',
    paddingBottom: 10,
  },
  text_input: {
      alignSelf: 'stretch',
      height: 40,
      marginBottom: 30,
      color: '#fff',
      borderBottomColor: '#871614',
      borderBottomWidth: 1,
  },
  btn:{
      alignSelf: 'stretch',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#000',
      marginTop: 30,
      borderWidth:1,
      borderColor: '#fff',
      borderRadius: 10
  }
  
});