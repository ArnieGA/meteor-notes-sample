import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { mount, shallow } from 'enzyme';

import { NoteListHeader } from './NoteListHeader';
import { testNotes } from '/imports/fixtures/noteFixtures';

if (Meteor.isClient) {
    describe('NoteListHeader Component Tests', function () {
        let meteorCall, Session, browserHistory;

        beforeEach(function () {
            meteorCall = expect.createSpy();
            Session = {
                set: expect.createSpy()
            };
            browserHistory = require('history').createBrowserHistory();
        });

        it('Should call "meteorCall" on button click', function () {
            const wrapper = mount(
                <NoteListHeader 
                    Session={Session}
                    meteorCall={meteorCall}
                    history={browserHistory} />
            );

            wrapper.find('button.button').simulate('click');
            expect(meteorCall.calls[0].arguments[0]).toBe('notes.insert');

            expect(()=>{
                meteorCall.calls[0].arguments[1](undefined, testNotes[0]._id)
            }).toNotThrow();
            expect(Session.set).toHaveBeenCalledWith('selectedNoteId', testNotes[0]._id);
        });


        it('Should not set "selectedNoteId" when an insert fails', function () {
            const wrapper = mount(
                <NoteListHeader 
                    Session={Session}
                    meteorCall={meteorCall}
                    history={browserHistory} />
            );

            wrapper.find('button.button').simulate('click');
            expect(meteorCall.calls[0].arguments[0]).toBe('notes.insert');

            expect(()=>{
                meteorCall.calls[0].arguments[1]({}, testNotes[0]._id)
            }).toThrow();
            expect(Session.set).toNotHaveBeenCalled();
        });
    });

}