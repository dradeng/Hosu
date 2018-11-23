import React from 'react';
import Slider from 'rc-slider';
import PropTypes from 'prop-types';
import {FaArrowLeft, FaArrowRight, FaStar} from 'react-icons/fa';

import 'rc-slider/assets/index.css';
import Filter from "./Filter";
import PostItem from "../PostItem";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);


const monthMaker = (months,props) => {
    let content = months.map(month => {
        if (month.number === props.selectedMonth) {
            return (<div key={month.number}  className="monthFlip">
                {month.name}
            </div>);
        }else {
            return (<div onClick={() => props.changeMonth(month.number)} key={month.number} className="monthBox">
                {month.name}
            </div>);
        }   });
    return content;
};
const MonthGrid = props => {

    let firstMonths = [{name: 'Jan',number: 1} ,
        {name: 'May',number: 5} ,
       {name: 'Sep',number: 9}
       ];
    let secondMonths =[{name: 'Feb',number: 2} ,{name: 'Jun',number: 6},{name: 'Oct',number: 10} ];
    let thirdMonths = [{name: 'Mar',number: 3},{name: 'Jul',number: 7}, {name: 'Nov',number: 11} ];
    let fourthMonths = [{name: 'Apr',number: 4},{name: 'Aug',number: 8},{name: 'Dec',number: 12}];
    let monthContent1 = monthMaker(firstMonths,props);
    let monthContent2 = monthMaker(secondMonths,props);
    let monthContent3 = monthMaker(thirdMonths,props);
    let monthContent4 = monthMaker(fourthMonths,props);

    return (
        <div>
            <div className="row">
                <div className="col-md-2">
                    <div style={{marginTop: 2}} onClick={() => props.changeYear(-1)}>

                    <FaArrowLeft/>
                    </div>
                </div>
                <div className="col-md-8">
                    <h4 style={{textAlign: 'center',marginBottom: 5}}> {props.selectedYear} </h4>
                </div>
                <div className="col-md-2">
                    <div style={{marginTop: 2}} onClick={() => props.changeYear(1)}>
                    <FaArrowRight  />
                    </div>
                </div>
            </div>
            <div className="row">
                <div>
                {monthContent1}
                </div>
                <div>
                    {monthContent2}

                </div>
                <div>
                    {monthContent3}

                </div>
                <div>
                    {monthContent4}
                </div>
            </div>
        </div>
    );
};



MonthGrid.propTypes = {
    selectedMonth: PropTypes.number.isRequired,
    selectedYear: PropTypes.number.isRequired,
    changeYear: PropTypes.func.isRequired,
    changeMonth:  PropTypes.func.isRequired
};


export default MonthGrid;