import React, { Component } from 'react';
import isEmpty from '../../validation/is-empty';
import {Link} from "react-router-dom";
import Rating from "react-rating";

class ProfileReview extends Component {

    render() {
        const { profile } = this.props;
        const reviews = profile.reviews.map(review => { 


            var date = new Date(review.date);

            var month =date.getMonth();
            var day = date.getDate();
            var year = date.getFullYear();
            date = month + '/' + day + '/' + year;

            return (
                <div key={review.reviewer} className="card card-body mb-2">
                    <div className="row">
                        <div className="col-md-10">
                            <h4>
                                {review.title}
                                <Rating
                                emptySymbol="far fa-star fa-2x"
                                fullSymbol="fa fa-star fa-2x"
                                readonly
                                initialRating={review.rating}
                                style={{fontSize: 10, paddingLeft: 10}}
                                />
                            </h4>
                            
                        </div>
                        <div className="col-md-2">
                             <span className="badge badge-secondary mr-1">
                              {date}
                            </span>
                        </div>
                        <div className="col-md-6">
                            <p>{review.description}</p>
                        </div>
                    </div>

                </div>

            )
        });

        return (
            <div ref="myRef">
                <hr />
                <h3 className="mb-4">Reviews ( {profile.numReviews} )</h3>
                {reviews}
                {profile.reviews.length === 0 && <div> none yet </div>}
            </div>
        );
    }
}

export default ProfileReview;
