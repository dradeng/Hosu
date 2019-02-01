import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addPost, addImage, deleteImage } from '../../actions/postActions';
import Spinner from '../common/Spinner';
import InputGroup from "../common/InputGroup";
import LocationAutoComplete from "../common/LocationAutoComplete";
import { getCurrentProfile } from '../../actions/profileActions';

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
      startDate: undefined,
      endDate: undefined,
      currFile: [],
      date: [new Date(), new Date()],
      minimumStay: 0,
      disabledDates: null,
    };

    this.changeAddress = this.changeAddress.bind(this);
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

    const { user } = this.props.auth;
    const { profile } = this.props.profile;
  
    var addedDates = [];

    if(this.state.disabledDates) {
      for(var i = 0; i < this.state.disabledDates.length; i++){
        var tmp = {
          from: this.state.disabledDates[i],
          to: this.state.disabledDates[i],
        };
        addedDates.push(tmp);
      }
    }

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
      profile: profile._id,
      minimumStay: this.state.minimumStay,
      bookedDates: addedDates,
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
    this.setState({ minimumStay: 0 });
    this.setState({ disabledDates: null });

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

  }
  changeAddress(e) {
    this.setState({ address: e });

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
  render() {
    const { user }  = this.props.auth;
    const { errors } = this.state;
    const { profile } = this.props.profile;
    let imagePreviewContent = null;

    if(user === null || profile === null) {
      //do nothing
    } else {
      if(!user.profile && profile === null) {
        return <Redirect to='/dashboard' />;
      }
    }

    //HAVE TO USE CURRFILE IF USE IMAGES THE SRC DOES NOT RECOGNOIZE THE URL FOR SOME REASON
    //MIGHT COME BACK TO< BUT PAIN IN THE ASS
    if(this.state.images != null) {

      imagePreviewContent = this.state.currFile.map( image => {

        return <img onClick={this.onDeleteClick.bind(this, image)}
          style={{width: 100, height: 100, border:0}} src={image} 
          alt="Images to be added"
          />
      });
    }
    const { startDate, endDate } = this.state;

    var borderStyle = errors.images ? {borderColor:'rgb(220, 53, 69)'} : null;

    //MIGHT TRY TO REFFACTOR THE FILE INPUT LATER BUT ATM IT WILL DO
    //WOULD NEED TO DO A FILEINPUTGROUP FILE



    return (

      <div>
      { user !== null ? <div className="post-form mb-3">
          <div className="container">
              <div className="row">
                  <div className="col-md-8 m-auto">
                      <h4 className="display-4 text-center">Sublet your room</h4>
                      <br/>
                      <small className="d-block pb-3">* = required fields</small>
                      <form onSubmit={this.onSubmit} method="POST" encType="multipart/form-data">
                          <div key="1" className="form-group">
                              <h6>
                                 Provide a title*
                              </h6>
                              <InputGroup
                                placeholder="ex. Draden's Magic Bungalow"
                                name="title"
                                value={this.state.title}
                                onChange={this.onChange}
                                error={errors.title}
                              />
                              <h6>
                                  Provide details*
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
                                  Enter your address*
                              </h6>
                              <LocationAutoComplete
                                changeAddress={this.changeAddress}
                                value={this.state.address}
                              />
                              <div style={{fontSize:13,color:'rgb(220, 53, 69)', paddingTop:5, fontFamily:'-apple-system, BlinkMacSystemFont, Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji, Segoe UI Emoji,Segoe UI Symbol'}}>
                               {errors.address ? errors.address : ''}
                              </div>
                          </div>
                          <div key="3" className="form-group">
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
                          <div key="4" className="form-group">
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
                          options = {{mode: "multiple", minDate: "today"}}
                          value={this.state.disabledDates}
                          onChange={disabledDates => { this.setState({disabledDates: disabledDates }); }}
                          />
                          <br/>

                          

                          <div>
                              <h6> Add Photos* </h6>
                          <input style={borderStyle} className="form-control" type="file" name="file" id="file" onChange={this.fileChangedHandler}/>

                          <div style={{fontSize:13,color:'rgb(220, 53, 69)', paddingTop:5, fontFamily:'-apple-system, BlinkMacSystemFont, Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji, Segoe UI Emoji,Segoe UI Symbol'}}>
                            
                            {errors.images ? errors.images : ''}
                          </div>

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
      </div> :
      <Spinner/>


    }
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
