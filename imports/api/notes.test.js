import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Notes } from './notes';
import expect from 'expect';

if (Meteor.isServer) {
    describe('Notes Tests', function () {
        // Creating a seed to use in all these tests:
        const seedOne = {
            _id: 'testNoteId',
            title: 'Test Title',
            body: 'Test Body',
            updatedAt: 0,
            userId: 'testUserId'
        };
        const seedTwo = {
            _id: 'testNoteId1',
            title: 'Test Title 1',
            body: 'Test Body 1',
            updatedAt: 0,
            userId: 'testUserId1'
        };
        beforeEach(function () {
            Notes.remove({});
            Notes.insert(seedOne);
            Notes.insert(seedTwo);
        });

        // CRUD OPERATIONS:
        describe('CRUD Operations Tests', function () {
            // AUTHENTICATION (ALL CRUDS):
            describe('Authentication', function () {
                it('Should not insert a Note if Unauthenticated', function () {
                    expect(() => { Meteor.server.method_handlers['notes.insert'](); })
                        .toThrow();
                });
                it('Should not remove a Note if Unauthenticated', function () {
                    expect(() => { Meteor.server.method_handlers['notes.remove'].apply({}, [seedOne._id]); })
                        .toThrow();
                });
                it('Should not update a Note if Unauthenticated', function () {
                    expect(() => { Meteor.server.method_handlers['notes.update'](); }).toThrow();
                    expect(() => {
                        Meteor.server.method_handlers['notes.update'].apply({},
                            [seedOne._id, { title: 'new title' }]);
                    }).toThrow();
                });

            });
            // INSERT
            describe('Insert', function () {
                it('Should insert new Note', function () {
                    const userId = 'testid';
                    const _id = Meteor.server.method_handlers['notes.insert'].apply({
                        userId: userId
                    });
                    expect(Notes.findOne({ _id, userId })).toExist();
                });

            });

            // REMOVE
            describe('Remove', function () {
                it('Should remove a Note', function () {
                    Meteor.server.method_handlers['notes.remove'].apply({ userId: seedOne.userId }, [seedOne._id]);
                    expect(Notes.findOne({ _id: seedOne._id })).toNotExist();
                });

                it('Should not remove a Note if invalid _id', function () {
                    expect(() => { Meteor.server.method_handlers['notes.remove'].apply({ userId: seedOne.userId }, []); })
                        .toThrow();
                });

            });

            // UPDATE
            describe('Update', function () {
                it('Should update Note', function () {
                    const title = 'This is an updated title';
                    Meteor.server.method_handlers['notes.update'].apply({
                        userId: seedOne.userId
                    }, [
                            seedOne._id,
                            { title }
                        ]
                    );

                    const updatedNote = Notes.findOne({ _id: seedOne._id });

                    expect(updatedNote.updatedAt).toBeGreaterThan(0);
                    expect(updatedNote).toInclude({
                        title,
                        body: seedOne.body
                    });
                });

                it('Should not update Note when passing non-schema data', function () {
                    expect(() => {
                        Meteor.server.method_handlers['notes.update'].apply({
                            userId: seedOne.userId
                        }, [
                                seedOne._id,
                                { test: 'Some extra data that is not part of the schema.' }
                            ]);
                    }).toThrow();
                });

                it('Should not update Note from a different user', function () {
                    const title = 'This is an updated title';
                    Meteor.server.method_handlers['notes.update'].apply({
                        userId: 'someOtherId'
                    }, [
                            seedOne._id,
                            { title }
                        ]
                    );

                    const updatedNote = Notes.findOne({ _id: seedOne._id });

                    expect(updatedNote).toInclude(seedOne);
                });

                it('Should not update a Note if invalid _id', function () {
                    expect(() => { Meteor.server.method_handlers['notes.update'].apply({ userId: seedOne.userId }, []); })
                        .toThrow();
                });
            });            
        });

        // PUBLICATIONS:
        describe('Publication tests', function(){
            it('Should return the logged user\'s notes ', function(){
                // The publish method returns a cursor! I order to get the actual data we have to use .fetch() afterwards.
                const result = Meteor.server.publish_handlers['notes'].apply({userId: seedOne.userId});
                const notes = result.fetch();

                expect(notes.length).toBe(1);
                expect(notes[0]).toEqual(seedOne);
            });

            it('Should not return any note if logged user has none', function(){
                const result = Meteor.server.publish_handlers['notes'].apply({userId: 'someValidUserId'});
                const notes = result.fetch();

                expect(notes.length).toBe(0);
            });
        });
    });
}