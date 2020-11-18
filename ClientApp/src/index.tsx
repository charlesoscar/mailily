import 'bootstrap/dist/css/bootstrap.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import configureStore from './store/configureStore';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as ApplicationStore from './store/index'
import { EmailInfo } from './store/EmailExtraction';

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href') as string;
const history = createBrowserHistory({ basename: baseUrl });

const loadState = () => {
    let initial: ApplicationStore.ApplicationState = {
        counter: {
            count: 0
        },
        weatherForecasts: {
            forecasts: [],
            isLoading: false 
        },    
        emails: {
            errorMessage: '',
            hasError: false,
            emails: [],
            isLoading: false,
            websiteUrl: ''
        }
    }
    let json = localStorage.getItem('persisted_emails');
    if (json !== null){
        let data = JSON.parse(json) as EmailInfo[]
        if(initial.emails){
            initial.emails.emails = data;
        }
    }
    return initial;
}

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore(history, loadState()); 
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root'));

registerServiceWorker();
