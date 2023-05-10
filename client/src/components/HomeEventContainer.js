import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Grid } from 'semantic-ui-react';
import { isLoadingState, currentlyLoggedInState, roomState, isParticipantState } from '../atoms/index';
import HomeEventCard from './HomeEventCard';
import ParticipantRoom from './ParticipantRoom';

function HomeEventContainer() {
    const [loggedInUser,] = useRecoilState(currentlyLoggedInState);
    const [rooms, setRooms] = useRecoilState(roomState);
    const [, setIsLoading] = useRecoilState(isLoadingState);
    const [isParticipant, setIsParticipant] = useRecoilState(isParticipantState);

  useEffect(() => {
    if (loggedInUser) {
      const fetchParticipants = async () => {
        const response = await fetch('/participants');
        const data = await response.json();
        setIsParticipant(data);
      };
      fetchParticipants();
    }
  }, [loggedInUser, setIsParticipant]);

  const filteredParticipatingRooms = isParticipant.filter((participant) => {
    if (participant.user_id === loggedInUser.id) {
      return true
    }
    return false;
  }) 

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch('/rooms');
      const roomData = await response.json();
      setRooms(roomData);
      setIsLoading(false);
    };
    
    fetchRooms();
  }, [setRooms, setIsLoading]);

  if (!loggedInUser) {
    return <div>Loading...</div>;
  }

  const filteredRooms = rooms.filter((room) => {
    if (loggedInUser.id === room.created_by) {
      return true;
    }
    return false;
  });

  return (
    <div style={{ padding: '0px 150px' }}>
    <Grid columns={2} stackable>
      <Grid.Column>
        <h1 style={{ color: '#dac7b3' }}>Created Events</h1>
        <br />
        {filteredRooms.length === 0 ? (
          <div>
            <h1>No events planned</h1>
          </div>
        ) : (
          <div className="ui two stackable centered cards">
            {rooms
              .filter((room) => loggedInUser.id === room.created_by)
              .map((room) => (
                <HomeEventCard key={room.id} room={room} isParticipant={isParticipant} />
              ))}
          </div>
        )}
      </Grid.Column>
      <Grid.Column>
        <h1 style={{ color: '#dac7b3' }}>Participating Events</h1>
        <br />
        {filteredParticipatingRooms.length === 0 ? (
          <div>
            <h1>You haven't been invited to any events yet!</h1>
          </div>
        ) : (
          <div className="ui two stackable centered cards">
            {isParticipant
              .filter((participant) => loggedInUser.id === participant.user_id)
              .map((participant) => (
                <ParticipantRoom key={participant.id} participant={participant} roomId={participant.room_id} />
              ))}
          </div>
        )}
      </Grid.Column>
    </Grid>
  </div>
);
};

export default HomeEventContainer;