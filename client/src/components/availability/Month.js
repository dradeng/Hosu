import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router-dom";

const styles = {
  month: {
    width: 55,
    height: 50,
    position: "relative",
    margin: 2
  },
  textStyle: {
    color: "grey",
    fontSize: 11,
    padding: 2
  },
  dateStyle: {
    color: "grey",
    fontSize: 14,
    paddingRight: 2,
    paddingLeft: 2
  },
  left: {
    paddingLeft: 3
  }
};

class Month extends Component {
  /*
    onDeleteClick(id) {
        this.props.deletePost(id);
    }

    onLikeClick(id) {
        this.props.addLike(id);
    }

    onUnlikeClick(id) {
        this.props.removeLike(id);
    }
    findUserLike(likes) {
        const { auth } = this.props;
        if (likes.filter(like => like.user === auth.user.id).length > 0) {
            return true;
        } else {
            return false;
        }
    }
    */

  render() {
    const months = {
      "Jan" : 0,
      "Feb" : 1,
      "Mar" : 2,
      "Apr" : 3,
      "May" : 4,
      "Jun" : 5,
      "Jul" : 6,
      "Aug" : 7,
      "Sep" : 8,
      "Oct" : 9,
      "Nov" : 10,
      "Dec" : 11
    }
    const month = this.props.month.split(" ")[0]
    const date = this.props.month.split(" ")[1]

    const propDate = new Date(new Date().getFullYear(),months[month],date);
    return (
      <div style={styles.month} className="card container-fluid">
        <div
          style={{ ...styles.textStyle, fontSize: 5, paddingTop: 1 }}
          className="row"
        >
          {this.props.period}
        </div>
        {  this.props.period == "start" && ( propDate < new Date()) ? (
          <div style={styles.textStyle} className="row">
            Now
          </div>
        ) : (
          <div style={styles.textStyle} className="row">
            <div className="co-md-7" style={styles.textStyle}>
              {this.props.month}
            </div>
            <div className="col-md-5" style={styles.dateStyle}>
              {this.props.date}
            </div>
          </div>
        )}
        <div style={styles.left} className="row">
          <div style={styles.textStyle}>
            <i
              style={{ fontSize: 15, width: 8, color: "#000000" }}
              className="fa fa-circle"
            />
          </div>
          <div style={styles.textStyle}>
            <i
              style={{ fontSize: 15, width: 8, color: "#000000" }}
              className="fa fa-circle"
            />
          </div>
          <div style={styles.textStyle}>
            <i style={{ fontSize: 15, width: 8 }} className="fa fa-circle" />
          </div>
        </div>
      </div>
    );
  }
}

Month.propTypes = {
  month: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  period: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Month);
