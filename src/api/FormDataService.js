import axios from "axios";
import {API_URL} from "../Constants";

class FormDataService{

    getForms(){
        return axios.get(`${API_URL}/forms/organization`);
    }

    deleteForm(id){
        return axios.delete(`${API_URL}/forms/${id}`)
    }

    getForm(id, incidentId){
        return axios.get(`${API_URL}/forms/${id}/${incidentId}`);
    }

    createForm(form){
        return axios.post(`${API_URL}/forms/create`, form)
    }

    updateForm(id,form){
        return axios.put(`${API_URL}/forms/update/${id}`, form)
    }
}

export default new FormDataService()