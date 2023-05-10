import React, { useState } from 'react';
import { Button } from 'semantic-ui-react'
import { useRecoilState } from 'recoil';
import { isDeletedState, showCardsState, eventElementsState } from '../atoms/index';

function EventElementCard({ element }) {

    const [, setIsDeleted] = useRecoilState(isDeletedState);
    const [showCard,] = useRecoilState(showCardsState);
    const [eventElements, setEventElements] = useRecoilState(eventElementsState);
    const [completed, setCompleted] = useState(element.completed);

    const handleDelete = async () => {
        try {
            const response = await fetch(`/elements/${element.id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            console.log(data);
            setIsDeleted(element.id);
            setEventElements(eventElements.filter(e => e.id !== element.id));
        } catch (error) {
            console.log(error);
        }
    };

    const handleToggleComplete = async () => {
      try {
        const response = await fetch(`/elements/${element.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            completed: true
          })
        });
        const data = await response.json();
        console.log(data);
        setCompleted(!completed);
        setEventElements(eventElements.map(e => {
          if (e.id === element.id) {
            return { ...e, completed: true };
          }
          return e;
        }));
      } catch (error) {
        console.log(error);
      }
    }
    

    return showCard ? (
        <div className="ui card" style={{ backgroundColor: '#FFC04E'}}>
          <div className="content">
              <h3>{element.event_element}</h3>
              <p>{element.event_value}</p>
              <div className="ui checkbox">
                  <input type="checkbox" checked={completed} onChange={handleToggleComplete} />
                  <label>Completed</label>
              </div>
              <br />
              <Button onClick={handleDelete} style={{ marginTop: '10px', padding: '10px', backgroundColor: 'grey', border: '2px solid black' }}>Delete</Button>
          </div>
        </div>
    ) : null;
}

export default EventElementCard;

