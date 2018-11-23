import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';
import { getChats } from '../../actions/chatActions';

import AveLogo from '../../assets/AveLogo.png';
import UserIcon from '../../assets/UserIcon.png';
import Chat from "../chat/Chat";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
      this.messageToggle = this.messageToggle.bind(this);

      this.state = {
      dropdownOpen: false,
        messageOpen: false,
    };
  }
  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  messageToggle() {
      this.setState(prevState => ({
          messageOpen: !prevState.messageOpen
      }));
  }
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    let options = [
      {
        text: 'Profile',
        value: 'Profile',
      },
      {
        text: 'Logout',
        value: 'Logout',
      },
    ];

    const authLinks = (
      <ul  className="navbar-nav ml-auto">
        <li className="nav-item">
            <Link className="nav-link" to="/sublet">
                <span style={{color: '#B4B4B4'}}>Post a Sublet</span>
            </Link>
        </li>
        <li  className="nav-item">
          <Link className="nav-link" to="/feed">
              <span style={{color: '#B4B4B4'}}> Sublets </span>
          </Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/favorites">
                <span style={{color: '#B4B4B4'}}>Favorites</span>
            </Link>
        </li>
        <li className="nav-item">
           <Dropdown className="nav-link" isOpen={this.state.messageOpen} toggle={this.messageToggle}>
              <DropdownToggle   style={{backgroundColor: 'transparent', borderWidth:0, padding:0,margin:0}}>

               <span style={{color: '#B4B4B4'}}>Messages</span>

              </DropdownToggle>
                <DropdownMenu>

                     {this.props.chat ? this.props.chat.chats.map(chat =>
                         <DropdownItem>
                         <Link  onClick="window.location.reload()" to={{pathname: `/chat/${chat._id}`, user2: chat.user2}} >
                             <span style={{color: '#B4B4B4'}}> {chat.user2Name}</span>
                         </Link>
                         </DropdownItem>
                         ) :
                     <div>
                         n/a
                     </div>}


                </DropdownMenu>
            </Dropdown>
        </li>
        <li className="nav-item">
          <span className="nav-link">
           <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle style={{backgroundColor: 'transparent', borderWidth:0, padding:0,margin:0}}>
                  {(user.profilePic !== null) ?
                <img
                  className="rounded-circle"
                  src={user.profilePic }
                  alt={user.name}
                  style={{ width: '25px', marginRight: '5px' }}
                  title="You must have a Gravatar connected to your email to display an image"
                />
                      :
                      <img
                          className="rounded-circle"
                          src={UserIcon}
                          alt={user.name}
                          style={{ width: '25px', marginRight: '5px' }}
                          title="You must have a Gravatar connected to your email to display an image"
                      />
                  }
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <Link to="/dashboard">
                     <span style={{color: '#B4B4B4'}}>Profile</span>
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <a
                    href=""
                    onClick={this.onLogoutClick.bind(this)}
                    className="nav-link"
                  > 
                    <span style={{color: 'Blue'}}>Logout</span> 
                  </a>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </span>    
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
              <span style={{color: '#B4B4B4'}}>Sign Up </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
              <span style={{color: '#B4B4B4'}}> Login </span>
          </Link>
        </li>
      </ul>
    );

    return (
      <nav style={{backgroundColor: '#ffffff',borderBottom: '1px solid rgba(0,0,0,0.25)'}} className="navbar navbar-expand-sm navbar-dark  mb-4">
          <img style={{width: 40}} src={AveLogo}/>

          <div className="container">
          <Link className="navbar-brand" to="/">
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
          
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
    chat: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
    chat: state.chat,
});

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile })(
  Navbar
);
