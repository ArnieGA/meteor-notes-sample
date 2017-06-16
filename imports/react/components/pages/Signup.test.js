import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import expect from 'expect';
import { mount } from 'enzyme';
import createRouterContext from 'react-router-test-context';
import PropTypes from 'prop-types';

import { Signup } from './Signup';

if (Meteor.isClient) {
    describe('Signup component tests', function () {
        let spy, wrapper1, wrapper2, signup1, signup2,
            signup1InitialState, signup2InitialState, submit, clearErrorState,
            resetAllStates;

        Signup.contextTypes = {
            router: PropTypes.object
        };
        beforeEach(function () {
            const context = createRouterContext();
            spy = expect.createSpy();
            wrapper1 = mount(
                <Signup
                    createUser={() => { }}
                    pagePrivacy='auth'
                    Session={Session} />
                , { context }
            );
            wrapper2 = mount(
                <Signup
                    createUser={spy}
                    pagePrivacy='auth'
                    Session={Session} />
                , { context }
            );

            signup1 = wrapper1.node;
            signup2 = wrapper2.node;

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

                    email.simulate('change', {
                        target: {
                            value: newValue
                        }
                    });
                    password.simulate('change', {
                        target: {
                            value: newValue
                        }
                    });
                    rePassword.simulate('change', {
                        target: {
                            value: newValue
                        }
                    });
                    expect(signup1.state['email']).toBe(newValue);
                    expect(signup1.state['password']).toBe(newValue);
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
                    email.simulate('change', {
                        target: {
                            value: validEmail
                        }
                    });
                    submit(wrapper1);
                    expect(signup1.state['error'].length).toNotBe(0);
                    resetAllStates(signup1);
                    expect(signup1.state['error'].length).toBe(0);
                    // Assert that an error is set only when password is present:
                    password.simulate('change', {
                        target: {
                            value: validPassword
                        }
                    });
                    submit(wrapper1);
                    expect(signup1.state['error'].length).toNotBe(0);
                    resetAllStates(signup1);
                    expect(signup1.state['error'].length).toBe(0);
                    // Assert that an error is set when only rePassword is present:
                    rePassword.simulate('change', {
                        target: {
                            value: validPassword
                        }
                    });
                    submit(wrapper1);
                    expect(signup1.state['error'].length).toNotBe(0);
                    resetAllStates(signup1);
                    expect(signup1.state['error'].length).toBe(0);

                    // Assert that no error is set when all fields are present on submit:           
                    email.simulate('change', {
                        target: {
                            value: validEmail
                        }
                    });
                    password.simulate('change', {
                        target: {
                            value: validPassword
                        }
                    });
                    rePassword.simulate('change', {
                        target: {
                            value: validPassword
                        }
                    });
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

                    email.simulate('change', {
                        target: {
                            value: validEmail
                        }
                    });
                    password.simulate('change', {
                        target: {
                            value: validPassword
                        }
                    });
                    rePassword.simulate('change', {
                        target: {
                            value: validPassword.slice(0, -1)
                        }
                    });
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

                email.simulate('change', {
                    target: {
                        value: validEmail
                    }
                });
                password.simulate('change', {
                    target: {
                        value: validPassword
                    }
                });
                rePassword.simulate('change', {
                    target: {
                        value: validPassword
                    }
                });
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

                email.simulate('change', {
                    target: {
                        value: validEmail
                    }
                });
                password.simulate('change', {
                    target: {
                        value: validPassword
                    }
                });
                rePassword.simulate('change', {
                    target: {
                        value: validPassword
                    }
                });
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