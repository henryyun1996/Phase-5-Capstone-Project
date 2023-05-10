import React, { useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { roomState, isParticipantState } from '../atoms/index';

function ParticipantRoom({ participant, roomId }) {
  const [rooms] = useRecoilState(roomState);
  const [, setIsParticipant] = useRecoilState(isParticipantState);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const handleGoIntoRoom = () => {
    history.push(`/rooms/${roomId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/participants');
        const data = await response.json();
        setIsParticipant(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [setIsParticipant]);

  const filterInviter = () => {
    const currentEvent = rooms.find((room) => room.id === participant.event_planning_room.id);
    const creatorUsername = currentEvent?.user?.username;
    return creatorUsername;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const formattedDate = new Date(participant.event_planning_room.date_of_event).toLocaleDateString();
  const formattedTime = new Date(`2000-01-01T${participant.event_planning_room.time_of_event}:00`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true});

  return (
    <div className="ui card" style={{ backgroundColor: '#709FC1', padding: '10px 0 10px', border: '2px solid #6A7DE1' }}>
      <div className="content">
        <h3>{participant.event_planning_room.room_name}</h3>
        <p>Invited by: {filterInviter()}</p>
        <p>Date of Event: {formattedDate}</p>
        <p>Time of Event: {formattedTime}</p>
        <Button className="ui bottom animated fade button" onClick={handleGoIntoRoom}>
          <div className="visible content"><i className="icon right arrow alternate"></i></div>
          <div className="hidden content" style={{ marginTop: '-14px' }}>Enter Room</div>
        </Button>
      </div>
    </div>
  );
}

export default ParticipantRoom;
