import axios from "axios";
import {API_URL} from "../Constants";

class IncidentDataService{

    getIncidents(){
        return axios.get(`${API_URL}/incidents/organization`);
    }

    getIncident(id){
        return axios.get(`${API_URL}/incidents/${id}`);
    }

    createIncident(incident){
        return axios.post(`${API_URL}/incidents`, incident);
    }

    updateIncidentStatus(id, statusCode, type, reOpen){

        let url = `${API_URL}/incidents/${id}/status/${statusCode}`;

        if (type !== null && reOpen !== null){
            url += `?type=${type}&re-open=${reOpen}`;
        }
        else if (type !== null){
            url += `?type=${type}`;
        }
        else if (reOpen !== null){
            url += `?re-open=${reOpen}`;
        }
        return axios.put(url);
    }
}

export default new IncidentDataService();
