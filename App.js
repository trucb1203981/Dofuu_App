
import React, { Component } from 'react';
import {
	YellowBox
} from 'react-native';
import { Provider } from 'react-redux';
YellowBox.ignoreWarnings([
	"Warning: isMounted(...) is deprecated",
	"Module RCTImageLoader"
]);
import store from './src/configureStore'

import RootStack from './src/navigation'

export default class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<RootStack />
			</Provider>
		)
	}
}
