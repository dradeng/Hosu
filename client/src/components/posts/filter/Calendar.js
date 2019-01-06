import React, { Component } from 'react';
import { updateCurrentDate,updateEndDate, updateStartDate } from '../../../actions/postActions';
import connect from "react-redux/es/connect/connect";

import 'flatpickr/dist/themes/material_green.css'

import Flatpickr from 'react-flatpickr'

class Calendar extends Component {
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
          <div>

            <Flatpickr
            options = {{mode: "range",inline: true,minDate: "today"}}
            value={this.state.date}
            onChange={date => { this.setState({date: date, selectedDate: date[0], selectedEndDate:date[1] }); this.props.onChangeDates(date);}} />

            </div>
        );
    }
}

const mapStateToProps = state => ({
    selectedEndDate: state.post.selectedEndDate,
    selectedDate: state.post.selectedDate,
});


export default  connect(mapStateToProps, { updateEndDate, updateStartDate  })(Calendar);
