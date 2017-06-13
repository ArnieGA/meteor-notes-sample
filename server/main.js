import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { Accounts } from 'meteor/accounts-base';
import '/imports/startup/simple-schema-config';
import '/imports/api/users';
import '/imports/api/email';
import '/imports/api/notes';

Meteor.startup(() => {
  // code to run on server at startup
  WebApp.connectHandlers.use((req, res, next)=>{
    next();
  });
});
