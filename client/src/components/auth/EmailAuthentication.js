import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authenticateEmail } from '../../actions/authActions';

class EmailAuthentication extends Component {
  constructor() {
    super();
    this.state = {
     
    };
  }

  componentDidMount() {
    //if (this.props.auth.isAuthenticated) {
    //  this.props.history.push('/dashboard');
    //}
    this.props.authenticateEmail(this.props.match.params.id, this.props.history);
  }
  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        Email Authenticated, will redirect to login page
      </div>
    );
  }
}

EmailAuthentication.propTypes = {
  authenticateEmail: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { authenticateEmail })(
  EmailAuthentication
);