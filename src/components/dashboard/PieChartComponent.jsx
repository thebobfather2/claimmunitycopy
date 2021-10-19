import React from "react";
import { Pie } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

class PieChartComponent extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.labels);
        console.log(this.props.data);

        this.state = {
            dataPie: {
                labels: this.props.labels,
                datasets: [
                    {
                        data: this.props.data,
                        backgroundColor: [
                            "#2863E9",
                            "#949FB1",
                            "#ABC3F9"
                        ],
                        hoverBackgroundColor: [
                            "#2863E9",
                            "#949FB1",
                            "#ABC3F9"
                        ]
                    }
                ]
            },
            pieOptions : {
                responsive: true,
                plugins:{
                    legend: {
                        position: 'top'
                    }
                }
            }
        }
    }

    render() {
        return (
            <MDBContainer>
                <Pie data={this.state.dataPie} options={this.state.pieOptions}  />
            </MDBContainer>
        );
    }
}

export default PieChartComponent;