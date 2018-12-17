import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
const GoogleMapsApi = require('../../config/index').GoogleMapsApi;

export class Container extends React.Component {
  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    }
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
          />
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: GoogleMapsApi
})(Container);