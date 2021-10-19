import axios from "axios";
import {API_URL} from "../Constants";

class DashboardDataService{

    getDashboard(timeInterval){
        return axios.get(`${API_URL}/dashboard?timeIntervalUnit=${timeInterval}`);
    }


}

export default new DashboardDataService();