const User = require("../config/model/user");
const mongoose = require("mongoose");
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
        return res.status(200).send({
          data: [],
          message: "User not found..!",
          success: false,
        });
      }
      const passwordMatch = await UtilService.comparePassword(
        password,
        user.password
      );
      if (!passwordMatch) {
        return res.status(200).send({
          data: [],
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
      if (newUser.role === "admin") {
        return res.status(200).send({
          data: newUser,
          message: "Welcome to AdminPanel..!",
          success: true,
        });
      }
      return res.status(200).send({
        data: newUser,
        message: "Successfully Login..!",
        success: true,
      });
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
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
        return res.status(200).send({
          data: [],
          message: "Emailid already exists..!",
          success: false,
        });
      } else {
        const encryptedPassword = await UtilService.hashPassword(password);
        const newUser = await User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
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
          return res.status(200).send({
            data: [],
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
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: "error",
        status: false,
      });
    }
  },
  googleAuth: async (req, res) => {
    try {
      const { email, firstName, lastName, photoUrl } = req.body;
      const user = await User.findOne({
        email,
      });
      if (!user) {
        await User.create({
          email,
          firstName,
          lastName,
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
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: "error",
        status: false,
      });
    }
  },
  viewUsers: async (req, res) => {
    try {
      await User.find({
        role: "user",
      })
        .then((users) => {
          res.status(200).send({
            data: users,
            message: "Successfully fetched users..!",
            success: true,
          });
        })
        .catch((err) => {
          console.log("error", err);
          res.status(404).send({
            data: [],
            message: "Error..!",
            success: false,
          });
        });
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: "error",
        status: false,
      });
    }
  },
  editUsers: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
      await User.findByIdAndUpdate(
        req.params.id,
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          mobileNumber: req.body.mobileNumber,
          email: req.body.email,
          gender: req.body.gender,
          dob: req.body.dob,
          pinCode: req.body.pinCode,
        },
        {
          new: true,
        }
      )
        .then((user) => {
          res.status(200).send({
            data: user,
            message: "Successfully updated user..!",
            success: true,
          });
        })
      }else {
          console.log("error", error);
          return res.status(404).send({
            data: [],
            message: "user not found with id " + req.params.id,
            success: false,
          });
        };
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: "error",
        status: false,
      });
    }
  },
  deleteUsers: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
      await User.findByIdAndRemove(req.params.id)
        .then((user) => {
          res.status(200).send({
            data: user,
            message: "Successfully deleted user..!",
            success: true,
          });
        })}else {
          console.log("error", error);
          return res.status(200).send({
            data: [],
            message: "user not found with id " + req.params.id,
            success: false,
          });
        };
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: "error",
        status: false,
      });
    }
  },
  addUserDetails: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
      await User.findByIdAndUpdate(
        req.params.id,
        {
        location:req.body.location,
        primaryAddress:req.body.primaryAddress,
        otherAddress:req.body.otherAddress,
        pinCode:req.body.pinCode
        },
        {
          new: true,
        }
      )
        .then((user) => {
          res.status(200).send({
            data: user,
            message: "Successfully updated user..!",
            success: true,
          });
        })
       }else {
          console.log("error", error);
          return res.status(404).send({
            data: [],
            message: "user not found with id " + req.params.id,
            success: false,
          });
        };
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: "error",
        status: false,
      });
    }
  },
};
