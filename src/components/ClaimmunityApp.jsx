import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LoginComponent from "./authentication/LoginComponent";
import ErrorComponent from "./ErrorComponent";
import ForgotPasswordComponent from "./authentication/ForgotPasswordComponent";
import SignUpComponent from "./authentication/SignUpComponent";
import AuthenticatedRoute from "./authentication/AuthenticatedRoute";
import TaskBoardComponent from "./incidents/TaskBoardComponent";
import CreateIncidentComponent from "./incidents/CreateIncidentComponent";
import TaskManagementBoard from "./incidents/TaskManagementBoard";
import FormsListComponent from "./forms/FormsListComponent";
import FormComponent from "./forms/FormComponent";
import DocHubListComponent from "./forms/DocHubListComponent";
import DocHubComponent from "./forms/DocHubComponent";
import DashboardComponent from "./dashboard/DashboardComponent";
import InvoiceComponent from "./payments/InvoiceComponent";
import InvoiceListComponent from "./payments/InvoiceListComponent";
import ContactListComponent from "./contacts/ContactListComponent";
import SettingsComponent from "./settings/SettingsComponent";
import ActivateUserComponent from "./authentication/ActivateUserComponent";

function ClaimmunityApp() {

    return (
            <div>

                <div>
                    <Router>

                        <Switch>
                            <Route path="/" exact component={LoginComponent} />
                            <Route path="/login" component={LoginComponent} />
                            <Route path="/forgot-password" component={ForgotPasswordComponent}/>
                            <Route path="/sign-up" component={SignUpComponent}/>
                            <Route path="/activate/:id" component={ActivateUserComponent}/>

                            <AuthenticatedRoute path="/dashboard" component={DashboardComponent}/>
                            <AuthenticatedRoute path="/task-board" component={TaskBoardComponent}/>
                            <AuthenticatedRoute path="/create-incident" component={CreateIncidentComponent}/>
                            <AuthenticatedRoute path="/task-management-board/:incidentId" component={TaskManagementBoard}/>
                            <AuthenticatedRoute path="/forms" component={FormsListComponent}/>
                            <AuthenticatedRoute path="/form/:id/:incidentId" component={FormComponent} />
                            <AuthenticatedRoute path="/doc-hub" component={DocHubListComponent}/>
                            <AuthenticatedRoute path="/docs/:incidentId" component={DocHubComponent}/>
                            <AuthenticatedRoute path="/invoice/:id" component={InvoiceComponent}/>
                            <AuthenticatedRoute path="/payments" component={InvoiceListComponent}/>
                            <AuthenticatedRoute path="/contacts" component={ContactListComponent}/>
                            <AuthenticatedRoute path="/settings" component={SettingsComponent}/>

                            <Route component={ErrorComponent}/>
                        </Switch>
                    </Router>
                </div>
            </div>
        );
}
export default ClaimmunityApp;