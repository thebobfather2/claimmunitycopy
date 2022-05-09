import React, {Component} from "react";
import {Button, Modal, ProgressBar} from "react-bootstrap";
import IncidentDataService from "../../api/IncidentDataService";
import {CgFileDocument} from "react-icons/cg";
import {FiTruck} from "react-icons/fi";
import {IconContext} from "react-icons";
import {FaConnectdevelop} from "react-icons/fa";
import {Link} from "react-router-dom";
import '../../static/css/TaskManagementBoard.css';
import '../../App.css';
import {NUM_OF_FREE_INCIDENTS_ALLOWED, NUM_OF_RESULTS_PER_PAGE} from "../../Constants";
import {USER_PREMIUM_USER} from "../../api/AuthenticationService";


class TaskBoardComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            incidents: [],
            sortedIncidents: [],
            message: '',
            currentPage: 1,
            showClearSearch: false,
            showInviteUserModal: false,
            incidentId: -1,
            emailAddress: '',
            errorMessage: '',
            successMessage: '',
            totalCount: 0,
            limitedAccess: true
        }
        this.getIncidents = this.getIncidents.bind(this);
        this.createIncident = this.createIncident.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.sortFieldAsc = this.sortFieldAsc.bind(this);
        this.sortFieldDesc = this.sortFieldDesc.bind(this);
        this.search = this.search.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.sendInvitation = this.sendInvitation.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value,
            errorMessage: '',
            successMessage:''
        })
    }

    sendInvitation(incidentId, emailAddress) {
        const emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        const popularEmailPattern = /.+@(gmail|yahoo|hotmail|aol)\.com$/;

        if (!emailPattern.test(emailAddress) || popularEmailPattern.test(emailAddress)){
            this.setState({
                errorMessage: 'Please enter a valid company email address'
            })
            return
        }

        const collaboration = {
            incidentId: incidentId,
            emailAddress: emailAddress
        }

        IncidentDataService.inviteUserToCollaborate(collaboration)
            .then(() => this.setState({
                successMessage: 'Invitation sent!'
            }))
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    this.setState({
                        errorMessage: 'Please enter valid email with a domain different than your organization\'s domain'
                    })
                }
                else{
                    this.setState({
                        errorMessage: "Unable to invite external user. Please contact support at support@claimmunity.com to report the issue."
                    })
                }
            })
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            this.search();
        } else if (e.keyCode === 27) {
            this.clearSearch();
        }
    }

    sortFieldDesc(field) {
        this.setState({
            sortedIncidents: this.state.sortedIncidents.sort((a, b) => {
                if (a[field] > b[field]) {
                    return -1;
                }
                if (b[field] > a[field]) {
                    return 1;
                }
                return 0;
            })
        })
    }

    sortFieldAsc(field) {
        this.setState({
            sortedIncidents: this.state.sortedIncidents.sort((a, b) => {
                if (a[field] > b[field]) {
                    return 1;
                }
                if (b[field] > a[field]) {
                    return -1;
                }
                return 0;
            })
        })
    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    componentDidMount() {
        this.getIncidents();
    }

    createIncident() {
        this.props.history.push(`/create-incident`)
    }

    getIncidents() {
        IncidentDataService.getIncidents()
            .then(response => {
                if (response.data.totalCount > 0) {
                    this.setState({
                        incidents: response.data.incidents,
                        sortedIncidents: response.data.incidents,
                        totalCount: response.data.totalCount,
                        limitedAccess: sessionStorage.getItem(USER_PREMIUM_USER) === 'false' && response.data.totalCount >= NUM_OF_FREE_INCIDENTS_ALLOWED
                    })
                }
            })
            .catch(response => {
                this.setState({
                    message: "An error occurred while retrieving your incidents. Please contact support at support@claimmunity.com to report the issue."
                })
            })
    }

    clearSearch() {
        this.setState({sortedIncidents: this.state.incidents, showClearSearch: false})
        document.getElementById('search-input').value = ''
    }

    search() {
        let searchValue = document.getElementById('search-input').value
        const re = new RegExp(searchValue, 'i');
        const filtered = this.state.incidents.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.match(re)));
        if (filtered !== null) {
            this.setState({
                sortedIncidents: filtered,
                showClearSearch: true
            })
        }
    }

    render() {

        const {sortedIncidents, currentPage} = this.state;

        // Logic for displaying incidents
        const indexOfLastIncident = currentPage * NUM_OF_RESULTS_PER_PAGE;
        const indexOfFirstIncident = indexOfLastIncident - NUM_OF_RESULTS_PER_PAGE;
        const currentIncidents = sortedIncidents.slice(indexOfFirstIncident, indexOfLastIncident);

        const renderIncidents = currentIncidents.map((incident, index) => {
            return <tr key={index}>
                <td><FaConnectdevelop style={{color: '#317ABB'}}/><Link className="link"
                                                                        to={`/task-management-board/${incident.id}`}>&nbsp;{incident.claimmunityNumber}</Link>
                </td>
                <td>{incident.type}</td>
                <td><ProgressBar now={incident.status.progressPercentage}/></td>
                <td>{incident.status.status}</td>
                <td><FiTruck/>&nbsp;{incident.vendor}</td>
                <td><CgFileDocument/>&nbsp;{incident.referenceNumber}</td>
                <td>
                    <Button className="btn-sm btn-primary" onClick={() => this.setState({showInviteUserModal: true, incidentId: incident.id})} disabled={this.state.limitedAccess}>Invite
                        user</Button>
                </td>
            </tr>
        });

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(sortedIncidents.length / NUM_OF_RESULTS_PER_PAGE); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            let className = ''
            if (currentPage === number) {
                className = 'active'
            }
            return (
                <button className={className} key={number} id={number} onClick={this.handleClick}>
                    {number}
                </button>
            );
        });


        return <IconContext.Provider value={{color: '#317ABB'}}>

            <div className="container">

                <div className="page-top">
                    <div className="pull-left text-white font-weight-bold bg-app">My Freight Incidents</div>
                    <div className="pull-right bg-app">
                        <button type="button" className="btn-light btn-rounded"
                                onClick={this.createIncident} disabled={this.state.limitedAccess}>+ Create New Incident
                        </button>
                    </div>
                    <div className="row searchBox">
                        <div className="col-sm-12 searchBox-inner">
                            <div className="input-group">
                                <input className="form-control py-2 border-right-0 border" type="search"
                                       id="search-input" placeholder="Search Incidents" onKeyDown={this.handleKeyDown}/>
                                {this.state.showClearSearch &&
                                <span className="input-group-append">
                                        <div className="input-group-text"> <i className="fa fa-times bg-transparent"
                                                                              onClick={this.clearSearch}/></div>
                                    </span>
                                }
                                <span className="input-group-append">
                                        <div className="input-group-text"><i className="fa fa-search bg-transparent"
                                                                             onClick={this.search}/></div>
                                    </span>

                            </div>
                        </div>
                    </div>


                    {this.state.message && <div className="alert alert-danger">{this.state.message}</div>}

                    {this.state.limitedAccess &&
                    <div>
                        <button className="btn-primary btn-upgrade"
                                onClick={() => this.props.history.push(`/settings/upgrade`)}>Upgrade To Premium<br/> To Unlock Unlimited <br/> Incidents</button>
                    </div>
                    }

                    <div className={this.state.limitedAccess ? "disable-div table-responsive": "table-responsive"}>
                        <table className="table table-responsive-lg">
                            <thead className="table-header">
                            <tr>
                                <th className="th-sm" scope="col">CLAIMMUNITY #
                                    <div className="stacked-icons">
                                        <i className="fa fa-fw fa-sort-asc"
                                           onClick={() => this.sortFieldDesc('claimmunityNumber')}/>
                                        <i className="fa fa-fw fa-sort-desc fa-margin-top"
                                           onClick={() => this.sortFieldAsc('claimmunityNumber')}/>
                                    </div>
                                </th>
                                <th className="th-sm" scope="col">TYPE
                                    <div className="stacked-icons">
                                        <i className="fa fa-fw fa-sort-asc fa-small-size"
                                           onClick={() => this.sortFieldDesc('type')}/>
                                        <i className="fa fa-fw fa-sort-desc fa-small-size fa-margin-top"
                                           onClick={() => this.sortFieldAsc('type')}/>
                                    </div>
                                </th>
                                <th className="th-sm" scope="col">PROGRESS</th>
                                <th onClick={() => this.sortFieldAsc('status')} className="th-sm" scope="col">STATUS
                                </th>
                                <th>VENDOR
                                    <div className="stacked-icons">
                                        <i className="fa fa-fw fa-sort-asc fa-small-size"
                                           onClick={() => this.sortFieldDesc('vendor')}/>
                                        <i className="fa fa-fw fa-sort-desc fa-small-size fa-margin-top"
                                           onClick={() => this.sortFieldAsc('vendor')}/>
                                    </div>
                                </th>
                                <th className="th-sm" scope="col">REFERENCE #
                                    <div className="stacked-icons">
                                        <i className="fa fa-fw fa-sort-asc fa-small-size"
                                           onClick={() => this.sortFieldDesc('referenceNumber')}/>
                                        <i className="fa fa-fw fa-sort-desc fa-small-size fa-margin-top"
                                           onClick={() => this.sortFieldAsc('referenceNumber')}/>
                                    </div>
                                </th>
                                <th className="th-sm" scope="col">
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {renderIncidents}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <ul id="page-numbers">
                                {renderPageNumbers}
                            </ul>
                        </div>
                    </div>

                    <Modal
                        show={this.state.showInviteUserModal}
                        onHide={() => this.setState({showInviteUserModal:false})}
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Please enter the email address of the user you would like to invite</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.successMessage !== '' &&
                            <div className="w-100 text-success">
                                {this.state.successMessage}
                            </div>}
                            {this.state.errorMessage !== '' &&
                            <div className="w-100 text-danger">
                                {this.state.errorMessage}
                            </div>}
                            <div className="w-100">
                                <input name="emailAddress" className="w-100" type="text" placeholder="Email address" onChange={this.handleChange}/>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="btn-primary" onClick={() => this.sendInvitation(this.state.incidentId, this.state.emailAddress)}>Send Invitation</Button>
                            <Button variant="secondary" onClick={() => this.setState({showInviteUserModal:false})}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </IconContext.Provider>
    }
}

export default TaskBoardComponent;