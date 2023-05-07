import React, { useEffect, useState } from 'react';

function ChatBox({ roomId }) {
    const [messages, setMessages] = useState([]);
  
    useEffect(() => {
      // Fetch messages for the room with roomId and update the messages state
      const fetchMessages = async () => {
        try {
          const response = await fetch(`/messages?room_id=${roomId}`);
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchMessages();
    }, [roomId]);
  
    // Function to add a new message to the messages state
    const handleMessageSubmit = async (message) => {
      try {
        const response = await fetch('/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            room_id: roomId,
            message,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add message');
        }
  
        const newMessage = await response.json();
        setMessages((prevState) => [...prevState, newMessage]);
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <div>
        <h2>Room {roomId} Chat Box</h2>
        <ChatBox messages={messages} onMessageSubmit={handleMessageSubmit} />
      </div>
    );
  }
  
  export default ChatBox;