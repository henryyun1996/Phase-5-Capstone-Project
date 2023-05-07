import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { eventElementState,roomState, eventValueState, eventElementsState, isLoadingState, isFriendsState, isParticipantState } from '../atoms/index';
import NavBar from './NavBar';
import EventElementCard from './EventElementCard';
import ChatBox from './ChatBox';

function EventElement({ roomId }) {
  const [eventElement, setEventElement] = useRecoilState(eventElementState);
  const [rooms, setRooms] = useRecoilState(roomState);
  const [eventValue, setEventValue] = useRecoilState(eventValueState);
  const [eventElements, setEventElements] = useRecoilState(eventElementsState);
  const [, setIsLoading] = useRecoilState(isLoadingState);
  const [isFriends, setIsFriends] = useRecoilState(isFriendsState);
  const [isParticipant, setIsParticipant] = useRecoilState(isParticipantState);

  const roomName = rooms
    .filter((room) => parseInt(roomId) === room.id)
    .map((room) => room.room_name);

  useEffect(() => {
    setIsParticipant('');
  }, [setIsParticipant])
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/rooms');
        const roomData = await response.json();
        setRooms(roomData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRooms();
  }, [setRooms, setIsLoading]);

  useEffect(() => {
    const fetchEventElements = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/elements?room_id=${roomId}`);
        const eventData = await response.json();
        setEventElements(eventData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventElements();
  }, [setEventElements, setIsLoading, roomId]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('/friends');
        const friendsData = await response.json();
        setIsFriends(friendsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFriends();
  }, [setIsFriends]);

  const handleElementSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/elements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_id: roomId,
          event_element: eventElement,
          event_value: eventValue,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add event element');
      }
  
      const newEventElement = await response.json();
      setEventElements((prevState) => [...prevState, newEventElement]);
      setEventElement('');
      setEventValue('');
    } catch (error) {
      console.log(error);
    }
  };
  

const filteredElements = eventElements.filter((element) => {
    if (parseInt(roomId) === element.event_planning_room.id) {
        return true;
    }
    return false;
});

const handleParticipantSubmit = async (e) => {
    e.preventDefault();

    const selectedUsername = isParticipant.trim();
    const friendId = await getFriendIdByUsername(selectedUsername);
    if (!friendId) {
      console.log(`Could not find friend with username ${selectedUsername}`);
      return;
    }
    try {
      const response = await fetch('/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: friendId,
          room_id: roomId,
        }),
      });
      console.log(response)
      setIsParticipant('');
    } catch (error) {
      console.log(error);
    }
  };
  
  const getFriendIdByUsername = (username) => {
    const selectedFriendObject = isFriends.find((friend) => friend.friend.username === username);
    return selectedFriendObject ? selectedFriendObject.friend.id : null;
  };

return (
    <div>
      <div>
        <h1>Event: "{roomName}" Planning Room</h1>
        <NavBar />
      </div>
      <form onSubmit={handleElementSubmit}>
        <div>
          <label htmlFor="event-element">Event Element:</label>
          <input
            id="event-element"
            type="text"
            value={eventElement}
            onChange={(e) => setEventElement(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="event-value">Event Value:</label>
          <input
            id="event-value"
            type="text"
            value={eventValue}
            onChange={(e) => setEventValue(e.target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>
      {filteredElements.length === 0 ? (
        <div>
          <h1>No elements yet!</h1>
        </div>
      ) : (
        <div className="card-container">
          {eventElements
            .filter((element) => parseInt(roomId) === element.event_planning_room.id)
            .map((element) => (
                <EventElementCard key={element.id} element={element} />
            ))}
        </div>
      )}
      <form onSubmit={handleParticipantSubmit}>
        <div>
            <label htmlFor="participant">Add Participant:</label>
            <input
              id="participant"
              type="text"
              value={isParticipant}
              placeholder="Add Participant"
              onChange={(e) => setIsParticipant(e.target.value)}
            />
            <button type="submit">Add Participant</button>
        </div>
      </form>
      <ChatBox roomId={roomId}/>
    </div>
  );
}

export default EventElement;
