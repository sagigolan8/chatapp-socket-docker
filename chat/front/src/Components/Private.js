import React, { useEffect, useState } from "react";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';import './private.css'
import ScrollToBottom from "react-scroll-to-bottom";
import { Button } from "@material-ui/core";
import { nanoid } from "nanoid";

export default function Private({socket,userName, chatPerson, setPrivateRoom}) {
    const [newMessage, setNewMessage] = useState("");
    const [messagesList, setMessagesList] = useState([]);

    const sendMessage = async () => {
        if (newMessage) {
          const messageData = {
            room1: `${userName}${chatPerson}`,
            room2: `${chatPerson}${userName}`,
            author: userName,
            message: newMessage,
            time:
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes(),
          };
    
          await socket.emit("send private message", messageData);
          setMessagesList((list) => [...list, messageData]);
          setNewMessage("");
        }
      };
    
      useEffect(() => {
        socket.on("receive private message", (data) => {
            console.log(data);
          setMessagesList((list) => [...list, data]);
          return ()=>{

          }
        });
      }, [socket]);

    return (
    <div className="chat-window">
        <div style={{textAlign:'left'}}>
        <Button 
        onClick={()=>setPrivateRoom(false)}
        >
        <ExitToAppIcon/>
        </Button>
        </div>
        <div className="chat-header">
          <p>Live Chat With {chatPerson} </p>
        </div>
        <div className="chat-body">

          <ScrollToBottom className="message-container">
            {messagesList.map((messageContent) => {
              return (
                <div
                key={nanoid()}
                  className="message"
                  id={userName === messageContent.author ? "you" : "other"}
                >
                  <div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="author">{messageContent.author}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={newMessage}
            placeholder="Hey..."
            onChange={(event) => {
              setNewMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button onClick={sendMessage}>&#9658;</button>
        </div>
      </div>
    )
}
