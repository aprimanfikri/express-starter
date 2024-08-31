const User = require('../models/user');
const ApiError = require('../utils/error');
const { hash, compare } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const { name, email, username, password } = req.body;
    if (!name) {
      throw new ApiError('Name is required.', 400);
    }
    if (!email) {
      throw new ApiError('Email is required.', 400);
    }
    if (!username) {
      throw new ApiError('Username is required.', 400);
    }
    if (!password) {
      throw new ApiError('Password is required.', 400);
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError('Email is already in use.', 409);
    }
    const hashedPassword = await hash(password);
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully.',
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { credentials, password } = req.body;
    if (!credentials) {
      throw new ApiError('Credentials are required.', 400);
    }
    if (!password) {
      throw new ApiError('Password is required.', 400);
    }
    const user = await User.findOne({
      $or: [{ email: credentials }, { username: credentials }],
    });
    if (!user) {
      throw new ApiError('Invalid credentials.', 401);
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials.', 401);
    }
    const token = generateToken(user);
    res.status(200).json({
      status: 'success',
      message: 'User logged in successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: 'success',
    message: 'User fetched successfully.',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

module.exports = { register, login, get };
