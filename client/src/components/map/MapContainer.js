import React, { Component } from 'react';
import Map from "./Map";

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          properties: [],
            location: this.props.location,
            activeMarker: null
        };
    }
    closeOtherMarkers = (uid) => {
        this.setState({activeMarker: uid})
    }
    render() {
        //this is different than the state.properties
        //idk why this is, bad implementation
        const properties = this.props.geojson;
        const address = this.props.address;
        const circle = this.props.circle;
        return (
            <Map
                address={address}
                propies={properties}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBob7qS5XZFENWz5u8UCRFvLaOXxhh3geE"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{height: '100%',width: '100%',
                }} />}
                mapElement={<div style={{ height: `100%` }} />}
                toggleShowPage={this.props.toggleShowPage}
                activeMarker={this.state.activeMarker}
                closeOtherMarkers={this.closeOtherMarkers}
            />
        );
    }
}

export default MapContainer;