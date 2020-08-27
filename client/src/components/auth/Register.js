import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Recaptcha from 'react-google-recaptcha';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { registerUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      profilePic: '',
      errors: {},
      recaptchaValue: '',
      termsOfService: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.verifyRecaptcha = this.verifyRecaptcha.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
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
  verifyRecaptcha(value) {
    this.setState({ recaptchaValue: value });
  }
  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      profilePic: this.state.profilePic,
      recaptchaValue: this.state.recaptchaValue,
      termsOfService: this.state.termsOfService
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your Aveneu account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Name*"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />
                <TextFieldGroup
                  placeholder="Email*"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
                />
                <TextFieldGroup
                  placeholder="Password*"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <TextFieldGroup
                  placeholder="Confirm Password*"
                  name="password2"
                  type="password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />

                Profile Picture
                <br />
                <input type="file" name="file" id="file" onChange={this.fileChangedHandler}/>

                <br />
                <br />
                
                <input
                  name="termsOfService"
                  type="checkbox"
                  checked={this.state.termsOfService}
                  onChange={this.onChange}
                  style={{display: 'inline-block'}}
                />
                <div style={{marginLeft: 5, display: 'inline-block'}}>
                  I agree to the Aveneu <Link to="/terms-of-service" >Terms of Service</Link> & <Link to="/privacy-policy">Privacy Policy</Link>
                </div>
                <div style={{fontSize:13,color:'rgb(220, 53, 69)', paddingBottom: 5, fontFamily:'-apple-system, BlinkMacSystemFont, Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji, Segoe UI Emoji,Segoe UI Symbol'}}>
      
                  {errors.termsOfService ? errors.termsOfService : ''}
                </div>

                <Recaptcha
                  sitekey="6Lc5oYUUAAAAAF6sHPPXu6MVEar5pMIVNNxFlZEe"
                  onChange={this.verifyRecaptcha}
                  style={{marginTop: 15}}
                />
              
                <div style={{fontSize:13,color:'rgb(220, 53, 69)', paddingTop:5, fontFamily:'-apple-system, BlinkMacSystemFont, Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji, Segoe UI Emoji,Segoe UI Symbol'}}>
                  {errors.recaptchaValue ? errors.recaptchaValue : ''}
                </div>

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

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
