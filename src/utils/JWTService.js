const jwt = require("jsonwebtoken");
const SECRET = "QUASIS_TECH";
module.exports = {
  issuer(payload, expiredIn) {
    return jwt.sign(payload, SECRET, { expiresIn: expiredIn });
  },
  verify(token) {
    return jwt.verify(token, SECRET, {});
  },
  verifyToken(req,res,next){
    const bearerHeader=req.headers['authorization']
    if(typeof bearerHeader !='undefined'){
     const bearer=bearerHeader.split(' ')
     const bearerToken=bearer[1]
     req.token=bearerToken
     next()
    }
    else{
      res.sendStatus(403)
    }
  }
};
