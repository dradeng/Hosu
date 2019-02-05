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
                <div className="card card-body mb-2">
                    <div class="row">
                        <div style={{paddingLeft:15}}>
                            <div class="row" style={{marginBottom: 10, verticalAlign: 'middle'}}>
                                <div>
                                    <img
                                        className="rounded-circle d-none d-md-block"
                                        src={review.profilePic}
                                        style={{ width:30,height:30, marginLeft: 10, marginRight: 10, verticalAlign: 'middle'}} />
                                    </div>
                                <div>
                                    {review.userName}
                                    
                                    <Rating
                                        emptySymbol="far fa-star fa-2x"
                                        fullSymbol="fa fa-star fa-2x"
                                        readonly
                                        initialRating={review.rating}
                                        style={{marginLeft:15, fontSize: 10}}
                                    />
                                </div>
                            
                                <div style={{position:'absolute', right:10 }} className="badge badge-secondary">
                                    {date}
                              
                                </div>
                                 
                            </div>
                           
                            <div>
                                {review.description}
                            </div>
                        </div>
                    </div>
                </div>
            )
        });

        return (
            <div ref="myRef">
                <h3 className="mb-4">Reviews ( {profile.numReviews} )</h3>
                {reviews}
                {profile.reviews.length === 0 && <div> none yet </div>}
            </div>
        );
    }
}

export default ProfileReview;
