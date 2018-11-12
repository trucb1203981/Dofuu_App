import React, { Component } from 'react'

import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity,
    Modal 
} from 'react-native'

import { 
    Header, 
    Body, 
    Right, 
    Left, 
    List, 
    ListItem, 
    Item, 
    Button, 
    Card, 
    CardItem, 
    Icon, 
    Thumbnail, 
    Input
} from 'native-base'

import Divider from '../../components/commons/Divider'
import Spacer from '../../components/commons/Spacer'

import { styles, colors, text, spacing} from '../../styles'
import { formatPrice, activityTime, image } from '../../utils'
import { connect } from 'react-redux'
import { fetchAllCart, updateCart, openCheckout, closeCheckout } from '../../actions'

class CartItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cart    : props.cart,
            subTotal: 0
        }
    }
    
    _subTotal(product) {
        if(!!product) {
            var total        = 0
            var totalTopping = 0
            var subTotal     = 0
            if(product.toppings.length > 0) {
                product.toppings.forEach(topping => {
                    totalTopping = totalTopping + parseInt(topping.price)
                })
            }
            if(!!product.size) {
                total = parseInt(product.size.price) + totalTopping
            }
        }
        subTotal = parseInt(total*product.qty)
        return parseInt(subTotal)
    }
    
    _total() {
        const { cart } = this.state
        
        var total = 0
        
        if(cart.items.length>0) {
            cart.items.forEach(item => {
                total = parseInt(total) + parseInt(item.subTotal)
            })
        }
        this.setState({subTotal: total})
    }

    _increase(product) {
        const {cart}       = this.state
        var   indexProduct = cart.items.findIndex(item => item.rowId === product.rowId)

        if(indexProduct > -1) {
            product.qty      = ++product.qty
            product.subTotal = this._subTotal(product)
            Object.assign(cart.items[indexProduct], product)
            this.props.updateCart(cart)
            this.setState({cart: cart}, () => this._total())
        }
    }

    _decrease(product) {
        const { cart }     = this.state
        var   indexProduct = cart.items.findIndex(item => item.rowId === product.rowId)
        if(indexProduct > -1) {
            if(cart.items[indexProduct].qty > 1) {
                cart.items[indexProduct].qty--
                cart.items[indexProduct].subTotal = this._subTotal(product)
            } else if (cart.items[indexProduct].qty == 1) {
                cart.items.splice(indexProduct, 1)
            }
            this.props.updateCart(cart)
            this.setState({cart: cart}, () => this._total())
        }
    }

    _agree() {
        const {cart} = this.state
        this.props.openCheckout(cart)
    }

    componentWillMount() {
        this._total()
    }

    render() {
        const { subTotal, cart } = this.state
        if(!cart) return null
        return (
            <Card style={colors.greenDarken2}>
                <CardItem header>
                    <Left>
                        <Thumbnail source={{uri: image(cart.store.avatar)}} small></Thumbnail>
                        <Body>
                            <Text style={[text.fontWeightBold, text.textDark]}>
                                {cart.store.name}
                            </Text>
                        </Body>
                    </Left>                            
                </CardItem>
                
                <List style={colors.greyLighten5} >  
                    {
                        cart.items.map((product, index) => {
                            return(
                                <ListItem last={index+1===cart.items.length} style={[{minHeight:30}, colors.greyLighten5]} key={index.toString()}>                                  
                                    <Left>
                                        <Body>
                                            <Text style={text.fontWeightThin}>{product.name}</Text>
                                            {
                                                (product.toppings.length === 0) ? null: (<Text numberOfLines={2} style={text.fontWeightBold}>{product.toppings.map(item => item.name)}</Text>)
                                            }
                                            {
                                                (!product.memo) ? null: (<Text style={text.textRedAccent}>{product.memo}</Text>)
                                            }
                                        </Body>
                                    </Left>
                                    <Right>  
                                        <Body>
                                            <CardItem style={[colors.transparent]}>                              
                                                <TouchableOpacity onPress={() => this._decrease(product)}>
                                                    <Icon type="MaterialCommunityIcons" name="minus-circle" style={text.textGreyLighten1}></Icon>
                                                </TouchableOpacity>                                           
                                                <Text style={[text.fontWeightBold, spacing.pr1]}>{product.qty}</Text>               
                                                <TouchableOpacity onPress={() => this._increase(product)}>
                                                    <Icon type="MaterialCommunityIcons" name="plus-circle" style={text.textGreenDarken3}></Icon>                                                                                
                                                </TouchableOpacity>  
                                            </CardItem>
                                            <Text style={[text.textRedAccent, text.fontWeightBold]}>{formatPrice(product.subTotal)}</Text>
                                        </Body>                                    
                                    </Right>
                                </ListItem>       
                            )
                        })
                    }                            
                </List>
                <Card transparent>
                    <CardItem>
                        <Left><Text>Tạm tính: </Text></Left>
                        <Right><Text style={text.fontWeightBold}>{formatPrice(subTotal)}</Text></Right>
                    </CardItem>
                </Card>
                <Divider />
                <Button block style={[colors.redAccent4, spacing.mt2]} small onPress={()=> this._agree()} >
                    <Text style={text.textWhite}>Xác nhận đơn hàng</Text>
                </Button>    
            </Card>     
        ) 
    }
}

