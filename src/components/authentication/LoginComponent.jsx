import logIn from '../../static/images/log-in.jpg';
import claimmunity from '../../static/images/claimmunity-logo.jpg';

import React, {Component} from 'react';
import '../../static/css/Login.css';
import table from '../../App.css';
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

                <div className="image-container">
                    <img src={logIn} className="image" alt="logIn"/>
                </div>

                <div className="log-in-form">

                    <table>
                            <tbody>
                            <tr>
                                <td><img src={claimmunity} className="claimmunity-image" alt="claimmunity"/></td>
                            </tr>
                            {this.state.hasLoginFailed && <div className="alert-warning" role="alert">Invalid credentials</div>}
                            <tr>
                                <td><input type="text" className="form-credentials mt-5" id="username" name="username" placeholder="username" onChange={this.handleChange}/></td>
                            </tr>
                            <tr>
                                <td><input type="password" className="form-credentials" id="password" name="password" placeholder="password" onChange={this.handleChange}/></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="remember"/>
                                            <label className="form-check-label" htmlFor="remember">Remember me</label>
                                        <button type="button" className="btn btn-primary float-md-right" onClick={this.loginClicked}>Sign in</button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><span><Link to="/forgot-password">Forgot password</Link></span></td>
                            </tr>

                            <tr>
                                <td><span>Create a <Link to="/sign-up">Claimmunity account</Link></span>
                                </td>
                            </tr>
                            </tbody>

                        </table>
                </div>

            </div>
        )
    }

    loginClicked() {

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
        if (this.state.hasLoginFailed){
            this.setState({
                hasLoginFailed: false
            })
        }
    }
}

export default LoginComponent;