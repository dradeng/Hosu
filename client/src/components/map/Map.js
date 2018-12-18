import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import PropertyMarker from "./PropertyMarker"

export class Map extends React.Component {
  constructor(props) {
    super(props);

    const {lat, lng} = this.props.initialCenter;
    this.state = {
      currentLocation: {
        lat: lat,
        lng: lng
      }
    }
  }
  componentDidMount() {
    this.loadMap();
  }
  renderChildren() {
    const {children} = this.props;

    if (!children) return;

    return React.Children.map(children, c => {
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation
      });
    })
  }
  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);
      const curr = this.state.currentLocation;
      const center = new maps.LatLng(curr.lat, curr.lng);
     
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      this.map = new maps.Map(node, mapConfig);

      let centerChangedTimeout;
      this.map.addListener('dragend', (evt) => {
        if (centerChangedTimeout) {
          clearTimeout(centerChangedTimeout);
          centerChangedTimeout = null;
        }
        centerChangedTimeout = setTimeout(() => {
          this.props.onMove(this.map);
        }, 0);
      })
    }
  }
  render() {
    return (
      <div ref='map'>
        Loading map...
        {this.renderChildren()}
      </div>
    )
  }
}

Map.propTypes = {
  google: React.PropTypes.object,
  zoom: React.PropTypes.number,
  initialCenter: React.PropTypes.object,
  onMove: React.PropTypes.func
}
Map.defaultProps = {
  zoom: 13,
  // San Francisco, by default
  initialCenter: {
    lat: 37.774929,
    lng: -122.419416
  },
  onMove: function() {} // default prop
}


export default Map