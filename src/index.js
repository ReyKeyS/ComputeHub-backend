const express = require("express");
const env = require("./config/env.config");
const cors = require("cors");
const fs = require("fs");
const { connect, getConn } = require('./database/connection');
const { Server } = require('socket.io');

const app = express();
// HTTP Server for Express and Socket.IO
const server = require('http').createServer(app)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: '*',
        optionsSuccessStatus: 200,
    })
); 

// Socket Configuration
const io = new Server(server, {cors: env("FRONT_END_SOCKET")})
let on_users = []
io.on('connection', (socket) => {
    socket.on('addUsersOn', (email) => {
        !on_users.some((u) => u.email === email ) && on_users.push({
            socketId: socket.id, 
            email: email
        })

        io.emit('getUsersOn', on_users)
    })

    socket.on("disconnect", () => {
        on_users = on_users.filter((u) => u.socketId !== socket.id);
        
        io.emit('getUsersOn', on_users)
    });
    
    socket.on("refreshing", (friend) => {
        const teman = on_users.find((u) => u.email == friend.id)
        
        if (teman) io.to(teman.socketId).emit('gasRefresh')
    })
})

// Routes
const userRouter = require("./routes/users");
const itemRouter = require("./routes/items");
const cartsRouter = require("./routes/carts");
const transRouter = require("./routes/trans");
const chatRouter = require("./routes/chats");

app.use('/api/users', userRouter);
app.use('/api/items', itemRouter);
app.use('/api/users/carts', cartsRouter);
app.use('/api/users/transaction', transRouter);
app.use('/api/users/chat', chatRouter);

// Get Any Picture
app.get('/api/getpict', (req, res) => {
    const { file } = req.query

    let lokasinya = 'uploads/';
    if (file.includes("item")) lokasinya += "Items/";
    else if (file.includes("profile")) lokasinya += "Profile/";

    lokasinya += file
    if (fs.existsSync(lokasinya))
        return res.status(200).sendFile(lokasinya, { root: "." });
    else 
        return res.status(404).json({message: "Picture not found"})
})

app.all('*', (req, res) => {
    return res.status(404).json({ message: `Page Not Found!` });
});

const port = 3000;
server.listen(port, env("HOST"), () => console.log(`Listening on port ${port}!`));
connect();