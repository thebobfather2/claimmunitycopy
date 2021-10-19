import {Component} from "react";
import '../../static/css/NotificationSettings.css';
import ConfigurationDataService from "../../api/ConfigurationDataService";

class NotificationSettingsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            configurations: [],
            isUserAdmin: false
        }
        this.loadUserConfigurations = this.loadUserConfigurations.bind(this);
        this.updateConfiguration = this.updateConfiguration.bind(this);
    }

    updateConfiguration(id, event){
        console.log(`Updating configuration with ID ${id} and value ${event.target.checked}`)
        ConfigurationDataService.updateUserConfigurationValue(id, event.target.checked)
            .then(() => this.loadUserConfigurations())
    }

    loadUserConfigurations() {
        ConfigurationDataService.getAllUserConfigurations("PLATFORM_NOTIFICATION")
            .then(response => {
                this.setState({
                    configurations: response.data
                })
            })
            .catch(() => console.log('Unable to load configurations for user.'))
    }

    componentDidMount() {
        this.loadUserConfigurations();
    }

    render() {
        return <div className="container">

            {
                this.state.configurations.map(
                    configuration => {
                        console.log(configuration.value)
                        return <div className="row">

                            <div className="col-xs-2 col-md-2">
                                <label><span className="notification-label">{configuration.readableName}:</span> </label>
                            </div>

                            <div className="col-xs-3 col-md-3">
                                <label className="switch">
                                    <input id="incidents" type="checkbox" defaultChecked={configuration.value === '1'} onChange={event => this.updateConfiguration(configuration.id, event)}/>
                                    <span className="slider round"/>
                                </label>
                            </div>
                        </div>
                    })}
        </div>
    }
}


export default NotificationSettingsComponent;