import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { mount, shallow } from 'enzyme';
import moment from 'moment';
import { updatedAtFormat, defaultNoteTitle, testNotes } from '/imports/fixtures/noteFixtures';

import { NoteListItem } from '/imports/react/components/NoteListItem';

if (Meteor.isClient) {
    describe('NoteListItem Tests', function () {
        let Session;

        beforeEach(() => {
            Session = {
                set: expect.createSpy()
            };
        });

        it('Should render title and timestamp', function () {
            const formattedStamp = moment(testNotes[0].updatedAt).format(updatedAtFormat);
            const wrapper = mount(<NoteListItem note={testNotes[0]} Session={Session} />);

            expect(wrapper.find('h5').text()).toBe(testNotes[0].title);
            expect(wrapper.find('p').text()).toBe(formattedStamp);

        });

        it('Should set default title if no title set', function () {
            const wrapper = mount(<NoteListItem note={testNotes[1]} Session={Session} />);
            expect(wrapper.find('h5').text()).toBe(defaultNoteTitle);
        });

        it('Should set Session["selectedNoteId"] on click', function(){
            const wrapper = mount(<NoteListItem note={testNotes[0]} Session={Session} />);
            wrapper.childAt(0).simulate('click');
            expect(Session.set).toHaveBeenCalledWith('selectedNoteId', testNotes[0]._id);
        });
    });
}