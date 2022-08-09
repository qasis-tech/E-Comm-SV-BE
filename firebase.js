const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors({ origin: true, credentials: true }));
require("dotenv").config();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use('/',require('./notification'))

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log("Server is listening on port ", port);
});
