import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { mount } from 'enzyme';
import { PrivateHeader } from './PrivateHeader';

if (Meteor.isClient) {
    describe('PrivateHeader Component Tests', function () {
        it('Should set button text to logout', function () {
            const wrapper = mount(<PrivateHeader title='Test title' handleLogout={()=>{}} />);
            const buttonText = wrapper.find('.button').text();

            expect(buttonText.toLowerCase()).toBe('logout');
        });

        it('Should use the title prop as an <h1> text', function () {
            const title = 'Test title here';
            const wrapper = mount(<PrivateHeader title={title} handleLogout={()=>{}} />);
            const h1 = wrapper.find('h1');

            expect(h1.text()).toBe(title);
        });

        it('Should call handleLogout on button click', function () {
            // Create a spy in order to simulate user interaction.
            // The following declares a Mock Function using an expect spy:
            const spy = expect.createSpy();
            // The spy is a function, so it has to be passed as argument to a prop.
            // In our specific case, please refer to PrivateHeader.jsx to see
            // the necessary changes over there.
            const wrapper = mount(<PrivateHeader title='Any title' handleLogout={spy} />);

            wrapper.find('button').simulate('click');

            expect(spy).toHaveBeenCalled();
        });
    });
}