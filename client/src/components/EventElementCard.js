import React from 'react';
import { useRecoilState } from 'recoil';
import { isDeletedState, showCardsState, eventElementsState } from '../atoms/index';

function EventElementCard({ element }) {

    const [, setIsDeleted] = useRecoilState(isDeletedState);
    const [showCard,] = useRecoilState(showCardsState);
    const [eventElements, setEventElements] = useRecoilState(eventElementsState);

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
  
    return showCard ? (
        <div className="ui card">
          <div className="content">
            <h3>{element.event_element}</h3>
            <p>{element.event_value}</p>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      ) : null;
}

export default EventElementCard;
