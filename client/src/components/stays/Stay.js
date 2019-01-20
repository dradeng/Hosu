import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import { Redirect } from 'react-router-dom';
import { updateStay } from '../../actions/stayActions';


class Stay extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.approveSublet = this.approveSublet.bind(this);
    this.denySublet = this.denySublet.bind(this);
  }
  componentDidMount() {
    
  }
  approveSublet() {
    
    var updatedInfo = {
      approved: true
    };
    this.props.updateStay(updatedInfo);
  }
  denySublet() {
  
    var updatedInfo = {
      approved: false
    };
    this.props.updateStay(updatedInfo);
  } 
  render() {
    const { user } = this.props.auth;
    const { stay } = this.props;
    var approveContent;
    var dateContent;
    var landLordContent;
    var subtenantContent;


    if(stay.landLord === user._id) {
      subtenantContent = (
        <div>
          <b>Subtenant: </b>
        </div>
        )
    } else {
      landLordContent = (
        <div>
          <b>Landlord: </b>
        </div>
      );
    }

    if(!stay.decided) {
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
              Made it to requests
              {landLordContent}
              {subtenantContent}
              {dateContent}
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
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { updateStay })(
  Stay
);