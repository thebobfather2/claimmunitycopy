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
    FiEdit, MdAttachFile,
    MdDescription
} from "react-icons/all";
import moment from "moment";
import IncidentDataService from "../../api/IncidentDataService";
import InvoiceDataService from "../../api/InvoiceDataService";
import UserDataService from "../../api/UserDataService";

class TaskManagementBoard extends Component {

    constructor(props) {

        super(props);

        this.state = {
            taskList: [],
            timelineMessages: [],
            timelineMessageCount: '',
            incidentType: '',
            completionPercentage: '',
            errorMessage: '',
            incidentId: props.match.params.incidentId,
            taskId: '',
            subTaskId: '',
            subTaskName: '',
            assignedTo: -1,
            members: [],
            dueByDate: '',
            description: '',
            showForm: false,
            hasCommodities: false
        }

        this.openForm = this.openForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.editForm = this.editForm.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.populateBoard = this.populateBoard.bind(this);
        this.updateIncidentStatus = this.updateIncidentStatus.bind(this);
        this.createInvoice = this.createInvoice.bind(this);
        this.loadMembersOfOrganization = this.loadMembersOfOrganization.bind(this);
    }

    createInvoice() {

        //First update incident status
        this.updateIncidentStatus(this.state.incidentId, 9, 'INVOICE', null)

        //Create invoice
        let invoice =
            {
                incidentId: this.state.incidentId,
                invoiceDate: moment(new Date()).format('YYYY-MM-DD'),
                status: 'UNPAID'
            };


        InvoiceDataService.createInvoice(invoice)
            .then(response => this.props.history.push(`/invoice/${response.data}`))
            .catch(() => {
                this.setState({
                    errorMessage: "An error occurred while converting to invoice. Please contact support at support@claimmunity.com to report the issue."
                })
            })
    }

    updateIncidentStatus(incidentId, statusCode, incidentType, reOpen) {
        IncidentDataService.updateIncidentStatus(incidentId, statusCode, incidentType, reOpen)
            .then(this.populateBoard);
    }

    componentDidMount() {
        this.populateBoard()
        this.loadMembersOfOrganization()
    }

    loadMembersOfOrganization() {
        UserDataService.getUsers()
            .then(response => this.setState({
                members: response.data
            }))
    }

    populateBoard() {

        TaskManagementDataService.getTaskManagementBoardTasks(this.state.incidentId)
            .then(
                response =>  {
                    let data = response.data;
                    let taskTimeline = data.taskTimeLine;
                    this.setState(
                        {
                            taskList: data.tasks, incidentType: data.incidentType,
                            completionPercentage: data.completionPercentage,
                            timelineMessages: taskTimeline.messages,
                            timelineMessageCount: taskTimeline.totalCount,
                            hasCommodities: data.hasCommodities
                        })}
            )
            .catch(() => {
                this.setState({
                    errorMessage: "An error occurred while retrieving the tasks. Please contact support at support@claimmunity.com to report the issue."
                })
            })
    }

    openForm(id) {
        this.setState({showForm: true, taskId: id})
        document.getElementById("saveTaskForm").style.display = "block";
    }

    clearForm() {
        this.setState({
            subTaskId: '',
            subTaskName: '',
            dueByDate: '',
            description: ''
        })
    }

    editForm(subTask, taskId) {
        this.setState({
            subTaskId: subTask.id,
            subTaskName: subTask.name,
            description: subTask.description,
            assignedTo: subTask.assignedTo,
            dueByDate: subTask.dueByDate
        })
        this.openForm(taskId);
    }

    closeForm() {
        this.setState({showForm: false})
        document.getElementById("saveTaskForm").style.display = "none";
        this.clearForm();
    }

    handleChange(event) {
        const target = event.target;
        this.setState({[target.name]: target.value});

        console.log(this.state.assignedTo)
    }

