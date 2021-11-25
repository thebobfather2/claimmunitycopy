import React, {useState} from 'react';
import '../../static/css/Login.css';
import ContactUsDataService from "../../api/ContactUsDataService";

function ContactUsComponent() {

    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        emailAddress: '',
        companyName: '',
        title: ''
    });
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const submitForm = () => {

        if (!values.firstName){
            setErrorMessage('Please enter a valid first name')
            return;
        }
        if (!values.lastName){
            setErrorMessage('Please enter a valid last name')
            return;
        }
        const emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        const popularEmailPattern = /.+@(gmail|yahoo|hotmail|aol)\.com$/;

        if (!emailPattern.test(values.emailAddress) || popularEmailPattern.test(values.emailAddress)) {
            setErrorMessage('Please enter a valid company email address')
            return;
        }

        if (!values.companyName){
            setErrorMessage('Please enter a valid company name')
            return;
        }

        if (!values.title){
            setErrorMessage('Please enter your title in the company')
            return;
        }

        let form = {
            firstName: values.firstName,
            lastName: values.lastName,
            emailAddress: values.emailAddress,
            companyName: values.companyName,
            title: values.title
        }


        ContactUsDataService.contactUs(form)
            .then(() => setSuccessMessage("Thank you for contacting us. Someone from our staff will reach out to you shortly!"))
            .catch(() => setErrorMessage('Error submitting your contact us form. Please try again or contact us directly at support@claimmunity.com'))
    }
    const handleInputChange = (event) => {
        event.preventDefault()

        setValues((values) => ({
            ...values,
            [event.target.name]: event.target.value
        }));

        setSuccessMessage('')
        setErrorMessage('')
    };

    const handleKeyDown= (event) => {
        if (event.key === 'Enter') {
            submitForm()
        }
    }

    return (

        <div className="container-sm">

            <div className="form-row">

                <div className="col-sm-12 mt-2">
                    <h2>LET US KNOW WHO YOU ARE</h2>
                    <hr/>
                </div>
            </div>

            {successMessage &&
            <div className="ml-2 text-success">
                {successMessage}
            </div>
            }

            {errorMessage &&
            <div className="ml-2 text-danger">
                {errorMessage}
                 </div>
            }

            <div className="form-row mt-4 ml-5">

                <div className="form-group col-sm-5">
                    <label className="required pull-left">FIRST NAME</label>
                    <input name="firstName" onChange={handleInputChange} value={values.firstName}
                           className="form-control" type="text" placeholder="First Name" onKeyDown={handleKeyDown}/>
                </div>

                <div className="form-group col-sm-5">
                    <label className="required pull-left">LAST NAME</label>
                    <input name="lastName" onChange={handleInputChange} value={values.lastName}
                           className="form-control" type="text" placeholder="Last Name" onKeyDown={handleKeyDown}/>
                </div>

            </div>

            <div className="form-row mt-2 ml-5">
                <div className="col-sm-10 form-group">
                    <label className="required pull-left">EMAIL</label>
                    <input name="emailAddress" onChange={handleInputChange} value={values.emailAddress}
                           className="form-control" type="text" placeholder="Your work email" onKeyDown={handleKeyDown}/>
                </div>
            </div>


            <div className="form-row mt-2 ml-5">
                <div className="col-sm-10 form-group">
                    <label className="required pull-left">COMPANY</label>
                    <input name="companyName" onChange={handleInputChange} value={values.companyName}
                           className="form-control" type="text" placeholder="The company you represent" onKeyDown={handleKeyDown}/>
                </div>
            </div>

            <div className="form-row ml-5">
                <div className="col-sm-10 form-group">
                    <label className="required pull-left">TITLE</label>
                    <input name="title" onChange={handleInputChange} value={values.title}
                           className="form-control" type="text" placeholder="Your title at the company" onKeyDown={handleKeyDown}/>
                </div>
            </div>

            <div className="form-row ml-5 mt-3">
                <div className="col-sm-10 form-group">
                   <button className="pull-right btn btn-primary w-100" onClick={submitForm}>Contact us!</button>
                </div>
            </div>

        </div>
    )

}

export default ContactUsComponent;