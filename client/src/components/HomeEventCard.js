import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { showFormState, eventFormState } from '../atoms/index';
import HomeEventCardUpdate from './HomeEventCardUpdate';

function HomeEventCard({ room }) {
  const { room_name, date_of_event, time_of_event } = room;
  const [showForm, setShowForm] = useRecoilState(showFormState);
  const [formData, setFormData] = useRecoilState(eventFormState);
  const [updatedRoom, setUpdatedRoom] = useState(room);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/rooms/${room.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setErrorMessage('Please enter a valid date in the format yyyy-mm-dd.');
        return;
      }

      const updatedRoom = await response.json();
      setUpdatedRoom(updatedRoom);
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      room_name: room.room_name,
      date_of_event: room.date_of_event,
      time_of_event: room.time_of_event,
    });
    setErrorMessage('');
  };

  const handleEdit = () => {
    setShowForm(true);
    setFormData({
      room_name: updatedRoom.room_name,
      date_of_event: updatedRoom.date_of_event,
      time_of_event: updatedRoom.time_of_event,
    });
    setErrorMessage('');
  };

  const resetForm = () => {
    setFormData({
      room_name: '',
      date_of_event: '',
      time_of_event: '',
    });
  }

  const formattedDate = new Date(updatedRoom.date_of_event).toLocaleDateString();
  const formattedTime = updatedRoom.time_of_event.slice(0, 5);

  return (
    <div className="ui card">
      <div className="content">
        <h3>{updatedRoom.room_name}</h3>
        <p>Date of Event: {formattedDate}</p>
        <p>Time of Event: {formattedTime}</p>
        <button onClick={() => setShowForm(!showForm)}>Edit</button>
      </div>
      {showForm && (
        <div className="content">
          <HomeEventCardUpdate onSubmit={handleUpdate} />
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
}

export default HomeEventCard;