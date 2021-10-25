import logIn from '../../static/images/log-in.jpg';
import claimmunity from '../../static/images/claimmunity-logo.jpg';

import React, {Component} from 'react';
import '../../static/css/Login.css';
import {Link} from "react-router-dom";
import AuthenticationService from "../../api/AuthenticationService";

class LoginComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            hasLoginFailed: false,
            showSuccessMessage: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.loginClicked = this.loginClicked.bind(this);
    }

    render() {

        return (

            <div className="container-lg">

                <div className="form-row">

                    <div className="col-sm-9">
                        <img src={logIn} className="sign-up-img border" alt="Sign Up"/>
                    </div>

                    <div className="col-sm-3">
                        {this.state.hasLoginFailed &&
                        <div className="alert-warning" role="alert">Invalid credentials</div>}

                        <div className="form-row ml-2 mt-3 mb-5">
                            <img src={claimmunity} className="claimmunity-image" alt="claimmunity"/>
                        </div>

                        <div className="form-row ml-2 mb-3">
                            <input type="text" className="sign-up-field" id="username" name="username" placeholder="username"
                                   onChange={this.handleChange}/>
                        </div>

                        <div className="form-row ml-2 mb-3">
                            <input type="password" className="sign-up-field" id="password" name="password" placeholder="password"
                                   onChange={this.handleChange}/>
                        </div>

                        <div className="form-row col-12">
                            <div className="col-5" >
                                <input type="checkbox" className="form-check-input" id="remember"/>
                                <label className="form-check-label" htmlFor="remember">Remember me</label>
                            </div>
                            <div className="col-6">
                                <button type="button" className="btn btn-primary ml-2 pull-right"
                                        onClick={this.loginClicked}>Sign in
                                </button>
                            </div>
                        </div>

                        <div className="form-row ml-4 mb-1">
                            <span><Link to="/forgot-password">Forgot password</Link></span>
                        </div>

                        <div className="form-row ml-4">
                            <span>Create a <Link to="/sign-up">Claimmunity account</Link></span>
                        </div>

                    </div>
                    
                </div>
            </div>
        )
    }

    loginClicked() {

        if (this.state.username === ''){
            this.setState({
                showSuccessfulMessage: false,
                hasLoginFailed: true
            })
            return;
        }

        if (this.state.password === ''){
            this.setState({
                showSuccessfulMessage: false,
                hasLoginFailed: true
            })
            return;
        }

        AuthenticationService
            .executeJwtAuthenticationService(this.state.username, this.state.password)
            .then(
                (response) => {
                    AuthenticationService.registerSuccessfulLogin(this.state.username, response.data.token)
                    this.props.history.push(`/dashboard`) //react router history API - check it out
                }
            )
            .catch(
                () => {
                    this.setState({
                        showSuccessfulMessage: false,
                        hasLoginFailed: true
                    })
                }
            )
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (this.state.hasLoginFailed) {
            this.setState({
                hasLoginFailed: false
            })
        }
    }
}

export default LoginComponent;