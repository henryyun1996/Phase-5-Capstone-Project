import React from 'react';
import { useRecoilState } from 'recoil';
import { eventFormState } from '../atoms/index';

function HomeEventCardUpdate ({ onSubmit }) {
    const [formData, setFormData] = useRecoilState(eventFormState);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
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
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            name="room_name"
            value={formData.room_name}
            onChange={handleChange}
            placeholder="Room Name"
        />
        <input
            type="date"
            name="date_of_event"
            value={formData.date_of_event}
            onChange={handleChange}
            placeholder="Date of Event"
        />
        <input
            type="time"
            name="time_of_event"
            value={formData.time_of_event}
            onChange={handleChange}
            placeholder="Time of Event"
        />
        <button type="submit">Save</button>
        </form>
    );
}

export default HomeEventCardUpdate;