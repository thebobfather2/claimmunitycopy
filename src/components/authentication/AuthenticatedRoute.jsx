import React, {Component} from 'react';
import {Redirect} from "react-router";
import {Route} from 'react-router-dom';
import AuthenticationService from "../../api/AuthenticationService";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

class AuthenticatedRoute extends Component {

    render() {
        if (AuthenticationService.isUserLoggedIn()) {
            return <>
                <Navbar/>
                <Sidebar/>
                <Route {...this.props}/>
            </>

        } else {
            return <Redirect to='/login'/>
        }
    }
}

export default AuthenticatedRoute;
