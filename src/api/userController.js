const User = require("../config/model/user");
const UtilService=require('../utils/utilService')
const clientID =
  "756091233237-qdi6vep1g8h25n2o6dmcp6n3vv7t41fi.apps.googleusercontent.com";
const {
  OAuth2Client
} = require("google-auth-library");
const client = new OAuth2Client(clientID);
module.exports = {
  addUser: async (req, res) => {
    try {
      const { email,password } = req.body;
      const oldUser = await User.findOne({
        email: email,
      });
      if (oldUser) {
        return res.status(404).send({
          data: [],
          message: "Emailid already exists..!",
          success: false,
        });
      } else {
        const encryptedPassword = await UtilService.hashPassword(password);
        const newUser = await User.create({           
          name: req.body.name,
          mobileNumber: req.body.mobileNumber,
          email: req.body.email,
          gender: req.body.gender,
          dob: req.body.dob,
          pinCode: req.body.pinCode,
          password: encryptedPassword,
          role: "user",
          token: null,
        });
        if (!newUser) {
          return res.status(404).send({
            data: [],
            message: "Failed to create your account..!",
            success: false,
          });
        }
        return res.status(200).send({
          data: [newUser],
          message: "Successfully created your account..!",
          success: true,
        });
      }
    } catch (error) {
      return res.status(404).send({
        data: [error],
        message: "error",
        status: false,
      });
    }
  },

  googleAuth: async (req, res) => {
    const {
      email,
      name,
      id,
      photoUrl
    } = req.body;
    console.log("Req Body", req.body);
    // const ticket = await client.verifyIdToken({
    //   idToken: token,
    //   audience: clientID,
    // });
    // const googleData = ticket.getPayload();
    // let email = googleData.email;
    // let name = googleData.name;
    try {
      const user = await User.findOne({
        email,
      });
    //   console.log("Userrr", user);
      if (!user) {
        await User.create({
          email,
          name,
          google_id: id,
          profile_pic: photoUrl,
          user_type: 3,
        });
        const user = await User.findOne({
          email,
        });
        res.send(user);
      } else {
        // const token = await JWTService.issuer({ user: user.id }, "1 day");
        // return res.ok({ token: token });
        return res.send(user);
      }
    } catch (error) {
      console.log("Error", error.details);
      return res.status(404).send({
        data: [error],
        message: "error",
        status: false,
      });
    }
  },

};
