import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import { Redirect } from 'react-router-dom';


class Stay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accepted: false
    };
    this.approveSublet = this.approveSublet.bind(this);
    this.denySublet = this.denySublet.bind(this);
  }
  componentDidMount() {
    
  }
  approveSublet() {

  }
  denySublet() {

  }
  render() {
    const { user } = this.props.auth;
    const { stay } = this.props;
    var approveContent;
    if(!stay.decided) {
      approveContent = (
        <div>
          <button onClick={this.approveSublet} className="btncustom btn mt-4">
            Approve
          </button>
          <button onClick={this.denySublet} type="submit" className="btncustom btn mt-4">
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
              Made it to requests
              {approveContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Stay.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {  })(
  Stay
);