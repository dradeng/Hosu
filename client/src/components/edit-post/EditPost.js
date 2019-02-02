import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import { addPost, getPost, deletePost, deleteImage, addImage } from '../../actions/postActions';
import { getCurrentProfile } from '../../actions/profileActions';
import LocationAutoComplete from "../common/LocationAutoComplete";
import 'flatpickr/dist/themes/material_blue.css';
import Flatpickr from 'react-flatpickr';


class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      text: '',
      address: '',
      rent: 0,
      images: [],
      errors: {},
      startDate: '',
      endDate: '',
      minimumStay: 0,
      currFile: [],
      newImages: [],
      redirect: false,
      removed: [],
      deleteExistingImages: [],
      disabledDates: [],
      bookedDates: [],
      deletedCount: 0,
      awsCF: [],
      removedCount: 0,
      addedCount: 0,
      recievedProps: false,
    };

    this.onChange = this.onChange.bind(this);
    this.changeAddress = this.changeAddress.bind(this);
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
 
    if (nextProps.post.post && !this.state.recievedProps) {
   
      const post = nextProps.post.post;
    
      var date= [post.startDate, post.endDate];
 
      const { user } = this.props.auth;

      // Set component fields state
      this.setState({
        title: post.title,
        text: post.text,
        address: post.address,
        name: user.name,
        avatar: user.profilePic,
        images: post.images,
        newImages: post.images,
        rent: post.rent,
        startDate: post.startDate,
        endDate: post.endDate,
        postID: post._id,
        bookedDates: post.bookedDates,
        disabledDates: post.blockedDates,
        date: date,
        addedCount: post.images.length,
        minimumStay: post.minimumStay,
        recievedProps: true,
      });
    }
  }
  onDeleteClick(id) {
    this.props.deletePost(id);
    this.props.history.push("/feed");
  }
  //THIS IS FOR A FILE BE UPLOADED
  fileChangedHandler = (event) => {
    event.preventDefault();
    if(event.target.files[0] != null) {
      const file = event.target.files[0];
      
  
      const uuidv4 = require('uuid/v4');
      const formData = new FormData();
      var fileName = uuidv4();

      formData.append('file', file, fileName);

      // I do this after so it only affects the state, not whats uploaded to s3
      // The state & model in the db stores the whole url
      fileName = 'https://s3.us-east-2.amazonaws.com/aveneu/' + fileName;
      
      var tmpImages = this.state.newImages;
      var awsCF = this.state.awsCF;
      awsCF.push(fileName);

      tmpImages.push(fileName);

      var tmpVal = this.state.addedCount + 1;
      this.setState({addedCount : tmpVal });

      this.setState({ images: tmpImages});
      this.setState({ awsCF: awsCF})
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
 
  }
  onDeleteClickImage(imageURL) {
    //imageurl is localhost technically or aveneu.co
    
    if(this.state.removedCount < this.state.addedCount - 1) {
      var indexCF = this.state.currFile.indexOf(imageURL);
      console.log('indexCF ' + indexCF);
      var AWSImage = this.state.awsCF[indexCF];

      var indexImages = this.state.images.indexOf(AWSImage);
      
      var fileName = this.state.images[indexCF];//HAVE TO FUCKING USE IMAGES NOT CURR FILE
      //gets the name of file from aws
      fileName.slice(-36);

      
      var tmpCF = [...this.state.currFile];
      
      var tmpImages = [...this.state.images];
      var tmpAwsCF = [...this.state.awsCF];
   
      
      tmpCF.splice(indexCF, 1);
      tmpImages.splice(indexImages, 1);
      tmpAwsCF.splice(indexCF, 1);
      this.setState({images: tmpImages});
      this.setState({ currFile: tmpCF });
      this.setState({ awsCF: tmpAwsCF });

      var tmpVal = this.state.removedCount + 1;
      this.setState({ removedCount: tmpVal });

      const newFile = {
        fileName : fileName
      };

      
      this.props.deleteImage(newFile);
    }
  }
  onDeleteExistingImage(imageURL){

    if(this.state.removedCount < this.state.addedCount - 1) {
      var index = this.state.newImages.indexOf(imageURL);
      var tmpImages = [...this.state.newImages];
  
      var newDeleteExistingImages = [...this.state.deleteExistingImages];
      newDeleteExistingImages.push(imageURL);
      this.setState({ deleteExistingImages: newDeleteExistingImages });
  
    
  
      if (index !== -1) {
  
        tmpImages.splice(index, 1);
        this.setState({images: tmpImages});
        this.setState({newImages: tmpImages});
       
      }
     
      this.setState({ removed: [...this.state.removed, imageURL]});
      var leng = ('https://s3.us-east-2.amazonaws.com/aveneu/').length;
      var fileName = imageURL.substring(leng);
     

      var tmpVal = this.state.removedCount + 1;
      this.setState({ removedCount: tmpVal });
      
      const newFile = {
        fileName : fileName
      };
      this.props.deleteImage(newFile);
    }

  }
  changeAddress(e) {
    this.setState({ address: e });

  }
  onSubmit(e) {
    e.preventDefault();

    const { user } = this.props.auth;
    const { post } = this.props.post;
    

    const newPost = {
      title: this.state.title,
      text: this.state.text,
      address: this.state.address,
      name: user.name,
      avatar: user.profilePic,
      images: this.state.images,
      rent: this.state.rent,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      id: post._id, // ADDED THIS SO I CAN FIND IT IN WHEN UPDATING
      deleteExistingImages: this.state.deleteExistingImages,
      bookedDates: this.state.bookedDates,
      blockedDates: this.state.disabledDates,
    };

    this.props.addPost(newPost, this.props.history);
    this.setState({ text: '' });
    this.setState({ title: '' });
    this.setState({ address: '' });
    this.setState({ images: [] });
    this.setState({ rent: 0 });
    this.setState({ startDate: '' });
    this.setState({ endDate: '' });
    this.setState({ currFile: []});
    this.setState({ redirect: true });
    this.setState({ removed: [] });
    this.setState({ deleteExistingImages: [] });
    this.setState({ disabledDates: null });
    this.setState({ awsCF: [] });
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
              <small className="d-block pb-3">* = required fields</small>
              <div className="form-group">
                <button
                    onClick={this.onDeleteClick.bind(this, this.state.postID)}
                    type="button"
                    style={{position:'absolute', right:0,top:5}}
                    className="btn btn-danger mr-1"
                  >
                    <i className="fas fa-times" />
                </button>
                <h6>
                  Provide a title*
                </h6>
                <TextAreaFieldGroup
                  placeholder="Title of post"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title} 
                />
              </div>
              <h6>
                Provide details*
              </h6>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Create a post"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={errors.text}
                />
              </div>
              <h6>
                Enter your address*
              </h6>
              <div className="form-group">
                <LocationAutoComplete
                  changeAddress={this.changeAddress}
                  value={this.state.address}
                  original={this.state.address}
                 />
                <div style={{fontSize:13,color:'rgb(220, 53, 69)', paddingTop:5, fontFamily:'-apple-system, BlinkMacSystemFont, Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji, Segoe UI Emoji,Segoe UI Symbol'}}>
                 {errors.address ? errors.address : ''}
                </div>
              </div>
              <div className="form-group">
                <h6>
                  Minimum Stay*
                </h6>
                <InputGroup
                  placeholder="Enter the minimum number of days for a single stay"
                  name="minimumStay"
                  error={errors.minimumStay}
                  value={this.state.minimumStay}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <h6>
                  Price per week*
                </h6>
                <InputGroup
                  placeholder="Enter number for rent"
                  name="rent"
                  icon="fas fa-dollar-sign"
                  error={errors.rent}
                  value={this.state.rent}
                  onChange={this.onChange}
                />
              </div>
              

              <h6>Availability*</h6>
              <Flatpickr
              options = {{mode: "range",minDate: "today"}}
              value={this.state.date}
              onChange={date => { this.setState({date: date, startDate: date[0], endDate:date[1] }); }} />
              <br/>
                

              <h6>Blocked Dates</h6>
                <Flatpickr
                options = {{
                  mode: "multiple", 
                  minDate: "today", 
                  dateFormat: "Y-m-d",
                }}
                value={this.state.disabledDates}
                onChange={disabledDates => { this.setState({disabledDates: disabledDates }); }}
                />
              <br/>
              <br />
              <br />
              Existing Images
              <br />
              <br />
              {existingImages}
              <br />
              <br />
              New Images
              <br />
              <input type="file" name="file" id="file" onChange={this.fileChangedHandler}/>
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
