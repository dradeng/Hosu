import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';

import PostItem from './PostItem';
import Filter from './filter/Filter';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
//import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import MonthGrid from "./filter/MonthGrid";
import Calendar from "./filter/Calendar.js";
const createSliderWithTooltip = Slider.createSliderWithTooltip;

const Range = createSliderWithTooltip(Slider.Range);

class PostFeed extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  		min: 0,
  		max: 2500,
        startYear: 2018,
        endYear: 2018,
        startMonth: 11,
        endMonth: 12,
        showFilter: false,
        showStartDate: false,
        showCalendar: false,
        showPriceTool: false,
  	};
  	this.onChange = this.onChange.bind(this);
    this.onPriceChange = this.onPriceChange.bind(this);
    this.onChangeStartYear = this.onChangeStartYear.bind(this);
    this.onChangeEndYear = this.onChangeEndYear.bind(this);
      this.onChangeStartMonth = this.onChangeStartMonth.bind(this);
      this.onChangeEndMonth = this.onChangeEndMonth.bind(this);


  }
  
  onChange(e) {
    console.log(e);
    this.setState({ [e.target.name]: e.target.value });
  }
  onPriceChange(min,max)
  {
      this.setState({ min: min, max: max });
  }
  onChangeStartMonth(num)
  {
      this.setState({ startMonth: num});

  }
    onChangeEndMonth(num)
    {
        this.setState({ endMonth: num});

    }
  onChangeStartYear(num)
  {
        this.setState({ startYear: this.state.startYear+num});
  }
    onChangeEndYear(num)
    {
        this.setState({ endYear: this.state.endYear+num});
    }
  render() {
  	
    const { posts } = this.props;
    console.log(posts);
    let newPosts = posts.filter(post => 
      post.rent >= this.state.min && post.rent <= this.state.max
    );

    let feedContent = newPosts.map(post => <PostItem className="col-md-6" key={post._id} post={post} />);

    return (
    	<div className="col-md-12">
            <div style={{ borderBottom: '1px solid #eeedf1', padding: 10, paddingLeft: 50}} className="row">

                {this.state.showPriceTool ?
                    <div>
                        <button className="filterButton" onClick={() => this.setState({showPriceTool: false})}>
                            <span style={{padding: 2, paddingTop: 6, paddingBottom: 6}}>  Price </span>
                        </button>
                        <div  className="filterPopUp" >
                        <Range  style={{
                            padding: 10,
                            width: 200
                        }}   tipTransitionName='rc-slider-tooltip-zoom-down' onChange={(evt) => this.onPriceChange(evt[0], evt[1])}  defaultValue={[0, 5000]} max={5000}  min={0}/>
                            <span> ${this.state.min} , ${this.state.max}  </span>


                        </div>
                    </div> :
                    <div>
                        <button className="filterButtonSelected" onClick={() => this.setState({showPriceTool: true})}>
                            <span style={{padding: 2, paddingTop: 6, paddingBottom: 6}}>  Price </span>
                        </button>

                    </div>
                }

                {this.state.showCalendar ?   <div>  <button className="filterButton" onClick={() => this.setState({showCalendar: false})}>
                        <span style={{padding: 2,paddingTop: 6, paddingBottom: 6}}> Dates </span>
                    </button>
                        <div className="filterPopUp">
                            <Calendar />
                        </div>
                    </div>:
                    <button className="filterButtonSelected"  onClick={() => this.setState({showCalendar: true,showPriceTool: false, showStartDate: false})}>
                        <span style={{padding: 2,paddingTop: 6, paddingBottom: 6}}> Dates </span>
                    </button>}
                {this.state.showFilter ?   <div>  <button className="filterButton" onClick={() => this.setState({showFilter: false})}>
                        <span style={{padding: 2,paddingTop: 6, paddingBottom: 6}}> More </span>
                    </button>
                    </div>:
                    <button className="filterButtonSelected"  onClick={() => this.setState({showFilter: true,showPriceTool: false,showStartDate: false,showEndDate: false})}>
                        <span style={{padding: 2,paddingTop: 6, paddingBottom: 6}}> More </span>
                    </button>}


            </div>
    		<div className="row">
                {this.state.showFilter && <Filter priceChange={this.onPriceChange}/> }

                {  !this.state.showFilter && feedContent }
            </div>
    	</div>
    );
  }
}

PostFeed.propTypes = {
    posts: PropTypes.array.isRequired,
};

export default PostFeed;
