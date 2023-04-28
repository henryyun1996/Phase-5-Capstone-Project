import React from 'react';

const HomeEventCard = ({ room }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{room.room_name}</h3>
      </div>
      <div className="card-body">
        <p>Date of Event: {room.date_of_event}</p>
        <p>Time of Event: {room.time_of_event}</p>
        <p>Location: {room.location}</p>
        <p>Description: {room.description}</p>
      </div>
    </div>
  );
};

export default HomeEventCard;