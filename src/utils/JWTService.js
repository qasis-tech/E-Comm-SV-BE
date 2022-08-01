const jwt = require("jsonwebtoken");
const SECRET = " QUASIS_TECH";
module.exports = {
  issuer(payload, expiredIn) {
    return jwt.sign(payload, SECRET, { expiresIn: expiredIn });
  },
  verify(token) {
    return jwt.verify(token, SECRET, {});
  },
};
