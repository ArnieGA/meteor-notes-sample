import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React from 'react';
import ReactDOM from 'react-dom';
import '/imports/startup/simple-schema-config'; // Run the Simple Schema configuration file
import { Session } from 'meteor/session';
import { history, onAuthChange, routes } from '/imports/react/routes/Router';

import App from '/imports/react/App';

Meteor.startup(() => {
  // Declare session variables:
  Session.set('userAuthenticated', undefined);
  Session.set('currentPagePrivacy', undefined);
  Session.set('selectedNoteId', undefined);
  Session.set('isNavOpen', false);

  // Start the auth tracker
  Tracker.autorun(() => {
    const isAuthenticated = !!Meteor.userId();
    const currentPagePrivacy = Session.get('currentPagePrivacy');

    onAuthChange(isAuthenticated, currentPagePrivacy);
  });

  // Start the selectedNoteId listener
  Tracker.autorun((computation) => {
    const selectedNoteId = Session.get('selectedNoteId');
    if (selectedNoteId) {
      Session.set('isNavOpen', false);
      history.replace(`/dash/${selectedNoteId}`);
    }
  });

  // Start the nav open listener
  Tracker.autorun(()=>{
    const isNavOpen = Session.get('isNavOpen');
    document.body.classList.toggle('is-nav-open', isNavOpen);
  });

  // Render the application:
  ReactDOM.render(
    <App />,
    document.getElementById('app'));
});