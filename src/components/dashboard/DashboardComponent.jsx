import React, {Component} from "react";
import '../../static/css/Dashboard.css';
import ProgressBarComponent from "./ProgressBarComponent";
import DashboardDataService from "../../api/DashboardDataService";
import DoughnutChartComponent from "./DoughnutChartComponent";
import LineChartComponent from "./LineChartComponent";
import BarChartComponent from "./BarChartComponent";


let osdLabels = ['OPEN', 'CLOSED', 'CONVERTED'];
let claimLabels = ['OPEN', 'CLOSED', 'INVOICE'];
let osdAmountLabels = ['OPEN', 'CONVERTED'];
let claimAmountLabels = ['OPEN', 'PAID'];
let progressBarOsdLabels = ['FORM', 'DOCUMENTATION', 'DISPOSITION', 'OUTCOME', 'COMPLETED'];
let progressBarClaimLabels = ['FORM', 'DOCUMENTATION', 'UNDER REVIEW', 'OUTCOME', 'COMPLETED'];
let monthsLabel = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
let osdCountData = [500, 231, 241, 300, 450, 1210,500, 231, 241, 300, 450, 1210];
let claimsCountData = [70, 150, 200, 3000, 550, 70, 150, 200, 3000, 550, 44, 65];

let osdAmountData = [1500.12, 3000.12, 5512.00, 10212.00, 8711.00, 8100.11, 1500.12, 3000.12, 5512.00, 10212.00, 8711.00, 8100.11];
let claimsAmountData = [3000.12, 2011.11, 15012.12, 3400.12, 5500.00, 6300.00, 3000.12, 2011.11, 15012.12, 3400.12, 5500.00, 6300.00];

class DashboardComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            osdSummary: [],
            osdDollarAmounts: [],
            claimSummary: [],
            claimDollarAmounts: [],
            progressBarOsdCount: [],
            progressBarClaimCount: [],
            consignorMap: [],
            consignors: [], consignorCount: [],
            consignees: [], consigneeCount: [],
            mounted: false
        }
        this.populateDashboard = this.populateDashboard.bind(this)
    }

    componentDidMount() {
        this.populateDashboard()
    }

    populateDashboard() {
        DashboardDataService.getDashboard('MONTH')
            .then(response => {
                let data = response.data;
                let osd = data.osdSummary;
                let claims = data.claimSummary;
                let progressBarOsd = data.osdSummary;
                let progressBarClaim = data.claimSummary;

                this.setState({
                    osdSummary: [osd.openCount, osd.closedCount, osd.convertedCount],
                    osdDollarAmounts: [osd.openDollarAmount, osd.convertedDollarAmount],
                    claimSummary: [claims.openCount, claims.closedCount, claims.convertedCount],
                    claimDollarAmounts: [claims.openDollarAmount, claims.paidDollarAmount],
                    progressBarOsdCount: [progressBarOsd.formCount, progressBarOsd.documentationCount, progressBarOsd.dispositionCount, progressBarOsd.outcomeCount, progressBarOsd.completedCount],
                    progressBarClaimCount: [progressBarClaim.formCount, progressBarClaim.documentationCount, progressBarClaim.underReviewCount, progressBarClaim.outcomeCount, progressBarClaim.completedCount],
                    consignorLabels : Object.keys(data.consignors), consignorCount: Object.values(data.consignors),
                    consigneeLabels : Object.keys(data.consignees), consigneeCount: Object.values(data.consignees),

                })
            })
            .then(() => this.setState({mounted: true}))
    }

    render() {
        return <div className="container dashboard">

            <div className="form-group chart mr-1">

                <div className="chart-title"><h5>OS&D SUMMARY</h5></div>

                <div className="row">
                    <div className="col-sm-6">
                        {this.state.mounted && <DoughnutChartComponent labels={osdLabels} data={this.state.osdSummary}/>}
                    </div>
                    <div className="col-sm-6">
                        <vl/>
                        {this.state.mounted &&
                        <DoughnutChartComponent labels={osdAmountLabels} data={this.state.osdDollarAmounts}
                                                customLabel="$"/>}
                    </div>
                </div>
            </div>

            <div className="form-group chart">

                <div className="chart-title"><h5>CLAIMS SUMMARY</h5></div>

                <div className="row">
                    <div className="col-sm-6">
                        {this.state.mounted && <DoughnutChartComponent labels={claimLabels} data={this.state.claimSummary}/>}
                    </div>
                    <div className="col-sm-6">
                        <vl/>
                        {this.state.mounted &&
                        <DoughnutChartComponent labels={claimAmountLabels} data={this.state.claimDollarAmounts}
                                                customLabel="$"/>}
                    </div>
                </div>
            </div>

            <div className="form-group chart mr-1">

                <div className="chart-title"><h5>OS&D PROGRESS BAR</h5></div>

                <div className="row">
                    <div className="col-sm-12">
                        {this.state.mounted &&
                        <ProgressBarComponent labels={progressBarOsdLabels} data={this.state.progressBarOsdCount}/>
                        }
                    </div>
                </div>
            </div>

            <div className="form-group chart mr-3">

                <div className="chart-title"><h5>CLAIMS PROGRESS BAR</h5></div>

                <div className="row">
                    <div className="col-sm-12">
                        {this.state.mounted &&
                        <ProgressBarComponent labels={progressBarClaimLabels} data={this.state.progressBarClaimCount}/>
                        }
                    </div>
                </div>
            </div>

            <div className="form-group chart mr-1">

                <div className="chart-title"><h5>OSD/Claims Trend</h5></div>

                <div className="row">
                    <div className="col-sm-12">
                        {this.state.mounted &&
                        <LineChartComponent labels={monthsLabel} firstLabel='OS&D Count' secondLabel='Claim Count' firstData={osdCountData} secondData={claimsCountData}
                        firstColor='#2863E9' secondColor='green'/>
                        }
                    </div>
                </div>
            </div>

            <div className="form-group chart mr-1">

                <div className="chart-title"><h5>OSD/Claims $ Exposure</h5></div>

                <div className="row">
                    <div className="col-sm-12">
                        {this.state.mounted &&
                        <LineChartComponent labels={monthsLabel} firstLabel='OS&D $ Amount' secondLabel='Claim $ Amount' firstData={osdAmountData} secondData={claimsAmountData}
                                            firstColor='red' secondColor='orange'/>
                        }
                    </div>
                </div>
            </div>

            <div className="form-group chart mr-1">

                <div className="chart-title"><h5>Top 5 Shipper Trend</h5></div>

                <div className="row">
                    <div className="col-sm-12">
                        {this.state.mounted &&
                        <BarChartComponent labels={this.state.consignorLabels} data={this.state.consignorCount}/>
                        }
                    </div>
                </div>
            </div>

            <div className="form-group chart mr-1">

                <div className="chart-title"><h5>Top 5 Recipient Trend</h5></div>

                <div className="row">
                    <div className="col-sm-12">
                        {this.state.mounted &&
                        <BarChartComponent labels={this.state.consigneeLabels} data={this.state.consigneeCount}/>
                        }
                    </div>
                </div>
            </div>

            <div className="form-group chart mr-1">

                <div className="chart-title"><h5>Incidents by mode</h5></div>

                <div className="row">
                    <div className="col-sm-12">
                        {this.state.mounted &&
                        <LineChartComponent labels={monthsLabel} firstLabel='FTL Count' secondLabel='LTL Count' firstData={osdAmountData} secondData={claimsAmountData}
                                            firstColor='purple' secondColor='blue'/>
                        }
                    </div>
                </div>
            </div>

        </div>
    }
}

export default DashboardComponent