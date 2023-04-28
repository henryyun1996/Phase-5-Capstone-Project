import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentlyLoggedInState } from '../atoms/index';
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import Home from "./Home";
import EventRoom from "./EventRoom";
import Friends from "./Friends";
import Calendar from "./Calendar";
import HomeEventContainer from "./HomeEventContainer";

function App() {
    const [ currentlyLoggedIn, setCurrentlyLoggedIn ] = useRecoilState(currentlyLoggedInState);

    const history = useHistory()
    // let location = useLocation();
    // let path = location.pathname

    useEffect(() => {
        fetch("/check_session")
          .then((r) => {
            if (r.ok) {
              r.json().then((user) => setCurrentlyLoggedIn(user));
            }
          });
      }, []);


    return (
        <div className="App ui">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/">
                        <LogIn />
                    </Route>
                    <Route exact path='/signup'>
                        <SignUp />
                    </Route>
                    <Route exact path='/home'>
                        <Home 
                            first_name={currentlyLoggedIn?.first_name} 
                            last_name={currentlyLoggedIn?.last_name}
                        />
                        <HomeEventContainer />
                    </Route>
                    <Route exact path="/event-room">
                        <EventRoom 

                        />
                    </Route>
                    <Route exact path="/calendar">
                        <Calendar 
                        
                        />
                    </Route>
                    <Route exact path="/friends">
                        <Friends
                        
                        />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;