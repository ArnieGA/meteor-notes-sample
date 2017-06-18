import React from 'react';
import { Notes } from '/imports/api/notes';
import Router from '/imports/react/routes/Router';
import { Meteor } from 'meteor/meteor';

// export const history = Meteor.isClient ? require('history').createBrowserHistory() : undefined;

class App extends React.Component {
    render() {
        return (
            <Router />
        );
    }
}

export default App;