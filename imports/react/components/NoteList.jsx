// Meteor
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
// React
import React from 'react';
import PropTypes from 'prop-types';
import FlipMove from 'react-flip-move';
// Api
import { Notes } from '/imports/api/notes';
// Children
import NoteListHeader from '/imports/react/components/NoteListHeader';
import NoteListItem from '/imports/react/components/NoteListItem';
import NoteListEmptyItem from '/imports/react/components/NoteListEmptyItem';

export const NoteList = (props) => {
    return (
        <div>
            <NoteListHeader />
            NoteList {props.notes.length}
            <FlipMove maintainContainerHeight={true}>
                {
                    props.notes.length > 0 ?
                        /* Render note items */
                        props.notes.map((note) => {
                            return <NoteListItem key={note._id} note={note} />
                        })
                        :
                        <NoteListEmptyItem />
                }
            </FlipMove>
        </div>
    );
};

NoteList.propTypes = {
    notes: PropTypes.array.isRequired
};

export default createContainer(() => {
    const selectedNoteId = Session.get('selectedNoteId');
    return {
        notes: Notes.find({}, { sort: { updatedAt: -1 } }).fetch().map((note) => {
            if (note._id === selectedNoteId) {
                return {
                    ...note,
                    selected: true
                }
            }
            return note;
        })
    };
}, NoteList);