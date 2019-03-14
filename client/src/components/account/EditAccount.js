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
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {

    const { user } = this.props.auth;
    this.setState({
      email: user.email,
      name: user.name,
      profilePic: user.profilePic,
    });

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
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Edit Account</h1>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                  info="Name"
                />
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
                  info="What is your old password"
                />
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

                Profile Picture
                <br />
                <img src={this.state.profilePic} />
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
