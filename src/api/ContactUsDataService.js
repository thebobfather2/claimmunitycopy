import axios from "axios";
import {API_URL} from "../Constants";

class ContactUsDataService{

    contactUs(form){
        return axios.post(`${API_URL}/contact-us`, form);
    }

}

export default new ContactUsDataService()