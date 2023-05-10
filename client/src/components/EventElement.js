import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Form, Button, Grid } from 'semantic-ui-react';
import { eventElementState,roomState, eventValueState, eventElementsState, isLoadingState, isFriendsState, isParticipantState } from '../atoms/index';
import NavBar from './NavBar';
import EventElementCard from './EventElementCard';

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
          completed: false,
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
      alert("You are either not friends with this person or there might be mispelling! Please try again.")
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
      alert(`${selectedUsername} successfully added as participant!`)
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
      <div style={{ padding: '50px' }}>
        <h1 style={{ color: '#FAC898' }}>Event: "{roomName}" Planning Room</h1>
        <br />
        <NavBar />
        <br />
      </div>
      <div style={{ maxWidth: '80%', margin: '0 auto' }}>
        <Grid columns={2} divided style={{ display: 'flex', alignItems: 'center', backgroundColor: '#9CA6C9', border: '6px solid #9CA6D9', padding: '35px' }}>
          <Grid.Column width={8}>
            <Form onSubmit={handleElementSubmit}>
              <div className="ui inverted segment" style={{ backgroundColor: '#47759E', width:'80%', margin: "0 auto", border: '4px solid black' }}>
                <div className="one field">
              <Form.Field>
                <label htmlFor="event-element" style={{color: 'navy'}}>Event Element:</label>
                <Form.Input
                  id="event-element"
                  type="text"
                  placeholder="What do you need to bring/ get done?"
                  value={eventElement}
                  onChange={(e) => setEventElement(e.target.value)}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="event-value" style={{color: 'navy'}}>Event Value:</label>
                <Form.Input
                  id="event-value"
                  type="text"
                  placeholder="Minutes, Dollar amount, etc."
                  value={eventValue}
                  onChange={(e) => setEventValue(e.target.value)}
                />
              </Form.Field>
              <Button type="submit" style={{ backgroundColor: 'grey', border: '2px solid black' }}>Add</Button>
                </div>
              </div>
            </Form>
          {filteredElements.length === 0 ? (
            <div>
              <h1>No elements yet!</h1>
            </div>
          ) : (
            <div className="ui two stackable centered cards" style={{ padding: '20px 100px'}}>
              {eventElements
                .filter((element) => parseInt(roomId) === element.event_planning_room.id)
                .map((element) => (
                    <EventElementCard key={element.id} element={element} />
                ))}
            </div>
          )}
        </Grid.Column>
        <Grid.Column width={8}>
          <Form onSubmit={handleParticipantSubmit}>
            <div className="ui inverted segment" style={{ backgroundColor: '#47759E', border: '4px solid black', maxWidth: '60%', margin: '0 auto' }}>
              <div className="one field">
                <label htmlFor="participant" style={{ color: 'navy'}}>Add Participant:</label>
                <Form.Input
                  id="participant"
                  type="text"
                  value={isParticipant}
                  placeholder="Add Participant"
                  onChange={(e) => setIsParticipant(e.target.value)}
                />
                <Button type="submit" style={{ backgroundColor: 'grey', border: '2px solid black' }}>Add Participant</Button>
              </div>
            </div>
          </Form>
        </Grid.Column>
        </Grid>
      </div>
    </div>
  );
}

export default EventElement;
