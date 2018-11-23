import React, { Component } from 'react';
import isEmpty from '../../validation/is-empty';
import {Link} from "react-router-dom";
import Rating from "react-rating";

class ProfileReview extends Component {
    render() {
        const { profile } = this.props;
        const reviews = profile.reviews.map(review => (
            <div key={review.reviewer} className="card card-body mb-2">
                <div className="row">
                    <div className="col-md-6">
                        <h4>
                            {review.title}
                        </h4>
                    </div>
                    <div className="col-md-6">
                         <span className="badge badge-secondary mr-1">
                          {review.date}
                        </span>
                    </div>
                    <div className="col-md-6">
                        <p>{review.description}</p>

                        <Rating
                            style={{background: "#FFFFFF", color: 'red'}}
                            readonly
                            initialRating={review.rating}
                        />

                    </div>
                </div>

            </div>
        ));

        return (
            <div ref="myRef">
                <hr />
                <h3 className="mb-4">Reviews</h3>
                {reviews}
                {profile.reviews.length === 0 && <div> none yet </div>}
            </div>
        );
    }
}

export default ProfileReview;
