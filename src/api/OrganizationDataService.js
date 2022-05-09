import axios from "axios";
import {API_URL} from "../Constants";

class OrganizationDataService {

    getLicenses() {
        return axios.get(`${API_URL}/organizations/licenses`);
    }

    updateLicense(licenseId,emailAddress,active) {
        if (emailAddress !== null) {
            return axios.put(`${API_URL}/organizations/license/${licenseId}?emailAddress=${emailAddress}&active=${active}`);
        }
        return axios.put(`${API_URL}/organizations/license/${licenseId}?active=${active}`);
    }

}

export default new OrganizationDataService();