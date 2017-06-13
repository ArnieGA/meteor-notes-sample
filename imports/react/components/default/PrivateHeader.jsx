import React from 'react';
import PropTypes from 'prop-types';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

export const PrivateHeader = (props) => {
    return (
        <div className='private-header'>
            <div className='private-header__container'>
                <h1 className='private-header__title'>{props.title}</h1>
                <button className="button button--header" onClick={() => props.handleLogout()}>Logout</button>
            </div>
        </div>
    );
};

PrivateHeader.propTypes = {
    title: PropTypes.string.isRequired,
    handleLogout: PropTypes.func.isRequired
};

export default createContainer(() => {
    return {
        handleLogout: () => {
            Accounts.logout();
        }
    };
}, PrivateHeader);
// export default PrivateHeader;