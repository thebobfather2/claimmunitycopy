import axios from "axios";
import {API_URL} from "../Constants";

class TaskManagementDataService{

    getTaskManagementBoardTasks(incidentId){
        return axios.get(`${API_URL}/task-management-board/${incidentId}`);
    }

    getTaskTimeline(incidentId){
        return axios.get(`${API_URL}/task-management-board/timeline/${incidentId}`);
    }

    createSubTask(subTask){
        return axios.post(`${API_URL}/task-management-board/sub-task`, subTask);
    }

    updateSubTask(id, subTask){
        return axios.put(`${API_URL}/task-management-board/sub-task/${id}`, subTask);
    }

    deleteSubTask(id){
        return axios.delete(`${API_URL}/task-management-board/sub-task/${id}`);
    }

    updateSubTaskCompletionStatus(id, status){
        return axios.put(`${API_URL}/task-management-board/sub-task/${id}/status/${status}`);
    }
}

export default new TaskManagementDataService();
