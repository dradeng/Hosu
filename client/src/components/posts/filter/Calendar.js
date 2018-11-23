import React from "react";
import dateFns from "date-fns";
import PropTypes from 'prop-types';

import './Calendar.css';
import MonthGrid from "./MonthGrid";
import { updateCurrentDate,updateEndDate, updateStartDate } from '../../../actions/postActions';
import connect from "react-redux/es/connect/connect";

class Calendar extends React.Component {
    state = {
        currentMonth: this.props.currentMonth,
        selectedDate: this.props.selectedDate,
        selectedEndDate: this.props.selectedEndDate,
    };
    renderHeader() {
       

        const dateFormat = "MMMM YYYY";

        return (
            <div className="header row flex-middle">
                <div className="col-md-2 col-start">
                    <div className="icon" onClick={this.prevMonth}>
                        chevron_left
                    </div>
                </div>
                <div style={{alignText: 'center'}} className="col-md-8 col-center">
                    <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
                </div>
                <div className="col-md-2 col-end" onClick={this.nextMonth}>
                    <div className="icon">chevron_right</div>
                </div>
            </div>
        );
    }

    renderDays() {
        const dateFormat = "dd";
        const days = [];

        let startDate = dateFns.startOfWeek(this.state.currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col col-center" key={i}>
                    {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
                </div>
            );
        }

        return <div className="days row">{days}</div>;
    }

    renderCells() {
        const { currentMonth, selectedDate, selectedEndDate } = this.state;
        const monthStart = dateFns.startOfMonth(currentMonth);
        const monthEnd = dateFns.endOfMonth(monthStart);
        const startDate = dateFns.startOfWeek(monthStart);
        const endDate = dateFns.endOfWeek(monthEnd);

        const dateFormat = "D";
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";
        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = dateFns.format(day, dateFormat);
                const cloneDay = day;
                if (!selectedEndDate && !selectedDate  || selectedDate && selectedEndDate) {
                    days.push(
                        <div
                            className={`col cell ${
                                !dateFns.isSameMonth(day, monthStart)
                                    ? "disabled"
                                    : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
                                    || dateFns.isSameDay(day, selectedEndDate) ? "selectedEnd" : ""
                                    || (dateFns.isBefore(day, selectedEndDate) &&  dateFns.isAfter(day, selectedDate)  && selectedDate !== null && selectedEndDate !== null)  ? "cover" : ""
                                }`}
                            key={day}
                            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
                        >
                            <span className="number">{formattedDate}</span>
                            {dateFns.isSameDay(day, selectedDate) &&<span style={{fontSize: 5, position: 'absolute',left: 0, bottom: 0}}> start </span>}
                            {dateFns.isSameDay(day, selectedEndDate) && <span style={{fontSize: 5, position: 'absolute',right: 5, bottom: 0}}> end </span>}


                        </div>
                    );
                } else if (!selectedEndDate && selectedDate) {
                    days.push(
                        <div
                            className={`col cell ${
                                !dateFns.isSameMonth(day, monthStart)
                                    ? "disabled"
                                    : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
                                }`}
                            key={day}
                            onClick={() => this.onEndDateClick(dateFns.parse(cloneDay))}
                        >
                            <span className="number">{formattedDate}</span>
                            {dateFns.isSameDay(day, selectedDate) && <span style={{fontSize: 5, position: 'absolute',left: 0, bottom: 0}}> start </span>}
                        </div>
                    );
                }
                day = dateFns.addDays(day, 1);
            }
            rows.push(
                <div className="row" key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="body">{rows}</div>;
    }

    onDateClick = day => {
        this.props.updateStartDate(day);
        this.setState({
            selectedDate: day,
            selectedEndDate: null,
        });
    };
    onEndDateClick = day => {
        if (dateFns.isAfter(day,this.state.selectedDate)) {
            this.props.updateEndDate(day);

            this.setState({
                selectedEndDate: day
            });
        }
        else {
            this.props.updateStartDate(day);

            this.setState({
            selectedDate: day
            });
        }
    };
    nextMonth = () => {

        this.props.updateCurrentDate(dateFns.addMonths(this.state.currentMonth, 1));
        this.setState({
            currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
        });
    };

    prevMonth = () => {
        this.props.updateCurrentDate(dateFns.subMonths(this.state.currentMonth, 1));
        this.setState({
            currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
        });

    };

    render() {
        return (
            <div className="calendar">
                {this.renderHeader()}
                {this.renderDays()}
                {this.renderCells()}
            </div>
        );
    }
}



MonthGrid.propTypes = {
    currentMonth: PropTypes.instanceOf(Date).isRequired,
    selectedDate: PropTypes.object.isRequired,
    selectedEndDate: PropTypes.object.isRequired,
    updateCurrentDate: PropTypes.func.isRequired,
    updateEndDate: PropTypes.func.isRequired,
    updateStartDate: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
    selectedEndDate: state.post.selectedEndDate,
    selectedDate: state.post.selectedDate,
    currentMonth:  state.post.currentMonth,
});


export default  connect(mapStateToProps, { updateCurrentDate,updateEndDate, updateStartDate  })(Calendar);