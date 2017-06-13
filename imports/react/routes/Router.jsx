import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Switch } from 'react-router-dom';
import { history } from '/imports/react/App';
import { Tracker } from 'meteor/tracker';
import { Notes } from '/imports/api/notes';
// Grab the Website pages (components):
import Dashboard from '/imports/react/components/pages/Dashboard';
import Login from '/imports/react/components/pages/Login';
import Signup from '/imports/react/components/pages/Signup';
import PageNotFound from '/imports/react/components/pages/PageNotFound';
import EmailVerification from '/imports/react/components/pages/EmailVerification';

// const userAuthenticated = !!Meteor.userId();

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

const routes = [
    { path: '/', exact: true, component: Login, privacy: 'unauth', rootPage: true, documentTitle:'Notes: Login' },
    { path: '/signup', exact: true, component: Signup, privacy: 'unauth', documentTitle: 'Notes: Signup' },
    { path: '/dash', exact: true, component: Dashboard, privacy: 'auth', mainPage: true, documentTitle: 'Notes: Dashboard' },
    { path: '/dash/:id', exact: true, component: Dashboard, privacy: 'auth' },
    { path: '/verify-email/:token', exact: true, component: EmailVerification, privacy: 'unauth', documentTitle: 'Email Verification' },
    { component: PageNotFound, privacy: 'unauth', documentTitle: '404: Not found' }
];

export class RoutesWithSubRoutes extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillUpdate(nextProps, nextState) {
        onAuthChange(Session.get('userAuthenticated'), Session.get('currentPagePrivacy'));
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
    componentWillMount(){
        // Start the selected note id tracker
        this.selectedNoteIdTracker = Tracker.autorun(() => {
            let selectedNoteId = Session.get('selectedNoteId');
            if (selectedNoteId) {
                if (!Notes.findOne({ _id: selectedNoteId })) {
                    Session.set('selectedNoteId', undefined);
                    history.replace(routes.find(component => component.mainPage).path);
                }
                else {
                    history.replace(`/dash/${selectedNoteId}`);
                }
            }
        });        
    }
    componentWillUnmount(){
        // Stop all trackers:
        this.selectedNoteIdTracker.stop();        
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