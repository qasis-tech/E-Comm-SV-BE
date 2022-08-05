const User = require("../config/model/user");
const UtilService = require("../utils/utilService");
const JWTService = require("../utils/JWTService");
module.exports = {
  login: async function (req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        email: email,
      });
      if (!user) {
        return res.status(404).send({
          message: "Invalid User..!",
          success: false,
        });
      }
      const passwordMatch = await comparePassword(password, user.password);
      if (!passwordMatch) {
        return res.status(404).send({
          message: "password do not match..!",
          success: false,
        });
      }
      const token = await JWTService.issuer({ email: user.email }, "10 day");
      const login = await User.updateOne(
        {
          email: email,
        },
        {
          $set: {
            token: token,
          },
        }
      );
      const newUser = await User.findOne({
        email: email,
      });
      return res.status(200).send({
        data: newUser,
        message: "Successfully Login..!",
        success: true,
      });
    } catch (error) {
      return res.status(404).send({
        message: error,
        status: false,
      });
    }
  },
  addUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const oldUser = await User.findOne({
        email: email,
      });
      if (oldUser) {
        return res.status(404).send({
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
            message: "Failed to create your account..!",
            success: false,
          });
        }
        return res.status(200).send({
          data: newUser,
          message: "Successfully created your account..!",
          success: true,
        });
      }
    } catch (error) {
      return res.status(404).send({
        message: "error",
        status: false,
      });
    }
  },
  googleAuth: async (req, res) => {
    try {
      const { email, name, photoUrl } = req.body;
      const user = await User.findOne({
        email,
      });
      if (!user) {
        await User.create({
          email,
          name,
          profilePic: photoUrl,
          role: "user",
        });
        const user = await User.findOne({
          email,
        });
        return res.status(200).send({
          data: user,
          message: "Successfully created your account..!",
          success: true,
        });
      } else {
        const token = await JWTService.issuer({ email: user.email }, "1 day");
        const login = await User.updateOne(
          {
            email: email,
          },
          {
            $set: {
              token: token,
            },
          }
        );
        const newUser = await User.findOne({
          email: email,
        });
        return res.status(200).send({
          data: newUser,
          message: "Successfully Login..!",
          success: true,
        });
      }
    } catch (error) {
      console.log("Error", error.details);
      return res.status(404).send({
        message: "error",
        status: false,
      });
    }
  },
};
