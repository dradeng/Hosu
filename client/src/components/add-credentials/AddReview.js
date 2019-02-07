import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import Rating from 'react-rating';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addReview, getCurrentProfile } from '../../actions/profileActions';

class AddReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            rating: 0,
            errors: {},
            disabled: false
        };

        this.onChange = this.onChange.bind(this);
        this.updateRating = this.updateRating.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCheck = this.onCheck.bind(this);
    }
    componentDidMount() {
        this.props.getCurrentProfile();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    onSubmit(e) {
        e.preventDefault();
        const { user } = this.props.auth;
        const { profile } = this.props.profile;

        const reviewData = {
            userName: user.name,
            user: this.props.match.params.id,
            profilePic: user.profilePic,
            description: this.state.description,
            rating: this.state.rating,
        };
        this.props.addReview(reviewData, this.props.history);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    updateRating(e) {
        
        this.setState({ rating: e});
    }
    onCheck(e) {
        this.setState({
            disabled: !this.state.disabled,
            current: !this.state.current
        });
    }

    render() {
        const { errors } = this.state;
        
        return (
            <div className="add-education">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <Link to="/dashboard" className="btn btn-light">
                                Go Back
                            </Link>
                            <h1 className="display-4 text-center">Write {this.props.target} a review</h1>
                            <small className="d-block pb-3">* = required fields</small>
                            <form onSubmit={this.onSubmit}>
                                <h6>Rating</h6>
                                <Rating
                                    onChange={this.updateRating}
                                    initialRating={this.state.rating}
                                    emptySymbol="far fa-star fa-2x"
                                    fullSymbol="fa fa-star fa-2x"
                                />
                                <h6>Description</h6>
                                <TextAreaFieldGroup
                                    placeholder="Write a description"
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.onChange}
                                    error={errors.description}
                                />
                                <button type="submit" className="btncustom btn btn-block mt-4">
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

AddReview.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    addReview: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile,
    errors: state.errors,
});

export default connect(mapStateToProps, { addReview, getCurrentProfile })(
    withRouter(AddReview)
);
