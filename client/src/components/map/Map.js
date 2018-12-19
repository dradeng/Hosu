import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import PropertyMarker from "./PropertyMarker"
import MapContainer from "./MapContainer";

const Map = withScriptjs(withGoogleMap((props) =>{
        var longitude = props.address.longitude;
        var latitude = props.address.latitude;
        console.log("lat and long is " + longitude +" "+ latitude);
        const markers = props.propies.map( property => {
            let marker = <PropertyMarker
                key={property._id}
                uid={property._id}
                closeMarkers={props.closeOtherMarkers}
                property={property}
                location={{lat: property.latitude, lng: property.longitude}}
                activeMarker={property._id === props.activeMarker ? true : false}/>
            return marker;
        });

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