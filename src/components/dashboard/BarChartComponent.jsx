import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import {MDBContainer} from "mdbreact";

export default class BarChartComponent extends Component {

    render() {

        const barChartData = {

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
            barThickness: 40,
            plugins: {
                legend:
                    {display: false}
            }
        };

        return (
            <MDBContainer>
                <Bar data={barChartData} options={options}/>
            </MDBContainer>
        );
    }
}