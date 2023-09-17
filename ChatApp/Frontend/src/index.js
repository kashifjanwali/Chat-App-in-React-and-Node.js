import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

import Chat from "./ChatApp/Chatwork.js";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:3001");

function MyMultiPost() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          
          <input
            type="text"
            placeholder="Kashif Hussain"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}
var root = ReactDOM.createRoot(document.getElementById("root"));

let value1 = (
  <>
    <MyMultiPost />
  </>
);

root.render(value1);
