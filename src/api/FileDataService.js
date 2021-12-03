import axios from "axios";
import {API_URL} from "../Constants";

class FileDataService{

    uploadFile(formData, incidentId){
        const headers = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return axios.post(`${API_URL}/docs/upload/${incidentId}`, formData, headers)
    }

    getAllDocuments(incidentId){
        return axios.get(`${API_URL}/docs/${incidentId}`)
    }

    deleteDocument(id, fileName){
        return axios.delete(`${API_URL}/docs/${id}?fileName=${fileName}`)
    }

    downloadFile(incidentId, fileName){
        return axios.get(`${API_URL}/docs/download/${incidentId}/${fileName}`, {responseType: 'blob'});
    }
}
export default new FileDataService();