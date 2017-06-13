import React from 'react';
import { Notes } from '/imports/api/notes';
import Router from '/imports/react/routes/Router';

export const history = require('history').createBrowserHistory();

class App extends React.Component {
    componentWillMount() {
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <Router />
        );
    }
}

export default App;