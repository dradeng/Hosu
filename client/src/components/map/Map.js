import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import PropertyMarker from "./PropertyMarker"
import MapContainer from "./MapContainer";

const Map = withScriptjs(withGoogleMap((props) =>{

        const markers = props.propies.map( property => {
            console.log(property);
            let marker = <PropertyMarker
                key={property._id}
                uid={property._id}
                closeMarkers={props.closeOtherMarkers}
                property={property}
                location={{lat: property.latitude, lng: property.longitude}}
                activeMarker={property._id === props.activeMarker ? true : false}
            />
            return marker
        })
        return (
            <GoogleMap

                defaultZoom={10}
                defaultCenter={{ lat: 34.05, lng: -118.644 }}

            >
                {markers}
            </GoogleMap>
        )
    }
))

export default Map