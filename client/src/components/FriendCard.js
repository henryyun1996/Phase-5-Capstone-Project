import React from 'react';

function FriendCard({ friend }) {
    return (
        <div className="ui card" style={{ backgroundColor: '#709FC1', padding: '0 0 10px', border: '2px solid #6A7DE1' }}>
            <div className="content">
                <p>Username: {friend}</p>
            </div>
        </div>
    )
}

export default FriendCard;