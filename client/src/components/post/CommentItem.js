import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteComment } from '../../actions/postActions';

class CommentItem extends Component {
  onDeleteClick(postId, commentId) {
    this.props.deleteComment(postId, commentId);
  }

  render() {
    const { comment, postId, auth } = this.props;

    return (
      <div>
        <div className="row">
          <div style={{margin:15}}>
              <img
                className="rounded-circle d-none d-md-block"
                src={comment.avatar}
                style={{ marginLeft: 15, marginRight: 15, width:30,height:30}}
                alt="Profile picture"
              />
            <br />
          </div>

         
          <div class="column" className="text-center">
          
            <div class="row" style={{fontWeight:'bold'}}>

              {comment.name}

              <div>
                {comment.user === auth.user.id ? (
                  <button
                    style={{left:0}}
                    onClick={this.onDeleteClick.bind(this, postId, comment._id)}
                    type="button"
                    class="close" 
                    aria-label="Close"
                  >
                    <i style={{paddingBottom:5, height:18}} class="fa fa-trash"></i>
                  </button>
                ) : null}
              </div>


            </div>
            <div class="row">{comment.text}</div>
          </div>
        </div>
      </div>
    );
  }
}

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
