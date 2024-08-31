const bcrypt = require('bcryptjs');

const hash = async (value) => {
  return bcrypt.hashSync(value, 10);
};

const compare = async (value, hashedValue) => {
  return bcrypt.compareSync(value, hashedValue);
};

module.exports = {
  hash,
  compare,
};
