import {Component} from "react";
import '../../static/css/AccountSettings.css';
import UserDataService from "../../api/UserDataService";


class AccountSettingsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            successMessage: '',
            errorMessage: '',
            currentUser: '',
            userId: '',
            currentPassword: '',
            newPassword: '',
            newPasswordConfirmation: '',
            companyName: '',
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            mobilePhone:'',
            workPhone: ''
        }

        this.handleDiv = this.handleDiv.bind(this)
        this.showDiv = this.showDiv.bind(this)
        this.hideDiv = this.hideDiv.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.updateUserPassword = this.updateUserPassword.bind(this)
        this.getUser = this.getUser.bind(this)
        this.updateUser = this.updateUser.bind(this)
        this.clearPasswordForm = this.clearPasswordForm.bind(this)
        this.resetUserForm = this.resetUserForm.bind(this)
    }

    resetUserForm(){
        let currentUser = this.state.currentUser
        this.setState({
            userId: currentUser.userId,
            companyName: currentUser.companyName,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            address: currentUser.address,
            city: currentUser.city,
            state: currentUser.state,
            zipCode: currentUser.zipCode,
            country: currentUser.country,
            mobilePhone: currentUser.mobilePhone,
            workPhone: currentUser.workPhone
        })

        this.hideDiv('changeUserForm')
    }

    clearPasswordForm(){
        this.setState({
            currentPassword: '',
            newPassword: '',
            newPasswordConfirmation: ''
        });

        this.hideDiv('changePasswordForm')
    }

    updateUser(){
        let user = {
            address : this.state.address,
            city: this.state.city,
            country: this.state.country,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            mobilePhone: this.state.mobilePhone,
            state: this.state.state,
            workEmail: this.state.workEmail,
            workPhone: this.state.workPhone,
            zipCode: this.state.zipCode
        }

        console.log(this.state.userId)

        UserDataService.updateUser(this.state.userId, user)
            .then(() => this.getUser())
            .then(() => this.setState({successMessage: 'Successfully updated user'}))
            .catch( () => this.setState({errorMessage: 'Error occurred while updating user'}))
    }

    componentDidMount() {
        this.getUser()
    }

    getUser(){
        UserDataService.getUser()
            .then(response => this.setState({
                currentUser: response.data,
                userId: response.data.id,
                companyName: response.data.companyName,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                address: response.data.address,
                city: response.data.city,
                state: response.data.state,
                zipCode: response.data.zipCode,
                country: response.data.country,
                mobilePhone: response.data.mobilePhone,
                workPhone: response.data.workPhone
            }))
    }

    handleChange(event) {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleDiv(divToShow, divToHide){
        this.hideDiv(divToHide)
        this.showDiv(divToShow)
    }

    updateUserPassword() {

        if (this.state.currentPassword.length < 1 || this.state.newPassword.length < 1
            || this.state.newPasswordConfirmation.length < 1){
            this.setState({errorMessage: 'None of the password fields can be blank'})
            return
        }

        if (this.state.currentPassword === this.state.newPassword){
            this.setState({errorMessage: 'New password should be different than old password'})
            return
        }

        if (this.state.newPasswordConfirmation !== this.state.newPassword){
            this.setState({errorMessage: 'New password entries don\'t match'})
            return
        }

        let password = {
            currentPassword: this.state.currentPassword,
            newPassword: this.state.newPassword
        }
        UserDataService.updateUserPassword(this.state.userId, password)
            .then(() => this.setState({successMessage: 'Password successfully updated'}))
            .catch(() => this.setState({errorMessage: 'The current password provided is invalid. Passwords are case sensitive.'}))
    }

    hideDiv(name){
        document.getElementById(name).style.display = 'none'
    }

    showDiv(name) {
        this.setState({errorMessage: '', successMessage: ''})
        document.getElementById(name).style.display = 'block'
    }

    render() {
        return <div className="container">

            <div className="row sideBar pb-3 account-main">
                <div className="col-sm-4">
                    <div className="font-weight-bold"><label>Change password</label></div>
                    <div><small>Choose a unique password to protect your account</small></div>
                </div>
                <div className="col-sm-4">
                    <button className="btn btn-primary mt-2" onClick={() => this.handleDiv('changePasswordForm', 'changeUserForm')}>Change
                    </button>
                </div>
            </div>


            <div className="row sideBar pb-3 account-main">
                <div className="col-sm-4">
                    <div className="font-weight-bold"><label>Change user information</label></div>
                    <div><small>Edit the account information</small></div>
                </div>
                <div className="col-sm-4 mt-2">
                    <button className="btn btn-primary" onClick={() => this.handleDiv('changeUserForm', 'changePasswordForm')}>Change</button>
                </div>
            </div>

            <div id="changePasswordForm" className="reset-password-div">

                {this.state.successMessage &&
                <div className="col-sm-4 alert-success" role="alert">
                    {this.state.successMessage}
                </div>
                }

                {this.state.errorMessage &&
                <div className="col-sm-4 alert-warning" role="alert">
                    {this.state.errorMessage}
                </div>
                }

                <div className="form-group">
                    <div className="col-sm-5">
                        <i className="fa fa-close pull-right" onClick={this.clearPasswordForm}/>
                    </div>
                </div>

                <form onChange={() => this.state.errorMessage !== '' && this.setState({errorMessage: ''})}>

                    <div className="form-group mb-5">
                        <label htmlFor="currentPassword mb-2">Enter current password</label>
                        <input type="password" id="currentPassword" name="currentPassword" className="form-control col-sm-4"
                               placeholder="Password" value={this.state.currentPassword} onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="currentPassword mb-2">Enter new password</label>
                        <input type="password" id="newPassword" name="newPassword" className="form-control col-sm-4"
                               placeholder="New Password" value={this.state.newPassword} onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                        <input type="password" id="newPasswordConfirmation" name="newPasswordConfirmation" className="form-control col-sm-4"
                               placeholder="Confirm Password" value={this.state.newPasswordConfirmation} onChange={this.handleChange}/>
                    </div>

                    <button type="button" onClick={this.updateUserPassword} className="btn btn-primary col-sm-4">Change password</button>

                </form>
            </div>

            <div id="changeUserForm" className="form-group change-user-div">

                {this.state.successMessage &&
                <div className="col-sm-4 alert-success" role="alert">
                    {this.state.successMessage}
                </div>
                }

                {this.state.errorMessage &&
                <div className="col-sm-4 alert-warning" role="alert">
                    {this.state.errorMessage}
                </div>
                }
                <div className="form-group pb-3">
                    <div className="col-sm-5">
                        <i className="fa fa-close pull-right" onClick={this.resetUserForm}/>
                    </div>
                </div>

                <form onChange={() => this.state.errorMessage !== '' && this.setState({errorMessage: ''})}>

                    <div className="form-group ">
                        <label>Company Name</label>
                        <input type="text" disabled id="companyName" name="companyName" className="form-control col-sm-4"
                               placeholder="Company Name" value={this.state.companyName}/>
                    </div>

                    <div className="form-group form-row">

                        <div className="col-sm-2 mr-1">
                            <label>First Name</label>
                            <input className="form-control" type="text" id="firstName" name="firstName" placeholder="First Name"
                            value={this.state.firstName} onChange={this.handleChange}/>
                        </div>

                        <div className="col-sm-2 ml-1">
                            <label>Last Name</label>
                            <input type="text" id="lastName" name="lastName" className="form-control"
                                   placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange}/>

                        </div>

                    </div>

                    <div className="form-group form-row">

                        <div className="col-sm-2 mr-1">
                            <label>Work Number</label>
                            <input className="form-control" type="text" id="workPhone" name="workPhone" placeholder="Work Number"
                                   value={this.state.workPhone} onChange={this.handleChange}/>
                        </div>

                        <div className="col-sm-2 ml-1">
                            <label htmlFor="mobileNumber">Mobile Number</label>
                            <input type="text" id="mobilePhone" name="mobilePhone" className="form-control"
                                   placeholder="Mobile Number" value={this.state.mobilePhone} onChange={this.handleChange}/>
                        </div>

                    </div>

                    <div className="form-group ">
                        <label>Address</label>
                        <input type="text" id="address" name="address" className="form-control col-sm-4"
                               placeholder="Address" value={this.state.address} onChange={this.handleChange}/>
                    </div>

                    <div className="form-group form-row">

                        <div className="col-sm-2 mr-1">
                            <label>City</label>
                            <input className="form-control" type="text" id="city" name="city" placeholder="City"
                                   value={this.state.city} onChange={this.handleChange}/>
                        </div>

                        <div className="col-sm-2 ml-1">
                            <label>State</label>
                            <input type="text" id="state" name="state" className="form-control"
                                   placeholder="State"  value={this.state.state} onChange={this.handleChange}/>

                        </div>

                    </div>

                    <div className="form-group form-row">

                        <div className="col-sm-2 mr-1">
                            <label>Postal Code</label>
                            <input className="form-control" type="text" id="zipCode" name="zipCode" placeholder="Postal Code"
                                   value={this.state.zipCode} onChange={this.handleChange}/>
                        </div>

                        <div className="col-sm-2 ml-1">
                            <label htmlFor="mobileNumber">Country</label>
                            <input type="text" id="country" name="country" className="form-control"
                                   placeholder="Country"  value={this.state.country} onChange={this.handleChange}/>
                        </div>

                    </div>

                    <button type="button" onClick={this.updateUser} className="btn btn-primary col-sm-4">Update User</button>

                </form>
            </div>

        </div>
    }
}

export default AccountSettingsComponent;