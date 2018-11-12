import React, { Component } from 'react'

import { View, Text } from 'react-native'

import { Icon } from 'native-base'

export default class Map extends Component {
    static navigationOptions = ({ navigation }) => ({
		title      : `Bản đồ`,
		tabBarLabel: 'Bản đồ',
		tabBarIcon : ({ tintColor, focused }) => (
			<Icon type="MaterialCommunityIcons" name={focused ? "map-marker" : "map-marker-outline"}  style={{ color: tintColor, fontSize: 25 }} />
		)
	})
    render() {
        return (
            <View>
                <Text>Map</Text>
            </View>
        )
    }
}

