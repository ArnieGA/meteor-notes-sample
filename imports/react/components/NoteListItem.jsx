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
        const className = this.props.note.selected ? 'item item--selected' : 'item';
        return (
            <div className={className} onClick={() => {
                this.props.Session.set('selectedNoteId', this.props.note._id);
                // props.Session.set('selectedNoteId', 'asdfasdf');
            }}>
                <h5 className='item__title'>{this.props.note.title || defaultNoteTitle}</h5>
                <p className='item__subtitle'>{moment(this.props.note.updatedAt).format(updatedAtFormat)}</p>
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
