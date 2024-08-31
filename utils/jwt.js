const jwt = require('jsonwebtoken');
const ApiError = require('./error');

const generateToken = (user, expiresIn = '1d') => {
  const payload = {
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError('Token has expired.', 401);
    } else if (error.name === 'JsonWebTokenError') {
      throw new ApiError('Invalid token.', 401);
    } else {
      throw new ApiError('Failed to authenticate token.', 401);
    }
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
