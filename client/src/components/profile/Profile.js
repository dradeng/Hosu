import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import ProfileReview from './ProfileReview';
import { getProfileByID } from '../../actions/profileActions';
import Spinner from '../common/Spinner';

class Profile extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getProfileByID(this.props.match.params.id);
    }
  }

  render() {
    const { profile, loading } = this.props.profile;
    let profileContent;

    if (profile === null || loading) {
      profileContent = <Spinner />;
    } else {
      profileContent = (
        <div style={{maxWidth: 800, margin:'0 auto'}}>
          <ProfileHeader profile={profile} />
          <span>{profile.bio}</span>
          <ProfileReview profile={profile}/>
        </div>
      );
    }

    return (
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{profileContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  getProfileByID: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfileByID })(Profile);
