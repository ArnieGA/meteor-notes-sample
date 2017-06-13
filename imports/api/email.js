import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Accounts } from 'meteor/accounts-base';

// SERVER-SIDE CODE
if (Meteor.isServer) {
    Meteor.publish('email');
    // Activate verification emails:
    // Accounts.config({
    //     sendVerificationEmail: true
    // });
    Accounts.emailTemplates = {
        from: 'no-reply@boilerplate.com',
        sitename: Meteor.settings.private.app.name,
    };
}
// CLIENT-SIDE CODE
if (Meteor.isClient) {
    // Start a verification link listener:
    // Accounts.onEmailVerificationLink(function (token, done) {
    //     console.log('token: ', token);
    // });

}

Meteor.methods({
    'email.send'(userEmail, emailSubject, emailContent) {
        try {
            this.unblock();
            Email.send({
                from: 'no-reply@boilerplate.com',
                to: userEmail,
                subject: emailSubject,
                html: emailContent
            });
        } catch (e) {
            console.log(e);
        }
    },
    'email.sendVerification'(email) {
        this.unblock();
        // Set up the verification email template:
        Accounts.emailTemplates.verifyEmail = {
            subject: (user) => { return 'Account validation.' },
            html: (user, url) => { return `<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1' /></head><body><div><h2>Activate your account</h2><p>In order to login to your ${Meteor.settings.private.app.name} account, you must first validate the email your provided.</p><p>Click here to validate your email address:<br/>${url.replace('/#', '')}</p><p>If you have not created an account on ${Meteor.settings.private.app.name} or if you understand you have received this message by mistake, please contact our support team at once at ${Meteor.settings.private.app.supportEmail}</p></div></body></html>`}
        };
        const newUser = Accounts.findUserByEmail(email);
        if (!!newUser) {
            return Accounts.sendVerificationEmail(newUser._id, newUser.emails[0].address);
        } else {
            throw new Meteor.Error(500, 'The newly created user was not found');
        }
    }
});
