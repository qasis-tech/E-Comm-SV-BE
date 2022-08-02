const User = require("../config/model/user");
const { comparePassword } = require("../utils/utilService");
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
          data: [],
          message: "Invalid User..!",
          success: false,
        });
      }
      const passwordMatch = await comparePassword(password, user.password);
      if (!passwordMatch) {
        return res.status(404).send({
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
      return res.status(200).send({
        data: [newUser],
        message: "Successfully Login..!",
        success: true,
      });
    } catch (error) {
      return res.status(404).send({
        data: [],
        message: error,
        status: false,
      });
    }
  },
};
