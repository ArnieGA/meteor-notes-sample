import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { mount, shallow } from 'enzyme';
import { NoteList } from './NoteList';
import { testNotes } from '/imports/fixtures/noteFixtures';

if (Meteor.isClient) {
    describe('NoteList Component Tests', function () {
        it('Should render a <NoteListItem/> for each note', function () {
            const wrapper = mount(<NoteList notes={testNotes} />);
            expect(wrapper.find('NoteListItem').length).toBe(2);
            expect(wrapper.find('NoteListEmptyItem').length).toBe(0);
        });

        it('Should render the <NoteListEmptyItem/> if zero notes', function () {
            const wrapper = mount(<NoteList notes={[]} />);
            expect(wrapper.find('NoteListItem').length).toBe(0);
            expect(wrapper.find("NoteListEmptyItem").length).toBe(1);
        });
    });
}