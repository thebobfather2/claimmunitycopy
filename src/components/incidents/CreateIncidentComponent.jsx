import React, {Component} from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import IncidentDataService from "../../api/IncidentDataService";
import '../../static/css/CreateIncidentComponent.css';

class CreateIncidentComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            claimmunityNumber: 'SYSTEM GENERATED ID #',
            incidentType: '',
            mode: '',
            vendorName: '',
            referenceNumber: ''
        }
        this.validate = this.validate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(values) {

        let request = {
            type: values.incidentType,
            mode: values.mode,
            vendor: values.vendorName,
            referenceNumber: values.referenceNumber
        }

        IncidentDataService.createIncident(request)
            .then(response => this.props.history.push(`/task-management-board/${response.data}`))
    }

    validate(values) {
        let errors = {}
        if (!values.incidentType) {
            errors.incidentType = 'Please enter an incident type'
        }
        if (!values.mode) {
            errors.mode = 'Please enter a mode'
        }
        if (!values.vendorName) {
            errors.vendorName = 'Please enter a valid vendor name'
        }
        if (!values.referenceNumber) {
            errors.referenceNumber = 'Please enter a valid reference number'
        }

        return errors
    }

    render() {

        let {claimmunityNumber, incidentType, mode, vendorName, referenceNumber} = this.state

        return <div className="container">

            <div className="page-top">
                <div className="pull-right bg-app">
                    <button type="button" className="btn-rounded btn-light"
                            onClick={() => this.props.history.push(`/task-board`)}>View Incidents
                    </button>
                </div>

            <div className="create-incident row-cols-sm-6">

                <div className="col-sm mt-5">

                    <h2>Create new incident</h2>

                    <Formik initialValues={
                        {claimmunityNumber, incidentType, mode, vendorName, referenceNumber}
                    }
                            onSubmit={this.onSubmit}
                            validate={this.validate}
                            validateOnBlur={false}
                            validateOnChange={false}
                            enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <ErrorMessage name="incidentType" component="div" className="alert-warning"/>
                                    <ErrorMessage name="mode" component="div" className="alert-warning"/>
                                    <ErrorMessage name="vendorName" component="div" className="alert-warning"/>
                                    <ErrorMessage name="referenceNumber" component="div"
                                                  className="alert-warning"/>

                                    <fieldset>
                                        <label>Claimmunity #</label>
                                        <Field className="form-control" type="text" name="claimmunityNumber"
                                               readOnly/>
                                    </fieldset>
                                    <fieldset>
                                        <label>Incident type</label>
                                        <Field as='select' className="form-control" type="text" name="incidentType">
                                            <option value=""/>
                                            <option value="OSD">OSD</option>
                                            <option value="CLAIM">Claim</option>
                                        </Field>
                                    </fieldset>
                                    <fieldset>
                                        <label>Mode</label>
                                        <Field as='select' className="form-control" type="text" name="mode">
                                            <option value=""/>
                                            <option value="LTL">LTL</option>
                                            <option value="FTL">FTL</option>
                                        </Field>
                                    </fieldset>
                                    <fieldset>
                                        <label>Vendor name</label>
                                        <Field className="form-control" type="text" name="vendorName">
                                        </Field>
                                    </fieldset>
                                    <fieldset>
                                        <label>Reference #</label>
                                        <Field className="form-control" type="text" name="referenceNumber"/>
                                    </fieldset>
                                    <br/>
                                    <button className="btn btn-primary" type="submit">Start Incident</button>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
            </div>
            </div>
        </div>
    }
}


export default CreateIncidentComponent;