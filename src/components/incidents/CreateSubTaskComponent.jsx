import React, {Component} from "react";
import {
    AiFillCheckCircle,
    AiFillClockCircle,
    AiOutlineCheckSquare,
    AiOutlineClose,
    AiOutlineDelete
} from "react-icons/ai";
import {Link} from "react-router-dom";
import TaskManagementDataService from "../../api/TaskManagementDataService";
import '../../static/css/TaskManagementBoard.css';
import {
    AiOutlineArrowRight,
    BsListTask,
    BsPersonPlusFill,
    BsPlusSquareFill,
    BsThreeDots,
    MdDescription
} from "react-icons/all";
import moment from "moment";

class CreateSubTaskComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            taskList: [],
            timelineMessages: [],
            incidentType: '',
            completionPercentage: '',
            errorMessage: '',
            incidentId: props.match.params.incidentId,
            taskId: '',
            subTaskId: '',
            subTaskName: '',
            members: '',
            dueDate: '',
            description: '',
            showForm: false
        }

        this.populateTaskTimeline = this.populateTaskTimeline.bind(this);
        this.makeFormVisible = this.makeFormVisible.bind(this);
        this.openForm = this.openForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.editForm = this.editForm.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.populateBoard = this.populateBoard.bind(this);
    }

    makeFormVisible() {
        this.setState({showForm: true})
    }

    componentDidMount() {
        this.populateBoard()
        // this.populateTaskTimeline()
    }

    populateBoard() {

        TaskManagementDataService.getTaskManagementBoardTasks(this.state.incidentId)
            .then(
                response =>
                    this.setState(
                        {taskList: response.data.tasks})
            )
            .catch(() => {
                this.setState({
                    errorMessage: "An error occurred while retrieving the tasks. Please contact support at support@claimmunity.com to report the issue."
                })
            })
    }

    populateTaskTimeline() {
        TaskManagementDataService.getTaskTimeline(this.state.incidentId)
            .then(
                response =>
                    this.setState(
                        {timelineMessages: response.data.messages})
            )
            .catch(() => {
                this.setState({
                    errorMessage: "An error occurred while retrieving the task timeline. Please contact support at support@claimmunity.com to report the issue."
                })
            })
    }

    openForm(id) {
        console.log(id)
        this.setState({showForm: true, taskId: id})
        document.getElementById("saveTaskForm").style.display = "block";
    }

    clearForm() {
        this.setState({
            subTaskId: '',
            subTaskName: '',
            members: '',
            dueDate: '',
            description: ''
        })
    }

    editForm(subTask) {
        this.setState({subTaskName: subTask.name, description: subTask.description})
        this.openForm();
    }

    closeForm() {
        this.setState({showForm: false})
        document.getElementById("saveTaskForm").style.display = "none";
        this.clearForm();
    }

    handleChange(event) {
        const target = event.target;
        this.setState({[target.name]: target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        let subTask = {
            completed: false,
            deletable: true,
            description: this.state.description,
            dueByDate: moment(this.state.dueDate).format('YYYY-MM-DD'),
            incidentId: this.state.incidentId,
            name: this.state.subTaskName,
            taskId: this.state.taskId
        }
        TaskManagementDataService.createSubTask(subTask)
            .catch(() => {
                this.setState({
                    errorMessage: "An error occurred while creating the new task. Please contact support at support@claimmunity.com to report the issue."
                })
            })
        this.closeForm()
        // this.props.history.push(`/task-management-board/${this.state.incidentId}`)
    }

    render() {

        return <div className="container">
            <div className="form-popup" id="saveTaskForm">

                <form className="form-container" onSubmit={this.handleSubmit}>

                    <div className="row ml-4">
                        <AiOutlineArrowRight size="30" color="gray"/>
                        <button type="submit" className="btn btn-primary">Save Task</button>
                        <AiOutlineClose size="20" color="gray" className="ml-auto mr-3" onClick={this.closeForm}/>
                    </div>

                    <div className="row ml-4">
                        <hr/>
                    </div>

                    <div className="row ml-4">
                        <label htmlFor="subTaskName">
                            <BsListTask size="20"/>
                            <span className="label-icon">Task Name</span>
                        </label>
                        <textarea className="form-control" id="subTaskName" name="subTaskName" placeholder="Add Task Name"
                                  value={this.state.subTaskName} onChange={this.handleChange} rows="3"/>
                    </div>

                    <div className="row">

                        <div className="col ml-1">
                            <div className="form-group" style={{width: '250px'}}>
                                <label htmlFor="members"><BsPersonPlusFill size="20"/><span className="label-icon">Assign Members</span></label>
                                <input className="form-control" value={this.state.members} onChange={this.handleChange}
                                       type="text" id="members" name="members"/>
                            </div>
                        </div>

                        <div className="col ml-1">
                            <div className="form-group" style={{width: '200px', paddingLeft: '15px'}}>
                                <label htmlFor="dueDate"><AiFillClockCircle size="20"/><span className="label-icon">Due Date</span></label>
                                <input className="form-control" id="dueDate" name="dueDate" type="date"
                                       value={this.state.dueDate}
                                       onChange={this.handleChange}/>
                            </div>
                        </div>

                    </div>

                    <div className="row ml-4">
                        <label>
                            <MdDescription size="20"/>
                            <span className="label-icon">Description</span>
                        </label>
                        <textarea className="form-control" id="description" value={this.state.description}
                                  onChange={this.handleChange} name="description"
                                  placeholder="Add a more detailed description..." rows="3"/>
                    </div>


                </form>
            </div>

        </div>
    }
}

export default CreateSubTaskComponent;