import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';

// Extending SimpleSchema.RegEx with my own regexes:
SimpleSchema.RegEx.UrlHost = new RegExp(/^((\w+\.)+([a-z]{3,5}))|((\d{1,3}\.){3}\d{1,3}(\:([0-9]|[1-8][0-9]|9[0-9]|[1-8][0-9]{2}|9[0-8][0-9]|99[0-9]|[1-8][0-9]{3}|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9]|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-6]))?)$/i);
SimpleSchema.RegEx.UrlProtocol = new RegExp(/^(?:(?:https?|ftp)\:\/\/)$/i);
SimpleSchema.RegEx.PortRange = new RegExp(/^([0-9]|[1-8][0-9]|9[0-9]|[1-8][0-9]{2}|9[0-8][0-9]|99[0-9]|[1-8][0-9]{3}|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9]|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-6])$/);
SimpleSchema.RegEx.Url2 = new RegExp(/^((?:https?|ftp)\:\/\/)(((\w+\.)+([a-z]{3,5}))|((\d{1,3}\.){3}\d{1,3}(\:([0-9]|[1-8][0-9]|9[0-9]|[1-8][0-9]{2}|9[0-8][0-9]|99[0-9]|[1-8][0-9]{3}|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9]|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-6]))?))$/i);
// --- Passwords ---
// Password1: 6-8 characters with at least 1 uppercase, 1 lowercase, 1 digit and 1 special character.
SimpleSchema.RegEx.Password1 = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,8}$/);

// Defining custom validation errors:
SimpleSchema.defineValidationErrorTransform((error)=>{
    return new Meteor.Error(400, error.message);
});

// ===== APPLICATION SCHEMAS: =====
// Users:
export const userCredentialsSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.EmailWithTLD
  },
  password: {
    type: String,
    regEx: SimpleSchema.RegEx.Password1,
    optional: true
  }
});

export default SimpleSchema;
