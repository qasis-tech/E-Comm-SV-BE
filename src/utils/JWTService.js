import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();
export default {
  issuer(payload, expiredIn) {
    return jwt.sign(payload, process.env.SECRET, { expiresIn: expiredIn });
  },
  verify(token) {
    return jwt.verify(token, process.env.SECRET, {});
  },
  verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader != "undefined") {
      const bearer = bearerHeader.split(" ")[1];
      const bearerToken = bearer;
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(401);
    }
  },
  verifyMyToken(req, res, next) {
    jwt.verify(req.headers["authorization"], process.env.SECRET, (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        next();
      }
    });
  },
};


