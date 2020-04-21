import { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';

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
    AsyncStorage,
    ImageBackground,
} from 'react-native';
const { height, width } = Dimensions.get('window');
const image_url_base = "http://image.tmdb.org/t/p/original";

export default class Movie extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            img: "",
            desp: "",
            data: [],
        }
        // detec the change of orientation and resize the screen
        Dimensions.addEventListener('change', () => {
            this.render();
        });
        if (this.props.navigation != null) {
            this.focusListener = this.props.navigation.addListener('didFocus', (data) => {
                if (data && data.state && this.state.name == "") {
                    this.setState({
                        name: data.state.params.name,
                        img: image_url_base + data.state.params.img,
                        desp: data.state.params.desp
                    })
                }
            });
        }
    }

    render() {
        if (this.state.name == "") {
            return (
                <LinearGradient colors={['#555555', '#303030', '#101010']} style={styles.container}>
                </LinearGradient>
            );
        }
        let reviews = [
            {
                'url': 'http://google.com',
                'isGood': true,
                'text': 'a good review'
            },
            {
                'url': 'http://google.com',
                'isGood': false,
                'text': 'a bad review'
            },
        ];
        let score = '80';

        let rows = [];
        rows.push(
            <View key={'fav'} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => {
                }}>
                    <Icon
                        size={20}
                        reverse
                        name='favorite'
                        color='#D95A43'
                    />
                </TouchableOpacity>
                <Text key={"score"} style={[styles.score, { color: parseInt(score) > 75 ? "#D95A43" : "#fff" }]}>{score + "%"}</Text>
            </View>);
        for (let i = 0; i < reviews.length; i++) {
            rows.push(
                <TouchableOpacity key={i + 5 * reviews.length}
                    onPress={() => {
                    }}>
                    <View key={i + 3 * reviews.length} style={[styles.reviewContainer, { backgroundColor: reviews[i].isGood ? "#A11614" : "black" }]}>
                        <Text key={i + 4 * reviews.length} style={styles.review}>{reviews[i].text}</Text>
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
}



Movie.navigationOptions = {
    header: null
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    review: {
        color: 'white'
    },
});