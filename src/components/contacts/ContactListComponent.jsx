import React, {Component} from "react";
import '../../static/css/ContactListComponent.css';
import ContactDataService from "../../api/ContactDataService";

class ContactListComponent extends Component {

    constructor(props) {
        super(props);
        this.showContactForm = this.showContactForm.bind(this)
        this.getContacts = this.getContacts.bind(this)
        this.searchContact = this.searchContact.bind(this)
        this.clearSearch = this.clearSearch.bind(this)
        this.delete = this.delete.bind(this)
        this.saveContact = this.saveContact.bind(this)
        this.clearForm = this.clearForm.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state = {
            selectedContact: '',
            contactId: '',
            firstName: null,
            lastName: null,
            companyAddress: null,
            companyName: null,
            companyCity: null,
            companyState: null,
            companyZipCode: null,
            companyCountry: null,
            insuranceName: null,
            insuranceContact: null,
            email: null,
            mobilePhone: null,
            workPhone: null,
            notes: null,
            originalContacts: [],
            contacts: [],
            showClearSearch: false,
            selected: false,
            disabled: false,
            editing: false,
            errorMessage: '',
            successMessage: ''
        }
    }

    clearForm(editing) {
        this.setState({
            selectedContact: null,
            contactId: '',
            firstName: '',
            lastName: '',
            companyAddress: '',
            companyName: '',
            companyCity: '',
            companyState: '',
            companyZipCode: '',
            companyCountry: '',
            insuranceName: '',
            insuranceContact: '',
            email: '',
            mobilePhone: '',
            workPhone: '',
            notes: '',
            selected: false,
            editing: editing,
            disabled: false
        })

        this.showContactForm()
    }

    saveContact() {

        if (this.state.companyName === '') {
            this.setState({errorMessage: 'Please enter a valid company name'})
            return
        }

        if (this.state.companyAddress === '') {
            this.setState({errorMessage: 'Please enter a valid company address'})
            return
        }

        if (this.state.companyCity === '') {
            this.setState({errorMessage: 'Please enter a valid company city'})
            return
        }

        if (this.state.companyState === '') {
            this.setState({errorMessage: 'Please enter a valid company state'})
            return
        }

        if (this.state.companyZipCode === '') {
            this.setState({errorMessage: 'Please enter a valid company postal code'})
            return
        }

        let contact = {
            companyAddress: this.state.companyAddress,
            companyCity: this.state.companyCity,
            companyCountry: this.state.companyCountry,
            companyName: this.state.companyName,
            companyState: this.state.companyState,
            companyZipCode: this.state.companyZipCode,
            contactEmail: this.state.email !== '' ? this.state.email : null,
            contactMobilePhone: this.state.mobilePhone !== '' ? this.state.mobilePhone : null,
            contactWorkPhone: this.state.workPhone !== '' ? this.state.workPhone : null,
            firstName: this.state.firstName !== '' ? this.state.firstName : null,
            insurance: this.state.insuranceName !== '' ? this.state.insuranceName : null,
            insuranceContact: this.state.insuranceContact !== '' ? this.state.insuranceContact : null,
            lastName: this.state.lastName !== '' ? this.state.lastName : null,
            notes: this.state.notes !== '' ? this.state.notes : null
        }

        if (this.state.contactId !== '' && this.state.contactId > 0){
            ContactDataService.updateContact(this.state.contactId, contact)
                .then(() => this.setState({successMessage: 'Your contact has been updated.', selected: true,
                    editing: false,
                    disabled: true}))
                .then(() => this.getContacts())
                .catch(() => this.setState({errorMessage: 'An error occurred while updating your contact. Please contact support at support@claimmunity.com to report the issue.'}))
        }

        else{
            ContactDataService.createContact(contact)
                .then(response => this.setState({successMessage: 'Your contact has been updated.', selected: true,
                    editing: false,
                    disabled: true, userId: response.data.id}))
                .then(() => this.getContacts())
                .catch(() => this.setState({errorMessage: 'An error occurred while creating your contact. Please contact support at support@claimmunity.com to report the issue.'}))
        }

    }

    delete(id) {

        if (window.confirm("Are you sure you want to delete contact?")) {
            ContactDataService.deleteContact(id)
                .then(() => this.clearForm(false))
                .then(() => this.getContacts())
                .then(() => document.getElementById("contactForm").style.display = "none")
                .catch(() => this.setState({errorMessage: 'Error occurred while deleting your contact. Please contact support at support@claimmunity.com to report the issue.'}))
        }

    }

    clearSearch() {
        this.setState({contacts: this.state.originalContacts, showClearSearch: false})
        document.getElementById('search-input').value = ''
    }

