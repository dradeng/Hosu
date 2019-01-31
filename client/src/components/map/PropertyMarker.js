import React, { Component } from 'react';
import { Marker, InfoWindow } from "react-google-maps";
import PropertyMapCard from "./PropertyMapCard";

import MapMarker from '../../assets/marker50.png'
class PropertyMarker extends Component {

    state = {
        isOpen: false,
        activeMarker: this.props.activeMarker
    }

    toggleOpen = () => {
        this.setState({isOpen: !this.state.isOpen}, () =>{
                if (!this.state.isOpen){
                    this.setState({activeMarker: false}, () => {
                        this.props.closeMarkers(null)
                    })
                } else{
                    this.props.closeMarkers(this.props.uid)
                }
            }
        )
    }

    componentWillReceiveProps(nextProps){

        this.setState({activeMarker: nextProps.activeMarker})
        console.log('we in here');
    }

    render(){
        const highlight = this.props.highlight;
        let display;
        console.log('highlist it' + highlight);
        if(this.props.address.circle) {
        
            display = <div>

                <Marker
                    lat={this.props.address.latitude} lng={this.props.address.longitude}
                >
                </Marker>
            </div>;

        } else {
            display =  <div>
                <Marker
                    onClick={this.toggleOpen}
                    label={"$"+this.props.property.rent}
                    key={`marker${this.props.property._id}`}
                    position={this.props.location}
                    icon={MapMarker}
                    
                >
                    { this.state.isOpen && this.state.activeMarker || highlight ?
                        <InfoWindow tyle={{height:800}} maxWidth={800} defaultPosition={ this.props.location } onCloseClick={this.props.onToggleOpen}>
                            <PropertyMapCard style={{height:800}} pro={this.props.property}/>
                        </InfoWindow> : null
                    }
                </Marker>
            </div>;
        }

        return(
            <div>
                {display}
            </div>
        )

    }
}

export default PropertyMarker;