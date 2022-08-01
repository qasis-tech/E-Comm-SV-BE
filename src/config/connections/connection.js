const mongoose = require("mongoose");
const dbConfig = require("./dbconfig");
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("running...");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
  });