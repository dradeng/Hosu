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
          <div style={{paddingLeft: 15}}>
            <div style={{backgroundColor: '#F5F5F5', textAlign: 'center', width:250 }}>
              <h3 style={{paddingTop: 70}}>{profile.name}</h3>
              <p style={{padding: 15}}>
                {
                  profile.age && 
                  <div>
                    {profile.age}
                  </div>
                }
                {
                  profile.location && 
                    <div style={{ verticalAlign: 'middle', display: 'inline-block'}}>
                      <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <i class="far fa-map" style={{paddingRight: 5, fontSize: 25}}></i>
                      </div>
                      {profile.location}
                    </div>
                }
                {
                  profile.university  && 
                  <div style={{paddingTop: 15, verticalAlign: 'middle', display: 'inline-block'}}>
                    <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                      <i class="fas fa-university" style={{paddingRight: 5, fontSize: 25}}></i>
                    </div>
                    {profile.university}
                  </div>
                }
                {
                  profile.study &&
                  <div>
                    {profile.study}
                  </div>
                }
                {
                  profile.job && 
                  <div style={{paddingTop: 15, verticalAlign: 'middle', display: 'inline-block'}}>
                    <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                      <i class="fas fa-briefcase" style={{paddingRight: 5, fontSize: 25}}></i>
                    </div>
                    {profile.job}
                  </div>
                }
                {
                  profile.bio && 
                  <div style={{paddingTop: 15}}>
                    {profile.bio}
                  </div>
                }
                {
                  profile.interests && 
                  <div style={{paddingTop: 15, paddingBottom: 15}}>
                    Interests: {profile.interests}
                  </div>
                }
              </p>

              <div style={{ marginBottom: '60px' }} />
            </div>
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
