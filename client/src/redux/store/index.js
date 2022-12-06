import {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from '../reducers/';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware, logger)));

export default store;