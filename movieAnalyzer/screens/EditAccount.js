import { Component } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar, Badge, withBadge, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
export default class EditAccount extends Component {

  constructor(props) {
    super(props);
    this.state = {
      height:height,
      width:width,
      username: undefined,
      password: this.props.navigation.getParam('password', ''), // get the user info from the account page via props
      name: this.props.navigation.getParam('name', ''),
      email: this.props.navigation.getParam('email', ''),
      bio: this.props.navigation.getParam('bio', ''),
    }
    // detec the change of orientation and resize the screen
    Dimensions.addEventListener('change', (event) => {
      this.setState({
        height: event.window.height,
        width: event.window.width,
      });
    });
  }

  // helper function to update the current change user made to the online storage
  async update(name, email, bio, password){
    let username = await AsyncStorage.getItem("username")
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("app");
    this.users = db.collection("movie_reviewer");
    this.users.updateOne({user_name: username}, {$set:{name:name, email:email, bio:bio, pwd:password}}).then(()=>{
        Alert.alert('Update Success','Account updated.',[ // update successfully
            {text: 'OK'},
        ])
    })
  }

  render() {
    return ( // all of the text inputs have already filled by original data.
    <LinearGradient colors={['#555555', '#303030', '#101010']} style={{flex:1}}>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')}
          style={{marginBottom:60, width: 250, height: 150, alignSelf:'center'}}
        />
        <View style={styles.regform}>
            <Text style={styles.header}>Edit Your Account</Text>
        </View>

        <View style={{flexDirection:'row', borderBottomColor: '#871614',borderBottomWidth: 1,}}>
            <Icon style={{alignSelf: 'stretch'}} color={'#871614'} name='account-circle' size={22} />
            <TextInput style={{alignSelf: 'stretch',color: '#fff' ,paddingBottom:5 ,paddingLeft:10}} 
            defaultValue={this.state.name}
            onChangeText={(text) => this.setState({name: text})}
            autoCapitalize = 'none'/>
        </View>

        <View style={{flexDirection:'row',marginTop:15 ,borderBottomColor: '#871614',borderBottomWidth: 1,}}>
            <Icon style={{alignSelf: 'stretch'}} color={'#871614'} name='email' size={22} />
            <TextInput style={{alignSelf: 'stretch',color: '#fff' ,paddingBottom:5 ,paddingLeft:10}} 
            defaultValue={this.state.email}
            onChangeText={(text) => this.setState({email: text})}
            autoCapitalize = 'none'/>
        </View>

        <View style={{flexDirection:'row',marginTop:15 , borderBottomColor: '#871614',borderBottomWidth: 1,}}>
            <Icon style={{alignSelf: 'stretch'}} color={'#871614'} name='bio' size={22} />
            <TextInput style={{alignSelf: 'stretch',color: '#fff' ,paddingBottom:5 ,paddingLeft:10}} 
            defaultValue={this.state.bio}
            onChangeText={(text) => this.setState({bio: text})}
            autoCapitalize = 'none'/>
        </View>

        <View style={{flexDirection:'row',marginTop:15 , borderBottomColor: '#871614',borderBottomWidth: 1,}}>
            <Icon style={{alignSelf: 'stretch'}} color={'#871614'} name='key' size={22} />
            <TextInput style={{alignSelf: 'stretch',color: '#fff' ,paddingBottom:5 ,paddingLeft:10}} 
            defaultValue={this.state.password}
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
            autoCapitalize = 'none'/>
        </View>

        <TouchableOpacity style={styles.btn} onPress={()=>{// a button to update the change
            this.update(this.state.name, this.state.email, this.state.bio, this.state.password)
        }}>
            <Text style={{color: '#fff'}}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignSelf:'center', marginTop:15}} onPress={()=>{ // a Back button to go back to the account page
            this.props.navigation.goBack();
        }}>
            <Text style={{color: '#871614', fontSize:15}}>Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
    );
  }


}

EditAccount.navigationOptions = {
    header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft:60,
    paddingRight:60,
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
      marginBottom: 40,
      color: '#fff',
      borderBottomColor: '#871614',
      borderBottomWidth: 1,
  },
  btn:{
      alignSelf: 'stretch',
      alignItems: 'center',
      padding: 20,
      marginTop: 30,
      borderWidth:1,
      borderColor: '#fff',
      borderRadius: 10
  }
  
});