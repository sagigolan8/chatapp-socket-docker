import TextField from "@material-ui/core/TextField";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Button } from "@material-ui/core";
import Message from "./Message";
import SendIcon from '@mui/icons-material/Send'
import User from "./User";
import Private from "./Private";
import { Container, Box } from "@mui/material";

export default function Chat() {
    const navigate = useNavigate()
    const location = useLocation()
    const { state: { userName } } = location

    const [newMessage, setNewMessage] = useState({ message: ""});
    const [messagesList, setMessagesList] = useState([]);
    const [users, setUsers] = useState([]); 
    const [privateRoom, setPrivateRoom] = useState(false); 
    const [chatPerson, setChatPerson] = useState(''); 
  
    const socketRef = useRef();
  
    useEffect(() => {
      socketRef.current = io.connect("http://localhost:4000");

      socketRef.current.emit("ehlo", { name:userName } ) //updates the users array in server

      socketRef.current.emit("users") //ask for users array

      socketRef.current.on("messageBack", ({ name, message }) => { //
        setMessagesList((prevState) => {
          return [...prevState, { name, message }];
        });
      });

      socketRef.current.on("usersBack", ({ USERS }) => {
        setUsers(USERS)
      });
    }, []);
  
    const onTextChange = (e) => {
      setNewMessage({ ...newMessage, message: e.target.value });
    };
  
    const onMessageSubmit = (e) => {
      e.preventDefault();
      const { message } = newMessage;
      if(!message) return
      const name = userName
      socketRef.current.emit("message", { name, message });
      setNewMessage({ message: "" });
    };

    const privateMessage = ( name )=>{
      socketRef.current.emit("join room", `${userName}${name}`)
      setPrivateRoom(true)
      setChatPerson(name)
    }

    const renderAllChat = ()=>{
      return (
      <form onSubmit={onMessageSubmit}>
        
      {renderChat()}
        <div>
          <TextField
            name="message"
            onChange={(e) => onTextChange(e)}
            value={newMessage.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
            autoComplete="off"
          />
        <Button type="submit">
          <SendIcon fontSize="large"/>
        </Button>
        </div>
      </form>
      )
    }

    const renderChat = () => {
      return(
      <div>
         {messagesList.map(({ name, message }) => (
            <div key={nanoid()}>
              <Message name={name} message={message} />
            </div>
          ))}
      </div>
        )
    };
    
    const renderUsers = ()=>{
      return (
      <ul className="list-group" style={{textAlign:'left'}}>
        {
        users.map(
          ({name,id})=>
          <User
          privateMessage={privateMessage}
          userName={userName}
          key={id}
           id={id} 
           name={name}
           />
          )}
      </ul>
          )
    }


    return (
      <div  style={{textAlign:'center'}}>
      <Container
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center"
        }}
      >
        <Box >
        <Typography 
          variant="h5"
          >
          Users
          </Typography>
        {renderUsers()}
        </Box>
        <Box sx={{
        width: 700,
        height: 100
          }}
        >
        <div className="name-field">
          <h1 style={{color:"#3f51b5"}}
          >
          Welcome {userName}!
          </h1>
          <br/>
        </div>
        { !privateRoom ? (
          renderAllChat()
        )
        :
        (
        <div style={{display:'flex',justifyContent:'center'}}>
          <Private 
          setPrivateRoom={setPrivateRoom}
          socket={socketRef.current} 
          userName={userName}
          chatPerson={chatPerson} 
          /> 
        </div>
        ) 
          }
          </Box>
          </Container>
      </div>

    );
}
