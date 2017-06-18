import { Accounts } from 'meteor/accounts-base';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';

export const PrivateHeader = (props) => {
    const navImgSrc = props.isNavOpen ? "/images/x.svg" : "/images/bars.svg";
    return (
        <div className='private-header'>
            <div className='private-header__container'>
                <img className='private-header__nav-toggle' src={navImgSrc} onClick={()=>props.toggleNav()} />
                <h1 className='private-header__title'>{props.title}</h1>
                <button className="button button--header" onClick={() => props.handleLogout()}>Logout</button>
            </div>
        </div>
    );
};

PrivateHeader.propTypes = {
    title: PropTypes.string.isRequired,
    handleLogout: PropTypes.func.isRequired,
    isNavOpen: PropTypes.bool.isRequired,
    toggleNav: PropTypes.func.isRequired
};

export default createContainer(() => {
    const isNavOpen = Session.get('isNavOpen');
    return {
        handleLogout: () => Accounts.logout(),
        toggleNav: () => Session.set('isNavOpen', !isNavOpen),
        isNavOpen
    };
}, PrivateHeader);
