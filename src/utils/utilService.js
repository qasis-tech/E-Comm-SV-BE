import bcrypt from 'bcrypt'
const SALT_ROUNT = 10;
export default {
  async hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNT);
  },
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  },
};
