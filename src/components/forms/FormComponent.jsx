import React, {Component} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import FormikErrorFocus from 'formik-error-focus'
import FormDataService from "../../api/FormDataService";
import moment from "moment";
import '../../static/css/FormComponent.css';
import IncidentDataService from "../../api/IncidentDataService";
import {ListGroup} from "react-bootstrap";
import CommodityComponent from "./CommodityComponent";

class FormComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            disabled: false,
            formId: props.match.params.id,
            incidentId: props.match.params.incidentId,
            incidentType: '',
            claimmunityNumber: '',
            carrierId: '',
            carrier: '',
            carrierAddress: '',
            carrierCity: '',
            carrierEmail: '',
            carrierState: '',
            carrierZipCode: '',
            carrierCountry: 'USA',
            carrierPhoneNumber: '',
            consignorId: '',
            consignor: '',
            consignorAddress: '',
            consignorCity: '',
            consignorEmail: '',
            consignorState: '',
            consignorZipCode: '',
            consignorCountry: 'USA',
            consignorPhoneNumber: '',
            consigneeId: '',
            consignee: '',
            consigneeAddress: '',
            consigneeCity: '',
            consigneeEmail: '',
            consigneeState: '',
            consigneeZipCode: '',
            consigneeCountry: 'USA',
            consigneePhoneNumber: '',
            pickupDate: '',
            deliveryDate: '',
            referenceNumber: '',
            proNumber: '',
            bolNumber: '',
            poNumber: '',
            claimId: '',
            claimantCompany: '',
            claimantFirstName: '',
            claimantLastName: '',
            claimantEmail: '',
            claimantPhoneNumber: '',
            claimantAddress: '',
            claimantAddressLine2: '',
            claimantCity: '',
            claimantState: '',
            claimantZipCode: '',
            claimantCountry: '',
            claimPayableToCompany: '',
            claimPayableToAddress: '',
            claimPayableToAddressLine2: '',
            claimPayableToCity: '',
            claimPayableToState: '',
            claimPayableToZipCode: '',
            claimPayableToCountry: '',
            claimPayableToEmail: '',
            claimPayableToPhoneNumber: '',
            notes: '',
            claimPayableToDisabled: false,
            commodities: [],
            maxChars: 500,
            charsLeft: 500,
            commodityErrorMessage: '',
            childCount: 1
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.validate = this.validate.bind(this);
        this.getForm = this.getForm.bind(this)
        this.enableFormForEdit = this.enableFormForEdit.bind(this)
        this.onChangePhone = this.onChangePhone.bind(this)
        this.getIncident = this.getIncident.bind(this)
        this.handleNotesCharacterCount = this.handleNotesCharacterCount.bind(this)
        this.onChange = this.onChange.bind(this);
        this.updateCommodities = this.updateCommodities.bind(this);
        this.handleAddChild = this.handleAddChild.bind(this);
        this.removeCommodity = this.removeCommodity.bind(this);
    }

    handleAddChild=(e)=>{
        e.preventDefault();
        const commodity = {
            id: -1000 + this.state.childCount,
            osdType: 'DAMAGE',
            claimedWeightUnit: 'LBS'
        }
        this.setState({commodities: [...this.state.commodities, commodity], childCount: this.state.childCount + 1})
    }

    removeCommodity(id) {

        let commodities = this.state.commodities.filter(item => item !== id);
        this.setState({
            commodities: commodities
        })
    }

    onChange(name, value, commodity) {

        // parent class change handler is always called with field name and value
        this.setState({[name]: value});
        const newCommodityList = this.state.commodities.map((c) => {
            if (commodity.id === c.id) {
                return {
                    ...c,
                    [name]: value
                };
            }
            return c;
        });
        this.setState({commodities: newCommodityList})
    }


    updateCommodities(commodities){
        this.setState({
            commodities: commodities
        })
    }

    getIncident() {
        IncidentDataService.getIncident(this.state.incidentId)
            .then(response => this.setState({incidentType: response.data.type}))
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    this.props.history.push('/forms');
                }
                else {
                    this.setState({
                        errorMessage: "An error occurred while retrieving the form. Please contact support at support@claimmunity.com to report the issue."
                    })
                }
            })
    }

    handleNotesCharacterCount(event) {
        // event.preventDefault();
        const charCount = event.target.value.length;
        const charLeft = this.state.maxChars - charCount;

        this.setState({
            notes: event.target.value,
            charsLeft: charLeft
        });

    }

    onChangePhone(e) {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({value: e.target.value})
        }
    }

    enableFormForEdit() {
        this.setState({disabled: !this.state.disabled})
    }

    onSubmit(values) {

        let form = {
            incidentId: this.state.incidentId,
            pickUpDate: moment(values.pickupDate).format('YYYY-MM-DD'),
            deliveryDate: moment(values.deliveryDate).format('YYYY-MM-DD'),
            referenceNumber: values.referenceNumber,
            proNumber: values.proNumber,
            bolNumber: values.bolNumber,
            poNumber: values.poNumber,
            carrier: {
                id: this.state.carrierId,
                address: values.carrierAddress,
                city: values.carrierCity,
                workEmail: values.carrierEmail,
                companyName: values.carrier,
                country: values.carrierCountry,
                phone: values.carrierPhoneNumber,
                state: values.carrierState,
                zipCode: values.carrierZipCode
            },
            consignor: {
                id: this.state.consignorId,
                address: values.consignorAddress,
                city: values.consignorCity,
                workEmail: values.consignorEmail,
                companyName: values.consignor,
                country: values.consignorCountry,
                phone: values.consignorPhoneNumber,
                state: values.consignorState,
                zipCode: values.consignorZipCode
            },
            consignee: {
                id: this.state.consigneeId,
                address: values.consigneeAddress,
                city: values.consigneeCity,
                companyName: values.consignee,
                country: values.consigneeCountry,
                workEmail: values.consigneeEmail,
                phone: values.consigneePhoneNumber,
                state: values.consigneeState,
                zipCode: values.consigneeZipCode
            },
            description: values.description,
            targetDate: values.targetDate,
            commodities: this.state.commodities
        }

        if (this.state.incidentType === 'CLAIM') {

            form.claim = {
                claimId: this.state.claimId,
                claimRecipient: {
                    address: this.state.claimPayableToDisabled ? values.claimantAddress : values.claimPayableToAddress,
                    city: this.state.claimPayableToDisabled ? values.claimantCity : values.claimPayableToCity,
                    companyName: this.state.claimPayableToDisabled ? values.claimantCompany : values.claimPayableToCompany,
                    country: this.state.claimPayableToDisabled ? values.claimantCountry : values.claimPayableToCountry,
                    state: this.state.claimPayableToDisabled ? values.claimantState : values.claimPayableToState,
                    streetAddress2: this.state.claimPayableToDisabled ? values.claimantAddressLine2 : values.claimPayableToAddressLine2,
                    zipCode: this.state.claimPayableToDisabled ? values.claimantZipCode : values.claimPayableToZipCode,
                    phone: this.state.claimPayableToDisabled ? values.claimantPhoneNumber : values.claimPayableToPhoneNumber,
                    email: this.state.claimPayableToDisabled ? values.claimantEmail : values.claimPayableToEmail
                },
                claimant: {
                    address: values.claimantAddress,
                    city: values.claimantCity,
                    companyName: values.claimantCompany,
                    country: values.claimantCountry,
                    email: values.claimantEmail,
                    firstName: values.claimantFirstName,
                    lastName: values.claimantLastName,
                    phone: values.claimantPhoneNumber,
                    state: values.claimantState,
                    streetAddress2: values.claimantAddressLine2,
                    zipCode: values.claimantZipCode
                },
                notes: values.notes
            };
        }

        if (this.state.formId > 0) {
            FormDataService.updateForm(this.state.formId, form)
                .then(() => this.props.history.push(`/task-management-board/${this.state.incidentId}`))
                .catch(() => {
                    this.setState({
                        message: "An error occurred while editing the form. Please contact support at support@claimmunity.com to report the issue."
                    })
                })
        } else {
            FormDataService.createForm(form)
                .then(() => this.props.history.push(`/task-management-board/${this.state.incidentId}`))
                .catch(() => {
                    this.setState({
                        message: "An error occurred while create a new form. Please contact support at support@claimmunity.com to report the issue."
                    })
                })
        }
    }

    validate(values) {

        const emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        const popularEmailPattern = /.+@(gmail|yahoo|hotmail|aol)\.com$/;

        let errors = {}

        if (!values.carrier) {
            errors.carrier = 'Please enter a valid carrier name'
            return errors
        }
        if (!values.carrierAddress) {
            errors.carrierAddress = 'Please enter a valid carrier address'
            return errors
        }
        if (!values.carrierCity) {
            errors.carrierCity = 'Please enter a valid carrier city'
            return errors
        }

        if (values.carrierEmail && (!emailPattern.test(values.carrierEmail) || popularEmailPattern.test(values.carrierEmail))) {
            errors.carrierEmail = 'Please enter a valid carrier email address'
            return errors
        }

        if (!values.carrierState) {
            errors.carrierState = 'Please enter a valid carrier state'
            return errors
        }
        if (!values.carrierZipCode) {
            errors.carrierZipCode = 'Please enter a valid carrier zip code'
            return errors
        }
        if (!values.carrierCountry) {
            errors.carrierCountry = 'Please enter a valid carrier country'
            return errors
        }

        if (!values.carrierPhoneNumber) {
            errors.carrierPhoneNumber = 'Please enter a valid carrier phone number'
            return errors
        }

        if (!values.consignor) {
            errors.consignor = 'Please enter a valid consignor name'
            return errors
        }
        if (!values.consignorAddress) {
            errors.consignorAddress = 'Please enter a valid consignor address'
            return errors
        }
        if (!values.consignorCity) {
            errors.consignorCity = 'Please enter a valid consignor city'
            return errors
        }
        if (values.consignorEmail && (!emailPattern.test(values.consignorEmail) || popularEmailPattern.test(values.consignorEmail))) {
            errors.consignorEmail = 'Please enter a valid consignor email address'
            return errors
        }
        if (!values.consignorState) {
            errors.consignorState = 'Please enter a valid consignor state'
            return errors
        }
        if (!values.consignorZipCode) {
            errors.consignorZipCode = 'Please enter a valid consignor zip code'
            return errors
        }
        if (!values.consignorCountry) {
            errors.consignorCountry = 'Please enter a valid consignor country'
            return errors
        }
        if (!values.consignorPhoneNumber) {
            errors.consignorPhoneNumber = 'Please enter a valid consignor phone number'
            return errors
        }

        if (!values.consignee) {
            errors.consignee = 'Please enter a valid consignee name'
            return errors
        }
        if (!values.consigneeAddress) {
            errors.consigneeAddress = 'Please enter a valid consignee address'
            return errors
        }
        if (!values.consigneeCity) {
            errors.consigneeCity = 'Please enter a valid consignee city'
            return errors
        }
        if (values.consigneeEmail && (!emailPattern.test(values.consigneeEmail) || popularEmailPattern.test(values.consigneeEmail))) {
            errors.consigneeEmail = 'Please enter a valid consignee email address'
            return errors
        }
        if (!values.consigneeState) {
            errors.consigneeState = 'Please enter a valid consignee state'
            return errors
        }
        if (!values.consigneeZipCode) {
            errors.consigneeZipCode = 'Please enter a valid consignee zip code'
            return errors
        }
        if (!values.consigneeCountry) {
            errors.consigneeCountry = 'Please enter a valid consignee country'
            return errors
        }
        if (!values.consigneePhoneNumber) {
            errors.consigneePhoneNumber = 'Please enter a valid consignee phone number'
            return errors
        }
        if (!values.pickupDate) {
            errors.pickupDate = 'Please enter a valid pick up date'
            return errors
        }
        if (!values.deliveryDate) {
            errors.deliveryDate = 'Please enter a valid delivery date'
            return errors
        }
        if (!values.referenceNumber) {
            errors.referenceNumber = 'Please enter a valid reference number'
            return errors
        }

        if (!values.proNumber) {
            errors.proNumber = 'Please enter a valid PRO number'
            return errors
        }

        if (this.state.incidentType === 'CLAIM') {
            if (!values.claimantCompany) {
                errors.claimantCompany = 'Please enter a valid claimant company name'
                return errors
            }

            if (!values.claimantEmail || (!emailPattern.test(values.claimantEmail) || popularEmailPattern.test(values.claimantEmail))) {
                errors.claimantEmail = 'Please enter a valid claimant email address'
                return errors
            }

            if (!values.claimantPhoneNumber) {
                errors.claimantPhoneNumber = 'Please enter a valid claimant phone number'
                return errors
            }
            if (!values.claimantAddress) {
                errors.claimantAddress = 'Please enter a valid claimant address'
                return errors
            }
            if (!values.claimantCity) {
                errors.claimantCity = 'Please enter a valid claimant city'
                return errors
            }
            if (!values.claimantState) {
                errors.claimantState = 'Please enter a valid claimant state'
                return errors
            }
            if (!values.claimantZipCode) {
                errors.claimantZipCode = 'Please enter a valid claimant postal code'
                return errors
            }
            if (!values.claimantCountry) {
                errors.claimantCountry = 'Please enter a valid claimant country'
                return errors
            }

            if (!this.state.claimPayableToDisabled) {
                if (!values.claimPayableToCompany) {
                    errors.claimPayableToCompany = 'Please enter a valid claim payable to company name'
                    return errors
                }
                if (!values.claimPayableToAddress) {
                    errors.claimPayableToAddress = 'Please enter a valid claim payable to address'
                    return errors
                }
                if (!values.claimPayableToCity) {
                    errors.claimPayableToCity = 'Please enter a valid claim payable to city'
                    return errors
                }
                if (!values.claimPayableToState) {
                    errors.claimPayableToState = 'Please enter a valid claim payable to state'
                    return errors
                }
                if (!values.claimPayableToZipCode) {
                    errors.claimPayableToZipCode = 'Please enter a valid claim payable to postal code'
                    return errors
                }
                if (!values.claimPayableToCountry) {
                    errors.claimPayableToCountry = 'Please enter a valid claim payable to country'
                    return errors
                }

                if (!values.claimPayableToPhoneNumber) {
                    errors.claimPayableToPhoneNumber = 'Please enter a valid claim payable phone number'
                    return errors
                }
                if (!values.claimPayableToEmail || (!emailPattern.test(values.claimPayableToEmail) || popularEmailPattern.test(values.claimPayableToEmail))) {
                    errors.claimPayableToEmail = 'Please enter a valid claim payable to email address'
                    return errors
                }
            }
        }
        const numberRegEx = /-?\d*\.?\d{1,2}/;

        this.state.commodities.map((commodity) => {

            if (!commodity.condition){
                errors.commodity = 'Missing condition for one or more commodities.'
                this.setState({commodityErrorMessage: 'Missing condition for one or more commodities.'})
                return errors;
            }
            if (!numberRegEx.test(String(commodity.claimedWeight).toLowerCase())){
                errors.commodity = 'Invalid weight for one or more commodities.'
                this.setState({commodityErrorMessage: 'Invalid claimed weight for one or more commodities.'})
                return errors
            }
            if (!numberRegEx.test(String(commodity.pieces).toLowerCase())){
                errors.commodity = 'Invalid number of pieces for one or more commodities.'
                this.setState({commodityErrorMessage: 'Invalid number of pieces for one or more commodities.'})
                return errors
            }
            if (!numberRegEx.test(String(commodity.claimedValue).toLowerCase())){
                errors.commodity = 'Invalid claimed value for one or more commodities.'
                this.setState({commodityErrorMessage: 'Invalid claimed value for one or more commodities.'})
                return errors
            }
            if (!commodity.commodityDescription){
                errors.commodity = 'Missing description for one or more commodities.'
                this.setState({commodityErrorMessage: 'Missing description for one or more commodities.'})
                return errors
            }
        });
        return errors
    }

    componentDidMount() {
        this.getIncident()
        if (this.state.formId < 0) {
            return
        }
        this.setState({disabled: true})
        this.getForm()
    }

    getForm() {
        FormDataService.getForm(this.state.formId, this.state.incidentId)
            .then((response) => {
                let data = response.data;
                if (data.claim) {
                    let claim = data.claim;
                    let claimantData = claim.claimant;
                    let claimRecipientData = claim.claimRecipient;
                    this.setState({
                        claimId: claim.claimId,
                        notes: claim.notes,
                        claimantCompany: claimantData.companyName,
                        claimantFirstName: claimantData.firstName,
                        claimantLastName: claimantData.lastName,
                        claimantEmail: claimantData.email,
                        claimantPhoneNumber: claimantData.phone,
                        claimantAddress: claimantData.address,
                        claimantAddressLine2: claimantData.streetAddress2,
                        claimantCity: claimantData.city,
                        claimantState: claimantData.state,
                        claimantZipCode: claimantData.zipCode,
                        claimantCountry: claimantData.country,
                        claimPayableToCompany: claimRecipientData.companyName,
                        claimPayableToAddress: claimRecipientData.address,
                        claimPayableToAddressLine2: claimRecipientData.streetAddress2,
                        claimPayableToCity: claimRecipientData.city,
                        claimPayableToState: claimRecipientData.state,
                        claimPayableToZipCode: claimRecipientData.zipCode,
                        claimPayableToCountry: claimRecipientData.country,
                        claimPayableToPhoneNumber: claimRecipientData.phone,
                        claimPayableToEmail: claimRecipientData.email
                    })
                }
                let carrierData = data.carrier;
                let consignorData = data.consignor;
                let consigneeData = data.consignee;

                this.setState({
                    carrierId: carrierData.id,
                    carrier: carrierData.companyName,
                    carrierAddress: carrierData.address,
                    carrierCity: carrierData.city,
                    carrierEmail: carrierData.workEmail,
                    carrierState: carrierData.state,
                    carrierZipCode: carrierData.zipCode,
                    carrierCountry: carrierData.country,
                    carrierPhoneNumber: carrierData.phone,
                    consignorId: consignorData.id,
                    consignor: consignorData.companyName,
                    consignorAddress: consignorData.address,
                    consignorCity: consignorData.city,
                    consignorState: consignorData.state,
                    consignorZipCode: consignorData.zipCode,
                    consignorCountry: consignorData.country,
                    consignorPhoneNumber: consignorData.phone,
                    consignorEmail: consignorData.workEmail,
                    consigneeId: consigneeData.id,
                    consignee: consigneeData.companyName,
                    consigneeAddress: consigneeData.address,
                    consigneeCity: consigneeData.city,
                    consigneeState: consigneeData.state,
                    consigneeZipCode: consigneeData.zipCode,
                    consigneeCountry: consigneeData.country,
                    consigneePhoneNumber: consigneeData.phone,
                    consigneeEmail: consigneeData.workEmail,
                    pickupDate: moment(data.pickUpDate).format('YYYY-MM-DD'),
                    deliveryDate: moment(data.deliveryDate).format('YYYY-MM-DD'),
                    referenceNumber: data.referenceNumber,
                    proNumber: data.proNumber,
                    bolNumber: data.bolNumber,
                    poNumber: data.poNumber,
                    commodities: data.commodities
                })
                if (this.state.notes !== null && this.state.notes.length > 0) {
                    this.setState({charsLeft: this.state.maxChars - this.state.notes.length})
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    this.props.history.push('/forms');
                }
                else {
                    this.setState({
                        errorMessage: "An error occurred while retrieving the form. Please contact support at support@claimmunity.com to report the issue."
                    })
                }
            })
    }

    render() {
        let {
            carrier,
            carrierAddress,
            carrierCity,
            carrierEmail,
            carrierState,
            carrierZipCode,
            carrierCountry,
            carrierPhoneNumber,
            consignor,
            consignorAddress,
            consignorCity,
            consignorEmail,
            consignorState,
            consignorZipCode,
            consignorCountry,
            consignorPhoneNumber,
            consignee,
            consigneeAddress,
            consigneeCity,
            consigneeEmail,
            consigneeState,
            consigneeZipCode,
            consigneeCountry,
            consigneePhoneNumber,
            pickupDate,
            deliveryDate,
            referenceNumber,
            proNumber,
            bolNumber,
            poNumber,
            claimantCompany,
            claimantFirstName,
            claimantLastName,
            claimantEmail,
            claimantPhoneNumber,
            claimantAddress,
            claimantAddressLine2,
            claimantCity,
            claimantState,
            claimantZipCode,
            claimantCountry,
            claimPayableToCompany,
            claimPayableToAddress,
            claimPayableToAddressLine2,
            claimPayableToCity,
            claimPayableToState,
            claimPayableToZipCode,
            claimPayableToCountry,
            claimPayableToPhoneNumber,
            claimPayableToEmail,
            notes
        } = this.state

        return <>
            <div className="container">

                <Formik initialValues={
                    {
                        carrier,
                        carrierAddress,
                        carrierCity,
                        carrierEmail,
                        carrierState,
                        carrierZipCode,
                        carrierCountry,
                        carrierPhoneNumber,
                        consignor,
                        consignorAddress,
                        consignorCity,
                        consignorEmail,
                        consignorState,
                        consignorZipCode,
                        consignorCountry,
                        consignorPhoneNumber,
                        consignee,
                        consigneeAddress,
                        consigneeCity,
                        consigneeEmail,
                        consigneeState,
                        consigneeZipCode,
                        consigneeCountry,
                        consigneePhoneNumber,
                        pickupDate,
                        deliveryDate,
                        referenceNumber,
                        proNumber,
                        bolNumber,
                        poNumber,
                        claimantCompany,
                        claimantFirstName,
                        claimantLastName,
                        claimantEmail,
                        claimantPhoneNumber,
                        claimantAddress,
                        claimantAddressLine2,
                        claimantCity,
                        claimantState,
                        claimantZipCode,
                        claimantCountry,
                        claimPayableToCompany,
                        claimPayableToAddress,
                        claimPayableToAddressLine2,
                        claimPayableToCity,
                        claimPayableToState,
                        claimPayableToZipCode,
                        claimPayableToCountry,
                        claimPayableToPhoneNumber,
                        claimPayableToEmail,
                        notes
                    }
                }
                        onSubmit={this.onSubmit}
                        validate={this.validate}
                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize={true}
                >
                    {
                        (props) => (
                            <Form autocomplete="on">

                                <div className="page-top">
                                    <div className="row btn-group float-sm-right">
                                        <div className="col mr-0 bg-app">
                                            <button type="button" className="btn-rounded btn-light"
                                                    onClick={() => this.props.history.push(`/forms`)}>
                                                Go to forms
                                            </button>
                                        </div>


                                        {(this.state.formId > 0 && this.state.disabled === true) &&
                                        <div className="col ml-0 bg-app">
                                            <button type="button" onClick={this.enableFormForEdit}
                                                    className="btn-rounded btn-light">Edit
                                            </button>
                                        </div>}
                                        {(this.state.formId < 0 || this.state.disabled === false) &&
                                        <div className="col ml-0 bg-app">
                                            <button type="submit" className="btn-rounded btn-light">Save</button>
                                        </div>}
                                    </div>
                                </div>

                                <div className="error">
                                    {
                                        this.state.errorMessage &&
                                        <div className="alert alert-danger">{this.state.errorMessage}</div>}
                                    {this.state.commodityErrorMessage && <div className="alert alert-warning">{this.state.commodityErrorMessage}</div>}
                                    <ErrorMessage name="carrier" component="div" className="alert alert-warning"/>
                                    <ErrorMessage name="carrierAddress" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="carrierCity" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="carrierState" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="carrierCountry" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="carrierZipCode" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="carrierPhoneNumber" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consignor" component="div" className="alert alert-warning"/>
                                    <ErrorMessage name="consignorAddress" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consignorCity" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consignorState" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consignorCountry" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consignorZipCode" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consignorPhoneNumber" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consignee" component="div" className="alert alert-warning"/>
                                    <ErrorMessage name="consigneeAddress" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consigneeCity" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consigneeState" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consigneeCountry" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consigneeZipCode" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consigneePhoneNumber" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="referenceNumber" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="proNumber" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimantCompany" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimantEmail" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimantPhoneNumber" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimantAddress" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimantCity" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimantState" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimantZipCode" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimantCountry" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimPayableToCompany" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimPayableToAddress" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimPayableToCity" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimPayableToState" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimPayableToZipCode" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="claimPayableToCountry" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="carrierEmail" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consignorEmail" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="consigneeEmail" component="div"
                                                  className="alert alert-warning"/>
                                    <ErrorMessage name="commodity" component="div"
                                                  className="alert alert-warning"/>
                                </div>

                                <div className="form-div">

                                    {this.state.incidentType === 'CLAIM' &&
                                    <>

                                        <div className="row row-line-height">
                                            <div className="col-sm-6 ml-0 mt-3">
                                                <div className="form-group form-group-custom-claimant">
                                                    <h6>Claimant</h6>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 mt-3">
                                                <div className="form-group form-group-custom-claimant">
                                                    <h6>Claim Payable To</h6>
                                                </div>
                                                <div className="float-sm-right pr-5">
                                                    <input disabled={this.state.disabled} className="form-check-input"
                                                           type="checkbox"
                                                           id="sameAsClaimant"
                                                           onChange={() => this.setState({claimPayableToDisabled: !this.state.claimPayableToDisabled})}/>
                                                    <label
                                                           htmlFor="sameAsClaimant" className="mb-3 mt-2">Same as
                                                        Claimant</label>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="row row-line-height">
                                            <div className="col-sm-6 ml-0 pt-0">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label required">Company</label>
                                                    <Field disabled={this.state.disabled} id="claimantCompany"
                                                           className="form-control form-control-sm" type="text"
                                                           name="claimantCompany"/>
                                                </div>
                                            </div>

                                            <div className="col-sm-6 pt-0">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label required">Company or individual</label>
                                                    <Field
                                                        disabled={this.state.disabled || this.state.claimPayableToDisabled}
                                                        id="claimPayableToCompany"
                                                        className="form-control form-control-sm" type="text"
                                                        name="claimPayableToCompany"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row row-line-height">
                                            <div className="form-group form-group-small col-sm-4">
                                                <label className="form-label">First Name</label>
                                                <Field disabled={this.state.disabled}
                                                       id="claimantFirstName"
                                                       className="form-control form-control-sm" type="text"
                                                       name="claimantFirstName" placeholder="First"/>
                                            </div>

                                            <div className="form-group form-group-small mr-1">
                                                <label className="form-label">Last Name</label>
                                                <Field disabled={this.state.disabled}
                                                       id="claimantLastName"
                                                       className="form-control form-control-sm field-margin-left"
                                                       type="text"
                                                       name="claimantLastName" placeholder=" Last Name"/>
                                            </div>

                                            <div className="col-sm-6 pl-5 pt-0">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label required">Mailing Address</label>
                                                    <Field
                                                        disabled={this.state.disabled || this.state.claimPayableToDisabled}
                                                        id="claimPayableToAddress"
                                                        className="form-control form-control-sm" type="text"
                                                        name="claimPayableToAddress"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row row-line-height">
                                            <div className="col ml-0 pt-0">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label required">Email</label>
                                                    <Field disabled={this.state.disabled} id="claimantEmail"
                                                           className="form-control form-control-sm" type="text"
                                                           name="claimantEmail" placeholder="name@email.com"/>
                                                </div>
                                            </div>

                                            <div className="col pt-0">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label">Address Line 2</label>
                                                    <Field
                                                        disabled={this.state.disabled || this.state.claimPayableToDisabled}
                                                        id="claimPayableToAddressLine2"
                                                        className="form-control form-control-sm" type="text"
                                                        name="claimPayableToAddressLine2"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row row-line-height">
                                            <div className="col ml-0 pt-0">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label required">Phone #</label>
                                                    <Field disabled={this.state.disabled} id="claimantPhoneNumber"
                                                           className="form-control form-control-sm" type="text"
                                                           name="claimantPhoneNumber" placeholder="###-###-####"/>
                                                </div>
                                            </div>

                                            <div className="col pt-0">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label required">City</label>
                                                    <Field
                                                        disabled={this.state.disabled || this.state.claimPayableToDisabled}
                                                        id="claimPayableToCity"
                                                        className="form-control form-control-sm" type="text"
                                                        name="claimPayableToCity"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row row-line-height">
                                            <div className="col-sm-6 ml-0 pt-0 mr-0 pr-0">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label required">Address</label>
                                                    <Field disabled={this.state.disabled} id="claimantAddress"
                                                           className="form-control form-control-sm" type="text"
                                                           name="claimantAddress"/>
                                                </div>
                                            </div>

                                            <div className="form-group form-group-small col-sm-4">
                                                <label className="form-label required">State/Province</label>
                                                <Field
                                                    disabled={this.state.disabled || this.state.claimPayableToDisabled}
                                                    id="claimPayableToState"
                                                    className="form-control form-control-sm" type="text"
                                                    name="claimPayableToState"/>
                                            </div>

                                            <div className="form-group form-group-small">
                                                <label className="form-label required">Postal Code</label>
                                                <Field
                                                    disabled={this.state.disabled || this.state.claimPayableToDisabled}
                                                    id="claimPayableToZipCode"
                                                    className="form-control form-control-sm field-margin-left"
                                                    type="text"
                                                    name="claimPayableToZipCode"/>
                                            </div>
                                        </div>

                                        <div className="row row-line-height">
                                            <div className="col ml-0 pt-0">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label">Address Line 2</label>
                                                    <Field disabled={this.state.disabled} id="claimantAddressLine2"
                                                           className="form-control form-control-sm" type="text"
                                                           name="claimantAddressLine2"/>
                                                </div>
                                            </div>

                                            <div className="col pt-0">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label required">Country</label>
                                                    <Field
                                                        disabled={this.state.disabled || this.state.claimPayableToDisabled}
                                                        id="claimPayableToCountry"
                                                        className="form-control form-control-sm" type="text"
                                                        name="claimPayableToCountry"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row row-line-height">
                                            <div className="col ml-0 pt-0">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label required">City</label>
                                                    <Field disabled={this.state.disabled} id="claimantCity"
                                                           className="form-control form-control-sm" type="text"
                                                           name="claimantCity"/>
                                                </div>
                                            </div>

                                            <div className="col pt-0">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label required">Phone #</label>
                                                    <Field
                                                        disabled={this.state.disabled || this.state.claimPayableToDisabled}
                                                        id="claimPayableToPhoneNumber"
                                                        className="form-control form-control-sm" type="text"
                                                        name="claimPayableToPhoneNumber" placeholder="###-###-####"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row row-line-height">
                                            <div className="form-group form-group-small col-sm-4">
                                                <label className="form-label required">State/Province</label>
                                                <Field disabled={this.state.disabled}
                                                       id="claimantState"
                                                       className="form-control form-control-sm" type="text"
                                                       name="claimantState"/>
                                            </div>

                                            <div className="form-group form-group-small mr-1">
                                                <label className="form-label required">Postal Code</label>
                                                <Field disabled={this.state.disabled}
                                                       id="claimantZipCode"
                                                       className="form-control form-control-sm field-margin-left"
                                                       type="text"
                                                       name="claimantZipCode"/>
                                            </div>

                                            <div className="col pl-5">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label required">Email</label>
                                                    <Field
                                                        disabled={this.state.disabled || this.state.claimPayableToDisabled}
                                                        id="claimPayableToEmail"
                                                        className="form-control form-control-sm" type="text"
                                                        name="claimPayableToEmail" placeholder="name@email.com"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row row-line-height">
                                            <div className="col ml-0 pt-0 pb-0">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label required">Country</label>
                                                    <Field disabled={this.state.disabled} id="claimantCountry"
                                                           className="form-control form-control-sm" type="text"
                                                           name="claimantCountry"/>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group-custom-claimant" >
                                                    <hr/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row row-line-height">
                                            <div className="col ml-0">
                                                <div className="form-group form-group-custom-claimant">
                                                </div>
                                            </div>
                                            <div className="col ml-2 field-textarea">
                                                <div className="form-group form-group-custom-claimant">
                                                    <label className="form-label font-weight-bold font-weight-bolder">Notes
                                                        & Comments</label>
                                                    <Field maxLength={this.state.maxChars} type="text"
                                                           disabled={this.state.disabled}
                                                           component="textarea"
                                                           className="form-control" id="notes" name="notes"
                                                           rows="4"/>
                                                    {/*<p><span className="float-sm-right">Characters Left: {this.state.charsLeft} / {this.state.maxChars}</span></p>*/}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row ml-0">
                                            <hr/>
                                        </div>
                                    </>
                                    }

                                    <div className="row row-line-height">
                                        <div className="col ml-0 mt-1">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label font-weight-bold required">Carrier</label>
                                                <Field disabled={this.state.disabled} id="carrier"
                                                       className="form-control form-control-sm" type="text"
                                                       name="carrier"/>
                                            </div>
                                        </div>

                                        <div className="col ml-0 mt-1">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label font-weight-bold required"><b>Consignor</b></label>
                                                <Field disabled={this.state.disabled} id="carrier"
                                                       className="form-control form-control-sm" type="text"
                                                       name="consignor"/>
                                            </div>
                                        </div>

                                        <div className="col ml-0 mt-1">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label font-weight-bold required"><b>Consignee</b></label>
                                                <Field disabled={this.state.disabled} id="carrier"
                                                       className="form-control form-control-sm" type="text"
                                                       name="consignee"/>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row row-line-height">

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label required">Address</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text"
                                                       name="carrierAddress"/>
                                            </div>
                                        </div>

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label required">Address</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text"
                                                       name="consignorAddress"/>
                                            </div>
                                        </div>

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label required">Address</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text"
                                                       name="consigneeAddress"/>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row row-line-height">

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label required">City</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text" name="carrierCity"/>
                                            </div>
                                        </div>

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label required">City</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text"
                                                       name="consignorCity"/>
                                            </div>
                                        </div>

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label required">City</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text"
                                                       name="consigneeCity"/>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row row-line-height">

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label">Email</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text" name="carrierEmail"/>
                                            </div>
                                        </div>

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label">Email</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text"
                                                       name="consignorEmail"/>
                                            </div>
                                        </div>

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label">Email</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text"
                                                       name="consigneeEmail"/>
                                            </div>
                                        </div>

                                    </div>


                                    <div className="row row-line-height ml-0">

                                        <div className="form-group form-group-state first mt-1">
                                            <label className="form-label required">State/Province</label>
                                            <Field disabled={this.state.disabled}
                                                   id="carrierState"
                                                   className="form-control form-control-sm" type="text"
                                                   name="carrierState"/>
                                        </div>
                                        <div className="form-group form-group-zip field-margin-right mt-1">
                                            <label className="form-label required">Zip</label>
                                            <Field disabled={this.state.disabled}
                                                   id="carrierZipCode"
                                                   className="form-control form-control-sm" type="text"
                                                   name="carrierZipCode"/>
                                        </div>

                                        <div className="form-group form-group-state mt-1">
                                            <label className="form-label required">State/Province</label>
                                            <Field disabled={this.state.disabled}
                                                   id="consignorState"
                                                   className="form-control form-control-sm" type="text"
                                                   name="consignorState"/>
                                        </div>
                                        <div className="form-group form-group-zip field-margin-right mt-1">
                                            <label className="form-label required">Zip</label>
                                            <Field disabled={this.state.disabled}
                                                   id="consignorZipCode"
                                                   className="form-control form-control-sm" type="text"
                                                   name="consignorZipCode"/>
                                        </div>

                                        <div className="form-group form-group-state mt-1">
                                            <label className="form-label required">State/Province</label>
                                            <Field disabled={this.state.disabled}
                                                   id="consigneeState"
                                                   className="form-control form-control-sm" type="text"
                                                   name="consigneeState"/>
                                        </div>
                                        <div className="form-group form-group-zip mt-1">
                                            <label className="form-label required">Zip</label>
                                            <Field disabled={this.state.disabled}
                                                   id="consigneeZipCode"
                                                   className="form-control form-control-sm" type="text"
                                                   name="consigneeZipCode"/>
                                        </div>
                                    </div>

                                    <div className="row row-line-height">

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label required">Country</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text"
                                                       name="carrierCountry"/>
                                            </div>
                                        </div>

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label required">Country</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text"
                                                       name="consignorCountry"/>
                                            </div>
                                        </div>

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label required">Country</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text"
                                                       name="consigneeCountry"/>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row row-line-height">

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label required">Phone #</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text" name="carrierPhoneNumber"/>
                                            </div>
                                        </div>

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label required">Phone #</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text"
                                                       name="consignorPhoneNumber"/>
                                            </div>
                                        </div>

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom">
                                                <label className="form-label required">Phone #</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-sm"
                                                       type="text"
                                                       name="consigneePhoneNumber"/>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row row-line-height">

                                        <div className="col ml-0">
                                            <div className="form-group form-group-custom"/>
                                        </div>

                                        <div className="col ml-0">
                                            <div className="form-group form-group-mid">
                                                <label className="form-label required">Pick Up Date</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-date"
                                                       type="date"
                                                       name="pickupDate"/>
                                            </div>
                                        </div>

                                        <div className="col">
                                            <div className="form-group form-group-mid">
                                                <label className="form-label required">Delivery Date</label>
                                                <Field disabled={this.state.disabled}
                                                       className="form-control form-control-date"
                                                       type="date"
                                                       name="deliveryDate"/>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row ml-4">
                                        <hr/>
                                    </div>

                                    <div className="row row-line-height pr-4">

                                        <div className="form-group form-group-mid ml-5">
                                            <label className="form-label required">Reference #</label>
                                            <Field disabled={this.state.disabled}
                                                   className="form-control form-control-sm"
                                                   type="text"
                                                   name="referenceNumber"/>
                                        </div>

                                        <div className="form-group form-group-mid ml-3">
                                            <label className="form-label required">PRO #</label>
                                            <Field disabled={this.state.disabled}
                                                   className="form-control form-control-sm"
                                                   type="text"
                                                   name="proNumber"/>
                                        </div>

                                        <div className="form-group form-group-mid ml-3">
                                            <label className="form-label">BOL #</label>
                                            <Field disabled={this.state.disabled}
                                                   className="form-control form-control-sm"
                                                   type="text"
                                                   name="bolNumber"/>
                                        </div>

                                        <div className="form-group form-group-mid ml-3">
                                            <label className="form-label">PO #</label>
                                            <Field disabled={this.state.disabled}
                                                   className="form-control form-control-sm"
                                                   type="text"
                                                   name="poNumber"/>
                                        </div>

                                    </div>

                                </div>

                                <FormikErrorFocus
                                    offset={0}
                                    align={'top'}
                                    ease={'linear'}
                                    duration={1000}

                                />
                            </Form>
                        )
                    }

                </Formik>

            </div>

            <div className="container-lg commodities">
                <div className="card">
                    <div className="card-header"><h4>Commodity Details</h4></div>
                    <div className="card-body">
                        <ListGroup>
                            {this.state.commodities.map((commodity, index) => {
                                return <ListGroup.Item><CommodityComponent disabled={this.state.disabled}
                                                                           commodity={commodity}
                                                                           count={index}
                                                                           key={commodity.id}
                                                                           removeCommodity={this.removeCommodity}
                                                                           onChange={this.onChange.bind(this)}
                                /></ListGroup.Item>
                            })
                            }
                        </ListGroup>
                    </div>
                    <div className="card-footer">
                        <input type="button" value="+New Commodity" className="float-sm-left btn btn-primary"
                               onClick={this.handleAddChild}/>
                    </div>
                </div>
            </div>

        </>
    }
}

export default FormComponent;