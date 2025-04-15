require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const server = http.createServer(app); // nécessaire pour socket.io
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// middleware pour attacher io à chaque requête
app.use((req, res, next) => {
  req.io = io;
  next();
});
// /backend/server.js
const issueRoutes = require('./routes/issueRoutes');
app.use('/api/issues', issueRoutes);

const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminIssueRoutes = require('./routes/adminIssueRoutes');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/issues', commentRoutes);
app.use('/admin', adminRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin/issues', adminIssueRoutes);
app.use('/api', issueRoutes); // issues route
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// socket.io écoute les connexions
io.on('connection', (socket) => {
  console.log('✅ Socket.io : un client est connecté');

  socket.on('disconnect', () => {
    console.log('❌ Socket.io : client déconnecté');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
