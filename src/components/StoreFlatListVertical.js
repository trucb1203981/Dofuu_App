import React, { Component } from 'react'

import {
    FlatList,    
    View,
} from 'react-native'

import {
    Body,
    Card,
    CardItem,
    Text,
    Icon,
    Thumbnail,
    Spinner
} from 'native-base'

import { formatTime, activityTime, image } from '../utils'
import {text, colors, styles, spacing} from '../styles'
import API from '../api/http'

import Spacer from './commons/Spacer'

class Item extends Component {
    
    render() {
        const { item } = this.props
        return (
            <Card style={styles.cardRadius}>
                <CardItem header style={[styles.cardHeader, colors.redDarken4, {height:30}]}>
                    <Icon name="time" style={[text.textLight, styles.iconSize]}></Icon>
                    <Text style={text.textLight}>{activityTime(item.activities)}</Text>
                    <Spacer/>
                    <Text style={text.textLight}>{item.type.name}</Text>
                </CardItem>
                <CardItem>
                    <Card style={{ borderRadius: 50 }}>
                        <Thumbnail source = {{uri: image(item.avatar)}}></Thumbnail>
                    </Card>
                    <Body style={spacing.ml3}>
                        <Text numberOfLines={1}>{item.name}</Text>
                        <Text numberOfLines={1} style={text.textDark}>{item.address}</Text>
                        { !!item.coupon ? <Text style={[text.textRedAccent, text.fontWeightBold, text.fontItalic]}>{item.coupon.title}</Text> :null}
                    </Body>
                </CardItem>
                <CardItem footer style={[styles.cardFooter, colors.greyLighten5, {height:30}]}>
                    <Spacer/>
                    <Icon type="MaterialCommunityIcons" name="eye" style={[text.textDark, styles.iconSize]}></Icon>
                    <Text style={[text.textDark, spacing.mr2]}>{item.views}</Text>
                    <Icon type="MaterialCommunityIcons" name="message-reply-text" style={[text.textDark, styles.iconSize]}></Icon>
                    <Text style={[text.textDark, spacing.mr2]}>{item.totalComment}</Text>
                    <Icon type="MaterialCommunityIcons" name="heart" style={[text.textDark, styles.iconSize]}></Icon>
                    <Text style={[text.textDark, spacing.mr2]}>{item.likes}</Text>
                    <Icon type="MaterialCommunityIcons" name="bookmark-outline" style={[text.textDark, styles.iconSize]}></Icon>
                </CardItem>
            </Card>
        ) 
    }
}


export default class StoreFlatListVertical extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stores : [],
            end    : false,
            loading: false
        };
    }
    
    componentDidMount () {
        this._fetchAllStore()
    }

    _fetchAllStore() {
        const cityId  = 10001
        var   offset  = this.state.stores.length
        const data    = { typeId: 0, offset: offset, cityId: cityId }
        const loading = this.state.loading
        const end     = this.state.end
        const url     = `/Store/FetchAllStores`
        if(!loading && !end) {
            this.setState({loading: true})
            setTimeout(() => {
                API.post(url, data, { withCredentials:true }).then(response => {
                    if(response.status === 200) {
                        var stores = response.data.stores
                        if(stores.length === 0) {
                            this.setState({end: true})
                        }
                        const newRecords = this.state.stores
                        stores.forEach(item => {
                            newRecords.push(item)
                        })
                        this.setState({stores: newRecords})
                    }
                }).finally(() => {
                    this.setState({loading: false})
                })
            }, 500)            
        }        
    }

    _renderHeader = () => {
        return null
      };

    _renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <Spinner color="grey" />
        );
    };
    
    _loadMore = () => {
        this._fetchAllStore()
    }
    
    render() {
        const { stores } = this.state
        return(
            <FlatList
                extraData  = {this.state}
                data       = {stores}
                renderItem = {({item}) => ( 
                    <Item item={item} />
                )}
                keyExtractor          = {item => item.id.toString()}
                ListFooterComponent   = {this._renderFooter}
                onEndReached          = {this._loadMore}
                onEndReachedThreshold = {0.5}
            >
            </FlatList>
        )
    }
}
