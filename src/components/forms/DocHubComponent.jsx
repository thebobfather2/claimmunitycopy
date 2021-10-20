import React, {Component} from "react";
import FileDataService from "../../api/FileDataService";
import '../../static/css/DocHub.css';
import {AiOutlineDelete} from "react-icons/ai";
import moment from "moment";

class DocHubComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            incidentId: props.match.params.incidentId,
            message: '',
            // Initially, no file is selected
            selectedFile: null,
            showUploadFile: false,
            image: '',
            preview: true,
            documents: [],
            fullImageId: ''
        }

        this.getAllDocuments = this.getAllDocuments.bind(this)
        this.preview = this.preview.bind(this)
        this.openWindow = this.openWindow.bind(this)
    }

    openWindow(fullUrl){
    }
    preview(document){

        // if (!this.state.preview && this.state.fullImageId === document.id){
        //     return this.displayFullImage(document)
        // }

        return <div className="col-sm-3 ml-3 mt-3 mr-3 mb-3 img-div">
            <img alt={document.id} id={document.id} onClick={this.openWindow(document.fullUrl)}
                 src={document.fullUrl} className="img-preview"/>
            <div className="font-weight-bold">{document.name}</div>
            <div>
                <small>{moment(document.uploadedOn).format('YYYY-MM-DD')}</small>
                <AiOutlineDelete className="pull-right" title="Delete" onClick={() => {
                    if (window.confirm('Are you sure you want to delete this file?')) {
                        FileDataService.deleteDocument(document.id, document.name).then(this.getAllDocuments)
                            .catch(() => {
                                this.setState({
                                    errorMessage: "An error occurred while delete the file. Please contact support at support@claimmunity.com to report the issue."
                                })
                            })
                    }
                }}/>
            </div>
        </div>
    }

    componentDidMount() {
        this.getAllDocuments();
    }

    getAllDocuments() {
        FileDataService.getAllDocuments(this.state.incidentId)
            .then(response => this.setState({documents: response.data}))
    }

    // On file select (from the pop up)
    onFileChange = event => {
        // Update the state
        this.setState({selectedFile: event.target.files[0]});
    };

    // On file upload (click the upload button)
    onFileUpload = () => {
        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "file",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        // Details of the uploaded file
        console.log(this.state.selectedFile);

        FileDataService.uploadFile(formData, this.state.incidentId).then(() => this.getAllDocuments())
    };

    render() {
        return (<div className="container doc-hub">
                <div className="row form-group">
                    <div className="col-sm-12 mt-4">
                        <button type="button" className="btn btn-primary pull-right"
                                onClick={() => this.setState({showUploadFile: false})}>
                            X &nbsp;&nbsp;REMOVE ITEM
                        </button>
                        <button type="button" className="btn btn-primary pull-right mr-2"
                                onClick={() => this.setState({showUploadFile: true})}>
                            + &nbsp;&nbsp;ADD ITEM
                        </button>
                    </div>
                </div>

                {
                    this.state.showUploadFile &&
                    <div className="row form-group">
                        <div className="col-sm-12">
                            <input type="file" id="files" onChange={this.onFileChange}/>
                            {
                                this.state.selectedFile &&
                                <button className="btn btn-primary" onClick={this.onFileUpload}>
                                    Upload file
                                </button>
                            }
                        </div>
                    </div>
                }

                <div id="preview" className="row img-list">
                    {
                        this.state.documents.map(
                            document => this.preview(document)
                        )}
                </div>
            </div>
        );
    }
}

export default DocHubComponent;