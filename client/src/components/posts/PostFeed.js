import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';

import PostItem from './PostItem';
import Filter from './filter/Filter';
import 'rc-slider/assets/index.css';
import Calendar from "./filter/Calendar.js";
const createSliderWithTooltip = Slider.createSliderWithTooltip;

const Range = createSliderWithTooltip(Slider.Range);

class PostFeed extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  		min: 0,
  		max: 10000,
        showFilter: false,
        showStartDate: false,
        showCalendar: false,
        showPriceTool: false,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  	};
  	this.onChange = this.onChange.bind(this);
    this.onPriceChange = this.onPriceChange.bind(this);
    this.onChangeDates = this.onChangeDates.bind(this);
    
    this.handleClickPrice = this.handleClickPrice.bind(this);
    this.handleOutsideClickPrice = this.handleOutsideClickPrice.bind(this);
    this.handleClickCalendar = this.handleClickCalendar.bind(this);
    this.handleOutsideClickCalendar = this.handleOutsideClickCalendar.bind(this);
  }
  handleClickPrice() {
    if (!this.state.showPriceTool) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClickPrice, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClickPrice, false);
    }

    this.setState(prevState => ({
       showPriceTool: !prevState.showPriceTool,
    }));
  }
  
  handleOutsideClickPrice(e) {
    // ignore clicks on the component itself
    if (this.nodePrice.contains(e.target)) {
      return;
    }
    
    this.handleClickPrice();
  }
  handleClickCalendar() {
    if (!this.state.showCalendar) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClickCalendar, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClickCalendar, false);
    }

    this.setState(prevState => ({
       showCalendar: !prevState.showCalendar,
    }));
  }
  
  handleOutsideClickCalendar(e) {
    // ignore clicks on the component itself
    if (this.nodeCalendar.contains(e.target)) {
      return;
    }
    
    this.handleClickCalendar();
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onPriceChange(min,max)
  {
      this.setState({ min: min, max: max });
  }
  onChangeDates(dates)
  {
    this.setState({ startDate: dates[0], endDate: dates[1]});
  }
  updateParentPostFeed(post) {
    console.log('made it to postfeed'+post);
    this.props.updateParentPosts(post);
  }
  render() {
    const { posts } = this.props;
    const { profile } = this.props;
    let newPosts = posts.filter(post =>
      post.rent >= this.state.min && post.rent <= this.state.max
    );
    let dateFilteredPosts = newPosts.filter(post =>
      new Date(post.startDate).getTime() <= this.state.startDate.getTime() && new Date(post.endDate).getTime() >= this.state.startDate.getTime()
    );

    let feedContent = null;
    if(profile === null) {
      //do nothign
    } else {
      feedContent = dateFilteredPosts.filter(post =>
          Math.abs(post.latitude - post.latitude) < 2 && Math.abs(profile.longitude - post.longitude) < 2)
          .map(post => {
            return <PostItem 
              updateParentPostFeed={this.updateParentPostFeed.bind(this)}
              className="col-md-6" 
              key={post._id} 
              post={post} 
            />;
          });
    }
    if(feedContent.length === 0) {
      feedContent = 
        <div style={{paddingTop: 30, display: 'block', textAlign:'center', marginLeft: 'auto', marginRight: 'auto'}}>
          <div>There are no posts listed in this area yet for the given availibility and price range chosen!</div>
        </div>
    }

    return (
    	<div className="col-md-12">
            <div style={{ borderBottom: '1px solid #eeedf1', padding: 10, paddingLeft: 50}} className="row">

                {this.state.showPriceTool ?
                  <div ref={nodePrice => { this.nodePrice = nodePrice; }}>
                    <button className="filterButton">
                      <span style={{padding: 2, paddingTop: 6, paddingBottom: 6}}>  Price </span>
                    </button>
                    <div  className="filterPopUp" >
                    <Range  
                      style={{ padding: 10, width: 200 }}   
                      tipTransitionName='rc-slider-tooltip-zoom-down'
                      onChange={(evt) => this.onPriceChange(evt[0], evt[1])}  
                      defaultValue={[0, 10000]} max={10000}  min={0} 
                    />
                    <span>
                      ${this.state.min} , ${this.state.max}  
                    </span>
                    </div>
                  </div> 
                  :
                  <div>
                    <button className="filterButtonSelected" onClick={() => this.handleClickPrice()}>
                      <span style={{padding: 2, paddingTop: 6, paddingBottom: 6}}>  Price </span>
                    </button>
                  </div>
                }

                {this.state.showCalendar ?  
                  <div ref={nodeCalendar => { this.nodeCalendar = nodeCalendar; }}>  
                    <button className="filterButton">
                      <span style={{padding: 2,paddingTop: 6, paddingBottom: 6}}> Dates </span>
                    </button>
                    <div className="filterPopUp">
                      <Calendar
                      onChangeDates={this.onChangeDates}
                      />
                    </div>
                  </div>
                :
                  <button className="filterButtonSelected"  onClick={() => this.handleClickCalendar()}>
                      <span style={{padding: 2,paddingTop: 6, paddingBottom: 6}}> Dates </span>
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
