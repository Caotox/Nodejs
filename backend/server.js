require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/issues', commentRoutes);
app.use('/admin', adminRoutes);

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));



//Modif Titouan
const { Server } = require('socket.io');
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Client connecté');
});

// Dans la route de résolution
await issue.update({ status: 'resolved' });
io.emit('issue:resolved', issue.id);