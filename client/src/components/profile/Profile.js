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
          <ProfileHeader profile={profile} history={this.props.history} />
          <div style={{paddingLeft: 15, display: 'inline-block'}}>
            <div style={{backgroundColor: '#F5F5F5', textAlign: 'center', width:250 }}>
              <h3 style={{paddingTop: 70}}>{profile.name}</h3>
              <p style={{paddingBottom: 15}}>
                {
                  profile.age && 
                  <div>
                    {profile.age}
                  </div>
                }
                {
                  profile.location && 
                    <div style={{ paddingTop: 15, verticalAlign: 'middle', display: 'inline-block'}}>
                      <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <i class="far fa-map" style={{paddingRight: 5, fontSize: 25}}></i>
                      </div>
                      {profile.location}
                    </div>
                }
                <br />
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
                <div className="text-dark" style={{textDecoration: 'none'}}>
                  {
                    profile.social.facebook && 
                    <a href={profile.social.facebook} style={{color: 'inherit', textDecoration: 'none'}}>
                      <i class="fab fa-facebook-square" style={{fontSize: 25, marginLeft: 5, marginRight: 5}}></i>
                    </a>
                  }
                  {
                    profile.social.instagram && 
                    <a href={profile.social.instagram} style={{color: 'inherit', textDecoration: 'none'}}>
                      <i class="fab fa-instagram" style={{fontSize: 25, marginLeft: 5, marginRight: 5}}></i>
                    </a>
                  }
                  {
                    profile.social.twitter && 
                    <a href={profile.social.twitter} style={{color: 'inherit', textDecoration: 'none'}}>
                      <i class="fab fa-twitter" style={{fontSize: 25, marginLeft: 5, marginRight: 5}}></i>
                    </a>
                  }
                  {
                    profile.social.linkedin && 
                    <a href={profile.social.linkedin} style={{color: 'inherit', textDecoration: 'none'}}>
                      <i class="fab fa-linkedin" style={{fontSize: 25, marginLeft: 5, marginRight: 5}}></i>
                    </a>
                  }
                  {
                    profile.social.youtube && 
                    <a href={profile.social.youtube} style={{color: 'inherit', textDecoration: 'none'}}>
                      <i class="fab fa-youtube" style={{fontSize: 25, marginLeft: 5, marginRight: 5}}></i>
                    </a>
                  }
                </div>
              </p>

              <div style={{ marginBottom: '60px' }} />
            </div>
          </div>
          <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: 50, paddingTop: 50, maxWidth: 600, width: '100%'}}>
            <ProfileReview profile={profile}/>
          </div>
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
