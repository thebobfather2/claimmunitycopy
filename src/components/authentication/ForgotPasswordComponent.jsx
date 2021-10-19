import React, {useState} from "react";
import SignUpDataService from "../../api/SignUpDataService";
import resetPassword from "../../static/images/reset-password.jpg";
import claimmunity from "../../static/images/claimmunity-logo.jpg";
import {Link} from "react-router-dom";

function ForgotPasswordComponent() {

    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const [values, setValues] = useState({
        workEmail: '',
        password: '',
        confirmPassword: '',
    });


    const handleInputChange = (event) => {
        event.preventDefault()

        setValues((values) => ({
            ...values,
            [event.target.name]: event.target.value
        }));

        setErrorMessage('')
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        const popularEmailPattern = /.+@(gmail|yahoo|hotmail|aol)\.com$/;

        if (!emailPattern.test(values.workEmail) || popularEmailPattern.test(values.workEmail)) {
            setErrorMessage('Please enter valid company email address')
            return;
        }

        if (!values.password || values.password.length < 8) {
            setErrorMessage('Please enter valid password. Passwords should be at least 8 characters long')
            return;
        }

        if (values.password !== values.confirmPassword) {
            setErrorMessage('Passwords need to match')
            return;
        }

        let request =
            {
                workEmail: values.workEmail,
                password: values.password
            }
        SignUpDataService.resetUserPassword(request)
            .then(() => {
                setSuccessMessage('Your password was successfully changed.')
            })
            .catch(function (error) {
                if (error.response && error.response.status === 400) {
                    setErrorMessage('Email address '+values.workEmail + ' does not exist in the system.')
                } else {
                    setErrorMessage('Error occurred while resetting the password. Please contact us at support@claimmunity.com.')
                }
            })
    }

    return <div className="container-lg">

        <div className="form-row">

            <div className="col-sm-9">
                <img src={resetPassword} className="sign-up-img border" alt="Sign Up"/>
            </div>

            <div className="col-sm-3">
                <div className="form-row ml-2 mt-3 mb-5">
                    <img src={claimmunity} className="claimmunity-image" alt="claimmunity"/>
                </div>

                {successMessage !== '' && <div>
                    <div className="alert-success mb-3">{successMessage}
                    </div>
                </div>}

                {errorMessage !== '' && <div>
                    <div className="alert-warning mb-3">{errorMessage}
                    </div>
                </div>}


                <div className="form-row ml-2 mb-3">
                    <input name="workEmail" onChange={handleInputChange} value={values.workEmail}
                           className="sign-up-field" type="text" placeholder="Work Email"/>
                </div>


                <div className="form-row ml-2 mb-3">
                    <input name="password" onChange={handleInputChange} value={values.password}
                           className="sign-up-field" type="password" placeholder="Password"/>
                </div>

                <div className="form-row ml-2 mb-3">
                    <input name="confirmPassword" onChange={handleInputChange} value={values.confirmPassword}
                           className="sign-up-field" type="password" placeholder="Confirm Password"/>
                </div>

                <div className="form-row ml-2 mt-2 mb-3">
                    <button onClick={handleSubmit} className="btn btn-primary sign-up-field">Reset Password</button>
                </div>

                <div className="form-row ml-4">
                    <span>Go back to <Link to="/login">login</Link> page.</span>
                </div>

            </div>
        </div>

    </div>
}

export default ForgotPasswordComponent;