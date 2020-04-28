import { View, Text, AppRegistry, Image, TextInput, TouchableOpacity, Linking, AsyncStorage, Alert, Dimensions, ScrollView } from 'react-native';
import React, { Component } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Stitch, AnonymousCredential, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
AnimatImg = Animatable.createAnimatableComponent(Image);
AnimatView = Animatable.createAnimatableComponent(View);
const { width, height } = Dimensions.get('window');

// Splash Screen that will appears before displaying the main page
class Setting extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      avatar_uri: undefined,
      username: 'empty',
      name: 'empty',
      password: 'empty',
      email:'empty',
      bio: 'empty',
    }
    const stitchAppClient = Stitch.defaultAppClient; // connect to mongodb 
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("app");
    this.users = db.collection("movie_reviewer");

    if (this.props.navigation != null) { // refresh the page after the user making any update
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
          this.getData();
        });
    }
  }

  render() {
    
    return (
        <LinearGradient colors={['#555555', '#303030', '#101010']} style={styles.container}>
            <View style={styles.account}>
                <AnimatView animation='flipInX' style={{alignItems: 'center',}}>
                    <TouchableOpacity onPress={this._pickImage}>
                        <Image
                        style={styles.avatar}
                        source={{uri: this.state.avatar_uri}}
                        defaultSource={require('../assets/images/logo.png')}
                        />
                    </TouchableOpacity>
                    
                </AnimatView>
            </View>
            <View style={{paddingLeft:60, paddingRight:60}}>
                <View style={styles.regform}>
                    <Text style={styles.header}>{this.state.username}</Text>
                </View>

                <ScrollView >
                    {/* Section for presenting user info */}
                    <Text style={{paddingTop:0.03*height, color:'#bfbfbf', fontSize:20}}>Info:</Text>

                    <View style={{flex:1 ,flexDirection:'row', marginTop:30, paddingLeft:12}}>
                        <Icon style={{alignSelf: 'stretch',height: 50}} color={'#871614'} name='account-circle' size={22} />
                        <Text style={{alignSelf: 'stretch',color: '#fff', paddingLeft:10, fontSize:17}}>{this.state.name}</Text>
                    </View>
                    
                    <View style={{flex:1 ,flexDirection:'row', paddingLeft:12}}>
                        <Icon style={{alignSelf: 'stretch',height: 50}} color={'#871614'} name='email' size={22} />
                        <Text style={{alignSelf: 'stretch',color: '#fff',paddingLeft:10, fontSize:17}}>{this.state.email}</Text>
                    </View>

                    <View style={{flex:1 ,flexDirection:'row', paddingLeft:12}}>
                        <Icon style={{alignSelf: 'stretch',height: 50}} color={'#871614'} name='bio' size={22} />
                        <Text style={{alignSelf: 'stretch',color: '#fff',paddingLeft:10, fontSize:17}}>{this.state.bio}</Text>
                    </View>

                    {/* Section of all functionalities including viewing favs, edit account, and sign out */}
                    <Text style={{paddingTop:5, color:'#bfbfbf', fontSize:20}}>Other:</Text>

                    <TouchableOpacity style={{flex:1 ,flexDirection:'row', paddingLeft:12, marginTop:30, justifyContent:'space-between'}} onPress={() => {
                        this.props.navigation.navigate('Favorite')
                    }}>
                        <View style={{flexDirection:'row'}}>
                            <Icon style={{alignSelf: 'stretch',height: 30, paddingTop:5}} color={'#871614'} name='playlist-play' size={22} />
                            <Text style={{alignSelf: 'stretch',color: '#fff',paddingTop:5 ,paddingLeft:10, fontSize:17}}>Your Favs</Text>
                        </View>
                        <Icon style={{alignSelf: 'stretch',height: 30}} color={'#871614'} name='circle-small' size={30}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex:1 ,flexDirection:'row', paddingLeft:12, marginTop:5, justifyContent:'space-between'}} onPress={()=>{
                        this.props.navigation.navigate('Edit',{
                            name:this.state.name,
                            email: this.state.email,
                            bio: this.state.bio,
                            password: this.state.password,
                        })
                    }}>
                        <View style={{flexDirection:'row'}}>
                            <Icon style={{alignSelf: 'stretch',height: 30, paddingTop:5}} color={'#871614'} name='account-edit' size={22} />
                            <Text style={{alignSelf: 'stretch',color: '#fff',paddingTop:5 ,paddingLeft:10, fontSize:17}}>Edit Account</Text>
                        </View>
                        <Icon style={{alignSelf: 'stretch',height: 30}} color={'#871614'} name='circle-small' size={30}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex:1 ,flexDirection:'row', paddingLeft:12, marginTop:5,justifyContent:'space-between'}} onPress={()=>{
                        Alert.alert('Confirm Sign Out','You are signing out of the app on this device.',[
                            {text: 'SIGN OUT', onPress: () => {
                                this.props.navigation.navigate('Login')
                            }},
                            {text: 'CANCEL'},
                        ])
                    }}>
                        <View style={{flexDirection:'row'}}>
                            <Icon style={{alignSelf: 'stretch',height: 30, paddingTop:5}} color={'#871614'} name='logout' size={22} />
                            <Text style={{alignSelf: 'stretch',color: '#fff',paddingTop:5 ,paddingLeft:10, fontSize:17}}>Log out</Text>
                        </View>
                        <Icon style={{alignSelf: 'stretch',height: 30}} color={'#871614'} name='circle-small' size={30}/>
                    </TouchableOpacity>
                    
                    
                </ScrollView>
            </View>
            
            
        </LinearGradient>
    );
  }

  // get the user info from mongodb
  async getData(){
    let username = await AsyncStorage.getItem("username")
    this.setState({username:username})
    this.users.find({ user_name: this.state.username }).first().then((doc) => {
        this.setState({password:doc.pwd})
        if('name' in doc)
            this.setState({name:doc.name})
        if('email' in doc)
            this.setState({email:doc.email})
        if('bio' in doc)
            this.setState({bio:doc.bio})
        if('avatar_uri' in doc && doc.avatar_uri !== '')
            this.setState({avatar_uri:doc.avatar_uri})
      })
  }

  // get permission to access the local camera and images
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  // let users choose the image theuy want for avatar using the local image uri
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
        this.users.updateOne({user_name: this.state.username}, {$set:{avatar_uri:result.uri}})
        this.setState({ avatar_uri: result.uri });
    }
  };

  // get data and permission at first
  componentDidMount() {
    this.getData();
    this.getPermissionAsync();
  }
}

Setting.navigationOptions = {
    header: null
};

const styles = {
    container: {
        flex: 1,
    },
    avatar: { 
        width: 120, 
        height: 120, 
        borderRadius:60, 
        borderColor:'#871614', 
        borderWidth:2
    },
    account: {
        height:0.22*height,
        marginTop: 0.09*height, 
        flexDirection:'row', 
        alignItems: 'center',
        justifyContent: 'center',
    },
    regform: {
        alignSelf: 'stretch',
        borderBottomWidth: 2,
        borderBottomColor: '#871614',
        marginBottom: 40,
    },
    header: {
        fontSize: 24,
        color: '#fff',
        paddingBottom: 10,
        alignSelf: 'center'
    },


}

export default Setting;