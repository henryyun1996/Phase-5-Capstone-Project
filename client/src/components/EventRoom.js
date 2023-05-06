import React, { useEffect } from "react";
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
        <div>
            
            <h1>Event Room</h1>
            <NavBar />
            <form onSubmit={handleCreateRoom}>
                <label htmlFor="roomName">Room Name:</label>
                <input
                    type="text"
                    name="room_name"
                    value={formData.room_name}
                    onChange={handleChange}
                    placeholder="Room Name"
                />
                <label htmlFor="dateOfEvent">Date of Event:</label>
                <input
                    type="date"
                    name="date_of_event"
                    value={formData.date_of_event}
                    onChange={handleChange}
                    placeholder="Date of Event"
                />
                <label htmlFor="timeOfEvent">Time of Event:</label>
                <input
                    type="time"
                    name="time_of_event"
                    value={formData.time_of_event}
                    onChange={handleChange}
                    placeholder="Time of Event"
                />
                <button type="submit">Create Room</button>
            </form>
            {filteredRooms.length === 0 ? (
                <div>
                    <h1>No events planned</h1>
                </div>
            ): (
                <div className="card-container">
                    {rooms
                        .filter((room) => loggedInUser.id === room.created_by)
                        .map((room) => (
                            <EventRoomCard key={room.id} room={room} />
                        ))}
                </div>
            )}
        </div>
    );
}


export default EventRoom;
