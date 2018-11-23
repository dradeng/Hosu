import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Geocode from 'react-geocode';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addPost,getPost } from '../../actions/postActions';
import { getCurrentProfile } from '../../actions/profileActions';
import AWS from 'aws-sdk';

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
  }
componentDidMount() {

    this.props.getPost(this.props.match.params.id);
    this.props.getCurrentProfile();
}
componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
     
      this.setState({ errors: nextProps.errors });
    }
 
    if (nextProps.post.post) {
   
      const post = nextProps.post.post;
    

 
      const { user } = this.props.auth;

      // Set component fields state
      this.setState({
        title: post.title,
        text: post.text,
        address: post.address,
        longitude: post.longitude, 
        latitude: post.latitude, 
        name: user.name,
        avatar: user.profilePic,
        images: post.images,
        rent: post.rent,
        startDate: post.startDate,
        endDate: post.endDate,
      });
    }
  }
  onSubmit(e) {
    e.preventDefault();

    const { user } = this.props.auth;
    const { post } = this.props.post;
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
      id: post._id // ADDED THIS SO I CAN FIND IT IN WHEN UPDATING
    };

    this.props.addPost(newPost, this.props.history);
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
      
      axios.post('api/posts/uploads', formData);
    }


  }
  onStartDateChange(dateValue){
    
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var startDate = months[dateValue.getMonth()] + ' ' + dateValue.getDay();

    this.setState({ 'startDate' : startDate });
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
    
    if(fileName > 0)
    { 
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

      axios.post('api/posts/delete/uploads', newFile);
    }

  }
  onDeleteExistingImage(imageURL) {
    var index = this.state.currFile.indexOf(imageURL);
    var fileName = this.state.images[index];//HAVE TO FUCKING USE IMAGES NOT CURR FILE

   
    var leng = ('https://s3.us-east-2.amazonaws.com/aveneu/').length;
    
    if(fileName > 0)
    { 
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

      axios.post('api/posts/delete/uploads', newFile);
    }

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
    const { errors } = this.state;
    let imagePreviewContent = null;
    let existingImages = null;
  
    //HAVE TO USE CURRFILE for files not yet saved to s3
    if(this.state.images != null) {
     

      existingImages = this.state.images.map( image => {
   
        return <img onClick={this.onDeleteExistingImage.bind(this, image)}
          style={{width: 100, height: 100, border:0}} src={image} />
      });
      imagePreviewContent = this.state.currFile.map( image => {
   
        return <img onClick={this.onDeleteClick.bind(this, image)}
          style={{width: 100, height: 100, border:0}} src={image} />
      });
    }

    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Say Somthing...</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit} method="POST" enctype="multipart/form-data">
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Title of post"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title} 
                />
              </div>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Create a post"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={errors.text}
                />
              </div>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Address of post (this will not be publicly visible)"
                  name="address"
                  value={this.state.address}
                  onChange={this.onChange}
                  error={errors.address}
                />
              </div>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Enter number for rent"
                  name="rent"
                  value={this.state.rent}
                  onChange={this.onChange}
                  error={errors.rent}
                />
              </div>
              

              <p>Start Date:</p>
              <DayPickerInput
                name="startDate"
                value={this.state.startDate}
                onDayChange={this.onStartDateChange}/>
              <DayPickerInput
                name="endDate"
                value={this.state.endDate}
                onDayChange={this.onEndDateChange}/>
              <br/>

              <input type="file" name="file" id="file" onChange={this.fileChangedHandler}/>
              {existingImages}
              {imagePreviewContent}

              <br />
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
         
            </form>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  getPost: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  post: state.post,
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps, { addPost, getPost, getCurrentProfile })(withRouter(PostForm));
