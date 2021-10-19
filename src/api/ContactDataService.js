import axios from "axios";
import {API_URL} from "../Constants";

class ContactDataService{

    getContacts(){
        return axios.get(`${API_URL}/contacts/organization`);
    }

    createContact(contact){
        return axios.post(`${API_URL}/contacts`, contact);
    }

    updateContact(id, contact){
        return axios.put(`${API_URL}/contacts/${id}`, contact);
    }

    deleteContact(id){
        return axios.delete(`${API_URL}/contacts/${id}`);
    }

}

export default new ContactDataService();