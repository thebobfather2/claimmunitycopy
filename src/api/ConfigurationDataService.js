import axios from "axios";
import {API_URL} from "../Constants";

class ConfigurationDataService{

    getAllUserConfigurations(type){
        return axios.get(`${API_URL}/configurations/user/${type}`);
    }

    updateUserConfigurationValue(id, value){
        return axios.put(`${API_URL}/configurations/user/${id}/${value}`);
    }
}

export default new ConfigurationDataService();