import React from 'react';

class NoteListEmptyItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <p className='empty-item'>Create a new note to get started.</p>
        );
    }
};

export default NoteListEmptyItem;

