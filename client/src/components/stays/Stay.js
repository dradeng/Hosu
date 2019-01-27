import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { getPost } from '../../actions/postActions';
import { updateStay } from '../../actions/stayActions';
import NonFeedPostItem from '../posts/NonFeedPostItem';

class Stay extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.approveSublet = this.approveSublet.bind(this);
    this.denySublet = this.denySublet.bind(this);
  }
  componentDidMount() {
    const { stay } = this.props;
    this.props.getPost(stay.post);
  }
  approveSublet() {
    
    const { stay } = this.props;
    var updatedInfo = {
      id: stay._id,
      approved: true,
      subtenant: stay.subtenant,
      //only need below for an approved sublet
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
    };
    this.props.updateStay(updatedInfo, this.props.history);
  } 
  render() {
    const { user } = this.props.auth;
    const { stay } = this.props;
    const { post, loading } = this.props.post;

    var approveContent;
    var dateContent;
    var landLordContent;
    var subtenantContent;
    var postContent;

    if (post === null || loading || Object.keys(post).length === 0) {
      //do nothing while loading individual post
    } else {
      postContent = (
        <div style={{width: 400}}>
          <NonFeedPostItem post={post} showActions={false}/>
        </div>
      );
    }

    if(stay.landLord === user._id) {
      subtenantContent = (
        <div>
          <Link className="text-dark" style={{textDecoration: 'none'}} to={`/profile/${stay.subtenantProfile}`}>
            <b>Subtenant: </b>
            <img
              className="rounded-circle"
              src={stay.subtenantImage}
              style={{ width: 30, height:30, marginRight: '5px' }}
              title="You must have a Gravatar connected to your email to display an image"
            />
            {stay.subtenantName}
          </Link>
        </div>
        )
    } else {
      landLordContent = (
        <div>
          <Link className="text-dark" style={{textDecoration: 'none'}} to={`/profile/${stay.landlordProfile}`}>
            <b>Landlord: </b>
            <img
              className="rounded-circle"
              src={stay.landlordImage}
              style={{ width: 30, height:30, marginRight: '5px' }}
              title="You must have a Gravatar connected to your email to display an image"
            />
            {stay.landlordName}
          </Link>
        </div>
      );
    }

    if(!stay.decided && stay.landlord === user.id) {
      approveContent = (
        <div>
          <button onClick={this.approveSublet} className="btncustom btn mt-4">
            Approve
          </button>
          <button onClick={this.denySublet} className="btncustom btn mt-4">
            Deny
          </button>
        </div>
      );
    }

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var start = new Date(stay.startDate).toLocaleDateString("en-US", options);
    var end = new Date(stay.endDate).toLocaleDateString("en-US", options);



    dateContent = (
      <div>
        <b>Start Date: </b>{start}<br />
        <b>End Date: </b>{end}
      </div>
    );


    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {landLordContent}
              {subtenantContent}
              {dateContent}
              {postContent}
              {approveContent}
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
};

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth
});

export default connect(mapStateToProps, { updateStay, getPost })(
  Stay
);