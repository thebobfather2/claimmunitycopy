import {Component} from "react";
import '../../static/css/OrganizationSettings.css';
import UserDataService from "../../api/UserDataService";


class OrganizationSettingsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            showInviteUser: false,
            email: '',
            errorMessage: '',
            successMessage: ''
        }
        this.renderUsers = this.renderUsers.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.sendInvitation = this.sendInvitation.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    sendInvitation(){

        const emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        const popularEmailPattern = /.+@(gmail|yahoo|hotmail|aol)\.com$/;

        if (!emailPattern.test(this.state.email) || popularEmailPattern.test(this.state.email)){
            this.setState({
                errorMessage: 'Please enter a valid company email address'
            })
            return
        }

        //Send invitation
        UserDataService.sendInvitation(this.state.email)
            .then(() => this.setState({successMessage: `Invitation sent to ${this.state.email}`}))
            .catch(() => this.setState({errorMessage: `Error occurred while sending invitation to ${this.state.email}`}))
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (this.state.errorMessage !== ''){
            this.setState({errorMessage: ''})
        }
        if (this.state.successMessage !== ''){
            this.setState({successMessage: ''})
        }
    }

    deleteUser(id) {
        if (window.confirm("Are you sure you want to remove user?")) {
            UserDataService.deleteUser(id)
                .then(() => this.renderUsers())
        }
    }

    componentDidMount() {
        this.renderUsers()
    }

    renderUsers() {
        UserDataService.getUsers()
            .then(response => this.setState({users: response.data}))
    }

    render() {
        return <div className="container organization-div sideBar">
            {
                this.state.users.map(
                    user => {
                        return (<div className="row mb-3">
                            <div className="col-sm-3">
                                <label>{user.firstName + ' ' + user.lastName}</label>
                            </div>
                            <div className="col-sm-3">
                                {user.role !== 'ADMIN' ?
                                    <button className="btn btn-primary btn-sm"
                                            onClick={() => this.deleteUser(user.id)}>- Remove User</button> :
                                    <label>ADMIN</label>
                                }
                            </div>
                        </div>)
                    })}
            <div className="row">
                <div className="col-sm-5">
                    <button className="btn btn-primary btn-sm" onClick={() => this.setState({showInviteUser: !this.state.showInviteUser, email: '', successMessage: '', errorMessage: ''})}>+ Invite New User</button>
                    {this.state.showInviteUser &&
                    <div className="ml-2 mt-3">
                        <input type="text" id="email" name="email" value={this.state.email} placeholder="Please enter email address" onChange={this.handleChange}/>
                        <button onClick={this.sendInvitation} type="button" className="ml-3 btn btn-primary btn-sm">Send Invitation</button>
                    </div>
                    }
                    {this.state.errorMessage &&
                    <div className="mt-2 alert alert-warning">{this.state.errorMessage}</div>
                    }
                    {this.state.successMessage &&
                    <div className="mt-2 alert alert-success">{this.state.successMessage}</div>
                    }
                </div>
            </div>
        </div>
    }
}

export default OrganizationSettingsComponent;