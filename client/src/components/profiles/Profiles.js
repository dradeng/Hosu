import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import ProfileItem from './ProfileItem';
import Map from '../map/Map';
import { getProfiles, getCurrentProfile } from '../../actions/profileActions';

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfiles();
    this.props.getCurrentProfile();

  }

  render() {
    const { profiles,profile, loading } = this.props.profile;
    let profileItems;
    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map(pro => {
          if (profile !== null) {

                   return (   <ProfileItem key={pro._id} profile={pro} isFavorited={true}/>
                   );


          }
            return (
            <ProfileItem key={pro._id} profile={pro} isFavorited={false}/>
          );
        });
      } else {
        profileItems = <h4>No profiles found...</h4>;
      }
    }

    return (
      <div  className="profiles">
        <div className="container">
          <div className="row">
            <div style={{overflow: 'scroll', height: '100vh'}} className="col-md-12">
              <h1 className="display-4 text-center">Developer Profiles</h1>
              <p className="lead text-center">
                Browse and connect with developers
              </p>
              {profileItems}



            </div>


          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles, getCurrentProfile })(Profiles);
