import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import UserIcon from "../../assets/UserIcon.png";
import isEmpty from "../../validation/is-empty";
import PostItem2 from '../posts/PostItem2.js';
import ProfileReview from "../profile/ProfileReview";
import {Link} from "react-router-dom";
const ChatProfile = ({
                         profile, post

                     }) => {
    return (
        <div className="text-center">
            <div >
            <img
                style={{width: 100}}
                className="rounded-circle"
                src={profile.user.avatar}
                alt=""
            />
            </div>
            <h2 >{profile.user.name}</h2>
            <p className="lead text-center">
                {profile.status}{' '}
                {isEmpty(profile.company) ? null : (
                    <span>at {profile.company}</span>
                )}
            </p>
            {isEmpty(profile.location) ? null : <p>{profile.location}</p>}
            <p>
                {isEmpty(profile.website) ? null : (
                    <a
                        className="text-white p-2"
                        href={profile.website}
                        target="_blank"
                    >
                        <i className="fas fa-globe fa-2x" />
                    </a>
                )}

                {isEmpty(profile.social && profile.social.twitter) ? null : (
                    <a
                        className="text-white p-2"
                        href={profile.social.twitter}
                        target="_blank"
                    >
                        <i className="fab fa-twitter fa-2x" />
                    </a>
                )}

                {isEmpty(profile.social && profile.social.facebook) ? null : (
                    <a
                        className="text-white p-2"
                        href={profile.social.facebook}
                        target="_blank"
                    >
                        <i className="fab fa-facebook fa-2x" />
                    </a>
                )}

                {isEmpty(profile.social && profile.social.linkedin) ? null : (
                    <a
                        className="text-white p-2"
                        href={profile.social.linkedin}
                        target="_blank"
                    >
                        <i className="fab fa-linkedin fa-2x" />
                    </a>
                )}

                {isEmpty(profile.social && profile.social.youtube) ? null : (
                    <a
                        className="text-white p-2"
                        href={profile.social.youtube}
                        target="_blank"
                    >
                        <i className="fab fa-youtube fa-2x" />
                    </a>
                )}

                {isEmpty(profile.social && profile.social.instagram) ? null : (
                    <a
                        className="text-white p-2"
                        href={profile.social.instagram}
                        target="_blank"
                    >
                        <i className="fab fa-instagram fa-2x" />
                    </a>
                )}
            </p>
            {isEmpty(post) ? null :
                <div>
                    <h2>Post</h2>

                <div className="d-flex justify-content-center" style={{width: '100%'}}>

                    <PostItem2 className="col-md-8" style={{width: '100%'}} post={post}/>
                </div>
                </div>
            }

                <ProfileReview profile={profile}/>

            <Link to={`/profile/${profile.handle}`} className="btncustom btn btn-info">
                View Profile
            </Link>

        </div>
    );
};

ChatProfile.propTypes = {
    profile: PropTypes.object.isRequired,

};

ChatProfile.defaultProps = {
    type: 'text'
};

export default ChatProfile;
