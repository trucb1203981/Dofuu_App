import { createStore, applyMiddleware } from 'redux';

import axiosMiddleware from 'redux-axios-middleware';
import thunk from 'redux-thunk'

import allReducers from './reducers'

const middlewares = [thunk];
const store       = createStore(
	allReducers,
	{},
	applyMiddleware(...middlewares)
)

export default store;