class Cart extends Component {
    static navigationOptions = ({ navigation, navigationOptions}) =>  ({
		title      : `Giỏ hàng`,
		tabBarLabel: 'Giỏ hàng',
		tabBarIcon : ({ tintColor, focused }) => (
			<Icon type="MaterialCommunityIcons" name={focused ? "cart" : "cart-outline"}  style={{ color: tintColor, fontSize: 25 }} />
		)
    })
    
    constructor(props) {
        super(props)
    }
    
    _fetchAllCart() {
        this.props.fetchAllCart()
    }

    componentDidMount() {
        this._fetchAllCart()
    }

    cancel() {
        this.props.closeCheckout()
    }

    render() {
        const {carts, cart, updateCart, checkoutDialog, openCheckout} = this.props
        console.log(this.props)
        if(carts.length === 0) return null
        return (      
            <ScrollView style={colors.greyLighten3}>        
            {
                carts.map((cart, i) => {
                    if(cart.items.length === 0) return null
                    return (                            
                        <CartItem cart={cart} key={i} updateCart={updateCart} openCheckout={openCheckout} />
                    )
                })
            }        
            {
                (!checkoutDialog) ? null
                : <Modal
                    animationType  = "slide"
                    transparent    = {false}
                    visible        = {checkoutDialog}
                    onRequestClose = {() => this.cancel()}
                >
                    <ScrollView>
                        <View  style={styles.container}>
                            <List>

                                {
                                    cart.items.map((product, i) => {
                                        return(
                                           <ListItem key={i}>
                                                <Left>
                                                    <Body>
                                                        <Text style={text.fontWeightThin}>{product.name}</Text>
                                                        {
                                                            (product.toppings.length === 0) ? null: (<Text numberOfLines={2} style={text.fontWeightBold}>a</Text>)
                                                        }
                                                        {
                                                            (!product.memo) ? null: (<Text style={text.textRedAccent}>{product.memo}</Text>)
                                                        }
                                                    </Body>
                                                </Left>  
                                                <Spacer />
                                                <Text>{product.qty}</Text>
                                                <Spacer />
                                                <Text style={[text.textRedAccent, text.fontWeightBold]}>{formatPrice(product.subTotal)}</Text>                                        
                                            </ListItem> 
                                        )
                                    })
                                }                                
                            </List>
                        </View>                    
                       
                    </ScrollView>                
                </Modal>     
            }   
                              
            </ScrollView>
        )
    }
}

function mapStateToProps(state) {
	return {
        carts         : state.cart.carts,
        cart          : state.cart.cart,
        checkoutDialog: state.cart.checkoutDialog,
	}
}

function mapDispatchToProps(dispatch) {
	return {
        fetchAllCart : () => dispatch(fetchAllCart()),
        updateCart   : (cart) => dispatch(updateCart(cart)),
        openCheckout : (cart) => dispatch(openCheckout(cart)),
        closeCheckout: () => dispatch(closeCheckout())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)