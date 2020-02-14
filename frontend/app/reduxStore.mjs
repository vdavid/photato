const {Redux, __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: reduxDevToolsCompose} = window;
import {reducer as appReducer} from './store.mjs';

/**
 * @typedef {Object} State
 * @property {AppState} app
 */

const combinedReducer = Redux.combineReducers({
    app: appReducer,
});

// noinspection JSUnresolvedVariable
const composeEnhancers = reduxDevToolsCompose || Redux.compose;

const store = Redux.createStore(combinedReducer, composeEnhancers(Redux.applyMiddleware()));

export default store;