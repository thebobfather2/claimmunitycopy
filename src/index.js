import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthenticationService from "./api/AuthenticationService";
import axios from "axios";

axios.interceptors.request.use(config => {

    const currentUser = AuthenticationService.getLoggedInUser() //You can get the user directly from the cookie or session storage...
    if (currentUser !== '') {
        config.headers.Authorization = AuthenticationService.getLoggedInUserToken()
    }
    return config
}, err => {
    console.log(err)
    return Promise.reject(err)
})

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (401 === error.response.status) {
        window.location = '/login';
    } else {
        return Promise.reject(error);
    }
});

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
