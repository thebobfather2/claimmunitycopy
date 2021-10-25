import React, {Component} from "react";
import {AiFillDelete, AiFillEye} from "react-icons/ai";
import FormDataService from "../../api/FormDataService";
import {NUM_OF_RESULTS_PER_PAGE} from "../../Constants";

class FormsListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            sortedForms: [],
            message: '',
            currentPage: 1,
            showClearSearch: false
        }
        this.getForms = this.getForms.bind(this);
        this.delete = this.delete.bind(this);
        this.openForm = this.openForm.bind(this);
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

    clearSearch() {
        this.setState({sortedForms: this.state.forms, showClearSearch: false})
        document.getElementById('search-input').value = ''
    }

    search() {
        let searchValue = document.getElementById('search-input').value
        const re = new RegExp(searchValue, 'i');
        const filtered = this.state.forms.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.match(re)));
        if (filtered !== null) {
            this.setState({
                sortedForms: filtered,
                showClearSearch: true
            })
        }
    }

    sortFieldDesc(field) {
        this.setState({
            sortedForms: this.state.sortedForms.sort((a, b) => {
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
            sortedForms: this.state.sortedForms.sort((a, b) => {
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
        this.getForms();
    }

    getForms() {
        FormDataService.getForms()
            .then(response => {
                // console.log(response)
                this.setState({
                    forms: response.data,
                    sortedForms: response.data
                })
            })
            .catch(() => {
                this.setState({
                    message: "An error occurred while retrieving the forms. Please contact support at support@claimmunity.com to report the issue."
                })
            })
    }

    delete(id) {
        if (window.confirm("Are you sure you want to delete form?")) {
            FormDataService.deleteForm(id)
                .then(this.getForms)
                .catch(response => {
                    this.setState({
                        message: "An error occurred while delete form. Please contact support at support@claimmunity.com to report the issue."
                    })
                })
        }
    }

    openForm(id, incidentId) {
        this.props.history.push(`/form/${id}/${incidentId}`)
    }

    render() {

        const {sortedForms, currentPage} = this.state;

        // Logic for displaying forms
        const lastIndex = currentPage * NUM_OF_RESULTS_PER_PAGE;
        const firstIndex = lastIndex - NUM_OF_RESULTS_PER_PAGE;
        const currentForms = sortedForms.slice(firstIndex, lastIndex);


        const renderForms = currentForms.map((form, index) => {
            return <tr key={index}>
                <td>{form.claimmunityNumber}</td>
                <td>{form.type}</td>
                <td>{form.mode}</td>
                <td>{form.vendor}</td>
                <td>{form.status}</td>
                <td><AiFillEye color="#317ABB"
                               onClick={() => this.openForm(form.formId, form.incidentId)}/>&nbsp;&nbsp;
                    {form.status !== 'DRAFT' &&
                    <AiFillDelete color="red" onClick={() => this.delete(form.formId)}/>}</td>
            </tr>
        });

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(sortedForms.length / NUM_OF_RESULTS_PER_PAGE); i++) {
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
                <div className="pull-left text-white font-weight-bold bg-app">Forms</div>
                <div className="pull-right bg-app">
                    <button type="button"
                            className="btn-rounded btn-light" onClick={() => this.props.history.push('doc-hub')}>
                        View Documents & Images
                    </button>
                </div>
                <div className="row searchBox">
                    <div className="col-sm-12 searchBox-inner">
                        <div className="input-group">
                            <input className="form-control py-2 border-right-0 border" type="search"
                                   id="search-input" placeholder="Search Forms" onKeyDown={this.handleKeyDown}/>
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
                        {renderForms}
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

export default FormsListComponent;