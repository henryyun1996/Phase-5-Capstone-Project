import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentlyLoggedInState } from '../atoms/index';
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import Home from "./Home";
import EventRoom from "./EventRoom";
import Friends from "./Friends";
import HomeEventContainer from "./HomeEventContainer";
import Header from "./Header";
import EventElement from "./EventElement"
import Profile from "./Profile"

function App() {
    const [ currentlyLoggedIn, setCurrentlyLoggedIn ] = useRecoilState(currentlyLoggedInState);

    useEffect(() => {
        fetch("/check_session")
          .then((r) => {
            if (r.ok) {
              r.json().then((user) => setCurrentlyLoggedIn(user));
            }
          });
      }, [setCurrentlyLoggedIn]);


    return (
        <div className="App ui">
            <BrowserRouter>
                <Header />
                <Switch>
                    <Route exact path="/">
                        <LogIn />
                    </Route>
                    <Route exact path='/signup'>
                        <SignUp />
                    </Route>
                    <Route exact path='/home'>
                        <div>
                            <Home 
                                first_name={currentlyLoggedIn?.first_name} 
                                last_name={currentlyLoggedIn?.last_name}
                            />
                            <HomeEventContainer />
                        </div>
                    </Route>
                    <Route exact path="/event-room">
                        <EventRoom 
                            currentlyLoggedInID={currentlyLoggedIn?.id}
                        />
                    </Route>
                    <Route path="/rooms/:roomId" render={(props) => 
                        <EventElement roomId={props.match.params.roomId} />} 
                    />
                    <Route exact path="/friends">
                        <Friends
                            first_name={currentlyLoggedIn?.first_name}
                        />
                    </Route>
                    <Route exact path="/edit-profile">
                        <Profile 
                            currentlyLoggedIn={currentlyLoggedIn} 
                            setCurrentlyLoggedIn={setCurrentlyLoggedIn}
                        />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;