// Meteor
import { Meteor } from 'meteor/meteor';
// Tests
import expect from 'expect';
import { mount } from 'enzyme';
// React
import React from 'react';
import { Editor } from './Editor';
// Api
import { testNotes } from '/imports/fixtures/noteFixtures';


if (Meteor.isClient) {
    describe('Editor Component Tests', function () {
        let history;
        let call;

        beforeEach(function () {
            call = expect.createSpy();
            history = {
                push: expect.createSpy()
            }
        });

        describe('Component render tests', function () {
            it('Should display correct message when no notes are selected', function () {
                const wrapper = mount(<Editor history={history} call={call} />);
                expect(wrapper.find('p').text()).toBe('Pick or create a note to get started.');
                const titleElement = wrapper.node.refs['noteTitle'];
                const bodyElement = wrapper.node.refs['noteBody'];
                expect(titleElement).toNotExist();
                expect(bodyElement).toNotExist();
            });

            it('Should display correct message when a note was not found', function () {
                const wrapper = mount(<Editor history={history} call={call} selectedNoteId='someId' />);
                expect(wrapper.find('p').text()).toBe('Note not found.');
                const titleElement = wrapper.node.refs['noteTitle'];
                const bodyElement = wrapper.node.refs['noteBody'];
                expect(titleElement).toNotExist();
                expect(bodyElement).toNotExist();
            });

            it('Should display editor contents when a note was found.', function () {
                const wrapper = mount(
                    <Editor history={history} call={call}
                        note={testNotes[0]} selectedNoteId={testNotes[0]._id} />
                );
                const titleState = wrapper.state('title');
                const bodyState = wrapper.state('body');
                expect(titleState).toBe(testNotes[0].title);
                expect(bodyState).toBe(testNotes[0].body);
                const titleElement = wrapper.node.refs['noteTitle'];
                const bodyElement = wrapper.node.refs['noteBody'];
                expect(titleElement).toExist();
                expect(bodyElement).toExist();
            });
        });

        describe('Component state tests', function () {
            it('Should set correct state on a new note.', function(){
                const note = testNotes.find((n)=>n._id === "completeNote");
                const wrapper = mount(
                    <Editor history={history} call={call} />
                );
                expect(wrapper.state('title')).toBe('');
                expect(wrapper.state('body')).toBe('');

                wrapper.setProps({
                    note,
                    selectedNoteId: note._id
                });

                expect(wrapper.state('title')).toBe(note.title);
                expect(wrapper.state('body')).toBe(note.body);
            });

            it('Should set initial note\'s state based on selected note values.', function () {
                const wrapper = mount(
                    <Editor history={history} call={call}
                        note={testNotes[2]} selectedNoteId={testNotes[2]._id} />
                );
                expect(wrapper.state('title')).toBe(testNotes[2].title);
                expect(wrapper.state('body')).toBe(testNotes[2].body);
            });

            it('Should set the correct note\'s state values on note edition.', function () {
                let note = { ...testNotes[0] };
                let wrapper = mount(
                    <Editor history={history} call={call}
                        note={note} selectedNoteId={note._id} />
                );
                expect(wrapper.state('title')).toBe(note.title);
                expect(wrapper.state('body')).toBe(note.body);

                const noteTitle = wrapper.find('input[name="noteTitle"]');
                const noteBody = wrapper.find('textarea[name="noteBody"]');
                const newValue = 'A New Value';

                noteTitle.simulate('change', {
                    target: {
                        value: newValue
                    }
                });
                noteBody.simulate('change', {
                    target: {
                        value: newValue
                    }
                });
                expect(wrapper.state('title')).toBe(newValue);
                expect(wrapper.state('body')).toBe(newValue);
                expect(noteTitle.node.value).toBe(newValue);
                expect(noteBody.node.value).toBe(newValue);
            });

            it('Should call \'notes.update\' with the correct data when field values change.', function () {
                let note = { ...testNotes[0] };
                let wrapper = mount(
                    <Editor history={history} call={call}
                        note={note} selectedNoteId={note._id} />
                );
                expect(wrapper.state('title')).toBe(note.title);
                expect(wrapper.state('body')).toBe(note.body);

                const noteTitle = wrapper.find('input[name="noteTitle"]');
                const noteBody = wrapper.find('textarea[name="noteBody"]');
                const newValue = 'A New Value';

                // Assert that the meteor method is being called correctly
                // when the field value changes
                // -- Note title
                noteTitle.simulate('change', {
                    target: {
                        value: newValue
                    }
                });
                expect(call).toHaveBeenCalledWith('notes.update', note._id, {
                    title: newValue
                });
                // -- Note body
                noteBody.simulate('change', {
                    target: {
                        value: newValue
                    }
                });
                expect(call).toHaveBeenCalledWith('notes.update', note._id, {
                    body: newValue
                });
            })
        });

        describe('Note removal api', function () {
            it('Should call \'notes.remove\' when removing a note.', function () {
                const wrapper = mount(
                    <Editor history={history} call={call}
                        note={testNotes[0]} selectedNoteId={testNotes[0]._id} />
                );
                wrapper.ref('removeNote').simulate('click');
                wrapper.ref('modalConfirmRemove').simulate('click');
                expect(call).toHaveBeenCalled();
                expect(call.calls[0].arguments[1]).toBe(testNotes[0]._id);
            });

            it('Should throw on \'notes.remove\' callback errors.', function () {
                const wrapper = mount(
                    <Editor history={history} call={call}
                        note={testNotes[0]} selectedNoteId={testNotes[0]._id} />
                );

                wrapper.ref('removeNote').simulate('click');
                wrapper.ref('modalConfirmRemove').simulate('click');

                expect(call).toHaveBeenCalled();
                const error = {
                    reason: 'This just failed dude!'
                };
                expect(() => {
                    call.calls[0].arguments[2](error)
                }).toThrow(error.reason);
            });
        });
    });
}