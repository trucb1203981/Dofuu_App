import React, { Component } from 'react'
import {
    Modal, 
	ScrollView, 
	View, 
	Dimensions, 
    TouchableOpacity,
    AsyncStorage
} from 'react-native'

import { Col, Grid } from 'react-native-easy-grid';

import {
    Header,
    Content,
    Body,
    Right,
    Button,
    Icon,
    Text,
    Card,
    CardItem,
    Thumbnail,
    ListItem,
    Radio,
    CheckBox,
    Separator,
    Item,
    Input   
} from 'native-base'

import Loading from './commons/Loading'
import Spacer from './commons/Spacer'
import ImageDialog from './commons/ImageDialog'

import { image, formatPrice, toUpperCase } from '../utils'
import { spacing, styles, colors, text, aligns } from '../styles'

const { width, height } = Dimensions.get("window");

export default class CartDialog extends Component {
    constructor(props) {
        super(props)

        this.state = {
            resolve: null,
            reject : null,
            dialog : false,
            loading: false,
            cart   : {
                instance: this.props.store.id,
                items   : []
            },
            default: {
                rowId   : null,
                size    : null,
                memo    : null,
                qty     : 1,
                subTotal: 0,
                toppings: []
            },
            editedItem: {
                rowId   : null,
                size    : null,
                memo    : null,
                qty     : 1,
                subTotal: 0,
                toppings: []
            },
            sizes   : [],
            progress: false
        }
        this._totalProduct = this._totalProduct.bind(this)
    }

    async open(item) {
        this.setState({dialog: true, loading: true, editedItem: Object.assign({}, this.state.default), sizes: []})
        var uuid  = require("uuid")
        var rowId = uuid.v4()
        var array = []
        if(item.sizes.length>0) {
            await item.sizes.forEach(size => {
                if(size.price > 0) {
                    array.push(size)
                    if(!this.state.editedItem.size) {
                        this.setState({editedItem: {...this.state.editedItem, size: size, subTotal: size.price}})
                    }
                }
            })
            this.setState({sizes: array})
        }
        this.setState({loading: false, editedItem: Object.assign(this.state.editedItem, item), editedItem: {...this.state.editedItem, rowId: rowId}}, () => {
            console.log(this.state.editedItem)
        })
        return new Promise((resolve, reject) => {
            this.setState({resolve: resolve, reject: reject})
        })
    }

    cancel() {
        this.setState({resolve: this.state.resolve(false), product: null, dialog: false, editedItem: Object.assign({}, this.state.default)}, () => {
            console.log(this.state.editedItem)
        })
    }

    agree(item) {

        this.setState({resolve: this.state.resolve(item), product: null, dialog: false})
    }

    _addToCart() {
        var { cart, carts } = this.props
        var { editedItem}   = this.state
        if(!this.state.progress) {
            this.setState({progress: true}, () => {
                this.props.addToCart(editedItem)
            })

            this.setState({progress: false}, () => {
                this.cancel()
            })
        }
    }

    _totalProduct() {
        var product = this.state.editedItem
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
        this.setState({editedItem: {...this.state.editedItem, subTotal: subTotal}})
        return parseInt(subTotal)
    }

    _chooseRadio(object) {
		if(this.state.editedItem.size.id != object.id) {
            this.setState({editedItem: {...this.state.editedItem, size: object}}, () => {
                this._totalProduct()
            })
        }
        
	}

    _chooseCheckBox(object) {
		const checkTopping = this.state.editedItem.toppings.some(topping => topping.id === object.id)
		if(checkTopping) {
			var   array   = this.state.editedItem.toppings
			const indexOf = this.state.editedItem.toppings.indexOf(object)
			array.splice(indexOf, 1)
		} else {
			var array = this.state.editedItem.toppings
			array.push(object)	
		}
		this.setState({editedItem: {...this.state.editedItem, toppings: array}}, () => {
            this._totalProduct()
        })
	}

    _openImage(image) {
        this.refs.image.open(image)
    }

    _increaseProduct() {
        this.setState({editedItem: {...this.state.editedItem, qty: ++this.state.editedItem.qty}}, () => {
            this._totalProduct()
        })
    }
    
    _decreaseProduct() {
        if(this.state.editedItem.qty>1) {
            this.setState({editedItem: {...this.state.editedItem, qty: --this.state.editedItem.qty}}, () => {
                this._totalProduct()
            })
        }
    }
    
    componentDidUpdate(prevProps) {
        if(prevProps.myProps !== this.props.myProp) {
            this._totalProduct(this.state.editedItem)
        }
      }

    _renderSize(sizes) {
        if(sizes.length == 0) null
       
            return (
                sizes.map((size, i) => 
                {
                    return(
                        <Col key={size.name}>
                            <Button large transparent onPress = { () => this._chooseRadio(size) }>
                                <Body>	
                                    <Radio
                                        color         = { "#616161" }
                                        selectedColor = { "#2E7D32" }
                                        onPress       = { () => this._chooseRadio(size) }
                                        selected      = { this.state.editedItem.size.id === size.id }
                                    />
                                    <Text style={text.caption}>{size.name}</Text>
                                    <Text style={text.fontWeightBold}>{formatPrice(size.price)}</Text>
                                </Body>					
                            </Button>
                        </Col>
                    )               
                }
            )
        )		
    }
    
