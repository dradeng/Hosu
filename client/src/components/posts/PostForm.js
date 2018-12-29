import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Geocode from 'react-geocode';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addPost, addImage, deleteImage } from '../../actions/postActions';
import AWS from 'aws-sdk';
import TextFieldGroup from "../common/TextFieldGroup";
import InputGroup from "../common/InputGroup";
import LocationSearchInput from "../common/LocationSearchInput";
import { getCurrentProfile } from '../../actions/profileActions';

import 'flatpickr/dist/themes/material_green.css'

import Flatpickr from 'react-flatpickr'

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      text: '',
      address: '',
      longitude: 0,
      latitude: 0,
      rent: 0,
      images: [],
      errors: {},
      startDate: undefined,
      endDate: undefined,
      currFile: [],
      date: [new Date(), new Date()]
    };

    this.onChange = this.onChange.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    console.log(this.state.images);

    const { user } = this.props.auth;
    const { profile } = this.props.profile;
    const newPost = {
      title: this.state.title,
      text: this.state.text,
      address: this.state.address,
      longitude: this.state.longitude,
      latitude: this.state.latitude,
      name: user.name,
      avatar: user.profilePic,
      images: this.state.images,
      rent: this.state.rent,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      profile: profile._id,
    };

    this.props.addPost(newPost);
    this.setState({ text: '' });
    this.setState({ title: '' });
    this.setState({ address: '' });
    this.setState({ images: [] });
    this.setState({ latitude: 0 });
    this.setState({ longitude: 0 });
    this.setState({ rent: 0 });
    this.setState({ startDate: '' });
    this.setState({ endDate: '' });
    this.setState({ currFile: []});



  }
  //THIS IS FOR A FILE BE UPLOADED
  fileChangedHandler = (event) => {

    if(event.target.files[0] != null) {
      const file = event.target.files[0];

      const uuidv4 = require('uuid/v4');
      const formData = new FormData();
      var fileName = uuidv4();

      formData.append('file', file, fileName);

      // I do this after so it only affects the state, not whats uploaded to s3
      // The state & model in the db stores the whole url
      fileName = 'https://s3.us-east-2.amazonaws.com/aveneu/' + fileName;



      this.setState({ images: [...this.state.images, fileName] });
      this.setState({ currFile: [...this.state.currFile, URL.createObjectURL(event.target.files[0])] });


      this.props.addImage(formData);
    }


  }


  onChange(e) {


    this.setState({ [e.target.name]: e.target.value });

    if( e.target.name === 'address')
    {
      this.getLatLong(e.target.value);
    }
  }
  onDeleteClick(imageURL) {
    var index = this.state.currFile.indexOf(imageURL);
    var fileName = this.state.images[index];//HAVE TO FUCKING USE IMAGES NOT CURR FILE


    var leng = ('https://s3.us-east-2.amazonaws.com/aveneu/').length;
    fileName = fileName.substring(leng);
    var tmpCF = [...this.state.currFile];

    var tmpImages = [...this.state.images];
    tmpCF.splice(index, 1);
    tmpImages.splice(index,1);
    this.setState({images: tmpImages});
    this.setState({ currFile: tmpCF });

    const newFile = {
      fileName : fileName
    };


    this.props.deleteImage(newFile);

  }
  getLatLong(address) {
    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.

    const GoogleMapsApi = require('../../config/index').GoogleMapsApi;
    Geocode.setApiKey(GoogleMapsApi);

    // Enable or disable logs. Its optional.
    Geocode.enableDebug();

    // Get latidude & longitude from address.
    Geocode.fromAddress(address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;

        this.setState({ latitude: lat});
        this.setState({ longitude: lng});
      },
      error => {
        //console.error(error);
        //Commented out because it says an error when ur not done typing out address
      }
    );


  }

  render() {
    const { user } = this.props.auth;

    if (!user.profile) {
      return <Redirect to='/dashboard' />
    }
    const { errors } = this.state;
    let imagePreviewContent = null;

    //HAVE TO USE CURRFILE IF USE IMAGES THE SRC DOES NOT RECOGNOIZE THE URL FOR SOME REASON
    //MIGHT COME BACK TO< BUT PAIN IN THE ASS
    if(this.state.images != null) {

      imagePreviewContent = this.state.currFile.map( image => {

        return <img onClick={this.onDeleteClick.bind(this, image)}
          style={{width: 100, height: 100, border:0}} src={image} />
      });
    }
    const { startDate, endDate } = this.state;
    return (
      <div className="post-form mb-3">
          <div className="container">
              <div className="row">
                  <div className="col-md-8 m-auto">
                      <h4 className="display-4 text-center">Sublet your room</h4>
                      <br/>
                      <form onSubmit={this.onSubmit} method="POST" encType="multipart/form-data">
                          <div key="1" className="form-group">
                              <h6>
                                 Provide a title
                              </h6>
                              <InputGroup
                                placeholder="ex. Draden's Magic Bungalow"
                                name="title"
                                value={this.state.title}
                                onChange={this.onChange}
                                error={errors.title}
                              />
                              <h6>
                                  Provide details
                              </h6>
                              <TextAreaFieldGroup
                                  placeholder="Create a post"
                                  name="text"
                                  value={this.state.text}
                                  onChange={this.onChange}
                                  error={errors.text}
                              />
                          </div>
                          <div key="2" className="form-group">
                              <h6>
                                  Enter your address
                              </h6>
                              <InputGroup
                                placeholder="ex. 320 14th St NW"
                                name="address"
                                value={this.state.address}
                                onChange={this.onChange}
                                error={errors.address}
                              />
                          </div>
                          <div key="3" className="form-group">
                              <h6>
                                  Price per week
                              </h6>
                              <InputGroup
                                placeholder="Enter number for rent"
                                name="rent"
                                icon="fas fa-dollar-sign"
                                value={this.state.rent}
                                onChange={this.onChange}
                              />
                          </div>


                          <h6>Availability</h6>
                          <Flatpickr
                          options = {{mode: "range",minDate: "today"}}
                          value={this.state.date}
                          onChange={date => { this.setState({date: date, startDate: date[0], endDate:date[1] }); }} />
                          <br/>


                          <div>
                              <h6> Add Photos </h6>
                          <input className="form-control" type="file" name="file" id="file" onChange={this.fileChangedHandler}/>
                          {imagePreviewContent}

                          </div>
                          <br/>


                          <button type="submit" className="btn btncustom">
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

PostForm.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  addImage: PropTypes.func.isRequired,
  deleteImage: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  profile: state.profile
});

export default connect(mapStateToProps, { addPost, addImage, deleteImage, getCurrentProfile })(PostForm);
