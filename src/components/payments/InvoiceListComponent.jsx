import React, {Component} from "react";
import InvoiceDataService from "../../api/InvoiceDataService";
import {NUM_OF_RESULTS_PER_PAGE} from "../../Constants";
import {AiFillEye} from "react-icons/ai";

class InvoiceListComponent extends Component{

    constructor(props) {
        super(props);
        this.state = {
            invoices: [],
            sortedInvoices: [],
            message: '',
            currentPage: 1,
            showClearSearch: false
        }
        this.getInvoices = this.getInvoices.bind(this);
        this.openInvoice = this.openInvoice.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.sortFieldAsc = this.sortFieldAsc.bind(this);
        this.sortFieldDesc = this.sortFieldDesc.bind(this);
        this.search = this.search.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
    }

    getInvoices(){
        InvoiceDataService.getInvoices()
            .then(response => {
                this.setState({
                    invoices: response.data,
                    sortedInvoices: response.data
                })
            })
            .catch(() => {
                this.setState({
                    message: "An error occurred while retrieving the forms. Please contact support at support@claimmunity.com to report the issue."
                })
            })
    }
    openInvoice(id) {
        this.props.history.push(`/invoice/${id}`)
    }

    clearSearch() {
        this.setState({sortedInvoices: this.state.invoices, showClearSearch: false})
        document.getElementById('search-input').value = ''
    }

    search() {
        let searchValue = document.getElementById('search-input').value
        const re = new RegExp(searchValue, 'i');
        const filtered = this.state.invoices.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.match(re)));
        if (filtered !== null) {
            this.setState({
                sortedInvoices: filtered,
                showClearSearch: true
            })
        }
    }

    sortFieldDesc(field) {
        this.setState({
            sortedInvoices: this.state.sortedInvoices.sort((a, b) => {
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
            sortedInvoices: this.state.sortedInvoices.sort((a, b) => {
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
        this.getInvoices();
    }

    render() {

        const {sortedInvoices, currentPage} = this.state;

        // Logic for displaying invoices
        const lastIndex = currentPage * NUM_OF_RESULTS_PER_PAGE;
        const firstIndex = lastIndex - NUM_OF_RESULTS_PER_PAGE;
        const currentInvoices = sortedInvoices.slice(firstIndex, lastIndex);


        const renderInvoices = currentInvoices.map((invoice, index) => {
            return <tr key={index}>
                <td>{invoice.claimmunityNumber}</td>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.vendor}</td>
                <td>{invoice.status}</td>
                <td>{invoice.externalReferenceNumber}</td>
                <td><AiFillEye color="#317ABB" onClick={() => this.openInvoice(invoice.id)}/></td>
            </tr>
        });

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(sortedInvoices.length / NUM_OF_RESULTS_PER_PAGE); i++) {
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


        return (<div className="container">
            <div className="page-top">
                <div className="pull-left text-white font-weight-bold">Invoices</div>

                <div className="row searchBox mt-5">
                    <div className="col-sm-12 searchBox-inner">
                        <div className="input-group">
                            <input className="form-control py-2 border-right-0 border" type="search"
                                   id="search-input" placeholder="Search Invoices"/>
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
                            <th className="th-sm">INVOICE #
                                <div className="stacked-icons">
                                    <i className="fa fa-fw fa-sort-asc"
                                       onClick={() => this.sortFieldDesc('invoiceNumber')}/>
                                    <i className="fa fa-fw fa-sort-desc fa-margin-top"
                                       onClick={() => this.sortFieldAsc('invoiceNumber')}/>
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
                            <th className="th-sm">STATUS
                                <div className="stacked-icons">
                                    <i className="fa fa-fw fa-sort-asc"
                                       onClick={() => this.sortFieldDesc('status')}/>
                                    <i className="fa fa-fw fa-sort-desc fa-margin-top"
                                       onClick={() => this.sortFieldAsc('status')}/>
                                </div>
                            </th>
                            <th className="th-sm">PAYMENT AUTH #</th>
                            <th className="th-sm">ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderInvoices}
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

        );
    }
}

export default InvoiceListComponent;
