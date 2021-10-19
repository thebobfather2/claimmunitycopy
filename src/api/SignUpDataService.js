import axios from "axios";
import {API_URL} from "../Constants";

class SignUpDataService {

    signUpUser(signUp) {
        return axios.post(`${API_URL}/sign-up`,signUp);
    }

    activateUser(id){
        return axios.put(`${API_URL}/sign-up/activate/${id}`);
    }

    resetUserPassword(request){
        return axios.put(`${API_URL}/sign-up/reset`, request);
    }
}

export default new SignUpDataService();