    _renderTopping(toppings) {
        const { store }      = this.props
        const { editedItem } = this.state
        if(!editedItem.haveTopping) null
        if(!store.toppings.length == 0) null
        return(
            toppings.map((topping, i) => 
            {
                return (
                    <ListItem 
                    key     = {i.toString()}
                    onPress = {()=> this._chooseCheckBox(topping)}
                    >
                        <CheckBox checked={this.state.editedItem.toppings.includes(topping)} onPress = {()=> this._chooseCheckBox(topping)}/>
                        <Body>	
                            <Text>{topping.name}</Text>
                        </Body>																					
                        <Right>
                            <Text style={text.fontWeightBold}>{formatPrice(topping.price)}</Text>
                        </Right>											
                    </ListItem>
                )
            })            
        ) 
    }


    componentDidMount() {
        this._totalProduct(this.state.editedItem)
    }

    render() {
        const { store }                     = this.props
        const { sizes, editedItem, dialog } = this.state
        if(!this.state.dialog) return null; 
        return (
            <Modal
                animationType  = "slide"
                transparent    = {false}
                visible        = {dialog}
                onRequestClose = {() => this.cancel()}
            >
                <View style={styles.container}>
                    <Header style={colors.redDarken4} androidStatusBarColor="#D50000">
                        <Button transparent onPress={() => this.cancel()} rounded >
                            <Icon name='close' style={text.textLight}></Icon>
                        </Button>										
                        <Body>
                            <Text style={[text.textWhite, text.fontWeightBold]}>
                                {toUpperCase(editedItem.name)}
                            </Text>
                        </Body>
                    </Header>

                    <View style={[colors.white]}>                    
                        <CardItem style={[colors.transparent]}>
                                <Card style={[{ borderRadius: 50 }, spacing.ma1]}>
                                    <TouchableOpacity onPress={() => this._openImage(editedItem.image)}>
                                        <Thumbnail source={{ uri: image(editedItem.image) }} />
                                    </TouchableOpacity>
                                </Card>
                                <Body>
                                    <ListItem>                                   
                                        <Text>Số lượng: </Text>
                                        <TouchableOpacity onPress={() => this._decreaseProduct()}>
                                            <Icon type="MaterialCommunityIcons" name="minus-circle" style={text.textGreyLighten1}></Icon>
                                        </TouchableOpacity>
                                        <Item rounded  style={{width: 32, height: 32}}>
                                            <Input keyboardType="numeric" maxLength={2} onChangeText={(qty) => this.setState({editedItem: {...this.state.editedItem, qty: qty}}, () => {this._totalProduct()})} value={`${this.state.editedItem.qty}`} />                
                                        </Item>                            
                                        {/* <Text style={[spacing.px2, text.fontWeightBold]}>{editedItem.qty}</Text> */}
                                        <TouchableOpacity onPress={() => this._increaseProduct()}>
                                            <Icon type="MaterialCommunityIcons" name="plus-circle" style={text.textGreenDarken3}></Icon>                                                                                
                                        </TouchableOpacity>                                                  
                                    </ListItem>          
                                    <Item rounded style={[colors.greyLighten4, { height: 35 }]}>
                                        <Input placeholder="Ghi chú" onChangeText={(memo) => this.setState({editedItem: {...this.state.editedItem, memo: memo}}, () => {console.log(this.state.editedItem)})}/>
                                    </Item>     
                                </Body>
                        </CardItem>
                    </View>
                    
                    <ScrollView>
                        <View style={styles.container}>
                            
                            <Separator bordered >
                                <Text style={text.fontWeightBold}>SIZE</Text>
                            </Separator>
                            <View>
                                <CardItem cardBody>
                                    <Grid style={spacing.my2}>
                                        {  
                                            this._renderSize(sizes)                                             
                                        }		
                                    </Grid>
                                </CardItem>
                            </View>      
                            <Separator bordered>
                                <Text  style={text.fontWeightBold}>PHẦN THÊM </Text>
                            </Separator>
                            <View>
                                {
                                    this._renderTopping(store.toppings)
                                }
                            </View>                      
                        </View>
                    </ScrollView>
                    
                    <View style={{
                        backgroundColor: '#FAFAFA',
                        height         : 85,
                        borderTopWidth : 0.5,
                        borderColor    : '#FAFAFA'
                    }}>
                        <Content padder>
                            <Text>Tạm tính: <Text style={text.fontWeightBold}>{formatPrice(editedItem.subTotal)}</Text></Text>
                            <Button block small rounded rightIcon style={colors.greenDarken3} onPress={() => this._addToCart()}>
                                <Icon name='cart' />
                                <Text>Hoàn thành</Text>
                            </Button>
                        </Content>	
                    </View>
                    <ImageDialog ref="image" />
                </View>                
            </Modal>
        )
    }
}