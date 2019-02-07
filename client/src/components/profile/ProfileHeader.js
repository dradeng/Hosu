import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from '../../validation/is-empty';
import { addChat } from '../../actions/chatActions';

class ProfileHeader extends Component {

  render() {
    const { profile } = this.props;
    
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
                <div style={{position: 'absolute', top:5,right:150, opacity: .7}}>
                  <Link to="/add-review" className="btn btn-light">
                    Send Message
                  </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileHeader.propTypes = {
  addChat: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { addChat }) (ProfileHeader);
