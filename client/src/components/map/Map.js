import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import PropertyMarker from "./PropertyMarker"
import MapContainer from "./MapContainer";
import MarkerCircle from "./MarkerCircle";

const Map = withScriptjs(withGoogleMap((props) =>{
        var longitude = props.address.longitude;
        var latitude = props.address.latitude;
        var circle = props.circle;

        var markers;

        if(props.address.circle) {
            markers = <MarkerCircle address={props.address}  />;

        } else {
            markers = props.propies.map( property => {
            let marker = <PropertyMarker
                key={property._id}
                uid={property._id}
                circle={circle}
                closeMarkers={props.closeOtherMarkers}
                property={property}
                address={props.address}
                location={{lat: property.latitude, lng: property.longitude}}
                activeMarker={property._id === props.activeMarker ? true : false}/>
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
        )
    }
))

export default Map