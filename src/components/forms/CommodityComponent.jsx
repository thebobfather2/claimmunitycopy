import React, {Component} from 'react';
import '../../static/css/CommodityComponent.css';
import {AiOutlineClose} from "react-icons/ai";

class CommodityComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            commodity: props.commodity,
            index: props.count,
            key: props.key
        }
        this.removeCommodity = this.removeCommodity.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        this.props.onChange(fieldName, fieldValue, this.state.commodity);
    }

    removeCommodity() {
        this.props.removeCommodity(this.state.commodity);
    }

    render() {
        return <div className="commodity">
            <div className="form-row">
                <div className="col-sm-6">
                    <p className="pull-left">Commodity #{this.state.index + 1}</p>
                </div>
                <div className="col-sm-6">

                    {!this.state.disabled && <AiOutlineClose className="pull-right" onClick={this.removeCommodity}/>}
                </div>
            </div>
            <form>
                <div className="row">
                    <div className="commodity-select-large" >
                        <label className="required">OSD Type</label>
                        <select disabled={this.state.disabled} className="commodity-select-large" name="osdType" id="osdType" defaultValue={this.state.commodity.osdType} onChange={this.handleChange}>
                            <option id="damage" value="DAMAGE">Damage</option>
                            <option id="overage" value="OVERAGE">Overage</option>
                            <option id="shortage" value="SHORTAGE">Shortage</option>
                        </select>
                    </div>
                    <div className="commodity-field">
                        <label className="required">Condition</label>
                        <input disabled={this.state.disabled} type="text" className="w-100" id="condition" name="condition" defaultValue={this.state.commodity.condition} onChange={this.handleChange}/>
                    </div>

                    <div className="commodity-field-wide">
                        <label>Part/Model #</label>
                        <input disabled={this.state.disabled} type="text" className="w-100" id="partNumber" name="partNumber" defaultValue={this.state.commodity.partNumber} onChange={this.handleChange}/>
                    </div>

                    <div className="commodity-field">
                        <label className="required">Claimed Weight</label>
                        <input  disabled={this.state.disabled} type="text" className="w-100" id="claimedWeight" name="claimedWeight" defaultValue={this.state.commodity.claimedWeight} onChange={this.handleChange}/>
                    </div>

                    <div className="commodity-select">
                        <label className="required">Unit</label>
                        <select disabled={this.state.disabled} className="commodity-select" name="claimedWeightUnit" id="claimedWeightUnit" defaultValue={this.state.commodity.claimedWeightUnit} onChange={this.handleChange}>
                            <option id="lbs" value="LBS">LBS</option>
                            <option id="oz" value="OZ">OZ</option>
                        </select>
                    </div>

                    <div className="commodity-field">
                        <label >Pieces</label>
                        <input disabled={this.state.disabled} type="text" className="w-100" id="pieces" name="pieces" defaultValue={this.state.commodity.pieces} onChange={this.handleChange}/>
                    </div>

                    <div className="commodity-field">
                        <label className="required">Value</label>
                        <input disabled={this.state.disabled} type="text" className="w-100" id="claimedValue" name="claimedValue" placeholder="0.00" defaultValue={this.state.commodity.claimedValue} onChange={this.handleChange}/>
                    </div>

                    <div className="commodity-select">
                        <label className="control-label">Currency</label>
                        <select disabled={this.state.disabled} className="commodity-select" name="currency" id="currency" defaultValue={this.state.commodity.currency} onChange={this.handleChange}>
                            <option id="usd" value="usd">USD</option>
                        </select>
                    </div>

                    <div className="commodity-field">
                        <label className="required">Description</label>
                        <textarea disabled={this.state.disabled} className="commodity-textarea" id="commodityDescription" name="commodityDescription" rows="3" defaultValue={this.state.commodity.commodityDescription} onChange={this.handleChange}/>
                    </div>
                </div>

            </form>
        </div>
    }
}

export default CommodityComponent;
