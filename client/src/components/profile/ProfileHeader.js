import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import isEmpty from '../../validation/is-empty';

class ProfileHeader extends Component {


  render() {
    const { profile } = this.props;
    

    /*
      <div className="text-center">
            <h1 className="display-4 text-center">{profile.user.name}</h1>
            <p>

              {isEmpty(profile.social && profile.social.twitter) ? null : (
                <a
                  className="text-white p-2"
                  href={profile.social.twitter}
                  target="_blank"
                >
                  <i className="fab fa-twitter fa-2x" />
                </a>
              )}

              {isEmpty(profile.social && profile.social.facebook) ? null : (
                <a
                  className="text-white p-2"
                  href={profile.social.facebook}
                  target="_blank"
                >
                  <i className="fab fa-facebook fa-2x" />
                </a>
              )}

              {isEmpty(profile.social && profile.social.linkedin) ? null : (
                <a
                  className="text-white p-2"
                  href={profile.social.linkedin}
                  target="_blank"
                >
                  <i className="fab fa-linkedin fa-2x" />
                </a>
              )}

              {isEmpty(profile.social && profile.social.youtube) ? null : (
                <a
                  className="text-white p-2"
                  href={profile.social.youtube}
                  target="_blank"
                >
                  <i className="fab fa-youtube fa-2x" />
                </a>
              )}

              {isEmpty(profile.social && profile.social.instagram) ? null : (
                <a
                  className="text-white p-2"
                  href={profile.social.instagram}
                  target="_blank"
                >
                  <i className="fab fa-instagram fa-2x" />
                </a>
              )}
            </p>
          </div>
    */



    return (
      <div>
        <div className="col-md-12">
          <div style={{backgroundImage: `url(${profile.backgroundPic})`, backgroundSize: '100% 100%',height: 315, width: 851}}>
            <div className="row">
              <img
                className="rounded-circle"
                src={profile.avatar}
                style={{width:150, height:150,display: 'block', position: 'absolute', left: 67.5, bottom: -75, border:'4px solid white'}}
                alt="Profile picture"
              />
              

                <div style={{position: 'absolute', top:5,right:25, opacity: .7}}>
                  <Link to="/add-review" className="btn btn-light">
                    Add Review
                  </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileHeader;
