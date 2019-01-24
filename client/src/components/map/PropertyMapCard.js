import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Item, Button } from "semantic-ui-react";
import Rating from "react-rating";
import { getProfile } from '../../actions/profileActions';

class PropertyMapCard extends Component {
    componentDidMount() {
        const { pro } = this.props
        this.props.getProfile(pro.profile);
    }
    render() {
        const { pro } = this.props


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

        return (
            <Item style={{maxWidth:120}}>
                <Link className="text-dark" style={{textDecoration: 'none'}} to={`/post/${pro._id}`}>
                    <Item.Image
                        src={pro.images[0]}
                        size="tiny"
                        className="img-responsive"
                        style={{width: "100%"}}
                    />
                    <Item.Content>
                        <Item.Header >
                            <strong>
                                {pro.title}
                            </strong>

                        </Item.Header>
                        <Item.Meta>
                            <span>
                                <i>
                                    ${pro.rent}
                                    {reviews}
                                </i>
                            </span>
                            <br />
                            <br />
                            Minium Stay: {pro.minimumStay}
                            <span className="cinema"></span>
                        </Item.Meta>
                    </Item.Content>
                </Link>
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
