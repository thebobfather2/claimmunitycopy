import signUpOrg from '../../static/images/sign-up-org.jpg';
import signUpUser from '../../static/images/sign-up-user.jpg';
import claimmunity from "../../static/images/claimmunity-logo.jpg";

import '../../static/css/SignUpComponent.css';

import React, {useState} from "react";
import {Link} from "react-router-dom";
import SignUpDataService from "../../api/SignUpDataService";

function SignUpComponent(props) {

    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [showUserPage, setShowUserPage] = useState(false)
    const [privacyViewed, setPrivacyViewed] = useState(false)
    const [termsViewed, setTermsViewed] = useState(false)

    const [values, setValues] = useState({
        businessType: '',
        companyName: '',
        workEmail: '',
        password: '',
        confirmPassword: '',
        tAndC: false,
        firstName: '',
        lastName: '',
        workNumber: '',
        mobileNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
    });

    const handleCheckbox = () => {
        setErrorMessage('')
        values.tAndC = !values.tAndC
    }

    const handleInputChange = (event) => {
        event.preventDefault()

        if (event.target.name === 'workNumber' || event.target.name === 'mobileNumber') {
            setValues((values) => ({
                ...values,
                [event.target.name]: formatPhone(event.target.value)
            }));
        } else {
            setValues((values) => ({
                ...values,
                [event.target.name]: event.target.value
            }));
        }

        setErrorMessage('')
    };

    const handleOrgSubmit = (event) => {
        event.preventDefault();
        if (!values.businessType) {
            setErrorMessage('Please select a valid business type')
            return;
        }

        if (!values.companyName) {
            setErrorMessage('Please enter a valid company name')
            return;
        }

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

        setShowUserPage(true)
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!values.firstName) {
            setErrorMessage('Please enter a valid first name')
            return;
        }

        if (!values.lastName) {
            setErrorMessage('Please enter a valid last name')
            return;
        }

        const phonePattern = /^[1-9]\d{2}-\d{3}-\d{4}$/;
        if (!values.workNumber.match(phonePattern)) {
            setErrorMessage('Please enter valid work number')
            return;
        }

        if (!values.mobileNumber.match(phonePattern)) {
            setErrorMessage('Please enter valid mobile number')
            return;
        }

        if (!values.address) {
            setErrorMessage('Please enter a valid address')
            return;
        }

        if (!values.city) {
            setErrorMessage('Please enter a valid city')
            return;
        }

        if (!values.state) {
            setErrorMessage('Please enter a valid state')
            return;
        }

        if (!values.zipCode) {
            setErrorMessage('Please enter a valid postal code')
            return;
        }

        if (!values.country) {
            setErrorMessage('Please enter a valid country')
            return;
        }

        if (!values.tAndC) {
            setErrorMessage('Please agree to the terms and conditions')
            return;
        }


        if (!termsViewed) {
            setErrorMessage('Please read the terms and conditions before signing up.')
            return;
        }

        if (!privacyViewed) {
            setErrorMessage('Please read the privacy policy before signing up.')
            return;
        }

        let request =
            {
                businessType: values.businessType,
                city: values.city,
                companyName: values.companyName,
                country: values.country,
                firstName: values.firstName,
                lastName: values.lastName,
                mobileNumber: values.mobileNumber,
                password: values.password,
                state: values.state,
                streetAddress1: values.address,
                workEmail: values.workEmail,
                workNumber: values.workNumber,
                zipCode: values.zipCode
            }
        SignUpDataService.signUpUser(request)
            .then(() => setSuccessMessage("Your account was successfully created. Please check your email to activate your account before logging in."))
            .catch(function (error){
                if (error.response && error.response.status === 400) {
                    console.log(error.response)
                    setErrorMessage(error.response.data)
                } else {
                    setErrorMessage('Error occurred while creating new user. Please contact us at support@claimmunity.com.')
                }
            })
    }

    const formatPhone = (value) => {
        // if input value is falsy eg if the user deletes the input, then just return
        if (!value) return value;

        // clean the input for any non-digit values.
        const phoneNumber = value.replace(/[^\d]/g, "");

        // phoneNumberLength is used to know when to apply our formatting for the phone number
        const phoneNumberLength = phoneNumber.length;

        // we need to return the value with no formatting if its less then four digits
        // this is to avoid weird behavior that occurs if you  format the area code to early
        if (phoneNumberLength < 4) return phoneNumber;

        // if phoneNumberLength is greater than 4 and less the 7 we start to return
        // the formatted number
        if (phoneNumberLength < 7) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        }

        // finally, if the phoneNumberLength is greater then seven, we add the last
        // bit of formatting and return it.
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
            3,
            6
        )}-${phoneNumber.slice(6, 10)}`;
    }

    const handlePrivacy = () => {
        setPrivacyViewed(true);
        setErrorMessage('');
    }

    const handleTerms = () => {
        setTermsViewed(true);
        setErrorMessage('');
    }

    return <div className="container-lg">

        {!showUserPage &&

        <div id="orgInfo" className="form-row">

            <div className="col-sm-9">
                <img src={signUpOrg} className="sign-up-img border" alt="Sign Up"/>
            </div>

            <div className="col-sm-3">
                <div className="form-row ml-2 mt-3 mb-5">
                    <img src={claimmunity} className="claimmunity-image" alt="claimmunity"/>
                </div>

                {errorMessage !== '' && <div>
                    <div className="alert-warning mb-3">{errorMessage}
                    </div>
                </div>}

                <div className="form-row ml-2 mb-3">
                    <select name="businessType" onChange={handleInputChange} value={values.businessType}
                            id="businessType" className="sign-up-field select">
                        <option value="" disabled selected hidden>Business Type</option>
                        <option value="SHIPPER">Shipper</option>
                        <option value="LSP">Logistics Service Provider</option>
                        <option value="CARRIER">Carrier</option>
                        <option value="INSURANCE">Insurance</option>
                    </select>
                </div>

                <div className="form-row ml-2 mb-3">
                    <input name="companyName" onChange={handleInputChange} value={values.companyName}
                           className="sign-up-field" type="text" placeholder="Company Name"/>
                </div>

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
                    <button onClick={handleOrgSubmit} className="btn btn-primary sign-up-field">Sign Up</button>
                </div>

                <div className="form-row ml-4">
                    <span>Already have an account? Click <Link to="/login">here</Link> to sign in.</span>
                </div>

            </div>
        </div>}

        {showUserPage &&
        <div id="userInfo" className="form-row user-info">

            <div className="col-sm-9">
                <img src={signUpUser} className="sign-up-img" alt="Sign Up"/>
            </div>

            <div className="col-sm-3">
                <div className="form-row ml-2 mt-3 mb-5">
                    <img src={claimmunity} className="claimmunity-image" alt="claimmunity"/>
                </div>

                {errorMessage !== '' && <div>
                    <div className="alert-warning mb-3">{errorMessage}
                    </div>
                </div>}

                {successMessage !== '' && <div>
                    <div className="alert-success mb-3">{successMessage}
                    </div>
                </div>}

                <div className="form-row mt-2 mb-3">
                    <div>
                        <input name="firstName" onChange={handleInputChange} value={values.firstName}
                               className="sign-up-field" type="text" placeholder="First Name"/>
                    </div>
                    <div>
                        <input name="lastName" onChange={handleInputChange} value={values.lastName}
                               className="sign-up-field-sm" type="text" placeholder="Last Name"/>
                    </div>
                </div>

                <div className="form-row mt-2 mb-3">
                    <div>
                        <input name="workNumber" onChange={handleInputChange} value={values.workNumber}
                               className="sign-up-field" type="text" placeholder="Work Number"/>
                    </div>
                    <div>
                        <input name="mobileNumber" onChange={handleInputChange} value={values.mobileNumber}
                               className="sign-up-field-sm" type="text" placeholder="Mobile Number"/>
                    </div>
                </div>

                <div className="form-row ml-3 mt-2 mb-3">
                    <input name="address" onChange={handleInputChange} value={values.address}
                           className="sign-up-field-sm" type="text" placeholder="Address"/>
                </div>

                <div className="form-row mt-2 mb-3">
                    <div>
                        <input name="city" onChange={handleInputChange} value={values.city}
                               className="sign-up-field" type="text" placeholder="City"/>
                    </div>
                    <div>
                        <input name="state" onChange={handleInputChange} value={values.state}
                               className="sign-up-field-sm" type="text" placeholder="State"/>
                    </div>
                </div>

                <div className="form-row mt-2 mb-3">
                    <div>
                        <input name="zipCode" onChange={handleInputChange} value={values.zipCode}
                               className="sign-up-field" type="text" placeholder="Postal Code"/>
                    </div>
                    <div>
                        <input name="country" onChange={handleInputChange} value={values.country}
                               className="sign-up-field-sm" type="text" placeholder="Country"/>
                    </div>
                </div>

                <div className="form-row ml-3 mt-2 mb-3">
                    <input onChange={handleCheckbox} name="tAndC" defaultChecked={values.tAndC} id="tAndC"
                           type="checkbox"/>
                    <label className="ml-2" htmlFor="tAndC">I agree with the <Link
                        to={{pathname: "https://claimmunity.com/terms"}} target="_blank" onClick={handleTerms}>terms
                        and conditions</Link> and <Link
                        to={{pathname: "https://claimmunity.com/privacy"}} target="_blank" onClick={handlePrivacy}>privacy policy</Link> </label>
                </div>

                <div className="form-row ml-3 mt-2 mb-4">
                    <button onClick={handleSubmit} className="btn btn-primary sign-up-field-sm">Complete Sign Up
                    </button>
                </div>

            </div>
        </div>}

    </div>
}

export default SignUpComponent;