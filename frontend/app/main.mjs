const {ReactDOM} = window;
import {App} from './components/App.mjs';
import store from './reduxStore.mjs';

const {StrictMode} = window.React;

const {Provider} = window.ReactRedux;

ReactDOM.render(
    React.createElement(Provider, {store},
        React.createElement(StrictMode, {},
            React.createElement(App),
        ),
    ),
    document.getElementById('app')
);