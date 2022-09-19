import User from "../config/model/user.js";
import mongoose from "mongoose";
import UtilService from "../utils/utilService.js";
import JWTService from "../utils/JWTService.js";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
const myOtp = otpGenerator.generate(6, {
  digits: true,
  lowerCaseAlphabets: false,
  upperCaseAlphabets: false,
  specialChars: false,
});
export default {
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
      const token = await JWTService.issuer({ email: user.email }, "300 days");
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
      const newUser = await User.findOne(
        {
          email: email,
        },
        { password: 0 }
      );
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
        message: `error..! ${error.message}`,
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
          status: "active",
          accountOtp: null,
        });
        if (!newUser) {
          return res.status(200).send({
            data: [],
            message: "Failed to create your account..!",
            success: false,
          });
        }
        const resetOtp = await User.updateOne(
          { email: email },
          { $set: { accountOtp: myOtp } }
        );
        if (resetOtp) {
          const msg = {
            from: "veenavijayan38@gmail.com",
            to: email,
            subject: "OTP for verify your account",

            html:`This is the One Time Password to verify your account.<br><br><b><u><h1> ${myOtp} </h1></b></u><br><br>Thank You..`
            
          };
          nodemailer
            .createTransport({
              service: "gmail",
              auth: {
                user: "veenavijayan38@gmail.com",
                pass: "rqdpilsciczoskpw",
              },
              port: 465,
              host: "smtp.gmail.com",
              from: "veenavijayan38@gmail.com",
            })
            .sendMail(msg, (err) => {
              if (err) {
                return res.status(404).send({
                  data: [err],
                  message: "Error in sending mail",
                  success: false,
                });
              } else {
                res.status(200).send({
                  data: [],
                  message:
                    "OTP Sent Successfully ..please wait for otp verification!",
                  success: true,
                });
              }
            });
        }
      }
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
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
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  viewUsers: async (req, res) => {
    try {
      if (req.query.search) {
        await User.find({ firstName: { $regex: req.query.search } })
          .then((users) => {
            if (users.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No User found..!",
                success: false,
                count: users.length,
              });
            }
            return res.status(200).send({
              data: users,
              message: "Successfully fetched users..!",
              success: true,
              count: users.length,
            });
          })
          .catch((err) => {
            console.log("error 1", err);
            return res.status(404).send({
              data: [],
              message: `error..! ${err.message}`,
              status: false,
            });
          });
      } else {
        let limit = 10;
        let skip = 0;
        if (req.query.limit && req.query.skip) {
          limit = parseInt(req.query.limit);
          skip = parseInt(req.query.skip);
        }
        let count = await User.find({ role: "user" }).count();
        await User.find(
          {
            role: "user",
          },
          { password: 0 }
        ).sort({_id:-1})
          .skip(skip)
          .limit(limit)
          .then((users) => {
            if (users.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No Users found..!",
                success: false,
                count: count,
              });
            }
            res.status(200).send({
              data: users,
              message: "Successfully fetched users..!",
              success: true,
              count: count,
            });
          })
          .catch((err) => {
            console.log("error", err);
            res.status(404).send({
              data: [],
              message: `error..! ${err.message}`,
              success: false,
            });
          });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  editUsers: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        const user = User.find({ _id: req.params.id });
        if (user.length === 0) {
          return res.status(200).send({
            data: [],
            message: "No user found with given id..!",
            success: false,
          });
        } else {
          const encryptedPassword = await UtilService.hashPassword(req.body.password);
          User.findByIdAndUpdate(
            req.params.id,
            {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              mobileNumber: req.body.mobileNumber,
              email: req.body.email,
              gender: req.body.gender,
              dob: req.body.dob,
              pinCode: req.body.pinCode,
              password: encryptedPassword,
            },
            {
              new: true,
            }
          )
            .select("-password")
            .then((user) => {
              res.status(200).send({
                data: user,
                message: "Successfully updated user..!",
                success: true,
              });
            });
        }
      } else {
        return res.status(404).send({
          data: [],
          message: `user not found with id ${req.params.id}`,
          success: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  deleteUsers: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        User.find({ _id: req.params.id }).then((user) => {
          if (user.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No user found with given id..!",
              success: false,
            });
          } else {
            User.findByIdAndRemove(req.params.id)
              .select("-password")
              .then((user) => {
                res.status(200).send({
                  data: user,
                  message: "Successfully deleted user..!",
                  success: true,
                });
              });
          }
        });
      } else {
        return res.status(200).send({
          data: [],
          message: `user not found with id ${req.params.id}`,
          success: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  addUserDetails: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        User.find({ _id: req.params.id }).then((user) => {
          if (user.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No user found with given id..!",
              success: false,
            });
          } else {
            User.findByIdAndUpdate(
              req.params.id,
              {
                location: req.body.location,
                primaryAddress: req.body.primaryAddress,
                otherAddress: req.body.otherAddress,
                pinCode: req.body.pinCode,
              },
              {
                new: true,
              }
            )
              .select("-password")
              .then((user) => {
                res.status(200).send({
                  data: user,
                  message: "Successfully updated user..!",
                  success: true,
                });
              });
          }
        });
      } else {
        console.log("error", error);
        return res.status(404).send({
          data: [],
          message: `user not found with id ${req.params.id}`,
          success: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  viewUserDetails: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        User.find({ _id: req.params.id }).then((user) => {
          if (user.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No user found with given id..!",
              success: false,
            });
          } else {
            User.findById({ _id: req.params.id }, { password: 0 })
              .then((user) => {
                if (user.length === 0) {
                  return res.status(200).send({
                    data: [],
                    message: "No user found..!",
                    success: false,
                  });
                }
                return res.status(200).send({
                  data: user,
                  message: "Successfully fetched user details..!",
                  success: true,
                });
              })
              .catch((err) => {
                console.log("error", err);
                return res.status(404).send({
                  data: [],
                  message: `error..! ${err.message}`,
                  status: false,
                });
              });
          }
        });
      } else {
        return res.status(200).send({
          data: [],
          message: `Cannot find user with id ${req.params.id}`,
          success: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const { otp, email } = req.body;
      const user = await User.findOne(
        {
          email: req.body.email,
        },
      );
     if (!user) {
        res.status(404).send({
          data: [],
          message: "No user found..!",
          success: false,
        });
      }
      else{
        if (user.accountOtp !== otp) {
          res.status(404).send({
            data: [],
            message: "OTP mismatch..!",
            success: false,
          });
        }
        else{
          res.status(200).send({
            data: [],
            message:
              "Account created successfully...",
            success: true,
          });
        }
      }    
   
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error ${error.message}`,
        status: false,
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const oldUser = await User.findOne({
        email: email,
      });
      if (!oldUser) {
        return res.status(200).send({
          data: [],
          message: "User not found..!",
          success: false,
        });
      } else {
        const resetOtp = await User.updateOne(
          { email: email },
          { $set: { accountOtp: myOtp } }
        );
        if (resetOtp) {
          const msg = {
            from: "veenavijayan38@gmail.com",
            to: email,
            subject: "OTP for reset your password",

            html:`This is the One Time Password to reset your password.<br><br><b><u><h1> ${myOtp} </h1></b></u><br><br>Thank You..`
             
          };
          nodemailer
            .createTransport({
              service: "gmail",
              auth: {
                user: "veenavijayan38@gmail.com",
                pass: "rqdpilsciczoskpw",
              },
              port: 465,
              host: "smtp.gmail.com",
              from: "veenavijayan38@gmail.com",
            })
            .sendMail(msg, (err) => {
              if (err) {
                return res.status(404).send({
                  data: [err],
                  message: "Error in sending mail",
                  success: false,
                });
              } else {
                res.status(200).send({
                  data: [],
                  message:
                    "OTP Sent Successfully ..please wait for otp verification!",
                  success: true,
                });
              }
            });
        }
      }
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error ${error.message}`,
        status: false,
      });
    }
  },
 verifyResetPasswordOtp: async (req, res) => {
    try {
      const {email,otp } = req.body;
      const user = await User.findOne(
        {
          email: req.body.email,
        },
        { password: 0 }
      );
     if (!user) {
        res.status(404).send({
          data: [],
          message: "No user found..!",
          success: false,
        });
      }
      else{
        if (user.accountOtp !== otp) {
          res.status(404).send({
            data: [],
            message: "OTP mismatch..!",
            success: false,
          });
        }
        else{
          res.status(200).send({
            data: user,
            message:
              "OTP verified successfully...",
            success: true,
          });
          const expireOtp = await User.updateOne(
            { email: email },
            { $set: { accountOtp: null } }
          );
        }
      }       
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error ${error.message}`,
        status: false,
      });
    }
  },

};
