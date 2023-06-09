import React from 'react';

function HomeEventCard({ room }) {

    const formattedDate = new Date(room.date_of_event).toLocaleDateString();
    const formattedTime = new Date(`2000-01-01T${room.time_of_event}:00`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true});

    return (
        <>
            <div className="ui centered card" style={{ backgroundColor: '#709FC1', padding: '0 0 10px', border: '2px solid #6A7DE1' }}>
                <div className="content">
                    <h3>{room.room_name}</h3>
                    <p>{formattedDate}</p>
                    <p>{formattedTime}</p>
                </div>
            </div>
        </>
    )
}

export default HomeEventCard;