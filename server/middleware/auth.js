const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

const permit = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
}

module.exports = { auth, permit };
