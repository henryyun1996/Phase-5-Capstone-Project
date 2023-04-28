import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { roomState } from '../atoms/index';
import HomeEventCard from './HomeEventCard';

function HomeEventContainer() {
    const [rooms, setRooms] = useRecoilState(roomState);

  useEffect(() => {
    // Fetch rooms from API and update recoil state
    const fetchRooms = async () => {
      const response = await fetch('/rooms');
      const data = await response.json();
      setRooms(data.rooms);
    };
    fetchRooms();
  }, []);

  return (
    <div className="card-container">
      {rooms.map((room) => (
        <HomeEventCard key={room.id} room={room} />
      ))}
    </div>
  );
};

export default HomeEventContainer;