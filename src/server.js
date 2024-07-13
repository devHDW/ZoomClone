import http from "http";
import SocketIO from "socket.io"
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/",(req,res) => res.render("home"));
app.get("/*",(req,res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

function publicRooms() {
    const {
        sockets: {
            adapter: {  sids, rooms },
        },
    } = wsServer;   
}
const publicRooms = [];
rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
        publicRooms.push(key);
    }
});
return publicRooms;

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
        wsServer.sockets.emit("")
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => 
            socket.to(room).emit("bye", socket.nickname)
        );    
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message",`${socket.nickname}:, ${msg}`);
        done();
    });

    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});


const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);



// console.log(socket.id);
// console.log(socket.rooms);
// console.log(socket.rooms);
// setTimeout(() => {
//     done("hello from the backend");
// }, 150000);

// {
//     type:"message",
//     payload:"hello everyone!"
// }

// {
//     type:"nickname",
//     payload:"dawit"
// }

// socket.on("nickname",fn);
// socket.on("notification", fn);
// const wss = new WebSocket.Server({ server });

// function onSocketMessage(message) {
//     console.log(message);
// }

// function onSocketClose() {
//     () => console.log("DisConnected from Browser X")
// }

// const sockets = [];

// wss.on("connection",(socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("Connected to Browser O");
//     socket.on("close", onSocketClose);
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch(message.type){
//             case "new_message":
//                 sockets.forEach((aSocket) => 
//                     aSocket.send(`${socket.nickname}: ${message.payload}`)
//             );
//             case "nickname":
//                 socket["nickname"] = message.payload;
//                 // console.log(message.payload);
//         }
//         // if(parsed.type === "new_message"){
//         // } else if(parsed.type === "nickname") {
//         // }
//     });
// });
