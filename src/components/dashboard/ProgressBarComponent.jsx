import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import {MDBContainer} from "mdbreact";

export default class ProgressBarComponent extends Component {

    render() {

        const progressBarData = {

            labels: this.props.labels,

            datasets: [
                {
                    backgroundColor: '#317ABB',
                    hoverBackgroundColor: '#70BDEC',
                    data: this.props.data,
                    borderWidth: 2
                }
            ]
        }
        const options = {
            barThickness: 15,
            indexAxis: 'y',
            plugins: {
                legend:
                    {display: false}
            }
        };

        return (
            <MDBContainer>
                <Bar data={progressBarData} options={options}/>
            </MDBContainer>
        );
    }
}