import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React from 'react';
import ReactDOM from 'react-dom';
import '/imports/startup/simple-schema-config'; // Run the Simple Schema configuration file
import { Session } from 'meteor/session';
import { onAuthChange } from '/imports/react/routes/Router';

import App from '/imports/react/App';

Meteor.startup(() => {
  // Declare session variables:
  Session.set('userAuthenticated', undefined);
  Session.set('currentPagePrivacy', undefined);
  Session.set('selectedNoteId', undefined);

  // Start the auth tracker
  Tracker.autorun(() => {
    const isAuthenticated = !!Meteor.userId();
    const currentPagePrivacy = Session.get('currentPagePrivacy');
    Session.set('userAuthenticated', isAuthenticated);
    onAuthChange(isAuthenticated, currentPagePrivacy);
  });

  // Render the application:
  ReactDOM.render(
    <App />,
    document.getElementById('app'));
});