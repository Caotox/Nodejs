require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware pour attacher io à chaque requête
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const issueRoutes = require('./routes/issueRoutes');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminIssueRoutes = require('./routes/adminIssuesRoutes');

app.use('/auth', authRoutes);
app.use('/api/', commentRoutes);
app.use('/api/', issueRoutes);
app.use('/api/', adminRoutes);
app.use('/api/', adminIssueRoutes);

// Socket.io
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
