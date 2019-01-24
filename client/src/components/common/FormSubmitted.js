
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';


class FormSubmitted extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }
  componentDidMount() {
  	this.props.getCurrentProfile();

	setTimeout(function() { //Start the timer
	  this.setState({redirect: true}) //After 30 seconds, set render to true
	}.bind(this), 30000)
  }
  render() {
	  const { user } = this.props.auth;

	  if(this.state.redirect) {
	  	return <Redirect to='/feed' />
	  }

    var imageURL = "s3.us-east-2.amazonaws.com/aveneu/DefaultBackgroundPicture.jpg";


    //WHEN TESTING THE URLS FOR THE FB SHARE AND OTHER SHARES THE URLS ARE SUPER FINICKY
    //POSSBILY NEED TO HAVE THE HTTPS AND / AT THE END, MAKE SURE TO DELETE CACHE AND CLOSE BROWSER
    //EACH NEW RENDERING TO TEST TO SEE IF IT WORKS WITH THE NEWEST INFO

	  return (
	    <div style={{textAlign:'center'}}>
        <MetaTags>
          <meta property="og:image" content="s3.us-east-2.amazonaws.com/aveneu/DefaultBackgroundPicture.jpg"/>
        </MetaTags>
	      <h3>Thankyou {user.name}! Your sublet has been submitted successfully. This page will redirect to the feed in a 30 seconds. Feel free to share
        to share this post on Facebook, Twitter, or Whatsapp!</h3>
        <div>
          <div style={{display: 'inline-block'}}>
            <FacebookShareButton style={{padding: 5, maxWidth: 100, float:'left'}} title='Posted my sublet on Aveneu' url='https://salty-plateau-48594.herokuapp.com/'>
              <FacebookIcon size={32} />
            </FacebookShareButton>
            <TwitterShareButton style={{padding: 5,  maxWidth: 100, float: 'left'}} title='Posted my sublet on Aveneu' url='https://salty-plateau-48594.herokuapp.com/'>
              <TwitterIcon size={32} />
            </TwitterShareButton>
            <WhatsappShareButton style={{padding: 5,  maxWidth: 100, float:'left'}} title='Posted my sublet on Aveneu' url='https://salty-plateau-48594.herokuapp.com/'>
              <WhatsappIcon size={32} />
            </WhatsappShareButton>
          </div>
        </div>
	    </div>
	  );
    }
}

FormSubmitted.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile,
	auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(FormSubmitted);