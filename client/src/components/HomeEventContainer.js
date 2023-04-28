import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { isLoadingState, currentlyLoggedInState, roomState } from '../atoms/index';
import HomeEventCard from './HomeEventCard';

function HomeEventContainer() {
    const [loggedInUser, setLoggedInUser] = useRecoilState(currentlyLoggedInState);
    const [rooms, setRooms] = useRecoilState(roomState);
    const [isLoading, setIsLoading] = useRecoilState(isLoadingState);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch('/rooms');
      const roomData = await response.json();
      setRooms(roomData);
      setIsLoading(false);
    };
    
    fetchRooms();
  }, []);

  if (!loggedInUser) {
    return <div>Loading...</div>;
  }

  const filteredRooms = rooms.filter((room) => {
    if (loggedInUser.id === room.created_by) {
      return true;
    }
    return false;
  });

  console.log(rooms)

  return (
    <>
      {filteredRooms.length === 0 ? (
        <div>
          <h1>No events planned</h1>
        </div>
      ) : (
        <div className="card-container">
          {rooms
            .filter((room) => loggedInUser.id === room.created_by)
            .map((room) => (
              <HomeEventCard key={room.id} room={room} />
            ))}
        </div>
      )}
    </>
  );
};

export default HomeEventContainer;