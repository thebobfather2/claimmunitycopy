import React, {Component} from "react";
import {Doughnut} from "react-chartjs-2";
import {MDBContainer} from "mdbreact";

class DoughnutChartComponent extends Component {

    render() {

        let data = this.props.data
        let labels = this.props.labels
        let customLabel = this.props.customLabel !== undefined ? this.props.customLabel : ''

        let customLabels = labels.map((label, index) => [`${customLabel}${data[index]}`, `${label}`])

        const chartdata = {
            labels: customLabels,
            datasets: [
                {
                    backgroundColor: [
                        "#2863E9",
                        "#949FB1",
                        "#ABC3F9"
                    ],
                    data: data,
                },
            ],
        };

        const options = {
            plugins: {
                legend: {
                    position: 'right',
                    align: 'center',
                    labels: {
                        padding: 17,
                        boxWidth: 15,
                        color: 'black',
                        font: {
                            size: 10,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    boxHeight: 10
                }
            },
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2
        };

        return (
            <MDBContainer>
                <Doughnut
                    data={chartdata}
                    options={options}
                />
            </MDBContainer>
        );
    }
}

export default DoughnutChartComponent;