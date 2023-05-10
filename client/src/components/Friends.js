import React, { useEffect } from 'react';
import { Grid } from "semantic-ui-react";
import { useRecoilState } from 'recoil';
import { searchTermState, resultsState ,currentlyLoggedInState, isFriendsState, friendUsernamesState } from '../atoms/index';
import NavBar from "./NavBar";
import FriendCard from './FriendCard';

function Friends({ first_name }) {
    const [searchTerm, setSearchTerm] = useRecoilState(searchTermState);
    const [results, setResults] = useRecoilState(resultsState);
    const [currentUser] = useRecoilState(currentlyLoggedInState);
    const [isFriends, setIsFriends] = useRecoilState(isFriendsState);
    const [friendUsernames, setFriendUsernames] = useRecoilState(friendUsernamesState);

    useEffect(() => {
        fetch("/friends")
            .then((resp) => resp.json())
            .then((friendsArray) => {
                setIsFriends(friendsArray || []);
                setFriendUsernames(friendsArray.map(friend => ({
                  friend_id: friend.friend.id,
                  username: friend.friend.username
                })));
            })
    }, [setIsFriends, setFriendUsernames])
  
    const handleSearch = (event) => {
      event.preventDefault();
      const firstChar = searchTerm.charAt(0);
      fetch(`/users?search=${firstChar}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const filteredResults = data.filter((result) => {
            return (
              result.username.charAt(0).toLowerCase() === firstChar.toLowerCase() &&
              result.username !== currentUser.username
            );
          });
          setResults(filteredResults);
        })
        .catch((error) => console.error(error));
    };    

    const handleDeleteFriend = (userId, friendId) => {
        const friendToDelete = isFriends.find(
          (friend) =>
            (friend.user_id === userId && friend.friend_id === friendId) ||
            (friend.user_id === friendId && friend.friend_id === userId)
        );
      
        fetch(`/friends/${friendToDelete.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => response.json())
          .then(() => {
            fetch("/friends")
              .then((resp) => resp.json())
              .then((friendsArray) => {
                setIsFriends(friendsArray || []);
                setFriendUsernames(friendsArray.map(friend => ({
                  friend_id: friend.friend.id,
                  username: friend.friend.username
                })));
              })
              .catch((error) => console.error(error));
          })
          .catch((error) => console.error(error));
      };
      

    const handleAddFriend = (friendId) => {
        const isFriend = isFriends.some(
            (friend) =>
                (friend.user_id === currentUser.id && friend.friend_id === friendId) ||
                (friend.user_id === friendId && friend.friend_id === currentUser.id)
        );
    
        if (!isFriend) {
            const existingFriend = friendUsernames.find(
                (friend) => friend.friend_id === friendId
            );
    
            if (existingFriend) {
                console.log("Friend already exists in the friends list");
                return;
            }
    
            fetch(`/friends`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ user_id: currentUser.id, friend_id: friendId }),
            })
                .then((response) => response.json())
                .then((newFriend) => {
                    setIsFriends([...isFriends, newFriend]);
                    setFriendUsernames([
                        ...friendUsernames,
                        { friend_id: friendId, username: newFriend.friend.username },
                    ]);
                    console.log(newFriend);
                })
                .catch((error) => console.error(error));
        } else {
            handleDeleteFriend(currentUser.id, friendId);
        }
    };

    const handleInputChange = (e) => {
      setSearchTerm(e.target.value);
    }

  return (
    <div style={{ padding: '50px' }}>
      <h1 style={{ color: '#FAC898' }}>{first_name}'s Friends Page</h1>
      <br />
    <NavBar />
    <br />
      <div style={{ padding: '50px' }}>
        <Grid columns={2} style={{ padding: '50px', display: 'flex', alignItems:'center', backgroundColor: '#9CA6C9', border: '6px solid #9CA6D9' }}>
          <Grid.Column width={5}>
            <form onSubmit={handleSearch} style={{ textAlign: 'center' }} className="ui left icon input">
              <input
                type="text"
                id="search"
                placeholder="Search for friends:"
                value={searchTerm}
                onChange={handleInputChange}
              />
              <i class="users icon"></i>
              <button type="submit"><i className="search icon"></i></button>
            </form>
            {results.map((result) => (
              <div class="ui celled list">
                <div key={result.id} className="item">
                  {result.username}{' '}
                  <button onClick={() => handleAddFriend(result.id)}>
                        {friendUsernames.some((friend) => friend.friend_id === result.id)
                            ? 'Unfriend'
                            : 'Add as Friend'}
                  </button>
                </div>
              </div>
            ))}
            </Grid.Column>
            <Grid.Column width={11}>
              <div>
                <h2 style={{ color: '#dac7b3' }}>My Friends</h2>
                <div className="ui five stackable centered cards">
                    {isFriends.map((friend) => (
                        <FriendCard key={friend.id} friend={friend.friend.username} />
                    ))}
                </div>
              </div>
            </Grid.Column>
        </Grid>
      </div>
    </div>
  );
}

export default Friends;

