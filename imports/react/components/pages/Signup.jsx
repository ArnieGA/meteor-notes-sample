// Meteor
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'; //<-- meteor add session
// React
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-portal-tooltip';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
// Named exports
import { userCredentialsSchema } from '/imports/startup/simple-schema-config';
import { history } from '/imports/react/routes/Router';

export class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            rePassword: '',
            error: '',
            pwdTtipActive: false, // <- maintains the password modal open/close state
            openSuccessModal: false
        };
        this.clearFields = this.clearFields.bind(this);
        this.validateFields = this.validateFields.bind(this);
        this.sendVerificationEmail = this.sendVerificationEmail.bind(this);
        this.openSuccessModal = this.openSuccessModal.bind(this);
        this.closeSuccessModal = this.closeSuccessModal.bind(this);
    }
    componentWillMount() {
        document.title = this.props.documentTitle;
        this.props.Session.set('currentPagePrivacy', this.props.pagePrivacy);
    }
    onSubmit(e) {
        e.preventDefault();
        this.setState({
            pwdTtipActive: false
        });
        if (this.validateFields()) {
            const email = this.state.email;
            const password = this.state.password;
            this.props.createUser({ email, password }, (err) => {
                if (err) {
                    if (err.error === 403 && err.reason === 'Login forbidden') {
                        this.sendVerificationEmail(email);
                        return;
                    }
                    this.setState({ error: err.reason });
                    this.clearFields();
                    this.refs.email.focus();
                } else {
                    this.setState({ error: '' });
                    this.clearFields();
                    this.refs.email.focus();
                    this.sendVerificationEmail(email);
                }
            });
        }
    }
    validateFields() {
        let email = this.state.email;
        let password = this.state.password;
        let rePassword = this.state.rePassword;
        if (!!email && !!password && !!rePassword) {
            try {
                userCredentialsSchema.validate({ email, password });
            } catch (e) {
                switch (e.reason) {
                    case 'Email must be a valid email address':
                        this.setState({ error: e.reason });
                        this.clearFields();
                        this.refs.email.focus();
                        break;
                    case 'Password failed regular expression validation':
                        this.setState({ error: 'Invalid password' });
                        this.clearFields(['password', 'rePassword']);
                        this.refs.password.focus();
                        break;
                }
                return false;
            }

            if (password !== rePassword) {
                this.setState({ error: 'The passwords don\'t match. Please try again.' });
                this.clearFields(['password', 'rePassword']);
                this.refs.password.focus();
                return false;
            }

            this.setState({ error: '' });
            return true;
        }
        else {
            this.setState({ error: 'All fields are required.' });
            if (!email) { this.refs.email.focus(); this.clearFields(); }
            else { this.refs.password.focus(); this.clearFields(['password', 'rePassword']); }
            return false;
        }
    }
    sendVerificationEmail(email) {
        Meteor.call('email.sendVerification', email, (err, res) => {
            if (err) {
                this.setState({ error: err.reason });
            } else if (res === 'unallowed') {
                return;
            } else {
                this.openSuccessModal();
            }
        });
    }
    clearFields(arrRefNames = []) {
        if (arrRefNames.length === 0) {
            this.refs.email.value = '';
            this.refs.password.value = '';
            this.refs.rePassword.value = '';
        } else {
            arrRefNames.forEach((refName) => {
                this.refs[refName].value = '';
            });
        }
    }
    // TOOLTIP ACTIONS
    openPwdTtip() {
        this.setState({ pwdTtipActive: true });
    }
    closePwdTtip() {
        this.setState({ pwdTtipActive: false });
    }
    // MODAL ACTIONS
    openSuccessModal() {
        this.setState({ openSuccessModal: true });
    }
    closeSuccessModal() {
        this.setState({ openSuccessModal: false });
        history.replace('/');
    }
    render() {
        return (
            <div className="boxed-view">
                <div className="boxed-view__box">
                    <Modal
                        isOpen={this.state.openSuccessModal}
                        contentLabel='Signup'
                        className='boxed-view__box flexible'
                        overlayClassName='boxed-view boxed-view--modal'
                        onAfterOpen={() => { this.refs.modalCloseButton.focus(); }}
                        onRequestClose={this.closeSuccessModal}>
                        <h1 style={{ color: 'green' }}>Successfully created</h1>
                        <p>You will receive an email shortly with instructions on how to activate your account.</p>
                        <p>Please, also check your spam folder.</p>
                        <button ref='modalCloseButton' className='button button--pill hover-alt-color' onClick={this.closeSuccessModal}>Go back home</button>
                    </Modal>
                    <h1>Signup Form</h1>
                    {this.state.error ? <p className="boxed-view__error">{this.state.error}</p> : undefined}
                    <form className='boxed-view__form' onSubmit={this.onSubmit.bind(this)} noValidate>
                        <input type="email" ref="email" name="email"
                            placeholder="Email"
                            onChange={(e) => {
                                this.setState({ email: e.target.value.trim() })
                            }}
                            value={this.state.email} />
                        <input id='passwrd'
                            onFocus={this.openPwdTtip.bind(this)}
                            onBlur={this.closePwdTtip.bind(this)}
                            type="password"
                            ref="password"
                            name="password"
                            placeholder="Password (6-8 characters)"
                            onChange={(e) => {
                                this.setState({ password: e.target.value.trim() });
                            }}
                            value={this.state.password} />
                        <Tooltip active={this.state.pwdTtipActive} position='right' arrow='center' parent='#passwrd'>
                            <div className='tooltip__content'>
                                <p>Must contain letters, digits and special characters (at least 1 of each)</p>
                            </div>
                        </Tooltip>
                        <input
                            type="password" ref="rePassword" name="rePassword"
                            placeholder="Re-enter your password"
                            onChange={(e) => {
                                this.setState({ rePassword: e.target.value.trim() });
                            }}
                            value={this.state.rePassword} />
                        <button className='button'>Create Account</button>
                    </form>
                    <Link to="/">I already have an account...</Link>
                </div>
            </div>
        );
    }
}

Signup.propTypes = {
    Session: PropTypes.object.isRequired,
    createUser: PropTypes.func.isRequired,
    pagePrivacy: PropTypes.string.isRequired,
    documentTitle: PropTypes.string
};

export default createContainer((props) => {
    return {
        Session,
        createUser: Accounts.createUser,
        Subscription: Meteor.subscribe('email'),
        pagePrivacy: props.privacy,
        documentTitle: props.documentTitle
    };
}, Signup);