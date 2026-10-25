const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization token, access denied' });
  }

  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7).trim() 
    : authHeader.trim();

  if (!token) {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'mindful_jwt_secret_key_2026_super_secure_auth';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is expired or invalid' });
  }
};
