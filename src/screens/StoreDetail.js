import React, { Component } from 'react'
import {
    ScrollView,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    AsyncStorage,
    Alert
} from 'react-native'

import { 
    Header,
    Left,
    Body,
    Right,
    Button,
    Icon,
    Item,
    Input,
    Card,
    CardItem,
    Tabs,
    Tab,
    TabHeading,
    ScrollableTab,
    Spinner,
    Thumbnail
} from 'native-base'

import { connect } from 'react-redux'
import { fetchCartFromStorage, addToCart } from '../actions'

import { Col, Grid } from 'react-native-easy-grid';

import Spacer from '../components/commons/Spacer'
import Divider from '../components/commons/Divider'
import Loading from '../components/commons/Loading'
import CartDialog from '../components/CartDialog'
import ImageDialog from '../components/commons/ImageDialog'

import { text, styles, colors, spacing} from '../styles'
import { formatPrice, activityTime, image } from '../utils'
import API from '../api/http'

class StoreDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            screenWidth : Dimensions.get("window").width,
            screenHeight: Dimensions.get("window").height,
            loading     : false,
            store       : null,
            cart        : null
        }
    }
    static navigationOptions = ({ navigation }) => ({
        header: <Header searchBar rounded style={[colors.white, styles.raised]} androidStatusBarColor='#B71C1C'>
                   <Left >
                        <Button style={[styles.circle]} transparent onPress={() => navigation.goBack() }>
                            <Icon name='arrow-back' style={text.textBlack} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={[text.subheading, text.fontWeightRegular, text.textRedAccent]}></Text>
                    </Body>
                    <Right>
                        <Button style={[styles.circle]} transparent onPress={() => navigation.state.routeName != 'Search' ? navigation.navigate('Search') : null}>
                            <Icon name='search' style={text.textBlack} />
                        </Button>
                    </Right>
                </Header>,
        title      : `Thực đơn`,
        tabBarLabel: 'Thực đơn'
    })
    
    _showStore(id) {
        const url    = `/Store/${id}/ShowStore`
        const data   = {}
        const params = {}
        if(!this.state.loading) {
            this.setState({loading: true}, () => {
                         
            })
            return new Promise((resolve, reject) => {
                API.post(url, data, {params, withCredentials:true}).then(response => {
                    if(response.status === 200) {
                        this.setState({store: response.data.store})
                    }
                    resolve(response)
                }).finally(() => {
                    this.setState({loading: false})
                })
            })    
        }
    }
    
    _getCart = async () => {
        const { store } = this.state
        var   array     = [{ instance: 100000040, items: []}, { instance: 100000062, items: []}]
        await AsyncStorage.setItem('carts', JSON.stringify(array))  
    }
    _showCart = async () => {
        try {
            let myData = JSON.parse(await AsyncStorage.getItem('carts'))
            alert(myData)
            console.log(JSON.parse(await AsyncStorage.getItem('carts')))
        } catch(error) {
            console.log(error.message)
        }
    }
    _removeCart = async () => {
        try {
            AsyncStorage.removeItem('carts')
        } catch (error) {
            console.log(error.message)
        }
    }

    _fetchCart = async () => {
        const { store } = this.state
        this.props.fetchCart(store)
        console.log('props', this.props)
    }

    _destroyCart = async () => {
        const { cart } = this.state
        if(cart.items.length === 0) {

        }
    }

    componentWillMount() {
        this._showStore(100000070).then(response => {
            if(response.status == 200) {
                this._fetchCart()
            }
        })
        console.log(this.props)
    }

    _openCart(product) {
        this.refs.cart.open(product).then(response => {

        })
    }

    _openImage(image) {
        this.refs.image.open(image)
    }

    _renderProduct(product) {
		return (
			<Card key={product.id.toString()} style={[styles.cardRadius]}>
				<CardItem header button  style={[styles.cardHeader, colors.redDarken4, {height: 30}]} onPress={() => this._openCart(product)}>
					<Text style={text.textLight}> { product.name } </Text>
				</CardItem>
				<CardItem button onPress={() => this._openCart(product)} style={styles.cardFooter}>
                    <Card style={{ borderRadius: 50 }}>
                        <Thumbnail source={{uri: image(product.image)}} />
                    </Card>
                    <Body style={spacing.ml3}>
                        <Grid>
                            { product.sizes.map((size, i) => {
                                if(size.price > 0) {
                                    return (
                                        <Col key={i.toString()}>
                                            <Text style={text.textBlack}>{size.name}</Text>
                                            <Text style={[text.textRed, text.fontWeightBold]}>{ formatPrice(size.price) }</Text>
                                        </Col>
                                    )
                                }
                            })}	
                        </Grid>                       
                        <Text>{product.description}</Text>
                    </Body>
				</CardItem>										
			</Card>
		)
	}    

    render() {
        const { store } = this.state
        if (this.state.loading) return <Spinner color="grey" />
        
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Card>
                        <CardItem header style={[styles.borderRadius, styles.cardHeader, colors.greyLighten4, {height: 30}]} >
                            <Text style={[text.textBlack, text.fontWeightRegular]}>{store.type.name}</Text>
                            <Spacer></Spacer>
                            <Icon name="time" style={[text.textBlack, styles.iconSize]}></Icon>
                            <Text style={[text.textBlack, text.fontWeightRegular]}>{activityTime(store.activities)}</Text>
                        </CardItem>
                        <Divider/>
                        <CardItem cardBody style={spacing.ma2}>
                            <Card style={{ borderRadius: 50 }}>
                                <TouchableOpacity onPress={() => this._openImage(store.avatar)}>
                                    <Thumbnail source={{ uri: image(store.avatar) }} large />
                                </TouchableOpacity>
                            </Card>
                            <Body style={spacing.ml2}>
                                <TouchableOpacity onPress={() => this._getCart()}>
                                    <Text>GET</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this._showCart()}>
                                    <Text>SHOW</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this._removeCart()}>
                                    <Text>REMOVE</Text>
                                </TouchableOpacity>
                                <Text style={text.textBlack}>{store.address}</Text>
                            </Body>
                        </CardItem>
                        <Divider/>
                        <CardItem footer style={[styles.cardFooter, colors.greyLighten4, {height: 30}]}>
                            <Spacer/>
                            <Icon type="MaterialCommunityIcons" name="eye" style={[text.textDark, styles.iconSize]}></Icon>
                            <Text style={[text.textDark, spacing.mr2]}>{store.views}</Text>
                            <Icon type="MaterialCommunityIcons" name="message-reply-text" style={[text.textDark, styles.iconSize]}></Icon>
                            <Text style={[text.textDark, spacing.mr2]}>{store.totalComment}</Text>
                            <TouchableOpacity style={[styles.circle]} small  onPress={() => alert('like')} transparent>
                                <Icon type="MaterialCommunityIcons" name="heart-outline" style={[text.textPink, styles.iconSize]}></Icon>
                            </TouchableOpacity>
                            <Text style={[text.textDark, spacing.mr2]}>{store.likes}</Text>
                            <TouchableOpacity style={[styles.circle]} small  onPress={() => alert('favorite')} transparent>
                                <Icon type="MaterialCommunityIcons" name="bookmark-outline" style={[text.textBlue, styles.iconSize]}></Icon>
                            </TouchableOpacity>
                        </CardItem>
                    </Card>
                    <Tabs  tabBarUnderlineStyle={colors.redAccent4} renderTabBar={()=> <ScrollableTab style={{ backgroundColor: 'transparent' }}/>}>
                        { 
                            store.catalogues.map(catalogue => {
                                return (
                                    <Tab heading={catalogue.name} key={catalogue.id} tabStyle={colors.greyLighten5} activeTabStyle={[colors.greyLighten3]} textStyle={[text.textDark]} activeTextStyle={[text.textRedAccent]} >
                                        {
                                            catalogue.products.map(product => {
											return(
												this._renderProduct(product)
											)
										    })
                                        }
                                    </Tab>
                                )
                            })
                        }
                    </Tabs>
                </ScrollView>
                <ImageDialog ref="image" {...this.props} />
                <CartDialog ref="cart" {...this.props}  store={store}/>
            </View>
        )
    }
}

function mapStateToProps(state) {
	return {
        carts: state.cart.carts,
        cart : state.cart.cart
	}
}

function mapDispatchToProps(dispatch) {
	return {
        fetchCart: (store) => dispatch(fetchCartFromStorage(store)),
        addToCart: (product) => dispatch(addToCart(product))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreDetail)