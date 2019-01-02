import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Geocode from 'react-geocode';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addPost, getPost, deletePost, deleteImage, addImage } from '../../actions/postActions';
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
      newImages: [],
      redirect: false,
      removed: [],
      deleteExistingImages: []
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
        newImages: post.images,
        rent: post.rent,
        startDate: post.startDate,
        endDate: post.endDate,
        postID: post._id,
      });
    }
  }
  onDeleteClick(id) {
    this.props.deletePost(id);
    this.props.history.push("/feed");
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
      
      //console.log('miages before upload    ' +this.state.images.length+ this.state.images);
      //console.log('currfile before upload    ' +this.state.currFile.length+ this.state.currFile);
      
      var tmpImages = this.state.newImages;
      tmpImages.push(fileName);
      this.setState({ images: tmpImages});
      //HAVE TO DO THIS OR ELSE IT DOESNT WORK, CANT DO ...this.state.images

      this.setState({ currFile: [...this.state.currFile, URL.createObjectURL(event.target.files[0])] });
      

     
      this.props.addImage(formData);
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
  onDeleteClickImage(imageURL) {
    console.log('IMAGE URL from delete'+imageURL);
    
    var index = this.state.currFile.indexOf(imageURL);
    var fileName = this.state.images[index];//HAVE TO FUCKING USE IMAGES NOT CURR FILE

    console.log("file deleted is with index: " + index + " name: " + fileName);
   
    var leng = ('https://s3.us-east-2.amazonaws.com/aveneu/').length;
    fileName = fileName.substring(leng);
    var tmpCF = [...this.state.currFile];
    
    var tmpImages = [...this.state.images];
    var imagesIndex = tmpImages.length + index - 1;
    console.log("index we cutting " + imagesIndex);
    tmpCF.splice(index, 1);
    tmpImages.splice(imagesIndex, 1);
    this.setState({images: tmpImages});
    this.setState({ currFile: tmpCF });

    const newFile = {
      fileName : fileName
    };

    
    this.props.deleteImage(newFile);

  }
  onDeleteExistingImage(imageURL){

    var index = this.state.newImages.indexOf(imageURL);
    var tmpImages = [...this.state.newImages];

    var newDeleteExistingImages = [...this.state.deleteExistingImages];
    newDeleteExistingImages.push(imageURL);
    this.setState({ deleteExistingImages: newDeleteExistingImages });

    console.log("file deleted is with index: " + index);

    if (index !== -1) {
      console.log("newimages length" + tmpImages.length);
      tmpImages.splice(index, 1);
      this.setState({images: tmpImages});
      this.setState({newImages: tmpImages});
      console.log("newimages length after" + tmpImages.length);
    }
    console.log("iamgeURL" + imageURL);
    this.setState({ removed: [...this.state.removed, imageURL]});
    var leng = ('https://s3.us-east-2.amazonaws.com/aveneu/').length;
    var fileName = imageURL.substring(leng);
    console.log("file name for " + fileName);
    
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
      id: post._id, // ADDED THIS SO I CAN FIND IT IN WHEN UPDATING
      deleteExistingImages: this.state.deleteExistingImages,
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
    this.setState({ redirect: true });
    this.setState({ removed: [] });
    this.setState({ deleteExistingImages: [] });
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to="/form-submitted" />;
    }


    const { errors } = this.state;
    let imagePreviewContent = null;
    let existingImages = null;
  
    //HAVE TO USE CURRFILE for files not yet saved to s3
    console.log('new render');
    if(this.state.newImages != null) {
     
      var i = 0;
      existingImages = this.state.newImages.map( image => {   
        if(this.state.removed.indexOf(image) == -1) {
          return <img
          onClick={this.onDeleteExistingImage.bind(this, image)}
          style={{width: 100, height: 100, border:0}} 
          onError={(e)=>{e.target.onerror = null; e.target.style.display='none'}}
          src={image} />  
        }
      });
      imagePreviewContent = this.state.currFile.map( image => {
   
        return <img onClick={this.onDeleteClickImage.bind(this, image)}
          style={{width: 100, height: 100, border:0}} src={image} />
      });
    }

    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header headercustom text-white">
            Say Something...
          </div>
          <div className="card-body">
            <form onSubmit={this.onSubmit} method="POST" enctype="multipart/form-data">
              <div className="form-group">
                <button
                    onClick={this.onDeleteClick.bind(this, this.state.postID)}
                    type="button"
                    style={{position:'absolute', right:0,top:5}}
                    className="btn btn-danger mr-1"
                  >
                    <i className="fas fa-times" />
                </button>
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
                
              <br />
              <br />
              <input type="file" name="file" id="file" onChange={this.fileChangedHandler}/>
              {existingImages}
              {imagePreviewContent}

              <br />
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
  deletePost: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  addImage: PropTypes.func.isRequired,
  deleteImage: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, { deletePost, addPost, getPost, getCurrentProfile, addImage, deleteImage })(withRouter(PostForm));
