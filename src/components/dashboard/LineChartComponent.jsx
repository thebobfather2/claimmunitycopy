import { Line } from "react-chartjs-2";
import {Component} from "react";
import {MDBContainer} from "mdbreact";

class LineChartComponent extends Component{
    render() {
        const data = {
            labels: this.props.labels,
            datasets: [
                {
                    label: this.props.firstLabel,
                    data: this.props.firstData,
                    fill: false,
                    borderColor: this.props.firstColor,
                    backgroundColor: this.props.firstColor
                },
                {
                    label: this.props.secondLabel,
                    data: this.props.secondData,
                    borderColor: this.props.secondColor,
                    backgroundColor: this.props.secondColor
                }
            ]
        };

        const options =  {
            scales: {
                yAxes: [{
                    // stacked: true,
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        display: false
                    }
                }]
            }};

        return <MDBContainer>
            <Line data={data} options={options}/>
        </MDBContainer>
    }
}

export default LineChartComponent;