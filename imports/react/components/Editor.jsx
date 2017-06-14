import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { Notes } from '/imports/api/notes';
import { Meteor } from 'meteor/meteor';
import { defaultNoteTitle } from '/imports/fixtures/noteFixtures';
import Modal from 'react-modal';

export class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.handleBodyChange = this.handleBodyChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleNoteRemove = this.handleNoteRemove.bind(this);
        this.openRemoveConfirmModal = this.openRemoveConfirmModal.bind(this);
        this.closeRemoveConfirmModal = this.closeRemoveConfirmModal.bind(this);
        this.state = {
            openRemoveConfirmModal: false,
            title: this.props.note ? this.props.note.title : '',
            body: this.props.note ? this.props.note.body : ''
        };
    }
    componentDidUpdate(prevProps, prevState) {
        const currentNoteId = this.props.note ? this.props.note._id : undefined;
        const prevNoteId = prevProps.note ? prevProps.note._id : undefined;

        if (currentNoteId && currentNoteId !== prevNoteId) {
            this.setState({
                title: this.props.note.title,
                body: this.props.note.body
            });
        }
    }
    handleBodyChange(e) {
        this.setState({ body: e.target.value });
        this.props.call('notes.update', this.props.note._id, {
            body: e.target.value
        });
    }
    handleTitleChange(e) {
        this.setState({ title: e.target.value });
        this.props.call('notes.update', this.props.note._id, {
            title: e.target.value
        });
    }
    handleNoteRemove(e) {
        this.closeRemoveConfirmModal()
            .then(() => {
                this.props.call('notes.remove', this.props.note._id, (err) => {
                    if (err) throw new Meteor.Error(err.error, err.reason);
                });
            });
    }
    // MODAL ACTIONS
    openRemoveConfirmModal() {
        this.setState({ openRemoveConfirmModal: true });
    }
    closeRemoveConfirmModal() {
        return new Promise((resolve, reject) => {
            this.setState({ openRemoveConfirmModal: false });
            resolve();
        });
    }

    render() {
        if (!!this.props.note) {
            document.title = `Note: ${this.props.note.title || defaultNoteTitle}`;
            return (
                <div>
                    <Modal
                        isOpen={this.state.openRemoveConfirmModal}
                        contentLabel='Signup'
                        className='boxed-view__box flexible'
                        overlayClassName='boxed-view boxed-view--modal'
                        onRequestClose={this.closeRemoveConfirmModal}>
                        <h2>{`Are you sure you want to remove note '${this.props.note.title || defaultNoteTitle}'`}</h2>
                        <button ref='modalRemove' className='button button--pill hover-alt-color thicker'
                            style={{ marginRight: '1rem' }}
                            onClick={this.handleNoteRemove}>Yes, remove</button>
                        <button ref='modalRemove' className='button button--secondary hover-alt-color'
                            onClick={this.closeRemoveConfirmModal}>Cancel</button>
                    </Modal>
                    <input type="text" placeholder="Your Note's Title..."
                        onChange={this.handleTitleChange}
                        value={this.state.title} />
                    <textarea
                        ref="noteBody"
                        cols="30" rows="10"
                        value={this.state.body}
                        placeholder='Type in your note here'
                        onChange={this.handleBodyChange}></textarea>
                    <button
                        className='button button--pill hover-alt-color'
                        onClick={this.openRemoveConfirmModal}>Delete Note</button>
                </div>
            );
        } else if (!!this.props.selectedNoteId) {
            return <p>Note not found.</p>
        } else {
            return <p>Pick or create a note to get started.</p>
        }
    }
}

Editor.propTypes = {
    note: PropTypes.object,
    selectedNoteId: PropTypes.string
};

export default createContainer(() => {
    const selectedNoteId = Session.get('selectedNoteId');
    return {
        selectedNoteId,
        note: Notes.findOne({ _id: selectedNoteId }),
        call: Meteor.call,
        Session: Session
    };
}, Editor);