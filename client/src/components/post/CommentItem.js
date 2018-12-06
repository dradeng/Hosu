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
            <a href="profile.html">
              <img
                className="rounded-circle d-none d-md-block"
                src={comment.avatar}
                style={{ marginLeft: 15, width:30,height:30}}
              />
            </a>
            <br />
          </div>

          <div>
            <span className="text-center" style={{}}>
              <span style={{fontWeight:'bold'}}>{comment.name}</span>

              {comment.user === auth.user.id ? (
                <button
                  onClick={this.onDeleteClick.bind(this, postId, comment._id)}
                  type="button"
                  class="close" 
                  aria-label="Close"
                >
                  <i style={{width:15,height:12,paddingBottom:2, verticalAlign: 'middle', display:'inline-block'}} class="fa fa-trash"></i>
                </button>
              ) : null}


            </span>
            <br />
            <span className="lead">{comment.text}</span>
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
