import { Meteor } from 'meteor/meteor';

Meteor.startup(()=>{
    if(Meteor.isServer){
        process.env.MAIL_URL = Meteor.settings.private.sendgrid.MAIL_URL;
    }
});