    searchContact() {
        let searchValue = document.getElementById('search-input').value
        const re = new RegExp(searchValue, 'i');
        const filtered = this.state.originalContacts.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.match(re)));
        if (filtered !== null) {
            this.setState({
                contacts: filtered,
                showClearSearch: true
            })
        }
    }

    updateSelectedContact(contact) {

        this.setState(
            {
                selectedContact: contact,
                selected: true,
                contactId: contact != null ? contact.id: '',
                firstName: contact != null ? contact.firstName : null,
                lastName: contact != null ? contact.lastName : null,
                companyAddress: contact != null ? contact.companyAddress : null,
                companyName: contact != null ? contact.companyName : null,
                companyCity: contact != null ? contact.companyCity : null,
                companyState: contact != null ? contact.companyState : null,
                companyZipCode: contact != null ? contact.companyZipCode : null,
                companyCountry: contact != null ? contact.companyCountry: null,
                insuranceName: (contact != null && contact.insurance !== null) ? contact.insurance : null,
                insuranceContact: (contact != null && contact.insuranceContact !== null) ? contact.insuranceContact : null,
                email: (contact != null && contact.contactEmail !== null) ? contact.contactEmail : null,
                mobilePhone: (contact != null && contact.contactMobilePhone !== null) ? contact.contactMobilePhone : null,
                workPhone: (contact != null && contact.contactWorkPhone !== null) ? contact.contactWorkPhone : null,
                notes: (contact != null && contact.notes !== null) ? contact.notes : null,
                disabled: true,
                editing: false,
                showForm: true
            })

        this.showContactForm()
    }

    showContactForm() {
        document.getElementById("contactForm").style.display = 'block'
    }

    componentDidMount() {
        this.getContacts()
    }

    getContacts() {
        ContactDataService.getContacts().then(response =>
            this.setState({originalContacts: response.data, contacts: response.data}))
    }

    handleChange(event) {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return <div className="container app contact-list-div">
            {this.state.errorMessage &&
            <div className="alert alert-warning">{this.state.errorMessage}</div>
            }

            <div className="row app-one">
                <div className="col-sm-4 side">
                    <div className="side-one">

                        <div className="row searchBox">
                            <div className="col-sm-12 searchBox-inner">
                                <div className="input-group">
                                    <input className="form-control py-2 border-right-0 border" type="search"
                                           id="search-input" placeholder="Search Contacts"/>
                                    {this.state.showClearSearch &&
                                    <span className="input-group-append">
                                        <div className="input-group-text bg-transparent"> <i className="fa fa-times"
                                                                                             onClick={this.clearSearch}/></div>
                                    </span>
                                    }
                                    <span className="input-group-append">
                                        <div className="input-group-text bg-transparent"><i className="fa fa-search"
                                                                                            onClick={this.searchContact}/></div>
                                    </span>

                                </div>
                            </div>
                        </div>

                        <div className="row sideBar">
                            {
                                this.state.contacts.map(
                                    contact => {
                                        return (<div className="row sideBar-body" key={contact.userId}
                                                     onClick={() => this.updateSelectedContact(contact)}>
                                            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                                                <div className="avatar-icon">
                                                    <img alt="avatar"
                                                         src="https://avatarfiles.alphacoders.com/180/180396.jpg"/>
                                                </div>
                                            </div>
                                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                                <div className="row">
                                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                                                        <span
                                                            className="name-meta">{contact.firstName !== undefined ? contact.firstName + ' ' + contact.lastName : contact.companyName}</span>
                                                    </div>
                                                    <div className="col-sm-4 col-xs-8 pull-right sideBar-time">
                  <span className="time-meta pull-right">
                      <i onClick={() => this.delete(contact.id)} className="fa fa-close"/>
                </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)
                                    })}

                        </div>
                    </div>

                </div>

                <div className="col-sm-8 conversation">

                <div className="form-group row">
                                <div className="col-sm-4 mt-2">
                                    {this.state.selected &&

                                    <span className="name-meta mr-2 float-sm-left ml-2 font-weight-bold">
                                {this.state.firstName !== '' && this.state.firstName !== undefined ? this.state.firstName + ' ' + this.state.lastName : this.state.companyName}
                            </span>}
                                    {this.state.selected && !this.state.editing &&
                                    <i className="fa fa-edit mr-2 float-sm-left mt-2"
                                       onClick={() => this.setState({disabled: false, editing: true})}/>
                                    }
                                    {this.state.selected && !this.state.editing &&
                                    <i className="fa fa-close float-sm-left mt-2"
                                       onClick={() => this.delete(this.state.contactId)}/>
                                    }

                                </div>


                        {!this.state.editing &&
                        <div className="col-sm-7">
                            <button className="btn-rounded btn-primary pull-right mt-4"
                                    onClick={() => this.clearForm(true)}>
                                Add New Contact
                            </button>

                        </div>
                        }

                        {this.state.editing &&
                        <div className="col-sm-7 pull-right">
                            <i className="fa fa-close pull-right mt-2" onClick={() => this.updateSelectedContact(this.state.selectedContact)}/>
                            <i className="fa fa-check pull-right mr-2 mt-2" onClick={this.saveContact}/>
                        </div>
                        }
                    </div>

                    <div id="contactForm" className="contact-form">
                        <form onChange={() => this.state.errorMessage !== '' && this.setState({errorMessage: ''})}>

                            <div className="form-group row">
                                <label htmlFor="firstName" className="col-sm-4 col-form-label">First
                                    Name:</label>
                                <div className="col-sm-7">
                                    <input disabled={this.state.disabled} type="text" className="form-control"
                                           name="firstName"
                                           placeholder="First Name" value={this.state.firstName}
                                           onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="lastName" className="col-sm-4 col-form-label">Last
                                    Name:</label>
                                <div className="col-sm-7">
                                    <input disabled={this.state.disabled} type="text" className="form-control"
                                           name="lastName"
                                           placeholder="Last Name" value={this.state.lastName}
                                           onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="company" className="col-sm-4 col-form-label required">Company
                                    Name:</label>
                                <div className="col-sm-7">
                                    <input disabled={this.state.disabled} type="text" className="form-control"
                                           id="companyName" name="companyName"
                                           placeholder="Company" value={this.state.companyName}
                                           onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="companyAddress" className="col-sm-4 col-form-label required">Company
                                    Address:</label>
                                <div className="col-sm-7">
                                    <input disabled={this.state.disabled} type="text" className="form-control"
                                           name="companyAddress"
                                           placeholder="Company Address" value={this.state.companyAddress}
                                           onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="companyCity" className="col-sm-4 col-form-label required">City:</label>
                                <div className="col-sm-7">
                                    <input disabled={this.state.disabled} type="text" className="form-control"
                                           name="companyCity"
                                           placeholder="Company City" value={this.state.companyCity}
                                           onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="state" className="col-sm-4 col-form-label required">State:</label>
                                <div className="col-sm-7">
                                    <input disabled={this.state.disabled} type="text" className="form-control"
                                           name="companyState"
                                           placeholder="Company State" value={this.state.companyState}
                                           onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="zipCode" className="col-sm-4 col-form-label required">Postal
                                    Code:</label>
                                <div className="col-sm-7">
                                    <input disabled={this.state.disabled} type="text" className="form-control"
                                           name="companyZipCode"
                                           placeholder="Company Postal Code" value={this.state.companyZipCode}
                                           onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="country" className="col-sm-4 col-form-label required">Country</label>
                                <div className="col-sm-7">
                                    <input disabled={this.state.disabled} type="text" className="form-control"
                                           name="companyCountry"
                                           placeholder="Country" value={this.state.companyCountry}
                                           onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="insurance" className="col-sm-4 col-form-label">Insurance:</label>
                                <div className="col-sm-7">
                                    <input disabled={this.state.disabled} type="text" className="form-control"
                                           name="insuranceName"
                                           placeholder="Insurance" value={this.state.insuranceName}
                                           onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="insuranceContact" className="col-sm-4 col-form-label">Insurance
                                    Contact:</label>
                                <div className="col-sm-7">
                                    <input disabled={this.state.disabled} type="text" className="form-control"
                                           name="insuranceContact"
                                           placeholder="Insurance Contact"
                                           value={this.state.insuranceContact} onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="email" className="col-sm-4 col-form-label">Email:</label>
                                <div className="col-sm-7">
                                    <input disabled={this.state.disabled} type="text" className="form-control"
                                           name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="mobile" className="col-sm-4 col-form-label">Mobile:</label>
                                <div className="col-sm-7">
                                    <input disabled={this.state.disabled} type="text" className="form-control"
                                           name="mobilePhone" placeholder="Mobile" value={this.state.mobilePhone} onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="work" className="col-sm-4 col-form-label">Work:</label>
                                <div className="col-sm-7">
                                    <input disabled={this.state.disabled} type="text" className="form-control" name="workPhone"
                                           placeholder="Work Phone" value={this.state.workPhone} onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="notes" className="col-sm-4 col-form-label">Notes:</label>
                                <div className="col-sm-7">
                                    <textarea disabled={this.state.disabled} rows="4" className="form-control"
                                              name="notes" placeholder="Notes about the contact"
                                              value={this.state.notes} onChange={this.handleChange}/>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>


    }
}

export default ContactListComponent;