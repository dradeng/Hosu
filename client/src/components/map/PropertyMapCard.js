import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Item, Button } from "semantic-ui-react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from 'react-responsive-carousel';
import Rating from "react-rating";
import { getProfile } from '../../actions/profileActions';

class PropertyMapCard extends Component {
    componentDidMount() {
        const { pro } = this.props
        this.props.getProfile(pro.profile);
    }
    render() {
        const { pro } = this.props


        const allImage = pro.images.map((item, index) => (
        <div>
            <div style={{height: '100%', paddingTop: '66%', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundImage: 'url("' + item + '")'}}>

            </div>
        </div>)
    );

        const { profile, loading } = this.props.profile;
        let reviews = null;

        if (profile === null || loading) {
          //do nothing
        } else {
            var rating = profile.reviewSum / profile.numReviews;
            reviews = <div>
            <Rating
                emptySymbol="far fa-star fa-2x"
                fullSymbol="fa fa-star fa-2x"
                readonly
                initialRating={rating}
                style={{fontSize: 8}}/> ({profile.numReviews})
                
            </div>
        }
//<Link className="text-dark" style={{textDecoration: 'none'}} to={`/post/${pro._id}`}>
        return (
            <Item style={{width:200, height: 240}}>
                    <Item.Content style={{paddingBottom: 10}}>
                        <Item.Header>
                            <Carousel showThumbs={false}  showIndicators={false} showStatus={false}>
                              {allImage}
                            </Carousel>
                        </Item.Header>
                        <Item.Meta style={{paddingRight: 5, paddingTop: 10, paddingBottom:10}}>
                            <span>
                                <i> 
                                    <div>
                                        <strong>
                                            {pro.title}
                                        </strong>
                                    </div>
                                    <div>
                                        <div>
                                            ${pro.rent}
                                        </div>   
                                        
                                    </div>
                                    <br />
                                    <div>
                                        <div>
                                            {reviews}
                                        </div>
                                    </div>
                                </i>
                            </span>
                            <br />
                            Minium Stay: {pro.minimumStay} days
                            <span className="cinema"></span>
                        </Item.Meta>
                    </Item.Content>
               
            </Item>
        );
    }
}

PropertyMapCard.propTypes = {
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfile })(
  PropertyMapCard
);
