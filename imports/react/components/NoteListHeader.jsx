// Meteor
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
// React
import React from 'react';
import PropTypes from 'prop-types';

export const NoteListHeader = (props) => {
    return (
        <div className='item-list__header'>
            <button className="button" onClick={() => {
                props.meteorCall('notes.insert', (err, newNoteId)=>{
                    if(err) throw new Meteor.Error('notes-api', 'The system has encountered an error while adding your note.');
                    if(newNoteId) props.Session.set('selectedNoteId', newNoteId);
                });
            }}>Create Note</button>
        </div>
    );
};

NoteListHeader.propTypes = {
    meteorCall: PropTypes.func.isRequired
};

export default createContainer(() => {
    return {
        meteorCall: Meteor.call,
        Session
    };
}, NoteListHeader);