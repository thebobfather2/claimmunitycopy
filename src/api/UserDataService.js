import axios from "axios";
import {API_URL} from "../Constants";

class UserDataService {

    getUsers() {
        return axios.get(`${API_URL}/users/organization`);
    }

    getUser() {
        return axios.get(`${API_URL}/users`);
    }

    createUser(user) {
        return axios.post(`${API_URL}/users`, user);
    }

    updateUser(id, user) {
        return axios.put(`${API_URL}/users/${id}`, user);
    }

    deleteUser(id) {
        return axios.delete(`${API_URL}/users/${id}`);
    }

    updateUserPassword(id, password){
        return axios.put(`${API_URL}/users/password/${id}`, password);
    }

    sendInvitation(emailAddress){
        const config = { headers: {'Content-Type': 'application/json'} };
        return axios.post(`${API_URL}/users/invite`, emailAddress, config);
    }
}

export default new UserDataService();