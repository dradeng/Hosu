import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Stay from './Stay';

class StayFeed extends Component {
  componentDidMount() {

  }
  render() {

    const { stays } = this.props;
    let stayContent;
    if(stays.length === 0) {
      stayContent = <div>You have no trips. Be patient!</div>;
    } else {
      stayContent = stays.map(stay => {
        return (
          <div style={{marginBottom: 50}}>      
            <Stay key={stay._id} stay={stay} />
          </div>
        );
      });
    }

    return (
      <div>
        {stayContent}
      </div>
    );
  }
}

Request.propTypes = {

  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default StayFeed;