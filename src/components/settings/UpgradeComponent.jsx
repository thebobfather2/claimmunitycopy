import React, {Component} from "react";
import '../../static/css/UpgradeSettings.css';

class UpgradeComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            licenses: 1,
            monthlyPrice: 59.99,
            yearlyPrice: 719.88
        }

        this.incrementLicenseCount = this.incrementLicenseCount.bind(this)
        this.decrementLicenseCount = this.decrementLicenseCount.bind(this)
        this.changeType = this.changeType.bind(this)
    }

    changeType(type){
        this.props.changeType(type)
    }

    incrementLicenseCount() {

        this.setState({
            licenses: this.state.licenses + 1
        })
    }

    decrementLicenseCount() {
        if (this.state.licenses === 1) {
            return
        }

        this.setState({
            licenses: this.state.licenses - 1
        })
    }


    render() {
        return <div className="container">
            <div className="pb-3 upgrade-main">
                <div className="font-weight-bold"><label>How many licenses do you need?</label></div>
                <div className="ml-0 col-xl-2">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <button className="btn btn-outline-primary" type="button"
                                    onClick={this.decrementLicenseCount}>-
                            </button>
                        </div>
                        <input type="text" className="form-control" value={this.state.licenses} readOnly/>
                        <div className="input-group-prepend">
                            <button className="btn btn-outline-primary" type="button"
                                    onClick={this.incrementLicenseCount}>+
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pb-3 upgrade-main">
                <div className="font-weight-bold"><label>Choose your plan</label></div>
                <div className="ml-0 col-xl-4 plan">
                    <ul>
                        <li className="font-weight-bold">PREMIUM<br/>
                        ${this.state.monthlyPrice * this.state.licenses}/monthly | ${this.state.yearlyPrice * this.state.licenses}/yearly</li>
                    </ul>

                </div>
            </div>

            <hr/>

            <div className="row mt-5 ml-1">
                    <button className="btn-light btn-rounded mr-4 pull-right" onClick={() => this.changeType('accounts')}>Cancel</button>
                    <button className="btn-primary btn-rounded pull-right" onClick={() => this.props.history.push(`/checkout/${this.state.licenses}`)}>Save & Continue</button>
            </div>
        </div>
    }
}

export default UpgradeComponent;