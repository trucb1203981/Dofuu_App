import React, { Component } from 'react'

import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'

import { text, styles, colors, spacing} from '../styles'

import HomeScreen from '../screens/Home'
import MapScreen from '../screens/Map'
import CartScreen from '../screens/CartDetails/Cart'
import HistoryScreen from '../screens/CartDetails/History'
import ProfileScreen from '../screens/Profile'
import SearchScreen from '../screens/Search'
import TypeScreen from '../screens/Type'
import StoreDetailScreen from '../screens/StoreDetail'
import StoreCommentScreen from '../screens/StoreDetails/Comment'
// class Navigation extends Component {
//     state = {
//         index : 0,
//         routes: [
//             { key: 'home', title: 'Khám phá', icon: 'home'},
//             { key: 'map', title: 'Bản đồ', icon: 'home'},
//             { key: 'cart', title: 'Đơn hàng', icon: 'home'},
//         ]
//     }
    
//     _handleIndexChange = index => this.setState({index})

//     _renderScreen = BottomNavigation.SceneMap({
//         home: HomeScreen,
//         map : MapScreen,
//         cart: CartScreen,
//     }) 

//     render() {
//         return (
//             <BottomNavigation
//                 navigationState = {this.state}
//                 onIndexChange   = {this._handleIndexChange}
//                 renderScene     = {this._renderScene}
//             />
//         )
//     }
// }

const CartTabNavigator = createMaterialTopTabNavigator({
    'Cart': {
        screen: CartScreen
    },
    'History': {
        screen: HistoryScreen
    }
},
{
    initialRouteName: 'Cart',
    tabBarOptions   : {
        indicatorStyle: colors.redAccent4,
        labelStyle    : {
            fontSize  : 12,
            color     : 'rgba(0, 0, 0, 0.54)',
            fontWeight: 'bold'
        },
        tabStyle: {
            height        : 48,
            alignItems    : 'center',
            justifyContent: 'center',
        },
        style: {
            backgroundColor: 'white',
        },
        allowFontScaling: true
    },
    swipeEnabled: false
})

const BottomTabNavigator = createMaterialBottomTabNavigator({
    Home: {
		screen: HomeScreen
	},
	Map: {
		screen: MapScreen
	},
	Cart: {
		screen: CartTabNavigator,
    },
    Profile: {
        screen: ProfileScreen,
    }
}, 
{
    initialRouteName: 'Profile',
    activeTintColor : '#B71C1C',
    barStyle        : { backgroundColor: 'white' },
    shifting        : true
})

const StoreTabNavigator = createMaterialTopTabNavigator({
    'Menu': {
        screen: StoreDetailScreen
    },
    'Comment': {
        screen: StoreCommentScreen
    }
},
{
    initialRouteName: 'Menu',
    tabBarOptions   : {
        indicatorStyle: colors.redAccent4,
        labelStyle    : {
            fontSize  : 12,
            color     : 'rgba(0, 0, 0, 0.54)',
            fontWeight: 'bold'
        },
        tabStyle: {
            height        : 48,
            alignItems    : 'center',
            justifyContent: 'center',
        },
        style: {
            backgroundColor: 'white',
        },
        allowFontScaling: true
    },
    swipeEnabled: false
})

const RootStack = createStackNavigator({
    Home: {
        screen           : BottomTabNavigator,
        navigationOptions: {
            header    : null,
            headerLeft: null
        }
    },
    Type: {
        screen: TypeScreen,
    },
    StoreDetail: {
        screen: StoreTabNavigator
    },
    Search: {
        screen: SearchScreen
    }
}, 
{
    initialRouteName: 'StoreDetail',
})

// export default RootStack;

export default CartTabNavigator;