import { Meteor } from 'meteor/meteor';
import expect from 'expect';
import { validateNewUser } from './users';

if (Meteor.isServer) {
    describe('User Validation', function () {
        it('Should allow valid email address', function () {
            let testUser = { emails: [{ address: 'Test@example.com' }] };
            expect(validateNewUser(testUser)).toBe(true);
        });

        it('Should not allow an invalid email address', function () {
            const testUser = { emails: [{ address: 'Test@example' }] };
            expect(() => {
                validateNewUser(testUser)
            }).toThrow();
        });
    });
}
