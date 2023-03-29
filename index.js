const express = require("express");
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");

app.use(cors());
require('dotenv').config();

const server = http.createServer(app);
app.get('/home', (req, res)=>{
    console.log("helloworld")
    res.send('hello')
})

const io = new Server(server, {
    cors: {
        origin: "https://realtime-live-messaging-app.netlify.app/",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data)=>{
        socket.join (data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })

    socket.on("send_message", (data)=>{
        console.log(data);
        socket.to(data.room).emit("receive_message", data);
    })


    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    })
});




server.listen(process.env.PORT, () => {
    console.log("SERVER running at port "+`${process.env.PORT}`)
})