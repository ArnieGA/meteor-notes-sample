import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { createContainer } from 'meteor/react-meteor-data';
import { updatedAtFormat, defaultNoteTitle } from '/imports/fixtures/noteFixtures';
import { Session } from 'meteor/session';

export class NoteListItem extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div onClick={() => {
                this.props.Session.set('selectedNoteId', this.props.note._id);
                // props.Session.set('selectedNoteId', 'asdfasdf');
            }}>
                <h5>{this.props.note.title || defaultNoteTitle}</h5>
                {this.props.note.selected ? 'selected' : undefined}
                <p>{moment(this.props.note.updatedAt).format(updatedAtFormat)}</p>
            </div>
        );
    }
}

NoteListItem.propTypes = {
    note: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
};

export default createContainer(() => {
    return {
        Session
    };
}, NoteListItem);