    handleSubmit(event) {
        event.preventDefault();
        let subTask = {
            completed: false,
            deletable: true,
            description: this.state.description,
            dueByDate: moment(this.state.dueByDate).format('YYYY-MM-DD'),
            incidentId: this.state.incidentId,
            name: this.state.subTaskName,
            taskId: this.state.taskId,
            assignedTo: this.state.assignedTo
        }

        this.state.subTaskId > 0 ?
            TaskManagementDataService.updateSubTask(this.state.subTaskId, subTask).then(
                this.populateBoard
            )
                .catch(() => {
                    this.setState({
                        errorMessage: "An error occurred while updating the task. Please contact support at support@claimmunity.com to report the issue."
                    })
                }) :
            TaskManagementDataService.createSubTask(subTask)
                .then(
                    this.populateBoard
                )
                .catch(() => {
                    this.setState({
                        errorMessage: "An error occurred while creating the new task. Please contact support at support@claimmunity.com to report the issue."
                    })
                })
        this.closeForm()
    }

    render() {

        return <div className="container">

            <div className="page-top">
                <div className="pull-left bg-app">
                    <button type="button" className="btn-rounded btn-light"
                            onClick={() => this.props.history.push(`/task-board`)}>Go To Incidents
                    </button>
                </div>


                {
                    this.state.errorMessage !== '' &&
                    <div className="alert alert-danger" role="alert">
                        <div className="row ml-4">
                            {this.state.errorMessage}
                        </div>
                    </div>
                }

                <div className="form-popup" id="saveTaskForm">

                    <form className="form-container" onSubmit={this.handleSubmit}>

                        <div className="row ml-4">
                            <AiOutlineArrowRight size="30" color="gray"/>
                            <button type="submit"
                                    className="btn btn-primary">{this.state.subTaskId > 0 ? 'Edit Task' : 'Save Task'}</button>
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
                            <textarea className="form-control" id="subTaskName" name="subTaskName"
                                      placeholder="Add Task Name"
                                      value={this.state.subTaskName} onChange={this.handleChange} rows="3"/>
                        </div>

                        <div className="row">

                            <div className="col ml-4">
                                <div className="form-group">
                                    <label htmlFor="members"><BsPersonPlusFill size="20"/><span className="label-icon">Assign Member</span></label>
                                    <select className="input select mt-0" id="assignedTo" name="assignedTo" onChange={this.handleChange}>
                                        {this.state.members.map(
                                            user => {
                                                return  user.id === this.state.assignedTo ?
                                                <option className="service-small" id={user.id} value={user.id} selected>{user.firstName + " " + user.lastName}</option> :
                                                    <option className="service-small" id={user.id} value={user.id}>{user.firstName + " " + user.lastName}</option>
                                            }
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="col ml-2">
                                <div className="form-group"
                                     style={{width: '200px', paddingRight: '50px', paddingTop: '2px'}}>
                                    <label htmlFor="dueByDate"><AiFillClockCircle size="20"/><span
                                        className="label-icon">Due Date</span></label>
                                    <input className="form-control" id="dueByDate" name="dueByDate" type="date"
                                           value={this.state.dueByDate}
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

                        <div className="row ml-4">
                            <label>
                                <MdAttachFile size="20"
                                              onClick={() => this.props.history.push(`/docs/${this.state.incidentId}`)}/>
                                <span className="label-icon">Attachments</span>
                            </label>
                        </div>


                    </form>
                </div>

                <div className="ui" style={this.state.showForm ? {pointerEvents: "none", opacity: "0.4"} : {}}>

                    <div className="lists">
                        {
                            this.state.taskList.map(
                                task => {
                                    return (
                                        <div className="list">
                                            <header>
                                                {task.name}
                                                {!task.completed &&
                                                <div className="icon">
                                                    {task.completable && <AiOutlineCheckSquare size="16"
                                                                                               onClick={() => this.updateIncidentStatus(this.state.incidentId, task.statusCode, null, null)}/>}&nbsp;
                                                    <BsPlusSquareFill color="grey" size="15"
                                                                      onClick={() => this.openForm(task.id)}/>&nbsp;
                                                </div>}
                                                {task.completed &&
                                                <div className="icon"><AiFillCheckCircle style={{color: "green"}}
                                                                                         title="Completed"
                                                                                         onClick={() => this.updateIncidentStatus(this.state.incidentId, task.statusCode, null, true)}/>&nbsp;
                                                </div>}
                                            </header>

                                            <ul style={task.completed ? {pointerEvents: "none", opacity: "0.4"} : {}}>
                                                {
                                                    task.subTasks.map(
                                                        subTask =>
                                                            <li>

                                                                <div >
                                                                    <span><AiFillClockCircle/>{moment(subTask.dueByDate).format('ddd D')}<br/></span>
                                                                </div>

                                                                {!subTask.href && subTask.name}
                                                                {subTask.href &&
                                                                <Link to={subTask.href}>{subTask.name}</Link>}
                                                                <div className="pull-right">

                                                                    {!subTask.completed &&
                                                                    <AiOutlineCheckSquare title="Mark as complete"
                                                                                          onClick={() =>
                                                                                              TaskManagementDataService.updateSubTaskCompletionStatus(subTask.id, true)
                                                                                                  .then(this.populateBoard)
                                                                                                  .catch(() => {
                                                                                                      this.setState({
                                                                                                          errorMessage: "An error occurred while completing the sub-task. Please contact support at support@claimmunity.com to report the issue."
                                                                                                      })
                                                                                                  })
                                                                                          }/>}

                                                                    {subTask.completed &&
                                                                    <AiFillCheckCircle style={{color: "green"}}
                                                                                       title="Completed"
                                                                                       onClick={() => {
                                                                                           TaskManagementDataService.updateSubTaskCompletionStatus(subTask.id, false)
                                                                                               .then(this.populateBoard)
                                                                                               .catch(() => {
                                                                                                   this.setState({
                                                                                                       errorMessage: "An error occurred while re-opening the sub-task. Please contact support at support@claimmunity.com to report the issue."
                                                                                                   })
                                                                                               })
                                                                                       }}/>}

                                                                    {!subTask.completed && <FiEdit title="Edit"
                                                                                                   onClick={() => this.editForm(subTask, task.id)}/>}

                                                                    {!subTask.completed && subTask.deletable &&
                                                                    <AiOutlineDelete title="Delete" onClick={() => {
                                                                        if (window.confirm('Are you sure you want to delete this task?')) {
                                                                            TaskManagementDataService.deleteSubTask(subTask.id).then(this.populateBoard)
                                                                                .catch(() => {
                                                                                    this.setState({
                                                                                        errorMessage: "An error occurred while delete the tasks. Please contact support at support@claimmunity.com to report the issue."
                                                                                    })
                                                                                })
                                                                        }
                                                                    }}/>}
                                                                </div>
                                                            </li>)
                                                }
                                            </ul>
                                        </div>
                                    )
                                })
                        }
                        <ul>
                            {this.state.incidentType === 'OSD' &&
                            <button type="button" disabled={this.state.completionPercentage !== 100}
                                    className="btn btn-primary pr-1"
                                    onClick={() => this.updateIncidentStatus(this.state.incidentId, 5, 'CLAIM', null)}>+
                                Convert to claim</button>
                            }
                            {this.state.incidentType === 'CLAIM' &&
                            <button type="button" disabled={this.state.completionPercentage !== 100 || !this.state.hasCommodities}
                                    className="btn btn-primary" onClick={this.createInvoice}>+ Create Invoice
                            </button>
                            }
                        </ul>
                    </div>
                </div>


                {this.state.timelineMessageCount > 0 &&
                <div className="task-timeline">

                    <div className="mt-5 mb-5">
                        <div className="row ml-4">
                            <div className="col-md-6">
                                <h2>Task Timeline</h2>
                                <ul className="timeline">
                                    {
                                        this.state.timelineMessages.map(
                                            timelineMessage =>
                                                <li>
                                                    <p>{timelineMessage}</p>
                                                </li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>}
            </div>
        </div>
    }
}

export default TaskManagementBoard;