import { Component } from 'react';
import { Stitch, AnonymousCredential, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";
import * as Animatable from 'react-native-animatable';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, withTheme } from 'react-native-elements';
import AnimatedLoader from "react-native-animated-loader";

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
    Linking,
    AsyncStorage,
    ImageBackground,
} from 'react-native';
const axios = require('axios');
const { height, width } = Dimensions.get('window');
const image_url_base = "http://image.tmdb.org/t/p/original";

export default class Movie extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            img: "",
            desp: "",
            isfav: false,
            reviews: [],
            score: 0,
        }
        // detec the change of orientation and resize the screen
        Dimensions.addEventListener('change', () => {
            this.render();
        });
        if (this.props.navigation != null) {
            this.focusListener = this.props.navigation.addListener('didFocus', (data) => {
                if (data && data.state && this.state.name == "") {
                    if (data.state.params.fav == null) {
                        this.checkFav(data.state.params);
                    } else {
                        this.state.name = data.state.params.name;
                        this.state.img = image_url_base + data.state.params.img;
                        this.state.desp = data.state.params.desp;
                        this.state.isfav = data.state.params.fav;
                        this.getData();
                    }
                }
            });
        }
    }

    async checkFav(params) {
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("app");
        const users = db.collection("movie_reviewer");
        let username = await AsyncStorage.getItem("username");
        users.find({ user_name: username, "favs.name": params.name }).asArray().then((doc) => {
            if (doc.length > 0) {
                this.state.isfav = true;
            }
            this.state.name = params.name;
            this.state.img = image_url_base + params.img;
            this.state.desp = params.desp;
            this.getData();
        });
    }
    async unfav() {
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("app");
        const users = db.collection("movie_reviewer");
        let username = await AsyncStorage.getItem("username");
        users.findOneAndUpdate(
            { user_name: username },
            { $pull: { favs: { name: this.state.name } } },
        ).then(() => {
            console.log("ok");
            this.setState({
                isfav: false
            });
        }).catch(() => { console.log("REMOVE ERROR") })
    }
    async fav() {
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("app");
        const users = db.collection("movie_reviewer");
        let username = await AsyncStorage.getItem("username");
        users.findOneAndUpdate(
            { user_name: username },
            {
                $push: {
                    favs: {
                        name: this.state.name,
                        img_url: this.state.img.slice(image_url_base.length),
                        desp: this.state.desp,
                        score: this.state.score,
                        isfav: true
                    }
                }
            },
        ).then(() => {
            console.log("ok");
            this.setState({
                isfav: true
            });
        }).catch(() => { console.log("FAV ERROR") })
    }

    render() {
        if (this.state.name == "") {
            return (
                <LinearGradient colors={['#555555', '#303030', '#101010']} style={styles.container}>
                    <AnimatedLoader
                        visible={true}
                        overlayColor="rgba(255,255,255,0)"
                        source={require("./loader_washhand.json")}
                        animationStyle={styles.lottie}
                        speed={1}
                    />
                </LinearGradient>
            );
        }
        let rows = [];
        rows.push(
            <View key={'fav'} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => {
                    if (this.state.isfav) {
                        this.unfav();
                    } else {
                        this.fav();
                    }
                }}>
                    <Icon
                        size={20}
                        reverse
                        name={this.state.isfav ? 'favorite' : 'favorite-border'}
                        color='#D95A43'
                    />
                </TouchableOpacity>
                <Text key={"score"} style={[styles.score, { color: this.state.score > 75 ? "#D95A43" : "#fff" }]}>{this.state.score + "%"}</Text>
            </View>);
        for (let i = 0; i < this.state.reviews.length; i++) {
            rows.push(
                <TouchableOpacity key={i + 5 * this.state.reviews.length}
                    onPress={() => { Linking.openURL(this.state.reviews[i].url) }}>
                    <View key={i + 3 * this.state.reviews.length} style={[styles.reviewContainer, { backgroundColor: this.state.reviews[i].isGood ? "#A11614" : "black" }]}>
                        <Text key={i + 4 * this.state.reviews.length} style={styles.review}>{this.state.reviews[i].text}</Text>
                    </View>
                </TouchableOpacity>);
        }
        return (

            <ImageBackground style={{ width: "auto", height: "100%" }} source={{ uri: this.state.img }}>
                <ScrollView style={styles.container}>
                    <AnimatView animation='fadeInDown' style={styles.header}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.goBack();
                        }}>
                            <Icon
                                reverse
                                name='arrow-back'
                                color='#871614'
                            />
                        </TouchableOpacity>
                    </AnimatView>
                    <AnimatView style={styles.desp} animation='fadeInLeft'>
                        <Text style={styles.text}>{this.state.desp}</Text>
                    </AnimatView>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>{rows}</View>
                </ScrollView>
            </ImageBackground>

        );
    }

    async getData() {
        if (this.state.name.length > 0) {
            await axios.get("https://sheltered-bastion-68183.herokuapp.com/get_rate?name=" + encodeURIComponent(this.state.name),
                {}).then((res) => {
                    let data = JSON.parse(res.data);
                    let reviews = [];
                    for (let i = 0; i < data.reviews.length; i++) {
                        let info = {};
                        info['url'] = data.reviews[i].url;
                        info['text'] = data.reviews[i].review;
                        info['isGood'] = data.reviews[i].feedback == "Good" ? true : false;
                        reviews.push(info);
                    }
                    this.setState({
                        reviews: reviews,
                        score: data.score
                    });
                })
        }
    }

    componentDidMount() {
        this.getData();
    }
}



Movie.navigationOptions = {
    header: null
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lottie: {
        width: 200,
        height: 200,
    },
    header: {
        flexDirection: 'row',
        marginTop: 0.1 * height,
        marginLeft: 0.08 * width,
    },
    desp: {
        backgroundColor: "rgba(100, 22, 20, 0.75)",
        width: 0.7 * width,
        marginTop: 0.05 * height,
        alignSelf: 'flex-end',
        padding: 20,
        marginBottom: 30,
    },
    text: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'American Typewriter'
    },
    score: {
        fontSize: 70,
        textAlign: "center",
        fontFamily: 'BradleyHandITCTT-Bold',
    },
    reviewContainer: {
        padding: 20,
        width: 0.8 * width,
        borderWidth: 1,
        borderColor: '#8D1113',
    },
    review: {
        color: 'white'
    },
});