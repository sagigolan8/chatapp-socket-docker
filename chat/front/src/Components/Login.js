import React,{ useEffect, useRef, useState } from "react";
import { TextField, Box } from "@material-ui/core";
import { niceAlert } from "../Helpers/niceAlerts";
import { Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import ChatIcon from '@mui/icons-material/Chat';
import { FormControl } from '@mui/material';
import io from "socket.io-client";

export default function Login() {
  const nameRef = useRef()
  const socketRef = useRef()
  const [users, setUsers] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000");

    socketRef.current.emit("users")
    socketRef.current.on("usersBack", ({ USERS }) => {
      setUsers(() => {
        return [...USERS ];
      });
    });
    return () => { 
      setUsers([])
    }
  }, []);

  const loginToChat = (e) =>{
    e.preventDefault()
    const userName = nameRef.current.value 
    if(!(/^[A-Za-z0-9]{3,20}$/.test(userName)))
    return niceAlert('Name should include only letters or numbers, at least 3 letters','error',3000)
    if(isNameAvailable(userName))
    return niceAlert('Name already taken','error',3000)
    navigate('/chat',{ state: { userName } })
  }

  const isNameAvailable = (userName)=>{
    const checkName = users.find((user)=>user.name === userName)
    return checkName 
  }
  return (
        <div style={{textAlign: 'center'}}>
        <Typography
        variant="h3"
        color="#3f51b5"
        >
        Login To Chat
        </Typography>
        <FormControl onSubmit={(e)=>loginToChat(e)}>
        <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        >

      <div className="App">
        <div>
          <br />
          <TextField
            autoComplete="off"
            style={{ width: "200px", margin: "5px" }}
            type="text"
            label="Name"
            variant="outlined"
            inputRef={nameRef}
            />
          <br />
        <Button
        type="submit"
        startIcon={<ChatIcon/>} 
        variant="contained"
        color="primary"
        size='large'
        >
        Login
        </Button>
          <br />
        </div>
         <br/>
      </div>
      </Box>
        </FormControl>

      
      </div>
    )
}
