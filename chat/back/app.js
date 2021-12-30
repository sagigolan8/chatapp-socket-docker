const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

let USERS = [] 

io.on("connection", (socket) => {

  socket.on('ehlo', ({name}) =>{ //updates the users array
    if(!USERS.find((user) => user.id === socket.id)){
       USERS = [...USERS, {id: socket.id, name }]  
      }
  })

  socket.on("join room", (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("send private message", (data) => {
    console.log(data);
    socket.to(data.room1).to(data.room2).emit("receive private message", data);
  });

  socket.on("message", ({ name, message }) => {
    io.emit("messageBack", { name, message });
  });

  socket.on("users", () => {
    io.emit("usersBack", { USERS });
  });

  socket.on("disconnect", () => {
    let user = USERS.find((user) => user.id === socket.id)
    USERS = USERS.filter((user) => user.id !== socket.id) 
    if(!user) return
    io.emit("usersBack", { USERS });
    io.emit("messageBack", { name: user.name, message: "left the system" });
  });
});

http.listen(4000, function () {
  console.log("listening on port 4000");
});
