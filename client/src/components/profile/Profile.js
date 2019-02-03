import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import ProfileReview from './ProfileReview';
import { getProfile } from '../../actions/profileActions';
import Spinner from '../common/Spinner';

class Profile extends Component {
  componentDidMount() {
    this.props.getProfile(this.props.match.params.id);
  }

  render() {
    const { profile, loading } = this.props.profile;
    let profileContent;

    if (profile === null) {
      profileContent = <Spinner />;
    } else {
      profileContent = (
        <div style={{maxWidth: 885, margin:'0 auto'}}>
          <ProfileHeader profile={profile} />
          <div style={{float: 'left'}}>
            <h3>{profile.name}</h3>
            <p style={{paddingTop: 70}}>
                {
                  profile.location && 
                    <div>
                      Location: {profile.location}
                    </div>
                }
              </p>
              <p style={{display: 'inline-block'}}>
                {
                  profile.university  && 
                  <div style={{display: 'inline-block'}}>
                    University: {profile.university}
                  </div>
                }
                {
                  profile.study &&
                  <div style={{display: 'inline-block'}}>
                    , {profile.study}
                  </div>
                }
              </p>
              <p>
                {
                  profile.age && 
                  <div>
                    Age: {profile.age}
                  </div>
                }
              </p>
              <p>
                {
                  profile.job && 
                  <div>
                    Job: {profile.job}
                  </div>
                }
              </p>
              <p>
                {
                  profile.bio && 
                  <div>
                    {profile.bio}
                  </div>
                }
              </p>
              <p>
                {
                  profile.interests && 
                  <div>
                    Interests: {profile.interests}
                  </div>
                }
              </p>
            </div>
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
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfile })(Profile);
