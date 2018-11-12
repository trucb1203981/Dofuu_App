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

import { activityTime } from '../utils'
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
                        <Thumbnail source = {{uri: 'https://www.dofuu.com'+item.avatar}}></Thumbnail>
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
    }

    _renderHeader = () => {
        return null
      };

    _renderFooter = () => {
        if (!this.props.isFetching) return null;
        
        return (
            <Spinner color="grey" />
        );
    };
    
    _loadMore = () => {
        const typeId = this.props.navigation.state.params.typeId
        const data   = { cityId: 10001, stores: this.props.stores, typeId: typeId }
        this.props._fetchStoreByType(data)
    }
    
    
    render() {
        const { stores } = this.props
        return(
            <FlatList
                extraData  = {this.props}
                data       = {stores}
                renderItem = {({item}) => ( 
                    <Item item={item} />
                )}
                keyExtractor          = {item => item.id.toString()}
                initialNumToRender    = {8}
                ListFooterComponent   = {this._renderFooter.bind(this)}
                onEndReached          = {this._loadMore.bind(this)}
                onEndReachedThreshold = {0.5}
            >
            </FlatList>
        )
    }
}
