const bcrypt = require("bcrypt");
const SALT_ROUNT = 10;

module.exports = {
  async hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNT);
  },
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  },
};
