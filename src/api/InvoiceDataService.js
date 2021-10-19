import axios from "axios";
import {API_URL} from "../Constants";


class InvoiceDataService {

    createInvoice(invoice) {
        return axios.post(`${API_URL}/invoices/create`, invoice);
    }

    getInvoice(id){
        return axios.get(`${API_URL}/invoices/${id}`);
    }

    getInvoices(){
        return axios.get(`${API_URL}/invoices`);
    }
}
export default new InvoiceDataService()