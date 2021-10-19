import axios from "axios";
import {API_URL} from "../Constants";


class NotificationDataService {

    getNotifications() {
        return axios.get(`${API_URL}/notifications`);
    }

    markNotificationsAsRead(){
        return axios.put(`${API_URL}/notifications/read`);
    }
}
export default new NotificationDataService()