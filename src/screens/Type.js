import React, { Component } from 'react'

import {
    View,
    ScrollView
} from 'react-native'

import { 
    Header,
    Left,
    Body,
    Right,
    Card,
    Button,
    Text,
    Icon,
    Item,
    Input
} from 'native-base'
import { connect } from 'react-redux'
import { fetchStoreFromAPI, defaultStore } from '../actions'
import StoreFlatListVertical from '../components/StoreFlatListVertical1'
import API from '../api/http'

import { text, styles, colors, spacing} from '../styles'

class Type extends Component {
    constructor(props) {
        super(props)
    }
    
    _loadStore() {
        const typeId = this.props.navigation.state.params.typeId
        const data   = {cityId: 10001, stores: this.props.stores, typeId: typeId}
        this.props._fetchStoreByType(data)
    }
    
    _destroyStore() {
        this.props._destroyFetchStore()
    }

    componentDidMount() {
        this._loadStore()
    }
    
    componentWillUnmount() {
        this._destroyStore()
    }

    static navigationOptions = ({ navigation }) => ({
        header: <Header searchBar rounded style={[colors.white, styles.raised]} androidStatusBarColor='#B71C1C'>
                    <Left >
                        <Button style={[styles.circle]} transparent onPress={() => navigation.goBack() }>
                            <Icon name='arrow-back' style={text.textBlack} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={[text.title, text.fontWeightLight]}>{navigation.state.params.name}</Text>
                    </Body>
                    <Right>
                        <Button style={[styles.circle]} transparent onPress={() => navigation.state.routeName != 'Search' ? navigation.navigate('Search') : null}>
                            <Icon name='search' style={text.textBlack} />
                        </Button> 
                    </Right>
                </Header>
    })
    
    render() {
        const { stores } = this.props
        return (
            <View style={styles.container}>                
                <StoreFlatListVertical stores={stores} {...this.props}></StoreFlatListVertical>
            </View>
        )
    }
}

function mapStateToProps(state) {
	return {
        isFetching: state.store.isFetching,
        stores    : state.store.stores
	}
}

function mapDispatchToProps(dispatch) {
	return {
        _fetchStoreByType : (data) => dispatch(fetchStoreFromAPI(data)),
        _destroyFetchStore: () => dispatch(defaultStore())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Type)