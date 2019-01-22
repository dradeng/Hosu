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

    const { post } = this.props;
   

    /*[
        {
            from: "2019-01-26",
            to: "2019-01-27"
        },
        {
            from: "2025-09-01",
            to: "2025-12-01"
        }
    ];*/
    console.log('date is'+ JSON.stringify(post.bookedDates));
    return (
      <div style={{padding:15}}>

        <Flatpickr
        options = {{
          mode: "range",
          inline: true, 
          dateFormat: "Y-m-d",
          disable: post.bookedDates,
          minDate: this.props.startDate, 
          altInput: true, altFormat: "F j, Y", 
          maxDate: this.props.endDate
          }}
          onChange={date => { this.setState({date: date, selectedDate: date[0], selectedEndDate:date[1] }); this.props.onChangeDates(date);}}
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
