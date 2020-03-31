import {combineReducers, compose, createStore, applyMiddleware} from '/web_modules/redux.js';
const {__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: reduxDevToolsCompose} = window;
import {reducer as appReducer} from './store.mjs';

/**
 * @typedef {Object} State
 * @property {AppState} app
 */

const combinedReducer = combineReducers({
    app: appReducer,
});

// noinspection JSUnresolvedVariable
const composeEnhancers = reduxDevToolsCompose || compose;

const store = createStore(combinedReducer, composeEnhancers(applyMiddleware()));

export default store;