import { Meteor } from 'meteor/meteor';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import expect from 'expect';
import { mount, shallow } from 'enzyme';

import { Login } from './Login';

if (Meteor.isClient) {
    describe('Login Component Tests', function () {
        it('Should show error messages (by setting error state)', function () {
            const error = 'This stuff is not working man!';
            const wrapper = mount(
                <MemoryRouter initialEntries={['/']} initialIndex={0}>
                    <Login loginWithPassword={() => { }} pagePrivacy='auth' />
                </MemoryRouter>
            );

            const login = wrapper.find(Login).node;

            expect(login.state['error'].length).toEqual('');

            login.setState({ error });
            const errorElement = wrapper.find('p.boxed-view__error');
            expect(errorElement.text()).toBe(error);

            login.setState({ error: '' });
            expect(wrapper.find('p.boxed-view__error').length).toBe(0);
        });

        it('Should set an error if no credentials were present on submit', function(){            
            const spy = expect.createSpy();
            const wrapper = mount(
                <MemoryRouter initialEntries={['/']} initialIndex={0}>
                    <Login loginWithPassword={spy} />
                </MemoryRouter>
            );

            expect(wrapper.find(Login).node.state['error'].length).toBe(0);
            wrapper.find('form.boxed-view__form').simulate('submit');
            expect(wrapper.find(Login).node.state['error'].length).toNotBe(0);
        });

        it('Should call loginWithPassword with form data', function () {
            const validEmail = 'andrew@test.com';
            const validPassword = 'Aa1234!';
            const spy = expect.createSpy();

            const wrapper = mount(
                <MemoryRouter initialEntries={['/']} initialIndex={0}>
                    <Login loginWithPassword={spy} />
                </MemoryRouter>
            );

            wrapper.find(Login).node.refs['email'].value = validEmail;
            wrapper.find(Login).node.refs['password'].value = validPassword;

            wrapper.find('form.boxed-view__form').simulate('submit');

            expect(spy).toHaveBeenCalled();
            expect(spy.calls[0].arguments[0]).toEqual({ email: validEmail });
            expect(spy.calls[0].arguments[1]).toBe(validPassword);
        });

        it('Should set loginWithPasswword callback errors', function () {
            const validEmail = 'andrew@test.com';
            const validPassword = 'Aa1234!';
            const spy = expect.createSpy();

            const wrapper = mount(
                <MemoryRouter initialEntries={['/']} initialIndex={0}>
                    <Login loginWithPassword={spy} />
                </MemoryRouter>
            );

            wrapper.find(Login).node.refs['email'].value = validEmail;
            wrapper.find(Login).node.refs['password'].value = validPassword;

            wrapper.find('form.boxed-view__form').simulate('submit');
            expect(spy).toHaveBeenCalled();
            // Simulate an error thrown by .loginWithPassword()
            spy.calls[0].arguments[2]({reason: 'just failed dude!'});
            expect(wrapper.find(Login).node.state['error'].length).toNotBe(0);
            // Assert that a successful call to .loginWithPassword() (a call with no errors thrown)
            // sets the error state value to '':
            spy.calls[0].arguments[2]();
            expect(wrapper.find(Login).node.state['error'].length).toBe(0);
        });
    });
}