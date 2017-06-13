import { Meteor } from 'meteor/meteor';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import expect from 'expect';
import { mount, shallow } from 'enzyme';
import { Signup } from './Signup';

if(Meteor.isClient){
    describe('Signup component tests', function(){
        it('Should show error messages (by setting error state)', function(){
            const error = 'This is not working dude!';
            const wrapper = shallow(<Signup createUser={()=>{}} />);

            wrapper.setState({ error });
            expect(wrapper.find('p.boxed-view__error').text()).toBe(error);

            wrapper.setState({ error: ''});
            expect(wrapper.find('p.boxed-view__error').length).toBe(0);
        });

        it('Should set an error if one or more fields were blank on submit', function(){
            const wrapper = mount(
                <MemoryRouter initialEntries={['/signup']} initialIndex={0}>
                    <Signup createUser={()=>{}} />
                </MemoryRouter>
            );
            const signup = wrapper.find(Signup).node;

            function submit() { wrapper.find('form').simulate('submit'); }
            function clearError() { signup.setState({ error: ''});}

            const validEmail = 'arnie@test.com';
            const validPassword = 'Aa1234!!';
            // Assert that the initial error state is '':
            expect(signup.state['error'].length).toBe(0);
            submit();
            expect(signup.state['error'].length).toNotBe(0);
            // Assert that an error is set when only an email is provided:
            clearError();
            expect(signup.state['error'].length).toBe(0);
            signup.refs['email'].value = validEmail;
            submit();
            expect(signup.state['error'].length).toNotBe(0);
            // Assert that an error is set when only password is present:
            clearError();
            expect(signup.state['error'].length).toBe(0);
            signup.refs['password'].value = validPassword;
            submit();
            expect(signup.state['error'].length).toNotBe(0);
            // Assert that an error is set when only rePassword is present:
            clearError();
            expect(signup.state['error'].length).toBe(0);
            signup.refs['rePassword'].value = validPassword;
            submit();
            expect(signup.state['error'].length).toNotBe(0);
            // Assert that no error is set when all fields are present on submit:           
            clearError();
            expect(signup.state['error'].length).toBe(0);
            signup.refs['email'].value = validEmail;
            signup.refs['password'].value = validPassword;
            signup.refs['rePassword'].value = validPassword;
            submit();
            expect(signup.state['error'].length).toBe(0);
        });

        it('Should set an error if the passwords don\'t match', function(){
            const wrapper = mount(
                <MemoryRouter initialEntries={['/signup']} initialIndex={0}>
                    <Signup createUser={()=>{}} />
                </MemoryRouter>
            );
            const signup = wrapper.find(Signup).node;

            function submit() { wrapper.find('form').simulate('submit'); }
            function clearError() { signup.setState({ error: ''});}

            const validEmail = 'arnie@test.com';
            const validPassword = 'Aa1234!!';
            // Assert that the initial error state is '':
            expect(signup.state['error'].length).toBe(0);
            
            signup.refs['email'].value = validEmail;
            signup.refs['password'].value = validPassword;
            signup.refs['rePassword'].value = validPassword.slice(0,-1);
            submit();
            expect(signup.state['error'].length).toNotBe(0);
        });

        it('Should call createUser with the form data', function(){
            const spy = expect.createSpy();
            const wrapper = mount(
                <MemoryRouter initialEntries={['/signup']} initialIndex={0}>
                    <Signup createUser={spy} />
                </MemoryRouter>
            );
            const signup = wrapper.find(Signup).node;

            function submit() { wrapper.find('form').simulate('submit'); }
            function clearError() { signup.setState({ error: ''});}

            // Assert that the initial error state is '':
            expect(signup.state['error'].length).toBe(0);

            const validEmail = 'arnie@test.com';
            const validPassword = 'Aa1234!!';
            signup.refs['email'].value = validEmail;
            signup.refs['password'].value = validPassword;
            signup.refs['rePassword'].value = validPassword;
            submit();

            expect(spy.calls[0].arguments[0]).toEqual({email: validEmail, password: validPassword});
            expect(signup.state['error'].length).toBe(0);
        });

        it('Should set createUser callback errors', function(){
            const spy = expect.createSpy();
            const wrapper = mount(
                <MemoryRouter initialEntries={['/signup']} initialIndex={0}>
                    <Signup createUser={spy} />
                </MemoryRouter>
            );
            const signup = wrapper.find(Signup).node;

            function submit() { wrapper.find('form').simulate('submit'); }
            function clearError() { signup.setState({ error: ''});}

            // Assert that the initial error state is '':
            expect(signup.state['error'].length).toBe(0);

            const validEmail = 'arnie@test.com';
            const validPassword = 'Aa1234!!';
            const reason = 'This just failed man!';
            signup.refs['email'].value = validEmail;
            signup.refs['password'].value = validPassword;
            signup.refs['rePassword'].value = validPassword;
            submit();

            expect(spy).toHaveBeenCalled();
            spy.calls[0].arguments[1]({ reason });
            expect(signup.state['error']).toBe(reason);

            clearError();
            spy.calls[0].arguments[1]();
            expect(signup.state['error'].length).toBe(0);

        });
    });
}