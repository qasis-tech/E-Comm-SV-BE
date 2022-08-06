const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect(process.env.DB_BASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB Connected...!");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
  });
