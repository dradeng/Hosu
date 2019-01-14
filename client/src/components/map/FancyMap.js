import React, { Component } from "react";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import PropertyMarker from "./PropertyMarker"
import MapContainer from "./MapContainer";
import MarkerCircle from "./MarkerCircle";

const Map = compose(
        withProps({
            googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBob7qS5XZFENWz5u8UCRFvLaOXxhh3geE",
            loadingElement: <div style={{ height: `100%` }} />,
            containerElement: <div style={{height: '100%',width: '100%'}} />,
            mapElement: <div style={{ height: `100%` }} />,

        }),
        withScriptjs,
        withGoogleMap
        )((props) => {
            var longitude = props.address.longitude;
            var latitude = props.address.latitude;
            var circle = props.circle;
            var highlight = props.highlight;

        var markers;

        if(props.address.circle) {
            markers = <MarkerCircle address={props.address}  />;

        } else {

            markers = props.propies.map( property => {
                console.log(property._id === highlight);
                let marker = <PropertyMarker
                    key={property._id}
                    uid={property._id}
                    circle={circle}
                    closeMarkers={props.closeOtherMarkers}
                    property={property}
                    address={props.address}
                    location={{lat: property.latitude, lng: property.longitude}}
                    activeMarker={property._id === highlight ? true : false}/>
                return marker;
            });
        }
        return (
        <GoogleMap
            defaultZoom={10}
            defaultCenter={{ lat: latitude, lng: longitude }}
        >
            {markers} 
        </GoogleMap>
        );
    }
);

class FancyMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
    }
    componentDidMount() {

    }
    render() {
        var address = this.props.address;
        var highlight = this.props.highlight;
        var circle = this.props.circle;
        var properties = this.props.propies;
        var toggleShowPage= this.props.toggleShowPage;
        var activeMarker= this.props.activeMarker;
        var closeOtherMarkers= this.props.closeOtherMarkers;
        return (
            <Map
                highlight={highlight}
                address={address}
                circle={circle}
                propies={properties}
                toggleShowPage={toggleShowPage}
                activeMarker={activeMarker}
                closeOtherMarkers={closeOtherMarkers}
            />
        );
    }
}

export default FancyMap;