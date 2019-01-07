import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';
import { addComment } from '../../actions/postActions';

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      errors: {}
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

    const { user } = this.props.auth;
    const { postId } = this.props;
    const newComment = {
      text: this.state.text,
      name: user.name,
      avatar: user.profilePic
    };

    this.props.addComment(postId, newComment);
    this.setState({ text: '' });
    
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let imgSrc;

    if (profile === null || loading) {
      // dop nothign
    } else {
      imgSrc = user.profilePic;
    }

    return (
      <div className="post-form mb-3">
        <div className="card-info">
          <div className="card-header headercustom text-white">
            Make a comment...
          </div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div style={{display:'flex'}} className="form-group">
                
                <img
                  
                  className="rounded-circle"
                  src={imgSrc}
                  style={{ width:30, height:30, marginRight: '15px'}} />
                <input 
                  
                  name="text" 
                  type="text" 
                  value={this.state.text} 
                  onChange={this.onChange} 
                  style={{ borderRadius:2, borderWidth:1, width:'100%' }}/>
                
                
              </div>
              <button type="submit" style={{display:"none"}}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CommentForm.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  profile: state.profile,
});

export default connect(mapStateToProps, { addComment, getCurrentProfile })(CommentForm);
