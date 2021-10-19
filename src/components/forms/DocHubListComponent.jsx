import React, {Component} from "react";
import {AiFillEye} from "react-icons/ai";
import FormDataService from "../../api/FormDataService";
import {NUM_OF_RESULTS_PER_PAGE} from "../../Constants";

class DocHubListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            docs: [],
            message: '',
            sortedDocs: [],
            currentPage: 1,
            showClearSearch: false
        }
        this.loadTable = this.loadTable.bind(this);
        this.openDocs = this.openDocs.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.sortFieldAsc = this.sortFieldAsc.bind(this);
        this.sortFieldDesc = this.sortFieldDesc.bind(this);
        this.search = this.search.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
    }

    clearSearch() {
        this.setState({sortedDocs: this.state.docs, showClearSearch: false})
        document.getElementById('search-input').value = ''
    }

    search() {
        let searchValue = document.getElementById('search-input').value
        const re = new RegExp(searchValue, 'i');
        const filtered = this.state.docs.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.match(re)));
        if (filtered !== null) {
            this.setState({
                sortedDocs: filtered,
                showClearSearch: true
            })
        }
    }

    sortFieldDesc(field) {
        this.setState({sortedDocs: this.state.sortedDocs.sort((a, b) => {
                if (a[field] > b[field]) { return -1; }
                if (b[field] > a[field]) { return 1; }
                return 0;
            })})
    }

    sortFieldAsc(field) {
        this.setState({sortedDocs: this.state.sortedDocs.sort((a, b) => {
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
        this.loadTable();
    }

    loadTable() {
        FormDataService.getForms()
            .then(response => {
                // console.log(response)
                this.setState({
                    docs: response.data,
                    sortedDocs: response.data
                })
            })
            .catch(() => {
                this.setState({
                    message: "An error occurred while retrieving the docs. Please contact support at support@claimmunity.com to report the issue."
                })
            })
    }


    openDocs(id) {
        this.props.history.push(`/docs/${id}`)
    }

    render() {

        const {sortedDocs, currentPage} = this.state;

        // Logic for displaying docs
        const indexOfLastDoc = currentPage * NUM_OF_RESULTS_PER_PAGE;
        const indexOfFirstDoc = indexOfLastDoc - NUM_OF_RESULTS_PER_PAGE;
        const currentDocs = sortedDocs.slice(indexOfFirstDoc, indexOfLastDoc);

        const renderDocs = currentDocs.map((doc, index) => {
            return <tr key={index}>
                            <td>{doc.claimmunityNumber}</td>
                            <td>{doc.type}</td>
                            <td>{doc.mode}</td>
                            <td>{doc.vendor}</td>
                            <td>{doc.status}</td>
                            <td><AiFillEye color="#317ABB" onClick={() => this.openDocs(doc.incidentId)}/>&nbsp;&nbsp;
                            </td>
                        </tr>
        });

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(sortedDocs.length / NUM_OF_RESULTS_PER_PAGE); i++) {
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


        return <div className="container">
            <div className="page-top">
                <div className="pull-left text-white font-weight-bold">Documents & Images</div>
                <div className="pull-right">
                    <button type="button"
                            className="btn-rounded btn-light"  onClick={() => this.props.history.push(`/forms`)}>
                        View Forms
                    </button>
                </div>
                <div className="row searchBox">
                    <div className="col-sm-12 searchBox-inner">
                        <div className="input-group">
                            <input className="form-control py-2 border-right-0 border" type="search"
                                   id="search-input" placeholder="Search Docs"/>
                            {this.state.showClearSearch &&
                            <span className="input-group-append">
                                        <div className="input-group-text bg-transparent"> <i className="fa fa-times"
                                                                                             onClick={this.clearSearch}/></div>
                                    </span>
                            }
                            <span className="input-group-append">
                                        <div className="input-group-text bg-transparent"><i className="fa fa-search"
                                                                                            onClick={this.search}/></div>
                                    </span>

                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-responsive-lg">
                        <thead className="table-header">
                        <tr>
                            <th className="th-sm">CLAIMMUNITY #
                                <div className="stacked-icons">
                                    <i className="fa fa-fw fa-sort-asc"
                                       onClick={() => this.sortFieldDesc('claimmunityNumber')}/>
                                    <i className="fa fa-fw fa-sort-desc fa-margin-top"
                                       onClick={() => this.sortFieldAsc('claimmunityNumber')}/>
                                </div>
                            </th>
                            <th className="th-sm">TYPE
                                <div className="stacked-icons">
                                    <i className="fa fa-fw fa-sort-asc"
                                       onClick={() => this.sortFieldDesc('type')}/>
                                    <i className="fa fa-fw fa-sort-desc fa-margin-top"
                                       onClick={() => this.sortFieldAsc('type')}/>
                                </div>
                            </th>
                            <th className="th-sm">MODE
                                <div className="stacked-icons">
                                    <i className="fa fa-fw fa-sort-asc"
                                       onClick={() => this.sortFieldDesc('mode')}/>
                                    <i className="fa fa-fw fa-sort-desc fa-margin-top"
                                       onClick={() => this.sortFieldAsc('mode')}/>
                                </div>
                            </th>
                            <th className="th-sm">VENDOR
                                <div className="stacked-icons">
                                    <i className="fa fa-fw fa-sort-asc"
                                       onClick={() => this.sortFieldDesc('vendor')}/>
                                    <i className="fa fa-fw fa-sort-desc fa-margin-top"
                                       onClick={() => this.sortFieldAsc('vendor')}/>
                                </div>
                            </th>
                            <th className="th-sm">STATUS</th>
                            <th className="th-sm">ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderDocs}
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
    }
}

export default DocHubListComponent;