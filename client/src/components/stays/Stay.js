import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { getPost } from '../../actions/postActions';
import { updateStay } from '../../actions/stayActions';
import StayItem from './StayItem';
import Rating from "react-rating";

class Stay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
    this.approveSublet = this.approveSublet.bind(this);
    this.denySublet = this.denySublet.bind(this);
  }
  componentDidMount() {
    const { stay } = this.props;
    this.props.getPost(stay.post);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }
  approveSublet() {
    
    const { stay } = this.props;
    var updatedInfo = {
      id: stay._id,
      approved: true,
      subtenant: stay.subtenant,
      post: stay.post,
      startDate: stay.startDate,
      endDate: stay.endDate
    };
    this.props.updateStay(updatedInfo, this.props.history);
  }
  denySublet() {
  
    const { stay } = this.props;
    var updatedInfo = {
      id: stay._id,
      approved: false,
      subtenant: stay.subtenant,
      post: stay.post,
      startDate: stay.startDate,
      endDate: stay.endDate
    };
    this.props.updateStay(updatedInfo, this.props.history);
  } 
  render() {
    const { user } = this.props.auth;
    const { stay } = this.props;
    const { post, loading } = this.props.post;
    const { errors } = this.state;
    var approveContent;
    var errorContent;
    var postContent;
    console.log('errors ' + JSON.stringify(errors));

    if (post === null || loading || Object.keys(post).length === 0) {
      //do nothing while loading individual post
    } else {
      postContent = (
        <div style={{width: 500}}>
          <StayItem post={post} stay={stay} showActions={false}/>
        </div>
      );
    }

    if(!stay.decided && stay.landlord === user.id) {
      approveContent = (
        <div style={{width: 500, textAlign: 'center'}}>
          <button onClick={this.approveSublet} className="btncustom btn mt-4" style={{marginRight: 10, width: 150}}>
            Approve
          </button>
          <button onClick={this.denySublet} className="btncustom btn mt-4" style={{marginLeft: 10, width: 150}}>
            Deny
          </button>
        </div>
      );
    }
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {postContent}
              {approveContent}
              <div style={{fontSize:13,color:'rgb(220, 53, 69)', paddingTop:5, fontFamily:'-apple-system, BlinkMacSystemFont, Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji, Segoe UI Emoji,Segoe UI Symbol'}}>
                           
                {errors.stay && stay._id === errors.id ? errors.stay : ''}

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Stay.propTypes = {
  updateStay: PropTypes.func.isRequired,
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { updateStay, getPost })(
  Stay
);