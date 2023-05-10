import React, { useEffect } from "react";
import { Form, Grid, Button } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import { currentlyLoggedInState, eventFormState, errorMessageState, roomState, isLoadingState } from "../atoms/index";
import NavBar from "./NavBar";
import EventRoomCard from "./EventRoomCard";

function EventRoom({ currentlyLoggedInID }) {
    const [loggedInUser, ] = useRecoilState(currentlyLoggedInState);
    const [formData, setFormData] = useRecoilState(eventFormState);
    const [, setErrorMessage] = useRecoilState(errorMessageState);
    const [rooms, setRooms] = useRecoilState(roomState);
    const [, setIsLoading] = useRecoilState(isLoadingState);

    console.log(rooms)

    useEffect(() => {
        if (currentlyLoggedInID && currentlyLoggedInID) {
            setFormData((prev) => ({
                ...prev,
                created_by: currentlyLoggedInID,
            }));
        }
    }, [currentlyLoggedInID, setFormData]);

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

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            
            if (!response.ok) {
                setErrorMessage('Please enter a valid date in the format yyyy-mm-dd.');
                return;
            }
            const newRoom = await response.json();
            setRooms([...rooms, newRoom]);
            setFormData({
              room_name: '',
              date_of_event: '',
              time_of_event: '',
              created_by: currentlyLoggedInID,
            });
          } catch (error) {
            console.log(error);
          }
        };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    console.log(formData)

    return (
        <div style={{ padding: '50px'}}>
            <h1 style={{ color: '#FAC898' }}>Event Room</h1>
            <br />
            <NavBar style={{ paddingBottom: '100px' }}/>
            <br />
            <Grid columns={2} divided style={{ display: 'flex', alignItems: 'center', backgroundColor: '#9CA6C9', border: '6px solid #6A7DE1', marginTop: '50px' }}>
                <Grid.Column width={8}>
            <div style={{ padding: '50px', maxWidth: '80%', margin: '0 auto' }}>
                <div className="ui inverted segment" style={{ backgroundColor: '#47759E', border: '4px solid black' }}>
                    <div className="three fields">
                        <div style={{}}>
                <Form onSubmit={handleCreateRoom}>
                    <Form.Field>
                        <div className="field">
                        <label htmlFor="roomName" style={{ color: 'navy' }}>Room Name:</label>
                        <input
                            type="text"
                            name="room_name"
                            value={formData.room_name}
                            onChange={handleChange}
                            placeholder="Room Name"
                        />
                        </div>
                    </Form.Field>
                    <Form.Field>
                        <div className="field">
                        <label htmlFor="dateOfEvent" style={{ color: 'navy' }}>Date of Event:</label>
                        <input
                            type="date"
                            name="date_of_event"
                            value={formData.date_of_event}
                            onChange={handleChange}
                            placeholder="Date of Event"
                        />
                        </div>
                    </Form.Field>
                    <Form.Field>
                        <div className="field">
                        <label htmlFor="timeOfEvent" style={{ color: 'navy' }}>Time of Event:</label>
                        <input
                            type="time"
                            name="time_of_event"
                            value={formData.time_of_event}
                            onChange={handleChange}
                            placeholder="Time of Event"
                        />
                        </div>
                    </Form.Field>
                    <Button className="ui button" type="submit" style={{ backgroundColor: '#478778', border: '2px solid black' }}>Create Room</Button>
                </Form>
                        </div>
                    </div>
                </div>
            </div>
            </Grid.Column>
            <Grid.Column width={8}>
            {filteredRooms.length === 0 ? (
                <div>
                    <h1>No events planned</h1>
                </div>
            ): (
                <div className="card-container">
                    <div className="ui two stackable centered cards" style={{ padding: "40px 100px" }}>
                        {rooms
                            .filter((room) => loggedInUser.id === room.created_by)
                            .map((room) => (
                                <EventRoomCard key={room.id} room={room} />
                            ))}
                    </div>
                </div>
            )}
            </Grid.Column>
            </Grid>
        </div>
    );
}


export default EventRoom;
