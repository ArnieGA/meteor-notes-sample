import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'; //<-- meteor add session
import { createContainer } from 'meteor/react-meteor-data';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            invalidAttempts: 0
        };
        this.clearFields = this.clearFields.bind(this);
    }
    componentWillMount(){
        Session.set('currentPagePrivacy', this.props.pagePrivacy);
        document.title = this.props.documentTitle;
    }
    onSubmit(e) {
        e.preventDefault();
        this.setState({ error: '' });
        let email = this.refs.email.value.trim();
        let password = this.refs.password.value.trim();
        if (!!email && !!password) {
            this.props.loginWithPassword({ email }, password, (err) => {
                if (err) {
                    switch (err.error) {
                        case 400:
                            this.setState({
                                error: 'Login attempt failed. You supplied incorrect credentials.'
                            });
                            break;
                        default:
                            this.setState({ error: err.reason });
                            break;
                    }
                    this.setState({ invalidAttempts: this.state.invalidAttempts++ });
                    this.refs.email.focus();
                    this.clearFields();
                } else {
                    this.setState({ error: '', invalidAttempts: 0 });
                }
            });
        } else {
            this.setState({ error: 'Please enter your credentials to continue.' });
            this.clearFields();
            this.refs.email.focus();
        }
    }
    clearFields(arrRefNames = []) {
        if (arrRefNames.length === 0) {
            this.refs.email.value = '';
            this.refs.password.value = '';
        } else {
            arrRefNames.forEach((refName) => {
                this.refs[refName].value = '';
            });
        }
    }
    render() {
        return (
            <div className='boxed-view'>
                <div className='boxed-view__box'>
                    <h1>Login</h1>
                    {this.state.error ? <p className="boxed-view__error">{this.state.error}</p> : undefined}
                    <form className='boxed-view__form' onSubmit={this.onSubmit.bind(this)} noValidate>
                        <input type="email" ref="email" name="email" placeholder="Email" />
                        <input type="password" ref="password" name="password" placeholder="Password" />
                        <button className='button'>Login</button>
                    </form>
                    <p>Click <Link to="/signup">here</Link> to register</p>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    loginWithPassword: PropTypes.func.isRequired,
    pagePrivacy: PropTypes.string.isRequired,
    documentTitle: PropTypes.string.isRequired
};

export default createContainer((props) => {
    return {
        loginWithPassword: Meteor.loginWithPassword,
        Session: Session,
        pagePrivacy: props.privacy,
        documentTitle: props.documentTitle
    };
}, Login);