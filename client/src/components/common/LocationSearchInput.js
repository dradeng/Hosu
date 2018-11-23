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
    }

    handleSelect = (address) => {
        this.setState({ address });
        this.props.changeIt(address);
    }

    render() {
        return (
            <PlacesAutocomplete
                value={this.state.address}
                placeholder={this.props.address}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                    <div >


                        <input


                            {...getInputProps({
                                type: "text", className: "form-control",
                                placeholder: 'Complete your address...',
                            })}
                        />


                        <div className="autocomplete-dropdown-container">
                            {suggestions.map(suggestion => {
                                const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div {...getSuggestionItemProps(suggestion, { className, style })}>
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