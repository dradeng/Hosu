import React from "react";
import { Marker, InfoWindow } from "react-google-maps";
import Marker from "./Marker"
import PropertyMapCard from "./PropertyMapCard";
import MapMarker from '../../assets/marker50.png'
export default class PropertyMarker extends React.Component {

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
    }
//                        icon={StethoscopeIcon}
    render(){

        return(
            <div>
                <Marker
                    onClick={this.toggleOpen}
                    label={"$"+this.props.property.rent}
                    key={`marker${this.props.property._id}`}
                    position={this.props.location}
                    icon={MapMarker}
                    
                >
                    { this.state.isOpen && this.state.activeMarker ?
                        <InfoWindow maxWidth={800} defaultPosition={ this.props.location } onCloseClick={this.props.onToggleOpen}>
                            <PropertyMapCard pro={this.props.property}/>
                        </InfoWindow> : null
                    }
                </Marker>
            </div>
        )

    }
}

/*export class Marker extends React.Component {
  componentDidUpdate(prevProps) {
    if ((this.props.map !== prevProps.map) ||
      (this.props.position !== prevProps.position)) {
        this.renderMarker();
    }
  }
  renderMarker() {
    let {
      map, google, position, mapCenter
    } = this.props;

    let pos = position || mapCenter;
    position = new google.maps.LatLng(pos.lat, pos.lng);

    const pref = {
      map: map,
      position: position
    };
    this.marker = new google.maps.Marker(pref);
  }
  render() {
    return null;
  }
}

Marker.propTypes = {
  position: React.PropTypes.object,
  map: React.PropTypes.object
}*/