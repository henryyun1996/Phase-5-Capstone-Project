import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentlyLoggedInState } from '../atoms/index';

function NavBar() {
    const [ currentlyLoggedIn, setCurrentlyLoggedIn ] = useRecoilState(currentlyLoggedInState);

    const history = useHistory()

    const handleLogout = () => {
        fetch("/logout", { method: "DELETE" })
          .then((r) => {
            if (r.ok) {
              setCurrentlyLoggedIn(undefined)
            }
            history.push('/')
          })
      }

    return (
        <div>
            <div className="ui menu">
                <a className="item" href="/home">Home</a>
                <a className="item" href="/event-room">Create an Event</a>
                <a className="item" href="/calendar">Your Calendar</a>
                <a className="item" href="/friends">Friends</a>
                <a className="item right floated" href='/' onClick={handleLogout}> Log Out </a>
            </div>
        </div>
    )
}

export default NavBar;