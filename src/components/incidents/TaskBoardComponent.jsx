import React, {Component} from "react";
import {ProgressBar} from "react-bootstrap";
import IncidentDataService from "../../api/IncidentDataService";
import {CgFileDocument} from "react-icons/cg";
import {FiTruck} from "react-icons/fi";
import {IconContext} from "react-icons";
import {FaConnectdevelop} from "react-icons/fa";
import {Link} from "react-router-dom";
import '../../static/css/TaskManagementBoard.css';
import '../../App.css';
import {NUM_OF_RESULTS_PER_PAGE} from "../../Constants";


class TaskBoardComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            incidents: [],
            sortedIncidents: [],
            message: '',
            currentPage: 1,
            showClearSearch: false
        }
        this.getIncidents = this.getIncidents.bind(this);
        this.createIncident = this.createIncident.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.sortFieldAsc = this.sortFieldAsc.bind(this);
        this.sortFieldDesc = this.sortFieldDesc.bind(this);
        this.search = this.search.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(e){
        if (e.key === 'Enter') {
            this.search();
        }
        else if (e.keyCode === 27){
            this.clearSearch();
        }
    }

    sortFieldDesc(field) {
        this.setState({sortedIncidents: this.state.sortedIncidents.sort((a, b) => {
            if (a[field] > b[field]) { return -1; }
            if (b[field] > a[field]) { return 1; }
            return 0;
        })})
    }

    sortFieldAsc(field) {
        this.setState({sortedIncidents: this.state.sortedIncidents.sort((a, b) => {
                if (a[field] > b[field]) { return 1; }
                if (b[field] > a[field]) { return -1; }
                return 0;
            })})
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
                        sortedIncidents: response.data.incidents
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
                                onClick={this.createIncident}>+ Create New Incident
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

                    <div className="table-responsive">
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
                                <th onClick={() => this.sortFieldAsc('status')} className="th-sm" scope="col">STATUS</th>
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

                </div>
            </div>
        </IconContext.Provider>
    }
}

export default TaskBoardComponent;