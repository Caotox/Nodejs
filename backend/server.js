require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');

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

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));

// ------------------- Titouan ---------------------

app.use('/api/votes', voteRoutes);
app.use('/api/admin', adminRoutes);

// -------------------------------
