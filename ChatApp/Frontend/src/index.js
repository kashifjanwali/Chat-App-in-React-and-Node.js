import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

import Chat from "./ChatApp/Chatwork.js";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function MyMultiPost() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(" ");
  const [showChat, setShowChat] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [roomError, setRoomError] = useState("");
  // const [showAlert, setShowAlert] = useState(false);

  const joinRoom = () => {
    let errorMessage = "";

    // Regular expression to validate the username format.
    const regex = /^[A-Z][a-z]{2,}(?:\s[A-Z][a-z]*)*$/;

    // Check if the username matches the defined regular expression.
    if (!regex.test(username)) {
      // Check if the first character of the username is not UPPERCASE.
      if (!/^[A-Z]/.test(username)) {
        errorMessage = "First Character of Username Should be UPPERCASE";
      }
      // Check if the username does not contain at least two lowercase characters following the uppercase first character.
      else if (!/^[a-z]{2,}/.test(username)) {
        errorMessage =
          "Username should contain atleast two lowercase alphabets after first UPPERCASE";
      }
      // Check if the last character of the username is not an alphabet character.
      else if (!/\s[A-Z][a-z]*/.test(username)) {
        errorMessage = "Last character of Username should be an alphabet";
      }
    }

    // Check if the username contains one or more non-alphabet characters.
    if (/[^\sa-zA-Z]+/.test(username)) {
      errorMessage = "Username cannot contain numbers or special characters.";
    }

    // Check if the username is entirely in uppercase.
    if (/^[A-Z ]+$/.test(username)) {
      errorMessage = "Username must be Capitalized.";
    }

    // Check if username is less than or equal to 20 characters long
    if (username.length > 25) {
      errorMessage = "Username cannot be more than 25 characters long";
    }

    // Check if room ID is a number between 1 and 999
    if (isNaN(room) || room < 1 || room > 999) {
      errorMessage = "Room ID must be a number between 1 and 999";
    }

    if (errorMessage === "") {
      socket.emit("join_room", room);
      setShowChat(true);
    } else {
      if (usernameError !== "") {
        setUsernameError("");
      }
      if (roomError !== "") {
        setRoomError("");
      }
      if (errorMessage.includes("Username")) {
        setUsernameError(errorMessage);
      } else {
        setRoomError(errorMessage);
      }
      // setShowAlert(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join a chat</h3>

          <input
            type="text"
            minLength={3}
            maxLength={25}
            required
            placeholder="Kashif Hussain"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              setUsernameError("");
            }}
          />
          <div className="error">{usernameError}</div>

          <input
            type="number"
            min={1}
            max={999}
            required
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Room ID..."
            value={room}
            onChange={(event) => {
              setRoom(event.target.value);
              setRoomError("");
            }}
          />
          <div className="error">{roomError}</div>

          <button onClick={joinRoom}>Join chat room</button>
        </div>
      ) : (
        <Chat
          socket={socket}
          username={username}
          room={room}
          // setShowAlert={setShowAlert}
        />
      )}
      {/* {showAlert && (
        <div className="alert alert-danger my-auto" role="alert">
          Error joining Room
        </div>
      )} */}
    </div>
  );
}

var root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<MyMultiPost />);
