import React from 'react';
import NavBar from "./NavBar";

function Home({ first_name, last_name }) {

    return (
        <div style={{ padding: '50px' }}>
            <h1 style={{ color: '#FAC898' }}>Welcome {first_name} {last_name} !</h1>
            <br />
            <NavBar />
        </div>
    );
}

export default Home;