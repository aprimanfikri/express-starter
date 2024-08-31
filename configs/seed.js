require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('./database');
const User = require('../models/user');
const { hash } = require('../utils/bcrypt');

connect();

const seedUser = async () => {
  try {
    await User.deleteMany({});
    const user = new User({
      name: process.env.ADMIN_NAME,
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: await hash(process.env.ADMIN_PASSWORD),
    });
    await user.save();
    console.log('Seed user created successfully');
  } catch (error) {
    console.error('Error seeding user:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seedUser();
