import React, { Component } from 'react'

import { View, Text } from 'react-native'

import { Icon } from 'native-base'

import { connect } from 'react-redux'

export default class History extends Component {
    static navigationOptions = ({ navigation, navigationOptions}) =>  ({
		title      : `Lịch sử đặt món`,
		tabBarLabel: 'Lịch sử đặt món'
	})
    render() {
        return (
            <View>
                <Text>History</Text>
            </View>
        )
    }
}

