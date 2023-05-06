import React from 'react';

function FriendCard({ friend }) {
    return (
        <div className="ui card">
            <div className="content">
                <p>Username: {friend}</p>
            </div>
        </div>
    )
}

export default FriendCard;