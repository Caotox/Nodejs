const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  console.log("Authenticating...");
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token error:", err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    console.log("Token valid. User:", user);
    next();
  });
}

module.exports = authenticate;
