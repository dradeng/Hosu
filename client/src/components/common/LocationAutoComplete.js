import React from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
class LocationAutoComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = { address: this.props.original }
    }
    componentWillReceiveProps(nextProps) {
 
        if (nextProps.original) {
       
          // Set component fields state
          this.setState({
            address: nextProps.original,
          });
        }
    }
    handleChange = (address) => {
        this.setState({ address });
    }

    handleSelect = (address) => {
        this.setState({ address });
        this.props.changeAddress(address);
    }
    render() {
        var addressStyle = {}
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
                    <div >


                        <input
                            value={this.props.original}
                            style={addressStyle}
                            {...getInputProps({
                                type: "text", className: "form-control",
                                placeholder: 'Enter an address...',
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
export default LocationAutoComplete;