import React, { useEffect } from 'react';
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
        fetch(`/users?search=${searchTerm}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setResults(data.filter((result) => result.id !== currentUser.id)))
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


  return (
    <div>
      <h1>{first_name}'s Friends Page</h1>
    <div><NavBar /></div>
      <form onSubmit={handleSearch}>
        <label htmlFor="search">Search for users:</label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
        <ul>
            {results.map((result) => (
            <li key={result.id}>
                {result.username}{' '}
                <button onClick={() => handleAddFriend(result.id)}>
                    {friendUsernames.some((friend) => friend.friend_id === result.id)
                        ? 'Unfriend'
                        : 'Add as Friend'}
                </button>
            </li>
            ))}
        </ul>
      <div>
        <h2>My Friends</h2>
        <div className="card-container">
            {isFriends.map((friend) => (
                <FriendCard key={friend.id} friend={friend.friend.username} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Friends;

