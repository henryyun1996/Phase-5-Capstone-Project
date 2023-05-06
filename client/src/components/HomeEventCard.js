import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { showFormState, eventFormState, errorMessageState } from '../atoms/index';
import HomeEventCardUpdate from './HomeEventCardUpdate';

function HomeEventCard({ room, isParticipant }) {
  const [formData, setFormData] = useRecoilState(eventFormState);
  const [updatedRoom, setUpdatedRoom] = useState(room);
  const [errorMessage, setErrorMessage] = useRecoilState(errorMessageState);
  const [showFormStateDict, setShowFormStateDict] = useRecoilState(showFormState);

  const history = useHistory();

  const participantFilter = isParticipant.filter((participator) => {
    if (participator.room_id === room.id) {
      return participator.user.username;
    }
    return false;
  });
  
  const usernames = participantFilter.map(participator => participator.user.username);
  
  console.log(usernames);

  const handleGoIntoRoom = () => {
    history.push(`/rooms/${room.id}`);
  };
  
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
      setShowFormStateDict(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setShowFormStateDict({
      ...showFormStateDict,
      [room.id]: false,
    });
    setFormData({
      room_name: room.room_name,
      date_of_event: room.date_of_event,
      time_of_event: room.time_of_event,
    });
    setErrorMessage('');
  };

  const handleEdit = () => {
    setShowFormStateDict(prevState => ({
      ...prevState,
      [room.id]: !prevState[room.id],
    }));
    setFormData({
      room_name: updatedRoom.room_name,
      date_of_event: updatedRoom.date_of_event,
      time_of_event: updatedRoom.time_of_event,
    });
    resetForm();
    setErrorMessage('');
  };

  const handleEventDelete = async () => {
    try {
      const response = await fetch(`/rooms/${updatedRoom.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setErrorMessage('Failed to delete event.');
        return;
      }
      
      setUpdatedRoom(null);
      setShowFormStateDict(prevState => {
        const newState = { ...prevState };
        delete newState[updatedRoom.id];
        return newState;
      });
    } catch (error) {
      console.log(error);
    }
  }

  const resetForm = () => {
    setFormData({
      room_name: '',
      date_of_event: '',
      time_of_event: '',
    });
  }

  if (!updatedRoom) {
    return null;
  }

  const formattedDate = new Date(updatedRoom.date_of_event).toLocaleDateString();
  const formattedTime = new Date(`2000-01-01T${updatedRoom.time_of_event}:00`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true});

  return (
    <>
      <div className="ui card">
        <div className="content">
          <h3>{updatedRoom.room_name}</h3>
          <p>Date of Event: {formattedDate}</p>
          <p>Time of Event: {formattedTime}</p>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleGoIntoRoom}>Go into Room</button>
          <button onClick={handleEventDelete}>Delete Event</button>
        </div>
        {showFormStateDict[room.id] && (
          <div className="content">
            <HomeEventCardUpdate onSubmit={handleUpdate} room={updatedRoom} />
            <button onClick={handleCancel}>Cancel</button>
          </div>
        )}
        {errorMessage && <span className="error-message">{errorMessage}</span>}
        <div>
          <h3>Participants:</h3>
          {participantFilter.length === 0 ? (
            <p>No participants yet</p>
          ) : (
            <ul>
              {participantFilter.map((participant) => (
                <li key={participant.id}>{participant.user.username}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

    </>
  );
}

export default HomeEventCard;
