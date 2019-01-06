import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";

import 'flatpickr/dist/themes/material_green.css'

import Flatpickr from 'react-flatpickr'

class PostCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: this.props.selectedDate,
      selectedEndDate: this.props.selectedEndDate,
      date: [new Date(), new Date()]
    };
  }
  render() {

    return (
      <div style={{padding:15}}>

        <Flatpickr
        options = {{mode: "range",inline: true, minDate: this.props.startDate, maxDate: this.props.endDate}}
        value={this.state.date}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
    selectedEndDate: state.post.selectedEndDate,
    selectedDate: state.post.selectedDate,
});


export default connect(mapStateToProps, { })(PostCalendar);
