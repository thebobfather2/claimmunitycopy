import React, {Component} from "react";
import '../../static/css/OrganizationSettings.css';
import UserDataService from "../../api/UserDataService";
import {USER_NAME_SESSION_ATTRIBUTE_NAME, USER_PREMIUM_USER} from "../../api/AuthenticationService";
import OrganizationDataService from "../../api/OrganizationDataService";


class OrganizationSettingsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            licenses: [],
            errorMessage: '',
            successMessage: '',
            premiumUser: sessionStorage.getItem(USER_PREMIUM_USER)
        }
        this.renderLicenses = this.renderLicenses.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.sendInvitation = this.sendInvitation.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.changeType = this.changeType.bind(this)
    }

    changeType(type){
        this.props.changeType(type)
    }

    sendInvitation(license) {
        const emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        const popularEmailPattern = /.+@(gmail|yahoo|hotmail|aol)\.com$/;

        if (!emailPattern.test(license.emailAddress) || popularEmailPattern.test(license.emailAddress)) {
            this.setState({
                errorMessage: 'Please enter a valid company email address'
            })
            return
        }

        const currentUser = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        const domain = currentUser.substring(currentUser.lastIndexOf("@") +1)
        const newUserDomain = license.emailAddress.substring(license.emailAddress.lastIndexOf("@") +1)

        console.log(domain)

        if (domain !== newUserDomain){
            this.setState({
                errorMessage: 'The invited user should be part of the organization'
            })
            return
        }

        //Send invitation
        OrganizationDataService.updateLicense(license.id, license.emailAddress, true)
            .then(() => UserDataService.sendInvitation(license.emailAddress))
            .then(() => alert(`Invitation sent to ${license.emailAddress}`))
            .then(() => this.renderLicenses())
            .catch(() => alert(`Error occurred while sending invitation to ${license.emailAddress}`))
    }

    handleChange(event, user) {

        const licenses = this.state.licenses
        const newLicenses = [...licenses]
        user.emailAddress = event.target.value
        this.setState({
            licenses: newLicenses
        })
        if (this.state.errorMessage !== '') {
            this.setState({errorMessage: ''})
        }
        if (this.state.successMessage !== '') {
            this.setState({successMessage: ''})
        }
    }

    deleteUser(licenseId, userId) {
        if (window.confirm("Are you sure you want to remove license for user?")) {
            //License might be assigned to user but they might have not signed up yet - in this case don't delete the user
            //since they don't exist; just remove the license from that email address
            if (userId !== undefined) {
                UserDataService.deleteUser(userId)
                    .then(() => OrganizationDataService.updateLicense(licenseId, null, false))
                    .then(() => this.renderLicenses())
            } else {
                OrganizationDataService.updateLicense(licenseId, null, false)
                    .then(() => this.renderLicenses())
            }
        }
    }

    componentDidMount() {
        this.renderLicenses()
    }

    renderLicenses() {
        OrganizationDataService.getLicenses()
            .then(response => this.setState(
                {licenses: response.data}))
            .catch(() => this.setState({
                errorMessage: 'Unable to load licenses'
            }))
    }

    render() {
        return <div className="container">

            {this.state.premiumUser === 'false' &&
            <div>
                <button className="btn btn-primary btn-upgrade" onClick={() => this.changeType('upgrade')}>
                    Upgrade To<br/> Premium To Add<br/>More Users
                </button>
            </div>
            }


            {this.state.errorMessage &&
            <div className="mt-2 alert alert-warning">{this.state.errorMessage}</div>
            }
            {this.state.successMessage &&
            <div className="mt-2 alert alert-success">{this.state.successMessage}</div>
            }


            <div
                className={this.state.premiumUser === 'false' ? "disable-div organization-div" : "organization-div sideBar"}>
                {

                    this.state.licenses.map(
                        license => {
                            return (
                                    <div key={license.id} className="ml-2 col-sm-8 mb-3">
                                        {license.active && license.firstName !== undefined && <label>{license.firstName + ' ' + license.lastName}</label>}
                                        {license.active && license.firstName === undefined && <label>{license.emailAddress}</label>}
                                        {!license.active && <input type="text" key={license.id} id={license.emailAddress} name={license.emailAddress} value={license.emailAddress} placeholder="Email address" onChange={e => this.handleChange(e, license)}/>
                                        }
                                        <div className="col-sm-8 pull-right">

                                            {license.active && <label className="mr-2">{license.role}</label>}

                                            {!license.active && <button className="btn btn-primary btn-sm mr-2" onClick={() => this.sendInvitation(license)}>+ Invite New User
                                            </button>
                                            }

                                            {license.active && license.role !== 'ADMIN' &&
                                            <button className="btn btn-primary btn-sm"
                                                    onClick={() => this.deleteUser(license.id, license.userId)}>- Remove User</button>}

                                        </div>
                                    </div>
                            )
                        })}
            </div>
        </div>
    }
}

export default OrganizationSettingsComponent;
