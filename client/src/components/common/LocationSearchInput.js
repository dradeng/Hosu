import React from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
class LocationSearchInput extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = { address: '' }
    }

    handleChange = (address) => {
        this.setState({ address });
        this.props.changeAddress(address);
    }

    handleSelect = (address) => {
        this.setState({ address });
        this.props.onSubmit(address);
    }


    render() {
        var addressStyle = {position: 'absolute', top:0,left:40, height:40}
        if(this.props.error) {
          addressStyle = {borderColor:'red'};
        }
        return (
            <PlacesAutocomplete
                value={this.state.address}
                placeholder={this.props.address}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                    <div>


                        <input

                            style={addressStyle}
                            {...getInputProps({
                                type: "text", className: "form-control",
                                placeholder: this.props.placeholder,
                            })}
                        />


                        <div style={{border:'1px solid rgba(0,0,0,0.25)', position: 'absolute', top:40, zIndex:1000}} className="autocomplete-dropdown-container">
                            {suggestions.map(suggestion => {
                                const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div style={{overflow: 'auto'}} {...getSuggestionItemProps(suggestion, { className, style })}>
                                        <span>{suggestion.description}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
        );
    }
}
export default LocationSearchInput;