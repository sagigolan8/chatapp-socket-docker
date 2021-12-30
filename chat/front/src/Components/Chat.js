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
  
    const logout = (userName) => {
      navigate('/')
    }

    const privateMessage = ( name )=>{
      // navigate('/private',{ state: {
      //   socketRef,
      //   userName,
      //   room : 1
      // } })
      socketRef.current.emit("join room", `${userName}${name}`)
      setPrivateRoom(true)
      setChatPerson(name)
    }


    const renderChat = () => {
      return(
    <div>
      <div>
         {messagesList.map(({ name, message }) => (
            <div key={nanoid()}>
              <Message name={name} message={message} />
            </div>
          ))}
      </div>

      <div style={{textAlign:'left'}}>
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
      </div>

  </div>
        )
    };
  


    return (
      <div  style={{textAlign:'center'}}>
        <button
        onClick={()=>logout(userName)}
        style={{float:'right'}}
        className="btn btn-primary"
        >Logout
        </button>
        <div className="name-field">
          <Typography style={{color:"#3f51b5"}}
          variant="h4"
          >
          Welcome {userName}!
          </Typography>
        </div>
        { !privateRoom ? (

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
      </div>
    );
}
