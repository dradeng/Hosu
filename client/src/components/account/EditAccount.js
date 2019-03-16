import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import isEmpty from '../../validation/is-empty';
import { updateUser } from '../../actions/authActions';

class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {

      name: '',
      email: '',
      profilePic: '',
      oldPassword: '',
      newPassword2: '',
      newPassword: '',
      errors: {},
      showName: true,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.iconClicked = this.iconClicked.bind(this);
    this.onSubmitName = this.onSubmitName.bind(this);
  }

  componentDidMount() {

    const { user } = this.props.auth;
    this.setState({
      email: user.email,
      name: user.name,
      profilePic: user.profilePic,
    });

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  iconClicked(e) {
    console.log('we made it');
    if(this.state.showName) {
      this.setState({showName: false});
    } else {
      this.setState({showName: true});
    }
  }
  fileChangedHandler = (event) => {

    if(event.target.files[0] != null) {
      const file = event.target.files[0];

      // this.setState({selectedFile: event.target.files[0]});
      const uuidv4 = require('uuid/v4');
      const formData = new FormData();
      var fileName = uuidv4();

      formData.append('file', file, fileName);

      // I do this after so it only affects the state, not whats uploaded to s3
      // The state & model in the db stores the whole url
      fileName = 'https://s3.us-east-2.amazonaws.com/aveneu/' + fileName;

      this.setState({profilePic: fileName});


      axios.post('api/posts/uploads', formData);
    }
  }
  onSubmitName(e) {
    e.preventDefault();

    this.setState({ showName: true});

    const profileData = {
      name: this.state.name,
    };

    //this.props.updateUserName(profileData, this.props.history);
  }
  onSubmitEmail(e) {
    e.preventDefault();


    //this.props.updateUserEmail(profileData, this.props.history);
  }
  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      name: this.state.name,
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword,
      newPassword2: this.state.newPassword2,
      email: this.state.email,
      profilePic: this.state.profilePic,
    };

    this.props.updateUser(profileData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    const { user } = this.props.auth;

    const name = this.state.name;
    const showName = this.state.showName;

    /*
    { showName ?
        <div onClick={this.iconClicked}>
          {this.state.name}
          <i style={{fontSize: 16, paddingLeft: 5, color: 'gray'}} class="fas fa-pencil-alt"></i>
        </div>
      :
      <TextFieldGroup
        placeholder="name"
        name="name"
        value={this.state.name}
        onChange={this.onChange}
        error={errors.name}
        info="Name"
      />
    }

    */


    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Account Overview</h1>
              <form onSubmit={this.onSubmitName}>
                <div style={{display: 'inline-block'}}>
                  <div style={{float: 'left', position: 'relative'}}>
                    <img
                      className="rounded-circle"
                      style={{width:120, height:120 }}
                      src={this.state.profilePic}
                    />
                    <div style={{ position: 'absolute', right: 0, bottom: 0}} onClick={this.iconClicked}>
                      <i style={{fontSize: 16, paddingLeft: 5, color: 'gray'}} class="fas fa-pencil-alt"></i>
                    </div>

                  </div>
                  <div style={{float: 'right', marginTop: 30}}>
                    <div style={{paddingLeft: 20, display: 'inline'}} onClick={this.iconClicked}>
                      {this.state.name}
                      <i style={{fontSize: 16, paddingLeft: 5, color: 'gray'}} class="fas fa-pencil-alt"></i>
                    </div>

                    <div style={{paddingLeft: 20}} onClick={this.iconClicked}>
                      {this.state.email}
                      <i style={{fontSize: 16, paddingLeft: 5, color: 'gray'}} class="fas fa-pencil-alt"></i>
                    </div>
                    <div style={{paddingLeft: 20, color: 'rgb(2, 136, 228)'}}>
                      <b>Update password</b>
                    </div>
                  </div>

                </div>
                <button type="submit" style={{display: 'none'}} className="btncustom btn btn-block mt-4">
                  Submit
                </button>

              </form>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="Email"
                />
                 <TextFieldGroup
                  placeholder="Old Password"
                  name="oldPassword"
                  value={this.state.oldPassword}
                  onChange={this.onChange}
                  error={errors.oldPassword}
                  info="What is your old password"
                />
                {errors.password}
                <TextFieldGroup
                  placeholder="new password"
                  name="newPassword"
                  value={this.state.newPassword}
                  onChange={this.onChange}
                  error={errors.newPassword}
                  info="What is your new password"
                />
                <TextFieldGroup
                  placeholder="retype new password"
                  name="newPassword2"
                  error={errors.newPassword2}
                  value={this.state.newPassword2}
                  onChange={this.onChange}
                  info="Retype your new password"
                />

                <button type="submit" className="btncustom btn btn-block mt-4">
                  Submit
                </button>
              </form>
              <form onSubmit={this.onSubmit}>

                <br />
                <input type="file" name="file" id="file" onChange={this.fileChangedHandler}/>


                <button type="submit" className="btncustom btn btn-block mt-4">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditAccount.propTypes = {
  updateUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { updateUser })( withRouter(EditAccount));
