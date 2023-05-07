// import React, { useState } from "react";

// function Message({ message, currentUser, onMessageDelete, onUpdateMessage }) {
//   const [isEditing, setIsEditing] = useState(false);

//   const { id, username, body, created_at: createdAt } = message;

//   const timestamp = new Date(createdAt).toLocaleTimeString();

//   const isCurrentUser = currentUser.username === username;

//   function handleDeleteClick() {
//     fetch(`http://127.0.0.1:4000/messages/${id}`, {
//       method: "DELETE",
//     });

//     onMessageDelete(id);
//   }

//   function handleUpdateMessage(updatedMessage) {
//     setIsEditing(false);
//     onUpdateMessage(updatedMessage);
//   }

//   return (
//     <li>
//       <span className="user">{username}</span>
//       <span className="time">{timestamp}</span>
//       {isCurrentUser ? (
//         <div className="actions">
//           <button onClick={() => setIsEditing((isEditing) => !isEditing)}>
//             <span role="img" aria-label="edit">
//               ✏️
//             </span>
//           </button>
//           <button onClick={handleDeleteClick}>
//             <span role="img" aria-label="delete">
//               🗑
//             </span>
//           </button>
//         </div>
//       ) : null}
//     </li>
//   );
// }

// export default Message;