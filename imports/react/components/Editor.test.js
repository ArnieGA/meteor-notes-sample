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
            });

            it('Should display correct message when note was not found', function () {
                const wrapper = mount(<Editor history={history} call={call} selectedNoteId='someId' />);
                expect(wrapper.find('p').text()).toBe('Note not found.');
            });

            it('Should display editor contents when a note was found.', function () {
                const wrapper = mount(
                    <Editor history={history} call={call}
                        note={testNotes[0]} selectedNoteId={testNotes[0]._id} />
                );
                const title = wrapper.state('title');
                const body = wrapper.state('body');
                const textarea = wrapper.find('textarea');
                expect(title).toBe(testNotes[0].title);
                expect(body).toBe(testNotes[0].body);
                expect(textarea).toExist();
            });
        });

        describe('Component state tests', function () {
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

                noteTitle.node.value = 'A New Title'; noteTitle.simulate('change');
                expect(wrapper.state('title')).toBe('A New Title');
                noteBody.node.value = 'A New Body'; noteBody.simulate('change');
                expect(wrapper.state('body')).toBe('A New Body');
            });

            it('Should call \'notes.update\' with the correct data when field values change.', function(){
                let note = { ...testNotes[0] };
                let wrapper = mount(
                    <Editor history={history} call={call}
                        note={note} selectedNoteId={note._id} />
                );
                expect(wrapper.state('title')).toBe(note.title);
                expect(wrapper.state('body')).toBe(note.body);

                const noteTitle = wrapper.find('input[name="noteTitle"]');
                const noteBody = wrapper.find('textarea[name="noteBody"]');

                // Assert that the meteor method is being called correctly
                // when the field value changes
                // -- Note title
                noteTitle.node.value = 'A New Title'; noteTitle.simulate('change');
                expect(call).toHaveBeenCalledWith('notes.update', note._id, {
                    title: 'A New Title'
                });
                // -- Note body
                noteBody.node.value = 'A New Body'; noteBody.simulate('change');
                expect(call).toHaveBeenCalledWith('notes.update', note._id, {
                    body: 'A New Body'
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