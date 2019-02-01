import React, { Component } from 'react';
import FancyMap from "./FancyMap";

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          properties: [],
            location: this.props.location,
            activeMarker: null,
            highlight: null,
        };
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.highlight !== this.props.highlight) {
            console.log('props updated for map');
           this.setState({highlight: nextProps.highlight});
        }
    }
    closeOtherMarkers = (uid) => {
        this.setState({activeMarker: uid})
    }
    render() {
        console.log('THIS IS WHAT MAP HIGHLIGHT IS '+this.props.highlight);
        //this is different than the state.properties
        //idk why this is, bad implementation
        const properties = this.props.geojson;
        const address = this.props.address;
        const highlight = this.props.highlight;

        const circle = this.props.circle;
        return (
            <FancyMap
                highlight={this.state.highlight}
                address={address}
                propies={properties}
                toggleShowPage={this.props.toggleShowPage}
                activeMarker={this.state.activeMarker}
                closeOtherMarkers={this.closeOtherMarkers}
            />
        );
    }
}

export default MapContainer;