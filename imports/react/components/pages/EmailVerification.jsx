import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { history } from '/imports/react/App';

export class EmailVerification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: 3,
            verifying: false,
            verified: false,
            error: '',
            counting: false
        }
    }
    componentWillMount() {
        this.setState({ verifying: true });
        Accounts.verifyEmail(this.props.token, (err) => {
            if (err) {
                this.setState({
                    verified: false,
                    error: `[${err.error}] ${err.reason}`,
                    verifying: false
                });
                // this.verified = false;
                // this.error = `[${err.error}] ${err.reason}`
            } else {
                this.setState({
                    verified: true,
                    error: '',
                    verifying: false
                });

            }
        });
    }
    componentDidUpdate() {
        if (!this.state.verifying && !!this.state.verified && !this.state.counting) {
            this.startCountdown();
        }
    }
    startCountdown() {
        this.setState({ counting: true });
        var countdown = window.setInterval(() => {
            if (this.state.seconds === 0) {
                window.clearInterval(countdown);
                //redirect:
                history.replace('/');
            } else {
                console.log(this.state.seconds);
                this.setState({ seconds: --this.state.seconds });
            }
        }, 1000);
    }
    render() {
        var renderContent = () => {
            if (!this.state.verifying) {
                if (this.state.error.length > 0) {
                    return (
                        <div>
                            <h1>Error</h1>
                            <h2 className='boxed-view__message--single error'>{this.state.error}</h2>
                        </div>
                    );
                } else if (!!this.state.verified) {
                    return (
                        <div>
                            <h1 style={{ color: 'green' }}>Verification successful!</h1>
                            <h2 className='boxed-view__message--single'>{`You will be redirected in ...${this.state.seconds}`}</h2>
                        </div>
                    );
                }
            } else {
                return <h2 className='boxed-view__message--single'>Please wait...</h2>
            }
        }
        return (
            <div className="boxed-view">
                <div className="boxed-view__box flexible">
                    {renderContent()}
                </div>
            </div>
        );
    }
}

export default createContainer((props) => {
    const token = props.match.params.token;
    return { ...props, token };
}, EmailVerification);