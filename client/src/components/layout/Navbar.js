import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Geocode from 'react-geocode';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile, updateSearch } from '../../actions/profileActions';
import { getChats } from '../../actions/chatActions';
import HausFlexLogo from '../../assets/hausflex.jpg';
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
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
  onSubmit(e) {
    e.preventDefault();
    
    var searchInfo = {
      address: this.state.addressSearch
    };
    this.props.updateSearch(searchInfo);
    //THIS ALWAYS MAKES SURE THE SEARCH GOES TO THE FEED
    this.props.history.push('/feed');
    //THIS ENSURES THE LOCATION IS LOADED PROPERLY
    window.location.reload();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
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
    const showSearchBar = isAuthenticated && user.profile;
    const searchBar = (
      <form onSubmit={this.onSubmit} style={{marginLeft: 15}}>
        <input onChange={this.onChange} type="text" name="addressSearch" placeholder="search" />
        <button type="submit" style={{display:"none"}}>
          Submit
        </button>

      </form>
    );
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
          <Link className="nav-link" to="/chats">
            <span style={{color: '#B4B4B4'}}>Messages</span>
          </Link>
        </li>
        <li className="nav-item">
          <span className="nav-link">
           <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle style={{backgroundColor: 'transparent', borderWidth:0, padding:0,margin:0}}>
                <img
                  className="rounded-circle"
                  src={user.profilePic }
                  alt={user.name}
                  style={{ width: 30, height:30, marginRight: '5px' }}
                  title="You must have a Gravatar connected to your email to display an image"
                />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <Link className="nav-link" to="/dashboard">
                     <span style={{color: '#B4B4B4'}}>Profile</span>
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <a
                    href=""
                    onClick={this.onLogoutClick.bind(this)}
                    className="nav-link"
                  >
                    <span style={{color: '#B4B4B4'}}>Logout</span> 
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
        <img style={{width: 40}} src={HausFlexLogo}/>
        {showSearchBar ? searchBar : null }
        <div className="container">

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

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile, updateSearch })(
  withRouter(Navbar)
);
