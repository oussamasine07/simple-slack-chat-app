const express = require("express");
const app = express();
const socketio = require("socket.io");
const namespaces = require("./data/namespaces")
// set the static folder
app.use(express.static(__dirname + "/public"));

const socketServer = app.listen(9000);

const io = socketio(socketServer);
io.on("connection", (socket) => {
    const nsData = namespaces.map(ns => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    });

    socket.emit("nsList", nsData);
});

namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on("connection", (nsSocket) => {
        console.log(`${nsSocket.id} this nsSocket has join ${namespace.endpoint}`)
        // now one of the clients is connected to the server
        // we have to send him the details info to update the DOM
        nsSocket.emit("nsRoomload", namespace.rooms);
        // listen for joinRoom event
        nsSocket.on("joinRoom", async (roomToJoin) => {
            // clear rooms to prevent deplicate events 
            nsSocket.rooms.clear();
            // Todo : deal with the history here
            nsSocket.join(roomToJoin);
            // fetch number of users and sent  them to all users
            const ids = await io.of(namespace.endpoint).in(roomToJoin).allSockets();
            const numberOfUsers = Array.from(ids).length
            io.of(namespace.endpoint).to(roomToJoin).emit("numberOfUsers", numberOfUsers);

            // identify the current room;
            const roomTitle = Array.from(nsSocket.rooms)[0];
            // console.log(roomTitle);
            // select the history of that specific room 
            const history = namespace.rooms.find(room => room.title === roomToJoin).history
            const roomObj = { roomTitle, history }
            // send the history the client
            nsSocket.emit("getHistory", roomObj);
        })

        nsSocket.on("newMessageToServer", (msg) => {
            //create messege object
            const msgObject = {
                text: msg.text,
                time: Date.now(),
                username: msg.username
            }
            // // now we have to send this message to all sockets that this room is in
            const roomTitle = Array.from(nsSocket.rooms)[0]
            // inset into history
            const foundRoom = namespace.rooms.find(room => room.title === roomTitle)
            foundRoom.addMessage(msgObject);
            
            io.of(namespace.endpoint).to(roomTitle).emit("messageToClient", foundRoom.history);
        });

        
        
    });
});
