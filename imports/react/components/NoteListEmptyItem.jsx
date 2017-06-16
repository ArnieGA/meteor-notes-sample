import React from 'react';

class NoteListEmptyItem extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div>
                <h5>You have no notes to display</h5>
                <p>Create a new note to get started.</p>
            </div>
        );
    }
};

export default NoteListEmptyItem;

