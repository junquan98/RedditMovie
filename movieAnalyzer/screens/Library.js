import { Component } from 'react';
import { Stitch, AnonymousCredential, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native'
import { FlatGrid } from 'react-native-super-grid';
import ScrollableTabView from 'react-native-scrollable-tab-view-forked';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
const axios = require('axios');
const { height, width } = Dimensions.get('window');
const image_url_base = "http://image.tmdb.org/t/p/w500"; // based url for image fetching api
const movie_genres = ['All', 'Action', 'Comedy', 'Romance', 'Science Fiction', 'Animation'] // all genres for users to choose to filter movies
const genre_id = ['', 28, 35, 10749, 878, 16] // movie genre id respectively correlated to the movie_genres

// a helper method to check whether the scroll view reach the end
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 5;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

export default class Library extends Component {

    constructor(props) {
        super(props);
        this.state = {
            trending: [{ name: 'TURQUOISE', code: '#1abc9c' }, { name: 'EMERALD', code: '#2ecc71' }], // stored trending movies information
            y2019: [{ name: 'TURQUOISE', code: '#1abc9c' }, { name: 'EMERALD', code: '#2ecc71' }], // stores 2019 movies information
            y2018: [{ name: 'TURQUOISE', code: '#1abc9c' }, { name: 'EMERALD', code: '#2ecc71' }], // stores 2018 movies information
            y2017: [{ name: 'TURQUOISE', code: '#1abc9c' }, { name: 'EMERALD', code: '#2ecc71' }], // stores 2017 movies information
            y2016: [{ name: 'TURQUOISE', code: '#1abc9c' }, { name: 'EMERALD', code: '#2ecc71' }], // stores 2016 movies information
            p2019: 1, //current page of the 2019 view
            p2018: 1, //current page of the 2018 view
            p2017: 1, //current page of the 2017 view
            p2016: 1, //current page of the 2016 view
            g2019: -1, //the selected genre index(related to genre_id) for the 2019 view
            g2018: -1, //the selected genre index for the 2018 view
            g2017: -1, //the selected genre index for the 2017 view
            g2016: -1, //the selected genre index for the 2016 view
        }
        // detec the change of orientation and resize the screen
        Dimensions.addEventListener('change', () => {
            this.render();
        });
    }

    // helper method to load the movies when user select a specific genre
    getMovies(id, year) {
        axios.get('https://api.themoviedb.org/3/discover/movie?api_key=dd2663f90eea8915b4119abab4159ba6&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true&page=1&primary_release_year=' + year.toString() + '&with_genres=' + id.toString())
            .then((res) => {
                if (year == 2019) {
                    this.setState({
                        y2019: res.data.results,
                    })
                }
                if (year == 2018) {
                    this.setState({
                        y2018: res.data.results,
                    })
                }
                if (year == 2017) {
                    this.setState({
                        y2017: res.data.results,
                    })
                }
                if (year == 2016) {
                    this.setState({
                        y2016: res.data.results,
                    })
                }
            })
    }

    // called when reaching the end of the view to load 20 more movies depends on the selected genre and year
    loading(page, year, id) {
        let genre = ''
        if (id != -1 && id != '') { //check whether user selects a genre
            genre = '&with_genres=' + id.toString()
        }
        axios.get('https://api.themoviedb.org/3/discover/movie?api_key=dd2663f90eea8915b4119abab4159ba6&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true&page=' + page.toString() + '&primary_release_year=' + year.toString() + genre)
            .then((res) => {
                console.log(res.data.results)
                if (year == 2019) {
                    let merge = this.state.y2019.concat(res.data.results)
                    this.setState({
                        y2019: merge,
                        p2019: page + 1
                    })
                }
                if (year == 2018) {
                    let merge = this.state.y2018.concat(res.data.results)
                    this.setState({
                        y2018: merge,
                        p2018: page + 1
                    })
                }
                if (year == 2017) {
                    let merge = this.state.y2017.concat(res.data.results)
                    this.setState({
                        y2017: merge,
                        p2017: page + 1
                    })
                }
                if (year == 2016) {
                    let merge = this.state.y2016.concat(res.data.results)
                    this.setState({
                        y2016: merge,
                        p2016: page + 1
                    })
                }

            })
    }

    render() {

        return (
            <LinearGradient colors={['#555555', '#303030', '#101010']} style={styles.container} >
                <AnimatView animation='fadeInDown'>
                    <Text style={styles.title}>Lib</Text>
                    {/* This view contains 5 scroll views for 5 different tabs */}
                    <ScrollableTabView
                        tabBarActiveTextColor='#590f0d'
                        tabBarInactiveTextColor='white'
                        tabBarUnderlineStyle={{
                            backgroundColor: '#590f0d'
                        }}
                    >
                        {/* Tranding scrollview */}
                        <ScrollView tabLabel={'Trending'} style={styles.grid}>
                            <FlatGrid
                                itemDimension={130}
                                items={this.state.trending}
                                style={styles.gridView}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate("Movie", {
                                                name: item.original_title,
                                                img: item.poster_path,
                                                desp: item.overview,
                                            })
                                        }}>
                                        <View style={[styles.itemContainer]}>
                                            <View style={styles.imagestyle}>
                                                <Image
                                                    source={{ uri: image_url_base + item.backdrop_path }}
                                                    defaultSource={require('../assets/images/logo.png')}
                                                    style={styles.image}
                                                />
                                            </View>

                                            <View style={styles.subtitle}>
                                                <Text style={styles.itemName}>{item.original_title}</Text>
                                                <Text style={styles.itemCode}>Pop rating: {item.popularity}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </ScrollView>

                        {/* 2019 movies scrollview */}
                        <ScrollView tabLabel={'2019'} style={styles.grid}
                            onScroll={({ nativeEvent }) => {
                                if (isCloseToBottom(nativeEvent)) {
                                    let page = this.state.p2019 + 1
                                    this.loading(page, 2019, this.state.g2019)
                                }
                            }}
                        >
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <Text style={{ color: 'white' }}>Genre: </Text>

                                {/* dropdown filter */}
                                <ModalDropdown options={movie_genres} style={styles.filter}
                                    dropdownStyle={styles.dropdownContainer} dropdownTextStyle={styles.dropdownItem}
                                    onSelect={(index) => {
                                        this.getMovies(genre_id[index], 2019)
                                        this.setState({
                                            g2019: genre_id[index],
                                            p2019: 1,
                                        })
                                    }}>
                                    <Icon color={'#871614'} name='filter-list' size={23} />
                                </ModalDropdown>
                            </View>

                            <FlatGrid
                                itemDimension={130}
                                items={this.state.y2019}
                                style={styles.gridView}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate("Movie", {
                                                name: item.original_title,
                                                img: item.poster_path,
                                                desp: item.overview,
                                            })
                                        }}>
                                        <View style={[styles.itemContainer]}>
                                            <View style={styles.imagestyle}>
                                                <Image
                                                    source={{ uri: image_url_base + item.backdrop_path }}
                                                    defaultSource={require('../assets/images/logo.png')}
                                                    style={styles.image}
                                                />
                                            </View>

                                            <View style={styles.subtitle}>
                                                <Text style={styles.itemName}>{item.original_title}</Text>
                                                <Text style={styles.itemCode}>Pop rating: {item.popularity}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </ScrollView>

                        {/* 2018 movies scrollview */}
                        <ScrollView tabLabel={'2018'} style={styles.grid}
                            onScroll={({ nativeEvent }) => {
                                if (isCloseToBottom(nativeEvent)) {
                                    let page = this.state.p2018 + 1
                                    this.loading(page, 2018, this.state.g2018)
                                }
                            }}
                        >
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <Text style={{ color: 'white' }}>Genre: </Text>

                                {/* dropdown filter */}
                                <ModalDropdown options={movie_genres} style={styles.filter}
                                    dropdownStyle={styles.dropdownContainer} dropdownTextStyle={styles.dropdownItem}
                                    onSelect={(index) => {
                                        this.getMovies(genre_id[index], 2018)
                                        this.setState({
                                            g2018: genre_id[index],
                                            p2018: 1,
                                        })
                                    }}>
                                    <Icon color={'#871614'} name='filter-list' size={23} />
                                </ModalDropdown>
                            </View>
                            <FlatGrid
                                itemDimension={130}
                                items={this.state.y2018}
                                style={styles.gridView}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate("Movie", {
                                                name: item.original_title,
                                                img: item.poster_path,
                                                desp: item.overview,
                                            })
                                        }}>
                                        <View style={[styles.itemContainer]}>
                                            <View style={styles.imagestyle}>
                                                <Image
                                                    source={{ uri: image_url_base + item.backdrop_path }}
                                                    defaultSource={require('../assets/images/logo.png')}
                                                    style={styles.image}
                                                />
                                            </View>

                                            <View style={styles.subtitle}>
                                                <Text style={styles.itemName}>{item.original_title}</Text>
                                                <Text style={styles.itemCode}>Pop rating: {item.popularity}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </ScrollView>

                        {/* 2017 movies scrollview */}
                        <ScrollView tabLabel={'2017'} style={styles.grid}
                            onScroll={({ nativeEvent }) => {
                                if (isCloseToBottom(nativeEvent)) {
                                    let page = this.state.p2017 + 1
                                    this.loading(page, 2017, this.state.g2017)
                                }
                            }}
                        >
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <Text style={{ color: 'white' }}>Genre: </Text>

                                {/* dropdown filter */}
                                <ModalDropdown options={movie_genres} style={styles.filter}
                                    dropdownStyle={styles.dropdownContainer} dropdownTextStyle={styles.dropdownItem}
                                    onSelect={(index) => {
                                        this.getMovies(genre_id[index], 2017)
                                        this.setState({
                                            g2017: genre_id[index],
                                            p2017: 1,
                                        })
                                    }}>
                                    <Icon color={'#871614'} name='filter-list' size={23} />
                                </ModalDropdown>
                            </View>
                            <FlatGrid
                                itemDimension={130}
                                items={this.state.y2017}
                                style={styles.gridView}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate("Movie", {
                                                name: item.original_title,
                                                img: item.poster_path,
                                                desp: item.overview,
                                            })
                                        }}>
                                        <View style={[styles.itemContainer]}>
                                            <View style={styles.imagestyle}>
                                                <Image
                                                    source={{ uri: image_url_base + item.backdrop_path }}
                                                    defaultSource={require('../assets/images/logo.png')}
                                                    style={styles.image}
                                                />
                                            </View>

                                            <View style={styles.subtitle}>
                                                <Text style={styles.itemName}>{item.original_title}</Text>
                                                <Text style={styles.itemCode}>Pop rating: {item.popularity}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </ScrollView>


                        {/* 2016 movies scrollview */}
                        <ScrollView tabLabel={'2016'} style={styles.grid}
                            onScroll={({ nativeEvent }) => {
                                if (isCloseToBottom(nativeEvent)) {
                                    let page = this.state.p2016 + 1
                                    this.loading(page, 2016, this.state.g2016)
                                }
                            }}
                        >
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <Text style={{ color: 'white' }}>Genre: </Text>

                                {/* dropdown filter */}
                                <ModalDropdown options={movie_genres} style={styles.filter}
                                    dropdownStyle={styles.dropdownContainer} dropdownTextStyle={styles.dropdownItem}
                                    onSelect={(index) => {
                                        this.getMovies(genre_id[index], 2016)
                                        this.setState({
                                            g2016: genre_id[index],
                                            p2016: 1,
                                        })
                                    }}>
                                    <Icon color={'#871614'} name='filter-list' size={23} />
                                </ModalDropdown>
                            </View>
                            <FlatGrid
                                itemDimension={130}
                                items={this.state.y2016}
                                style={styles.gridView}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate("Movie", {
                                                name: item.original_title,
                                                img: item.poster_path,
                                                desp: item.overview,
                                            })
                                        }}>
                                        <View style={[styles.itemContainer]}>
                                            <View style={styles.imagestyle}>
                                                <Image
                                                    source={{ uri: image_url_base + item.backdrop_path }}
                                                    defaultSource={require('../assets/images/logo.png')}
                                                    style={styles.image}
                                                />
                                            </View>

                                            <View style={styles.subtitle}>
                                                <Text style={styles.itemName}>{item.original_title}</Text>
                                                <Text style={styles.itemCode}>Pop rating: {item.popularity}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </ScrollView>

                    </ScrollableTabView>
                </AnimatView>
            </LinearGradient>

        );
    }

    //get all movies for the first page in all 5 tabviews
    async getData() {
        axios.get('https://api.themoviedb.org/3/trending/movie/week?api_key=dd2663f90eea8915b4119abab4159ba6')
            .then((res) => {
                this.setState({
                    trending: res.data.results
                })
            })
        axios.get('https://api.themoviedb.org/3/discover/movie?api_key=dd2663f90eea8915b4119abab4159ba6&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true&page=1&primary_release_year=2019')
            .then((res) => {
                console.log(res.data.results)
                this.setState({
                    y2019: res.data.results
                })
            })
        axios.get('https://api.themoviedb.org/3/discover/movie?api_key=dd2663f90eea8915b4119abab4159ba6&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true&page=1&primary_release_year=2018')
            .then((res) => {
                console.log(res.data.results)
                this.setState({
                    y2018: res.data.results
                })
            })
        axios.get('https://api.themoviedb.org/3/discover/movie?api_key=dd2663f90eea8915b4119abab4159ba6&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true&page=1&primary_release_year=2017')
            .then((res) => {
                console.log(res.data.results)
                this.setState({
                    y2017: res.data.results
                })
            })
        axios.get('https://api.themoviedb.org/3/discover/movie?api_key=dd2663f90eea8915b4119abab4159ba6&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true&page=1&primary_release_year=2016')
            .then((res) => {
                console.log(res.data.results)
                this.setState({
                    y2016: res.data.results
                })
            })
    }

    componentDidMount() {
        this.getData();
    }
}



Library.navigationOptions = {
    header: null
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
    },
    title: {
        fontSize: 40,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'AppleSDGothicNeo-Thin',
        marginTop: 0.1 * height,
    },
    grid: {
        width: width,
        height: 0.8 * height,
        marginBottom: 10,
        alignContent: 'center',
    },
    gridView: {
        flex: 1,
        alignSelf: 'center',
    },
    itemContainer: {
        borderRadius: 5,
        height: 160,
        margin: 5
    },
    image: {
        height: 120,
    },
    imagestyle: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        overflow: 'hidden'
    },
    subtitle: {
        padding: 5,
        height: 50,
        backgroundColor: '#212121',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    itemName: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
    filter: {
        marginTop: 10,
        marginRight: 20
    },
    dropdownContainer: {
        backgroundColor: '#555555'
    },
    dropdownItem: {
        backgroundColor: '#555555',
        color: 'white'
    },
});