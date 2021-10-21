import React, {Component} from "react";
import '../../static/css/InvoiceComponent.css';
import InvoiceDataService from "../../api/InvoiceDataService";

class InvoiceComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            invoiceNumber: '',
            invoiceDate: '',
            claimantCompanyName: '',
            claimantEmail: '',
            claimantAddress: '',
            claimantCity: '',
            claimantState: '',
            claimantZipCode: '',
            claimantPhone: '',
            claimRecipientCompanyName: '',
            claimRecipientEmail: '',
            claimRecipientAddress: '',
            claimRecipientCity: '',
            claimRecipientState: '',
            claimRecipientZipCode: '',
            claimRecipientPhone: '',
            commodities: [],
            grandTotal: '',
            errorMessage: ''
        }

        this.getInvoice = this.getInvoice.bind(this);
    }

    getInvoice() {
        InvoiceDataService.getInvoice(this.state.id).then(response =>
            this.setState(
                {
                    invoiceNumber: response.data.invoiceNumber,
                    invoiceDate: response.data.invoiceDate,
                    claimantCompanyName:response.data.claimant.companyName,
                    claimantEmail: response.data.claimant.email,
                    claimantAddress: response.data.claimant.address,
                    claimantCity: response.data.claimant.city,
                    claimantState: response.data.claimant.state,
                    claimantZipCode: response.data.claimant.zipCode,
                    claimantPhone: response.data.claimant.phone,
                    claimRecipientCompanyName: response.data.claimRecipient.companyName,
                    claimRecipientEmail: response.data.claimRecipient.email,
                    claimRecipientAddress: response.data.claimRecipient.address,
                    claimRecipientCity: response.data.claimRecipient.city,
                    claimRecipientState: response.data.claimRecipient.state,
                    claimRecipientZipCode:response.data.claimRecipient.zipCode,
                    claimRecipientPhone: response.data.claimRecipient.phone,
                    commodities: response.data.commodities,
                    grandTotal: response.data.grandTotal
                })
        )
            .catch(() => {
                this.setState({
                    errorMessage: "An error occurred while retrieving the tasks. Please contact support at support@claimmunity.com to report the issue."
                })
            })
    }


    componentDidMount() {
        this.getInvoice()
    }


    render() {
        return <div className="container container-invoice">

            <div className="row">
                <div className="col-xs-12">
                    <div className="grid invoice">
                        <div className="grid-body">
                            <div className="row float-md-right">
                                <div className="col mr-0">
                                    <button type="button" className="btn btn-light"
                                            onClick={() => this.props.history.push(`/payments`)}>Go To Payments
                                    </button>
                                </div>
                                <div className="col ml-0">
                                    <button type="button" className="btn btn-light"
                                            onClick={() => this.props.history.push(`/form/1`)}>Edit Commodities
                                    </button>
                                </div>
                            </div>

                            <div className="invoice-title">

                                <div className="row pt-3">
                                    <div className="col text-left">
                                        <h6>Invoice Number<br/>
                                            <span className="small">{this.state.invoiceNumber}</span>
                                        </h6>
                                    </div>
                                    <div className="col text-right">
                                        <h6>Invoice Date<br/>
                                            <span className="small">{this.state.invoiceDate}</span>
                                        </h6>
                                    </div>
                                </div>

                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col text-left">
                                    <address>
                                        <strong>Bill From:</strong><br/>
                                        {this.state.claimantCompanyName}<br/><br/>
                                        {this.state.claimantEmail}<br/>
                                        {this.state.claimantAddress}<br/>
                                        {this.state.claimantCity}, {this.state.claimantState} {this.state.claimantZipCode}<br/>
                                        <abbr title="Phone">P:</abbr> {this.state.claimantPhone}
                                    </address>
                                </div>
                                <div className="col text-right">
                                    <address>
                                        <strong>Bill To:</strong><br/>
                                        {this.state.claimRecipientCompanyName}<br/><br/>
                                        {this.state.claimRecipientEmail}<br/>
                                        {this.state.claimRecipientAddress}<br/>
                                        {this.state.claimRecipientCity}, {this.state.claimRecipientState} {this.state.claimRecipientZipCode}<br/>
                                        <abbr title="Phone">P:</abbr> {this.state.claimRecipientPhone}
                                    </address>
                                </div>
                            </div>

                            <div className="row">
                                <div className="form-group col-xs-3 col-md-3">
                                    <label htmlFor="referenceNumber" className="field-label">Reference #</label>
                                    <input className="form-control" id="referenceNumber" type="text" disabled="true"
                                           value="123"/>
                                </div>
                                <div className="form-group col-xs-3 col-md-3">
                                    <label htmlFor="referenceNumber" className="field-label">PRO #</label>
                                    <input className="form-control" id="referenceNumber" type="text" disabled="true"
                                           value="123"/>
                                </div>
                                <div className="form-group col-xs-3 col-md-3">
                                    <label htmlFor="referenceNumber" className="field-label">BOL #</label>
                                    <input className="form-control" id="referenceNumber" type="text" disabled="true"
                                           value="123"/>
                                </div>
                                <div className="form-group col-xs-3 col-md-3">
                                    <label htmlFor="referenceNumber" className="field-label">PO #</label>
                                    <input className="form-control" id="referenceNumber" type="text" disabled="true"
                                           value="123"/>
                                </div>

                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <table className="table">
                                        <thead>
                                        <tr className="line">
                                            <td><strong>#</strong></td>
                                            <td><strong>Item name</strong></td>
                                            <td className="text-center"><strong>Unit Costs</strong></td>
                                            <td className="text-center"><strong>Unit</strong></td>
                                            <td className="text-center"><strong>Price</strong></td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.commodities.map(
                                                commodity =>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>{commodity.commodityDescription}</td>
                                                        <td className="text-center">{commodity.pieces}</td>
                                                        <td className="text-center">{commodity.pieces}</td>
                                                        <td className="text-right">${commodity.claimedValue}</td>
                                                    </tr>
                                            )
                                        }


                                        <tr>
                                            <td>
                                                <button className="btn btn-primary">Send Invoice</button>
                                            </td>
                                            <td colSpan="2">
                                            </td>
                                            <td className="text-right"><strong>Grand Total</strong></td>
                                            <td className="text-right"><strong>${this.state.grandTotal}</strong></td>
                                        </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default InvoiceComponent;
