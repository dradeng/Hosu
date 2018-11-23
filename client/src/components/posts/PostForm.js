import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Geocode from 'react-geocode';
import axios from 'axios';
import { connect } from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import Dropzone from 'react-dropzone'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addPost } from '../../actions/postActions';
import AWS from 'aws-sdk';
import TextFieldGroup from "../common/TextFieldGroup";
import LocationSearchInput from "../common/LocationSearchInput";

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
      startDate: '',
      endDate: '',
      currFile: [],
    };

    this.onChange = this.onChange.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.changeAddress = this.changeAddress.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const { user } = this.props.auth;

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
      
      // this.setState({selectedFile: event.target.files[0]});
      const uuidv4 = require('uuid/v4');
      const formData = new FormData();
      var fileName = uuidv4();

      formData.append('file', file, fileName);

      // I do this after so it only affects the state, not whats uploaded to s3
      // The state & model in the db stores the whole url
      fileName = 'https://s3.us-east-2.amazonaws.com/aveneu/' + fileName;
      

      
      this.setState({ images: [...this.state.images, fileName] });
      this.setState({ currFile: [...this.state.currFile, URL.createObjectURL(event.target.files[0])] });
      //console.log('currfile during upload' + this.state.currFile);
      //console.log('miages during upload' + this.state.images);
      //console.log('FILE NAME DURING UPLOAd' + fileName);
      axios.post('api/posts/uploads', formData);
    }


  }
  onStartDateChange(dateValue){
    
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var startDate = months[dateValue.getMonth()] + ' ' + dateValue.getDay();

    this.setState({ 'startDate' : startDate });
  }

  changeAddress(newAddress) {
      this.getLatLong(newAddress);

      this.setState({address: newAddress});
      //this.changeProp(newAddress);

  }
  onEndDateChange(dateValue){

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var endDate = months[dateValue.getMonth()] + ' ' + dateValue.getDay();

    this.setState({ 'endDate' : endDate });
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

    console.log("FILE CLIENT"+fileName);
    const newFile = {
      fileName : fileName
    };

    axios.post('api/posts/delete/uploads', newFile);
  

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
    console.log(this.state.latitude);
  
  }

  render() {
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
                          <input
                                  placeholder="ex. Jake's Magic Bungalow"
                                  name="title"
                                  type="text"
                                  className="form-control"
                                  value={this.state.title}
                                  onChange={this.onChange}
                                  error={errors.title}
                              />
                              <br/>
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
                              <LocationSearchInput
                                  changeIt={(address) => this.changeAddress(address)}

                              />
                          </div>
                          <div key="3" className="form-group">
                              <h6>
                                  Price per week
                              </h6>
                              <div className="input-group mb-3">
                                  <div className="input-group-prepend">
                                      <span className="input-group-text">$</span>
                                  </div>
                                  <input type="text" className="form-control"
                                         placeholder="Enter number for rent"
                                         name="rent"
                                         type="number"
                                         className="form-control"
                                         value={this.state.rent}
                                         onChange={this.onChange}
                                         aria-label="Amount (to the nearest dollar)"/>
                              </div>
                          </div>


                          <h6>Start Date:</h6>
                          <DayPickerInput
                              name="startDate"
                              value={this.state.startDate}
                              onDayChange={this.onStartDateChange}/>
                          <DayPickerInput
                              name="endDate"
                              value={this.state.endDate}
                              onDayChange={this.onEndDateChange}/>
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
  addPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { addPost })(PostForm);
