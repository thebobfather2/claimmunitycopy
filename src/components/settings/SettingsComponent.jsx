import React, {Component} from "react";
import '../../static/css/Settings.css';
import {BsPersonCheck, GoOrganization, IoMdNotificationsOutline, MdAccountBalance} from "react-icons/all";
import AccountSettingsComponent from "./AccountSettingsComponent";
import NotificationSettingsComponent from "./NotificationSettingsComponent";
import PaymentSettingsComponent from "./PaymentSettingsComponent";
import OrganizationSettingsComponent from "./OrganizationSettingsComponent";
import UpgradeComponent from "./UpgradeComponent";

class SettingsComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            view: props.match.params.view
        }
        this.changeType = this.changeType.bind(this)
    }

    changeType(type){
        this.setState({
            view: type
        })
    }

    render() {
        return <div className="container app settings-div">
            <div className="col-sm-4 side">
                <div className="side-one">

                    <div className="row sideBar">

                        <div className="row sideBar-body" onClick={() => this.setState({view: 'accounts'})}>
                            <div className="col-sm-3 col-xs-3 mt-3">
                                <BsPersonCheck size="25"/>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                                        <span className="name-meta">Account</span><br/>
                                        <span className="small-description">Your account information</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row sideBar-body" onClick={() => this.setState({view: 'notifications'})}>
                            <div className="col-sm-3 col-xs-3 mt-3">
                                <IoMdNotificationsOutline size="25"/>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-9 col-xs-9 sideBar-name">
                                        <span className="name-meta">Notifications</span><br/>
                                        <span className="small-description">Your notification preferences</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row sideBar-body" onClick={() => this.setState({view: 'organization'})}>
                            <div className="col-sm-3 col-xs-3 mt-3">
                                <div>
                                    <GoOrganization size="25"/>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-9 col-xs-9 sideBar-name">
                                        <span className="name-meta">Your organization</span><br/>
                                        <span className="small-description">Members of your organization</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row sideBar-body" onClick={() => this.setState({view: 'payments'})}>
                            <div className="col-sm-3 col-xs-3 mt-3">
                                <div>
                                    <MdAccountBalance size="25"/>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-9 col-xs-9 sideBar-name">
                                        <span className="name-meta">Your payment information</span><br/>
                                        <span className="small-description">Payment methods and transactions</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <div className="settings">
                {this.state.view === 'accounts' && <AccountSettingsComponent changeType={this.changeType}/>}
                {this.state.view === 'notifications' && <NotificationSettingsComponent/>}
                {this.state.view === 'organization' && <OrganizationSettingsComponent changeType={this.changeType}/>}
                {this.state.view === 'payments' && <PaymentSettingsComponent/>}
                {this.state.view === 'upgrade' && <UpgradeComponent history={this.props.history} changeType={this.changeType}/>}
            </div>

        </div>
    }
}

export default SettingsComponent