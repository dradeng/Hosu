import React from "react";
import Map from "./Map";

export default class MapContainer extends React.Component {

    state = {
        properties: [],
        location: this.props.location,
        activeMarker: null
    }
    /*
    componentWillReceiveProps(nextProps){
        if (nextProps.doctors !== this.props.doctors){
            this.setState({
                doctors: nextProps.doctors,
                location: nextProps.location
            })
        }
    }
      findClsosestPractice = () => {
        return this.props.doctors.map(doctor => {
            let closestPractice = doctor.practices[0]
            doctor.practices.forEach(practice => {
                if (practice.distance < closestPractice.distance){
                    closestPractice = practice
                }
            })
            return Object.assign(doctor, { closestPractice })
        });
    };

    @TODO:  later
    */


    closeOtherMarkers = (uid) => {
        this.setState({activeMarker: uid})
    }

    render() {
        const properties = this.props.geojson;
        return (
            <Map
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