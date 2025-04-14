require('dotenv').config();
const express = require('express');
const cors = require('cors');
//ce qui va suivre est pr websocker
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });
//web socket finiiiii
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const issueRoutes = require("./routes/issueRoutes"); //jess

// --------------- Titouan --------------
const voteRoutes = require('./routes/voteRoutes');
//const adminRoutes = require('./routes/adminRoutes');
// ----------------------------

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/issues', commentRoutes);
app.use('/admin', adminRoutes);
app.use("/api", issueRoutes); //jess

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
//ce qui suis est pr websocket
io.on("connection", (socket) => {
    console.log("Client connecté au WebSocket");
  });
//fin websocket

// ------------------- Titouan ---------------------

app.use('/api/votes', voteRoutes);
app.use('/api/admin', adminRoutes);

// -------------------------------
