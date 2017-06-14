import { Session } from 'meteor/session'; //<-- meteor add session
import { Tracker } from 'meteor/tracker';
import { Route, Match } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { Notes } from '/imports/api/notes';
import { createContainer } from 'meteor/react-meteor-data';

import PageNotFound from '/imports/react/components/pages/PageNotFound';
import PrivateHeader from '/imports/react/components/default/PrivateHeader';
import NoteList from '/imports/react/components/NoteList';
import Editor from '/imports/react/components/Editor';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.Session.set('currentPagePrivacy', this.props.pagePrivacy);
        document.title = this.props.documentTitle;
    }
    componentWillUpdate(nextProps, nextState) {
        this.props.Session.set('currentPagePrivacy', nextProps.pagePrivacy);
        if (this.props.match.params.id && nextProps.match.params.id !== this.props.match.params.id) {
            this.props.Session.set('selectedNoteId', nextProps.match.params.id);
        }
    }
    render() {
        return (
            <div>
                <PrivateHeader title='Dashboard' />
                <div className='page-container'>
                    <NoteList />
                    <Editor />
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    pagePrivacy: PropTypes.string.isRequired,
    documentTitle: PropTypes.string.isRequired
};

export default createContainer((props) => {
    return {
        Session: Session,
        Subscription: Meteor.subscribe('notes', {
            onReady: () => {
                const id = props.match.params.id;
                Session.set('selectedNoteId', id);
            }
        }),
        pagePrivacy: props.privacy,
        documentTitle: props.documentTitle
    };
}, Dashboard);