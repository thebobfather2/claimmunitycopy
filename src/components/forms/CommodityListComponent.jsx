import React, {Component} from "react";
import {ListGroup} from "react-bootstrap";
import CommodityComponent from "./CommodityComponent";

class CommodityListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {commodities: [], count: 1};
        this.removeCommodity = this.removeCommodity.bind(this);
        this.handleAddChild = this.handleAddChild.bind(this);
    }

    handleAddChild=(e)=>{
        e.preventDefault();
        //Here i form the object
        const commodity = {
            id: this.state.count
        }
        this.setState({commodities: [...this.state.commodities, commodity], count: this.state.count + 1})
    }

    removeCommodity(id) {
        let commodities = this.state.commodities.slice();
        commodities.splice(id, 1);
        this.setState({
            commodities,
            count: this.state.count - 1
        });
    }

    render() {
        return <div className="card">
            <div className="card-header"><h5>Commodity Details</h5></div>
            <div className="card-body">
                <ListGroup>
                    {this.state.commodities.map(commodity => {
                    return <ListGroup.Item><CommodityComponent number={commodity.id} removeCommodity={this.removeCommodity}/></ListGroup.Item>
                })
                }
                </ListGroup>
            </div>
            <div className="card-footer">
                <input type="button" value="+New Commodity" className="float-sm-left btn btn-primary" onClick={this.handleAddChild}/>
            </div>
        </div>
    }
}

export default CommodityListComponent;