const User = require('../models/user');
const ApiError = require('../utils/error');
const { verifyToken } = require('../utils/jwt');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new ApiError('Authorization token is required.', 401));
    }
    if (!token.startsWith('Bearer ')) {
      return next(
        new ApiError('Authorization token must start with Bearer.', 401)
      );
    }
    const tokenValue = token.split('Bearer ')[1];
    const payload = verifyToken(tokenValue);
    const user = await User.findById(payload.id);
    if (!user) {
      return next(new ApiError('User not found.', 404));
    }
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authenticate;
