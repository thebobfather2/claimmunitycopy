import axios from "axios";
import {API_URL} from "../Constants";

class PaymentDataService {

    checkout(data, token){
        console.log(`Checking out....`)
        return axios
            .post(`${API_URL}/payment/charge`, data)
    }

    createSubscription(data){
        console.log(`Recurrent payment....`)
        return axios
            .post(`${API_URL}/payment/recurrent`, data)
    }
}

export default new PaymentDataService();