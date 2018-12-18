import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import PropertyMarker from "./PropertyMarker";

const GoogleMapsApi = require('../../config/index').GoogleMapsApi;


export class Container extends React.Component {
  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    }


    /*const markers = this.props.geojson.map( property => {
      console.log(property);
      let marker = <PropertyMarker
        key={property._id}
          uid={property._id}
          closeMarkers={this.props.closeOtherMarkers}
          property={property}
          location={{lat: property.latitude, lng: property.longitude}}
          activeMarker={property._id === this.props.activeMarker ? true : false} />
      return marker;
    });*/
    const markers = this.props.geojson.map( property => {
      console.log(property);
      let marker = <Marker
        title={'The marker`s title will appear as a tooltip.'}
        name={'SOMA'}
        position={{lat: property.latitude, lng: property.longitude}} />;
      return marker;
    });

    /*let testMarker = 
        <Marker
        title={'The marker`s title will appear as a tooltip.'}
        name={'SOMA'}
        position={{lat: property.latitude, lng: property.longitude}} />;*/

    var longitude = this.props.address.longitude;
    var latitude = this.props.address.latitude;
    const pos = {lat: 37.759703, lng: -122.428093}
    return (
      <div style={style}>
        <Map google={this.props.google}
        initialCenter={{
         lat: latitude,
         lng: longitude
        }}
        >
          {markers}
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: GoogleMapsApi
})(Container);