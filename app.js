const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const adminRouter=require('./src/routes/adminRouter')
const dbCon = require("./src/config/connection");
const cors = require("cors");
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use('/', adminRouter);
const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log("Server is listening on port ", port);
});