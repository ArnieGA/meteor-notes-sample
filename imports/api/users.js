import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { userCredentialsSchema } from '/imports/startup/simple-schema-config';
import { Accounts } from 'meteor/accounts-base';

export const settings = {
    allowUnverifiedLogins: Meteor.settings.private.app.allowUnverifiedLogins
};


export const validateNewUser = (user) => {
    const email = user.emails[0].address;
    // Validate User credentials (NOTE: refer to /imports/startup/simple-schema-config.js)
    userCredentialsSchema.validate({ email });
    return true;
};

if (Meteor.isServer) {
    Accounts.validateNewUser(validateNewUser);
    Accounts.validateLoginAttempt((loginAttempt) => {
        if (loginAttempt.type === 'resume') return true;
        // Disable auto-login on new user creation:
        if (loginAttempt.methodName === 'createUser') {
            return settings.allowUnverifiedLogins;
        }
        // Control login:
        if (loginAttempt.methodName === 'login' && loginAttempt.allowed) {
            let verified = false;
            let email = loginAttempt.methodArguments[0].user.email;
            // Allow login depending on verified email state:
            loginAttempt.user.emails.forEach((emailObject, index) => {
                if (email === emailObject.address && emailObject.verified)
                    verified = true;
            });
            if (!verified)
                throw new Meteor.Error(403, Meteor.settings.private.app.unverifiedEmailLoginMessage);
        }
        return true;
    });
    Accounts.onCreateUser((options, user) => {
        const customizedUser = {
            ...user
        };
        if (options.profile) customizedUser.profile = options.profile;
        return customizedUser;
    });
}

export default {
    settings, validateNewUser
};
