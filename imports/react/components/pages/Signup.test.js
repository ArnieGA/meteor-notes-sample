import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import expect from 'expect';
import { mount } from 'enzyme';

import { Signup } from './Signup';

if (Meteor.isClient) {
    describe('Signup component tests', function () {
        let spy, wrapper1, wrapper2, signup1, signup2, 
        signup1InitialState, signup2InitialState, submit, clearErrorState,
        resetAllStates;

        beforeEach(function () {
            spy = expect.createSpy();
            wrapper1 = mount(
                <MemoryRouter initialEntries={['/signup']} initialIndex={0}>
                    <Signup
                        createUser={() => { }}
                        pagePrivacy='auth'
                        Session={Session} />
                </MemoryRouter>
            );
            wrapper2 = mount(
                <MemoryRouter initialEntries={['/signup']} initialIndex={0}>
                    <Signup
                        createUser={spy}
                        pagePrivacy='auth'
                        Session={Session} />
                </MemoryRouter>
            );

            signup1 = wrapper1.find(Signup).node;
            signup2 = wrapper2.find(Signup).node;

            signup1InitialState = { ...signup1.state };
            signup2InitialState = { ...signup2.state };

            submit = (wrapper) => { wrapper.find('form').simulate('submit'); }
            clearErrorState = (component) => { component.setState({ error: '' }); }
            resetAllStates = (component) => {
                if (component === signup1) {
                    signup1.setState(signup1InitialState);
                }
                if (component === signup2) {
                    signup2.setState(signup2InitialState);
                }
            }
        });

        describe('Base component tests', function () {
            it('Should show error messages (by setting error state)', function () {
                const error = 'This is not working dude!';

                signup1.setState({ error });
                expect(wrapper1.find('p.boxed-view__error').text()).toBe(error);

                signup1.setState({ error: '' });
                expect(wrapper1.find('p.boxed-view__error').length).toBe(0);

                resetAllStates(signup1);
            });

            describe('Form fields tests', function () {
                it('Should set state when user changes a field\'s value', function () {
                    const email = wrapper1.find("input[name='email']");
                    const password = wrapper1.find("input[name='password']");
                    const rePassword = wrapper1.find("input[name='rePassword']");
                    expect(email.node.value.length).toBe(0);
                    expect(password.node.value.length).toBe(0);
                    expect(rePassword.node.value.length).toBe(0);

                    // Change fields inputs values and assert:
                    const newValue = 'testing';
                    email.node.value = newValue;
                    email.simulate('change');
                    expect(signup1.state['email']).toBe(newValue);
                    password.node.value = newValue;
                    password.simulate('change');
                    expect(signup1.state['password']).toBe(newValue);
                    rePassword.node.value = newValue;
                    rePassword.simulate('change');
                    expect(signup1.state['rePassword']).toBe(newValue);

                    resetAllStates(signup1);
                });

                it('Should set form fields values based on state', function () {
                    const email = wrapper1.find("input[name='email']").node;
                    const password = wrapper1.find("input[name='password']").node;
                    const rePassword = wrapper1.find("input[name='rePassword']").node;
                    expect(email.value.length).toBe(0);
                    expect(password.value.length).toBe(0);
                    expect(rePassword.value.length).toBe(0);

                    // Change fields inputs values and assert:
                    const newValue = 'testing';
                    signup1.setState({
                        email: newValue,
                        password: newValue,
                        rePassword: newValue
                    });
                    expect(email.value).toBe(signup1.state['email']);
                    expect(password.value).toBe(signup1.state['password']);
                    expect(rePassword.value).toBe(signup1.state['rePassword']);

                    resetAllStates(signup1);
                });

                it('Should set an error if one or more fields were blank on submit', function () {
                    const validEmail = 'arnie@test.com';
                    const validPassword = 'Aa1234!!';
                    const email = wrapper1.find("input[name='email']");
                    const password = wrapper1.find("input[name='password']");
                    const rePassword = wrapper1.find("input[name='rePassword']");

                    // Assert that the initial error state is '':
                    expect(signup1.state['error'].length).toBe(0);
                    submit(wrapper1);
                    expect(signup1.state['error'].length).toNotBe(0);
                    clearErrorState(signup1);
                    expect(signup1.state['error'].length).toBe(0);
                    // Assert that an error is set only when an email is provided:
                    email.node.value = validEmail; email.simulate('change');
                    submit(wrapper1);
                    expect(signup1.state['error'].length).toNotBe(0);
                    resetAllStates(signup1);
                    expect(signup1.state['error'].length).toBe(0);
                    // Assert that an error is set only when password is present:
                    password.node.value = validPassword; password.simulate('change');
                    submit(wrapper1);
                    expect(signup1.state['error'].length).toNotBe(0);
                    resetAllStates(signup1);
                    expect(signup1.state['error'].length).toBe(0);
                    // Assert that an error is set when only rePassword is present:
                    rePassword.node.value = validPassword; rePassword.simulate('change');
                    submit(wrapper1);
                    expect(signup1.state['error'].length).toNotBe(0);
                    resetAllStates(signup1);
                    expect(signup1.state['error'].length).toBe(0);

                    // Assert that no error is set when all fields are present on submit:           
                    email.node.value = validEmail; email.simulate('change');
                    password.node.value = validPassword; password.simulate('change');
                    rePassword.node.value = validPassword; rePassword.simulate('change');
                    submit(wrapper1);
                    expect(signup1.state['error'].length).toBe(0);

                    resetAllStates(signup1);
                });

                it('Should set an error if the passwords don\'t match', function () {
                    const validEmail = 'arnie@test.com';
                    const validPassword = 'Aa1234!!';
                    const email = wrapper1.find("input[name='email']");
                    const password = wrapper1.find("input[name='password']");
                    const rePassword = wrapper1.find("input[name='rePassword']");

                    // Assert that the initial error state is '':
                    expect(signup1.state['error'].length).toBe(0);

                    email.node.value = validEmail; email.simulate('change');
                    password.node.value = validPassword; password.simulate('change');
                    rePassword.value = validPassword.slice(0, -1); rePassword.simulate('change');
                    submit(wrapper1);
                    expect(signup1.state['error'].length).toNotBe(0);

                    resetAllStates(signup1);
                });
            });
        });

        describe('Signup flow tests', function () {
            it('Should call createUser with the form data', function () {
                // Assert that the initial error state is '':
                expect(signup2.state['error'].length).toBe(0);

                const validEmail = 'arnie@test.com';
                const validPassword = 'Aa1234!!';
                const email = wrapper2.find("input[name='email']");
                const password = wrapper2.find("input[name='password']");
                const rePassword = wrapper2.find("input[name='rePassword']");

                email.node.value = validEmail; email.simulate('change');
                password.node.value = validPassword; password.simulate('change');
                rePassword.node.value = validPassword; rePassword.simulate('change');
                submit(wrapper2);

                expect(spy.calls[0].arguments[0]).toEqual({ email: validEmail, password: validPassword });
                expect(signup2.state['error'].length).toBe(0);

                resetAllStates(signup2);
            });

            it('Should set createUser callback errors', function () {
                // Assert that the initial error state is '':
                expect(signup2.state['error'].length).toBe(0);

                const validEmail = 'arnie@test.com';
                const validPassword = 'Aa1234!!';
                const email = wrapper2.find("input[name='email']");
                const password = wrapper2.find("input[name='password']");
                const rePassword = wrapper2.find("input[name='rePassword']");
                const reason = 'This just failed man!';

                email.node.value = validEmail; email.simulate('change');
                password.node.value = validPassword; password.simulate('change');
                rePassword.node.value = validPassword; rePassword.simulate('change');
                submit(wrapper2);

                expect(spy).toHaveBeenCalled();
                spy.calls[0].arguments[1]({ reason });
                expect(signup2.state['error']).toBe(reason);

                resetAllStates(signup2);
                spy.calls[0].arguments[1]();
                expect(signup2.state['error'].length).toBe(0);

            });
        });

        describe('Pending tests', function () {
            it('Should call email.sendVerification on successful user creation');
            it('Should set email.sendVerification callback errors');
            it('Should open success modal on successful user creation after sending verification email');
            it('Should redirect to root page when closing success modal');
        });
    });
}