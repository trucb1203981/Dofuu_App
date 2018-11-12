import React, { Component } from 'react'

import { 
    ScrollView,
    View, 
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native'

import {
    Content,
    Left,
    Header,
    Item,
    Body,
    Card,
    CardItem,
    Text,
    Input,
    Picker,
    Button,
    Icon,
    Thumbnail,
    Spinner
} from 'native-base'

import { formatTime, activityTime, typeIcon } from '../utils'
import { text, styles, colors, spacing} from '../styles'



import API from '../api/http'
import Spacer from '../components/commons/Spacer'
import StoreFlatListHorizontal from '../components/StoreFlatListHorizontal'
import StoreFlatListVertical from '../components/StoreFlatListVertical'

export default class Home extends Component {

    static navigationOptions = ({ navigation }) => ({
		title      : `Khám phá`,
		tabBarLabel: 'Khám phá',
		tabBarIcon : ({ tintColor, focused }) => (
			<Icon type="MaterialCommunityIcons" name={focused ? "home" : "home-outline"} style={{ color: tintColor, fontSize: 25 }} />
		)
	})

    constructor(props) {
        super(props)
        this.state = {
            cities: [],
            types : [],
            deal  : {
                stores: []
            },
            end    : false,
            loading: false
        }
    }
    
    _fetchStoreWithDeal(data) {
        const url    = `/Store/FetchDealStores`
        var   data   = {}
        var   params = { cityId: 10001 }
        API.post(url, data, { params, withCredentials: true }).then(response => {
            if(response.status === 200) {
                this.setState({ deal: {...this.state.deal, stores: response.data.stores} })
            }
        })
    }
    _fetchCity() {
        const url    = `/City/FetchAllCities`
        var   data   = {}
        var   params = {}
        API.post(url, data, {params, withCredentials: true}).then(response => {
            if(response.status === 200) {
                this.setState({cities: response.data.cities})
            }
        })
    }

    _fetchType() {
        const url    = `/Type/FetchAllTypes`
        var   data   = {}
        var   params = {}
        API.post(url, data, {params, withCredentials: true}).then(response => {
            if(response.status === 200) {
                this.setState({types: response.data.types})
            }
        })
    }

    componentDidMount () {
        const query = { did:0, tid:0, page:0 }
        this._fetchCity()
        this._fetchType()
        this._fetchStoreWithDeal(query)
        
    }

    render() {
        const { deal, cities, types } = this.state
        const { navigation }          = this.props
        return (
            <View style={styles.container}>
                    <Header searchBar rounded style={[colors.white, styles.raised]} androidStatusBarColor='#B71C1C'>
                        <Item rounded style={[colors.greyLighten4, {flex: 1}]}>
                        <Picker
                            note
                            style = {{width: 100}}
                        >
                            { 
                                cities.map((city, index) => {
                                    return (
                                        <Picker.Item label={city.name} value={city.id} key={index}/>
                                    )
                                })
                            }                           
                        </Picker>
                            <Input  style = {{ flex: 9}} placeholder="Tìm kiếm món, quán ăn..." onFocus  = {() => navigation.state.routeName != 'Search' ? navigation.navigate('Search') : null}/>
                        </Item>
                    </Header>
                <ScrollView>         
                    <Card>
                        <CardItem header style={[{height: 35}]}>
                            <Text style={text.textRedAccent}>Hot Deals</Text>
                        </CardItem>          
                        <StoreFlatListHorizontal stores={deal.stores} {...this.props}></StoreFlatListHorizontal>
                    </Card>
                    <Card>
                        <FlatList 
                            extraData  = {this.state}
                            horizontal = {true}
                            data       = {types}
                            renderItem = {({item, index}) => {
                                return (
                                <Card style={[styles.cardRadius, {height: 70, width: 70}]} key={index}>
                                    <TouchableOpacity
                                        onPress = {() => navigation.navigate('Type', {typeId: item.id, name: item.name})}
                                    >
                                    <View  style={[spacing.ma1, { justifyContent: 'center', alignItems: 'center'}]}>                                  
                                        <Thumbnail small square
                                        source = {{uri: 'https://www.dofuu.com'+typeIcon(item.name, 'type')}}
                                        />                                    
                                        <Text numberOfLines={1}>{item.name}</Text>
                                    </View>       
                                    </TouchableOpacity>                                   
                                </Card>
                                )
                            }}
                            keyExtractor                   = { (item, index) => item.name}
                            showsHorizontalScrollIndicator = {false}
                            onEndThreshold                 = {0}
                            ItemSeparatorComponent         = {() => <View style={spacing.ma2} />}
                        >
                        </FlatList>
                        <StoreFlatListVertical></StoreFlatListVertical>
                    </Card>                  
                </ScrollView>
            </View>
        )
    }
}

const home = StyleSheet.create({
    searchbar: {
        margin      : 4,
        height      : 40,
        borderRadius: 18,
        elevation   : 0
    },
});