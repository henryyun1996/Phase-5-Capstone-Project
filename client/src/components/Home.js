import React from 'react';
import NavBar from "./NavBar";

function Home({ first_name, last_name }) {
    console.log(last_name);

    return (
        <div>
            <h1>Welcome {first_name} {last_name} !</h1>
            <NavBar />
        </div>
    );
}

export default Home;