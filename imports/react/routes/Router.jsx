// Meteor
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'; //<-- meteor add session
import { Tracker } from 'meteor/tracker';
// React
import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Switch } from 'react-router-dom';
// API's
import { Notes } from '/imports/api/notes';
// PAGES:
import Dashboard from '/imports/react/components/pages/Dashboard';
import Login from '/imports/react/components/pages/Login';
import Signup from '/imports/react/components/pages/Signup';
import PageNotFound from '/imports/react/components/pages/PageNotFound';
import EmailVerification from '/imports/react/components/pages/EmailVerification';

export const history = Meteor.isClient ? require('history').createBrowserHistory() : undefined;

const routes = [
    { path: '/', exact: true, component: Login, privacy: 'unauth', rootPage: true, documentTitle: 'Notes: Login' },
    { path: '/signup', exact: true, component: Signup, privacy: 'unauth', documentTitle: 'Notes: Signup' },
    { path: '/dash', exact: true, component: Dashboard, privacy: 'auth', mainPage: true, documentTitle: 'Notes: Dashboard' },
    { path: '/dash/:id', exact: true, component: Dashboard, privacy: 'auth' },
    { path: '/verify-email/:token', exact: true, component: EmailVerification, privacy: 'unauth', documentTitle: 'Email Verification' },
    { component: PageNotFound, privacy: 'unauth', documentTitle: '404: Not found' }
];

export const onAuthChange = (isAuthenticated, currentPagePrivacy) => {
    const isUnauthenticatedPath = currentPagePrivacy === 'unauth';
    const isAuthenticatedPath = currentPagePrivacy === 'auth';
    const rootPage = routes.find(component => component.rootPage);
    const mainPage = routes.find(component => component.mainPage);

    if (isUnauthenticatedPath && isAuthenticated) {
        history.replace(mainPage.path);
    }
    else if (isAuthenticatedPath && !isAuthenticated) {
        history.replace(rootPage.path);
    }
};

// Start the selected note id tracker
if (Meteor.isClient) {
    const selectedNoteIdTracker = Tracker.autorun((computation) => {
        const selectedNoteId = Session.get('selectedNoteId');
        if (selectedNoteId) {
            history.push(`/dash/${selectedNoteId}`);
        }
        else {
            if(history.location.pathname.includes('/dash/'))
                history.push(routes.find((component) => component.mainPage).path);
        }
    });
}

export class RoutesWithSubRoutes extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Route path={this.props.path} render={(props) => (
                <this.props.component {...props}
                    privacy={this.props.privacy}
                    documentTitle={this.props.documentTitle || Meteor.settings.public.app.defaultDocumentTitle}
                    routes={this.props.routes} />
            )} />
        );
    }
}


class _Router extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Router history={history}>
                <Switch>
                    {routes.map((route, i) => (
                        <RoutesWithSubRoutes key={i} {...route} />
                    ))}
                </Switch>
            </Router>
        );
    }
}

export default _Router;