import React, { Component } from 'react';
import { Marker } from "react-google-maps";

class MarkerCircle extends Component {

    render(){

        console.log('what up');
        console.log(this.props.address.latitude);
        console.log(this.props.address.longitude);
        return(
            <div>
                <Marker position={{ lat: this.props.address.latitude, lng:this.props.address.longitude}} />
            </div>
        )

    }
}

export default MarkerCircle;