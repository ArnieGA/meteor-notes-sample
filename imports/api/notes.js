import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import { updatedAtFormat, defaultNoteTitle } from '/imports/fixtures/noteFixtures';

export const Notes = new Mongo.Collection('notes');

if (Meteor.isServer) {
    // The publish method returns a cursor! I order to get the actual data we have to use .fetch() afterwards.
    Meteor.publish('notes', function () {
        return Notes.find({ userId: this.userId });
    })
};

Meteor.methods({
    'notes.insert'() {
        if (!this.userId) throw new Meteor.Error('auth-error', 'Unauthorized');
        return Notes.insert({
            title: '',
            body: '',
            userId: this.userId,
            updatedAt: new Date().getTime()
        });
    },
    'notes.remove'(_id) {
        if (!this.userId) throw new Error('auth-error', 'Unauthorized');
        new SimpleSchema({
            _id: { type: String, min: 1 }
        }).validate({ _id });
        return Notes.remove({ _id, userId: this.userId });
    },
    'notes.update'(_id, updates) {
        if (!this.userId) throw new Error('auth-error', 'Unauthorized');
        new SimpleSchema({
            _id: {
                type: String,
                min: 1
            },
            title: {
                type: String,
                optional: true
            },
            body: {
                type: String,
                optional: true
            }
        }).validate({
            _id,
            ...updates
        });
        return Notes.update({ _id, userId: this.userId }, {
            $set: {
                updatedAt: new Date().getTime(),
                ...updates
            }
        });
    }
});