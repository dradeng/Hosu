import React from 'react';
import Slider from 'rc-slider';
import PropTypes from 'prop-types';
import 'rc-slider/assets/index.css';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Filter = props => {




    return (
        <div style={{marginLeft: 20,width: '100%',
        }}>


            <div className="filterBox">
                <h5> Type </h5>
                <div  style={{margin: 10}}  className="btn-group buttonFilter" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-secondary buttonFilter">Left</button>
                    <button type="button" className="btn btn-secondary buttonFilter">Middle</button>
                    <button type="button" className="btn btn-secondary buttonFilter">Right</button>
                </div>
            </div>
            <div className="filterBox">
                <h5> Duration </h5>
                <div  style={{margin: 10,display: 'flex'}}  className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-secondary buttonFilter">Left</button>
                    <button type="button" className="btn btn-secondary buttonFilter">Middle</button>
                    <button type="button" className="btn btn-secondary buttonFilter">Right</button>
                </div>
            </div>
            <div className="filterBox ">
                <h5> Roommates </h5>
                <div style={{margin: 10}} className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-secondary buttonFilter">Left</button>
                    <button type="button" className="btn btn-secondary buttonFilter">Middle</button>
                    <button type="button" className="btn btn-secondary buttonFilter">Right</button>
                </div>
            </div>
            <div className="filterBox">
                <h5> Bedrooms </h5>
                <div  style={{margin: 10}}  className="btn-group buttonFilter" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-secondary buttonFilter">Left</button>
                    <button type="button" className="btn btn-secondary buttonFilter">Middle</button>
                    <button type="button" className="btn btn-secondary buttonFilter">Right</button>
                </div>
            </div>
        </div>
    );
};

Filter.propTypes = {
    priceChange: PropTypes.func.isRequired,
};


export default Filter;