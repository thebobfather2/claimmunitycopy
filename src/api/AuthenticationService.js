import axios from "axios";
import {API_URL} from "../Constants";

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
export const USER_TOKEN_SESSION_ATTRIBUTE_NAME = 'token'
export const USER_PREMIUM_USER = 'premiumUser'


class AuthenticationService {

    executeJwtAuthenticationService(username, password){

        return axios.post(`${API_URL}/authenticate`, {
            username: username,
            password: password
        })
    }

    registerSuccessfulLogin(username, token, premiumUser){
        sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username);
        sessionStorage.setItem(USER_TOKEN_SESSION_ATTRIBUTE_NAME, this.createJwtToken(token));
        sessionStorage.setItem(USER_PREMIUM_USER, premiumUser);
    }

    updateUserToPremium(){
        sessionStorage.setItem(USER_PREMIUM_USER, 'true');
    }
    createJwtToken(token){
        return 'Bearer ' + token;
    }

    logout(){
        sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
        sessionStorage.removeItem(USER_TOKEN_SESSION_ATTRIBUTE_NAME);
    }

    isUserLoggedIn(){
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        return user != null;
    }

    getLoggedInUser(){
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user == null){
            return ''
        }
        return user;
    }

    getLoggedInUserToken(){
        let token = sessionStorage.getItem(USER_TOKEN_SESSION_ATTRIBUTE_NAME)
        if (token == null){
            return ''
        }
        return token;
    }

    setupAxiosInterceptors(token){

        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                }
                return config
            }
        )
    }
}

export default new AuthenticationService()