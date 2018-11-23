import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import UserIcon from "../../assets/UserIcon.png";

const ChatboxLink = ({
                            name,lastMessage

                        }) => {
    return (
        <div className="row chatlink" style={{padding: '10px 16px 0 0',marginRight: 0,borderBottom: '1px solid rgba(0,0,0,0.25)'}}>
            <div  className="col-md-3">
                <img
                    className="rounded-circle"
                    src={UserIcon}
                    style={{ width: '30px', marginRight: '5px' }}
                    title="You must have a Gravatar connected to your email to display an image"
                />
            </div>
            <div className="col-md-9">
                <h6 style={{marginBottom: 3}}>
                {name}
                </h6>
                <p style={{marginLeft: 5}}>
                    {lastMessage}
                </p>
            </div>
        </div>
    );
};

ChatboxLink.propTypes = {
    name: PropTypes.string.isRequired,
    lastMessage: PropTypes.string.isRequired,

};

ChatboxLink.defaultProps = {
    type: 'text'
};

export default ChatboxLink;
