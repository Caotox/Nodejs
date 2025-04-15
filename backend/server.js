require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const issueRoutes = require("./routes/issueRoutes"); //jess
const voteRoutes = require('./routes/voteRoutes');

// Crée l'application Express AVANT de créer le serveur HTTP
const app = express();

// Création du serveur HTTP à partir de l'app express
const server = http.createServer(app);

// Configuration de socket.io
const io = new Server(server, { cors: { origin: "*" } });

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/issues', commentRoutes);
app.use('/admin', adminRoutes);
app.use("/api", issueRoutes); //jess
app.use('/api/votes', voteRoutes);
// app.use('/api/admin', adminRoutes); // redondant avec '/admin' ? À vérifier

// WebSocket
io.on("connection", (socket) => {
    console.log("Client connecté au WebSocket");
});

// Démarrage du serveur
server.listen(3001, () => console.log('Backend running on http://localhost:3001'));
