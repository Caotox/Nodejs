require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const sequelize = require('./config/db');
const Issue = require('./models/Issue');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/issues', commentRoutes);

sequelize.sync({ alter: false }) 
  .then(() => {
    console.log('Base de données synchronisée avec Sequelize.');
  })
  .catch((err) => console.error('Erreur de sync DB:', err));

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Client connecté en WebSocket');

  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

router.post('/', authMiddleware, async (req, res) => {
  io.emit('issue:new', newIssue); 
});


app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
